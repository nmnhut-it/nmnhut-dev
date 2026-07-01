# Slide Narration Audio

The audio files in `audio/` are generated from `../teacher-script.md` with Edge TTS.

Generate or refresh from the repository root:

```powershell
python -m pip install edge-tts
python tools\generate_edge_tts.py
```

Use a different voice:

```powershell
python tools\generate_edge_tts.py --voice en-US-AriaNeural --rate -5%
```

When `manifest.json` exists, `web/slides/slides.js` adds an audio control to each slide.
