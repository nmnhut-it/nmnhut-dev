import importlib.util
import json
import math
import sys
from pathlib import Path

import torch


SCORER = Path(__file__).parent / "tools" / "nlp" / "phobert_pll.py"
spec = importlib.util.spec_from_file_location("phobert_pll", SCORER)
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)


class FakeOutput:
    def __init__(self, logits):
        self.logits = logits


class FakeModel:
    def __init__(self):
        self.anchor = torch.nn.Parameter(torch.zeros(1))

    def parameters(self):
        yield self.anchor

    def __call__(self, input_ids, attention_mask):
        rows, width = input_ids.shape
        logits = torch.zeros(rows, width, 10)
        expected = [3, 4]
        for row, token_id in enumerate(expected[:rows]):
            position = row + 1
            logits[row, position, token_id] = 2.0
        return FakeOutput(logits)


score = module.score_encoded(
    model=FakeModel(),
    input_ids=torch.tensor([[0, 3, 4, 1]]),
    attention_mask=torch.tensor([[1, 1, 1, 1]]),
    mask_token_id=9,
    special_token_ids={0, 1},
    batch_size=8,
)
expected_log_prob = 2.0 - math.log(math.exp(2.0) + 9)
assert score.scored_tokens == 2
assert abs(score.avg_log_prob - expected_log_prob) < 1e-6
assert abs(score.pseudo_perplexity - math.exp(-expected_log_prob)) < 1e-6

items = list(module.read_json_lines([json.dumps({"text": "Câu thử."}, ensure_ascii=False)]))
assert items == [{"text": "Câu thử."}]

print("Vietnamese naturalness scorer tests: ok")
