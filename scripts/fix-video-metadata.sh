#!/bin/bash
# Fix WebM videos that show 0:00 duration / black screen in the browser.
# Re-encodes the file so duration and metadata are written correctly.
#
# Usage:
#   ./scripts/fix-video-metadata.sh                          # fix all .webm in public/videos/
#   ./scripts/fix-video-metadata.sh path/to/video.webm        # fix one file

TARGET="${1:-}"
if [ -z "$TARGET" ]; then
  VIDEOS_DIR="public/videos"
  FIX_ALL=1
elif [ -f "$TARGET" ]; then
  VIDEOS_DIR=""
  SINGLE_FILE="$TARGET"
else
  echo "Error: not a file: $TARGET"
  exit 1
fi

if ! command -v ffmpeg &> /dev/null; then
  echo "Error: ffmpeg is required. Install with: brew install ffmpeg"
  exit 1
fi

process_one() {
  local video="$1"
  local dir=$(dirname "$video")
  local filename=$(basename "$video")
  local name="${filename%.*}"
  local temp_out="${dir}/${name}_fixed.webm"

  echo "Fixing: $filename"
  # Check for audio
  has_audio=$(ffprobe -v error -select_streams a:0 -show_entries stream=codec_type -of default=noprint_wrappers=1:nokey=1 "$video" 2>/dev/null | head -1)

  args=(-i "$video" -c:v libvpx-vp9 -crf 30 -b:v 0 -cpu-used 4 -row-mt 1 -map 0:v:0 -avoid_negative_ts make_zero -y "$temp_out")
  if [ -n "$has_audio" ]; then
    args=(-i "$video" -c:v libvpx-vp9 -crf 30 -b:v 0 -cpu-used 4 -row-mt 1 -c:a libopus -b:a 128k -map 0:v:0 -map 0:a:0 -avoid_negative_ts make_zero -y "$temp_out")
  fi

  if ffmpeg "${args[@]}" -loglevel warning -stats 2>&1; then
    if [ -f "$temp_out" ] && [ $(stat -f%z "$temp_out" 2>/dev/null || stat -c%s "$temp_out" 2>/dev/null) -gt 1024 ]; then
      mv "$temp_out" "$video"
      echo "  ✓ Re-encoded and replaced original"
      # Regenerate poster if it exists
      if [ -f "${dir}/${name}_poster.jpg" ]; then
        ffmpeg -i "$video" -ss 00:00:01 -vframes 1 -q:v 2 -y "${dir}/${name}_poster.jpg" -loglevel error 2>/dev/null && echo "  ✓ Poster updated"
      fi
    else
      echo "  ✗ Output missing or too small, keeping original"
      rm -f "$temp_out"
    fi
  else
    echo "  ✗ ffmpeg failed, keeping original"
    rm -f "$temp_out"
  fi
  echo ""
}

if [ -n "$SINGLE_FILE" ]; then
  process_one "$SINGLE_FILE"
else
  shopt -s nullglob
  for video in "$VIDEOS_DIR"/*.webm; do
    [ -f "$video" ] || continue
    process_one "$video"
  done
  shopt -u nullglob
fi

echo "Done."
