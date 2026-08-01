"""Score Vietnamese text with pseudo-log-likelihood from a masked LM.

The command reads JSON objects from stdin, one per line. Each object must have
``text`` and may have any metadata fields. It writes the same object plus
``avg_log_prob``, ``pseudo_perplexity`` and ``scored_tokens``.
"""

from __future__ import annotations

import argparse
import json
import math
import os
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

import torch
from transformers import AutoModelForMaskedLM, AutoTokenizer


DEFAULT_MODEL = "vinai/phobert-base-v2"
VENDORED_NLP = Path(__file__).parent / "underthesea_vendor"


@dataclass(frozen=True)
class Score:
    avg_log_prob: float
    pseudo_perplexity: float
    scored_tokens: int


def score_encoded(model, input_ids: torch.Tensor, attention_mask: torch.Tensor,
                  mask_token_id: int, special_token_ids: set[int],
                  batch_size: int) -> Score:
    """Mask each ordinary token once and average its original-token log-prob."""
    token_ids = input_ids[0]
    positions = [
        index for index, token_id in enumerate(token_ids.tolist())
        if token_id not in special_token_ids and attention_mask[0, index].item() == 1
    ]
    if not positions:
        return Score(avg_log_prob=0.0, pseudo_perplexity=1.0, scored_tokens=0)

    total_log_prob = 0.0
    device = next(model.parameters()).device
    with torch.inference_mode():
        for start in range(0, len(positions), batch_size):
            chunk = positions[start:start + batch_size]
            masked = input_ids.repeat(len(chunk), 1)
            masks = attention_mask.repeat(len(chunk), 1)
            expected = []
            for row, position in enumerate(chunk):
                expected.append(masked[row, position].item())
                masked[row, position] = mask_token_id
            logits = model(
                input_ids=masked.to(device),
                attention_mask=masks.to(device),
            ).logits
            log_probs = torch.log_softmax(logits, dim=-1)
            for row, (position, token_id) in enumerate(zip(chunk, expected)):
                total_log_prob += log_probs[row, position, token_id].item()

    average = total_log_prob / len(positions)
    return Score(
        avg_log_prob=average,
        pseudo_perplexity=math.exp(-average),
        scored_tokens=len(positions),
    )


def segment_vietnamese(text: str) -> str:
    """Apply the word segmentation expected by PhoBERT."""
    if str(VENDORED_NLP) not in sys.path:
        sys.path.insert(0, str(VENDORED_NLP))
    from underthesea import word_tokenize
    return word_tokenize(text, format="text")


def score_text(model, tokenizer, text: str, batch_size: int, max_length: int) -> Score:
    encoded = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        max_length=max_length,
    )
    return score_encoded(
        model=model,
        input_ids=encoded["input_ids"],
        attention_mask=encoded["attention_mask"],
        mask_token_id=tokenizer.mask_token_id,
        special_token_ids=set(tokenizer.all_special_ids),
        batch_size=batch_size,
    )


def score_texts(model, tokenizer, texts: list[str], batch_size: int,
                max_length: int, mask_stride: int = 1) -> list[Score]:
    """Score many sentences with exact or grouped masked-token batches.

    ``mask_stride=1`` masks one token per row (exact PLL). Values above one
    partition every sentence's tokens into that many interleaved mask groups,
    which is much faster and is suitable for broad review ranking.
    """
    if not texts:
        return []
    encoded = tokenizer(texts, truncation=True, max_length=max_length)
    special_ids = set(tokenizer.all_special_ids)
    jobs = []
    token_counts = [0] * len(texts)
    for item_index, (ids, attention) in enumerate(zip(encoded["input_ids"], encoded["attention_mask"])):
        tokens = [
            (position, token_id)
            for position, (token_id, visible) in enumerate(zip(ids, attention))
            if visible and token_id not in special_ids
        ]
        token_counts[item_index] = len(tokens)
        if mask_stride <= 1:
            groups = [[token] for token in tokens]
        else:
            groups = [tokens[offset::mask_stride] for offset in range(mask_stride)]
        for group in groups:
            if group:
                jobs.append((len(ids), item_index, ids, attention, group))

    jobs.sort(key=lambda job: job[0])
    totals = [0.0] * len(texts)
    device = next(model.parameters()).device
    pad_token_id = tokenizer.pad_token_id
    if pad_token_id is None:
        pad_token_id = tokenizer.eos_token_id or 0

    with torch.inference_mode():
        for start in range(0, len(jobs), batch_size):
            chunk = jobs[start:start + batch_size]
            width = max(job[0] for job in chunk)
            masked = torch.full((len(chunk), width), pad_token_id, dtype=torch.long)
            masks = torch.zeros((len(chunk), width), dtype=torch.long)
            for row, (_, _, ids, attention, group) in enumerate(chunk):
                length = len(ids)
                masked[row, :length] = torch.tensor(ids, dtype=torch.long)
                masks[row, :length] = torch.tensor(attention, dtype=torch.long)
                for position, _ in group:
                    masked[row, position] = tokenizer.mask_token_id
            logits = model(
                input_ids=masked.to(device),
                attention_mask=masks.to(device),
            ).logits
            log_probs = torch.log_softmax(logits, dim=-1)
            for row, (_, item_index, _, _, group) in enumerate(chunk):
                for position, token_id in group:
                    totals[item_index] += log_probs[row, position, token_id].item()

    scores = []
    for total, count in zip(totals, token_counts):
        average = total / count if count else 0.0
        scores.append(Score(
            avg_log_prob=average,
            pseudo_perplexity=math.exp(-average),
            scored_tokens=count,
        ))
    return scores


def read_json_lines(lines: Iterable[str]) -> Iterable[dict]:
    for line_number, raw_line in enumerate(lines, 1):
        if not raw_line.strip():
            continue
        try:
            item = json.loads(raw_line)
        except json.JSONDecodeError as error:
            raise ValueError(f"stdin line {line_number} is not valid JSON: {error}") from error
        if not isinstance(item, dict) or not isinstance(item.get("text"), str):
            raise ValueError(f"stdin line {line_number} must be an object with a string 'text'")
        yield item


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model", default=os.environ.get("MAGIC_DUST_VI_LM", DEFAULT_MODEL))
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--max-length", type=int, default=256)
    parser.add_argument("--mask-stride", type=int, default=1,
                        help="Interleaved token-mask groups; 1 is exact PLL.")
    parser.add_argument("--offline", action="store_true", help="Use only an already cached model.")
    parser.add_argument("--no-segment", action="store_true", help="Skip Vietnamese word segmentation.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    tokenizer = AutoTokenizer.from_pretrained(args.model, local_files_only=args.offline)
    model = AutoModelForMaskedLM.from_pretrained(args.model, local_files_only=args.offline)
    model.eval()

    items = list(read_json_lines(sys.stdin))
    scored_texts = [
        item["text"] if args.no_segment else segment_vietnamese(item["text"])
        for item in items
    ]
    scores = score_texts(
        model, tokenizer, scored_texts, args.batch_size, args.max_length,
        mask_stride=max(1, args.mask_stride),
    )
    for item, score in zip(items, scores):
        output = {
            **item,
            "avg_log_prob": score.avg_log_prob,
            "pseudo_perplexity": score.pseudo_perplexity,
            "scored_tokens": score.scored_tokens,
        }
        print(json.dumps(output, ensure_ascii=False), flush=True)


if __name__ == "__main__":
    main()
