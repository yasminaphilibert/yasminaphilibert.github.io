#!/bin/bash

# Video Optimization Script
# This script optimizes videos for web use while maintaining quality
# Usage: ./scripts/optimize-videos.sh [input_directory] [output_directory]
# 
# Speed settings:
# - WebM: Uses cpu-used=4 (faster) instead of default (slower but better compression)
# - MP4: Skipped (WebM only for better compression and faster processing)
# For maximum quality (slower), edit the script and change:
#   WebM: cpu-used 4 -> cpu-used 0
#
# Note: WebM is better for web (smaller files, better compression)
# Modern browsers (Chrome, Firefox, Edge, Safari 14+) all support WebM

INPUT_DIR="${1:-public/videos/raw}"
OUTPUT_DIR="${2:-public/videos}"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Video Optimization Script${NC}"
echo "================================"
echo "Input directory: $INPUT_DIR"
echo "Output directory: $OUTPUT_DIR"
echo ""

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}Error: ffmpeg is not installed.${NC}"
    echo "Please install ffmpeg first:"
    echo "  macOS: brew install ffmpeg"
    echo "  Ubuntu: sudo apt-get install ffmpeg"
    echo "  Windows: Download from https://ffmpeg.org/download.html"
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Function to process a video file
process_video() {
    local video="$1"
    local filename=$(basename "$video")
    local name="${filename%.*}"
    
    echo -e "${YELLOW}Processing: $filename${NC}"
    
    # 1. Create optimized WebM (VP9) - Best compression
    # Using faster speed settings for quicker encoding
    echo "  → Creating WebM (VP9) version..."
    if ffmpeg -i "$video" \
        -c:v libvpx-vp9 \
        -crf 30 \
        -b:v 0 \
        -cpu-used 4 \
        -row-mt 1 \
        -c:a libopus \
        -b:a 128k \
        -movflags +faststart \
        -y \
        "$OUTPUT_DIR/${name}.webm" 2>&1 | grep -q "error\|Error" && false || true; then
        if [ -f "$OUTPUT_DIR/${name}.webm" ]; then
            echo -e "    ${GREEN}✓ WebM created${NC}"
        else
            echo -e "    ${RED}✗ WebM creation failed${NC}"
        fi
    else
        echo -e "    ${RED}✗ WebM creation failed${NC}"
    fi
    
    # MP4 encoding skipped - using WebM only for better compression
    
    # 3. Create poster image (thumbnail)
    echo "  → Creating poster image..."
    if ffmpeg -i "$video" \
        -ss 00:00:01 \
        -vframes 1 \
        -q:v 2 \
        -y \
        "$OUTPUT_DIR/${name}_poster.jpg" 2>&1 | grep -q "error\|Error" && false || true; then
        if [ -f "$OUTPUT_DIR/${name}_poster.jpg" ]; then
            echo -e "    ${GREEN}✓ Poster created${NC}"
        else
            echo -e "    ${RED}✗ Poster creation failed${NC}"
        fi
    else
        echo -e "    ${RED}✗ Poster creation failed${NC}"
    fi
    
    echo ""
}

# Process each video file by extension
# Enable nullglob to handle cases where no files match
shopt -s nullglob
file_count=0
for ext in mp4 MOV mov avi mkv webm; do
    for video in "$INPUT_DIR"/*."$ext"; do
        # Check if file exists
        if [ -f "$video" ]; then
            process_video "$video"
            ((file_count++))
        fi
    done
done
shopt -u nullglob

# Check if any files were processed
if [ $file_count -eq 0 ]; then
    echo -e "${YELLOW}No video files found in $INPUT_DIR${NC}"
    echo "Please upload your video files to: $INPUT_DIR"
    echo ""
    echo "Supported formats: .mp4, .mov, .avi, .mkv, .webm"
    exit 0
fi

echo -e "${GREEN}Optimization complete!${NC}"
echo ""
echo "Optimized files are in: $OUTPUT_DIR"
echo ""
echo "File structure:"
echo "  - [name].webm (WebM format, best compression)"
echo "  - [name]_poster.jpg (Thumbnail image)"
echo ""
echo "Next steps:"
echo "  1. Review the optimized videos"
echo "  2. Update your project markdown files to reference videos"
echo "  3. Example: galleryVideos:"
echo "     - 'public/videos/my-video.webm'"
