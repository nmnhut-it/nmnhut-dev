"""Frame-mining helper for the world/node art pipeline (see lessons/README.md
"Art pipeline"). Wraps ffmpeg (must be on PATH) to dump frames from an mp4
at a given fps, or at explicit timestamps, into an output directory.

Usage:
    python lessons/tools/extract-frames.py <video.mp4> <outdir> --fps 1
    python lessons/tools/extract-frames.py <video.mp4> <outdir> --at 0.5,2.0,7.3

Frames land as <outdir>/<video-stem>-%04d.jpg (fps mode) or
<video-stem>-t<seconds>.jpg (timestamp mode). Output dir is created if
missing. This script is a dev tool only — its output (contact sheets,
curated frames) is NOT committed; only the final graded assets under
lessons/assets/ are.
"""
import argparse, os, subprocess, sys

def run_fps(video, outdir, fps):
    stem = os.path.splitext(os.path.basename(video))[0]
    pattern = os.path.join(outdir, f"{stem}-%04d.jpg")
    cmd = ["ffmpeg", "-y", "-i", video, "-vf", f"fps={fps}", "-q:v", "2", pattern]
    subprocess.run(cmd, check=True)

def run_at(video, outdir, timestamps):
    stem = os.path.splitext(os.path.basename(video))[0]
    for t in timestamps:
        out = os.path.join(outdir, f"{stem}-t{t}.jpg")
        cmd = ["ffmpeg", "-y", "-ss", str(t), "-i", video, "-frames:v", "1", "-q:v", "2", out]
        subprocess.run(cmd, check=True)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("outdir")
    ap.add_argument("--fps", type=float, default=None)
    ap.add_argument("--at", type=str, default=None, help="comma-separated seconds")
    args = ap.parse_args()
    os.makedirs(args.outdir, exist_ok=True)
    if args.at:
        run_at(args.video, args.outdir, [float(x) for x in args.at.split(",")])
    else:
        run_fps(args.video, args.outdir, args.fps or 1)
    print(f"done: {args.outdir}")

if __name__ == "__main__":
    main()
