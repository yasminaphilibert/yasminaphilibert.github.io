#!/bin/bash

# Video Split Script for Shorts
# Splits a video into 10.5-second segments
# Usage: ./scripts/split-video-shorts.sh [input_video] [output_directory]

INPUT_VIDEO="${1:-public/videos/Nodaleto - Love To Love You.webm}"
OUTPUT_DIR="${2:-public/videos}"
SEGMENT_DURATION=10.5

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Video Split Script for Shorts${NC}"
echo "======================================"
echo "Input video: $INPUT_VIDEO"
echo "Output directory: $OUTPUT_DIR"
echo "Segment duration: ${SEGMENT_DURATION}s"
echo ""

# Check if input file exists
if [ ! -f "$INPUT_VIDEO" ]; then
    echo -e "${RED}Error: Input video not found: $INPUT_VIDEO${NC}"
    exit 1
fi

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}Error: ffmpeg is not installed.${NC}"
    echo "Please install ffmpeg first:"
    echo "  macOS: brew install ffmpeg"
    echo "  Ubuntu: sudo apt-get install ffmpeg"
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Get video filename without extension
filename=$(basename "$INPUT_VIDEO")
name="${filename%.*}"

# Get video duration
duration=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$INPUT_VIDEO")
echo "Video duration: ${duration}s"
echo ""

# Calculate number of segments
segment_count=$(echo "$duration / $SEGMENT_DURATION" | bc -l | awk '{print int($1) + (($1 - int($1)) > 0 ? 1 : 0)}')
echo "Creating $segment_count segment(s)..."
echo ""

# Split video into segments
segment_num=1
start_time=0

while (( $(echo "$start_time < $duration" | bc -l) )); do
    output_file="$OUTPUT_DIR/${name}_short_${segment_num}.webm"
    
    echo -e "${YELLOW}Creating segment $segment_num (${start_time}s - $(echo "$start_time + $SEGMENT_DURATION" | bc -l)s)...${NC}"
    
    # Calculate actual duration for this segment (don't exceed video duration)
    actual_duration=$(echo "if ($start_time + $SEGMENT_DURATION > $duration) { $duration - $start_time } else { $SEGMENT_DURATION }" | bc -l)
    
    if ffmpeg -i "$INPUT_VIDEO" \
        -ss "$start_time" \
        -t "$actual_duration" \
        -c:v copy \
        -c:a copy \
        -avoid_negative_ts make_zero \
        -y \
        "$output_file" 2>&1 | grep -q "error\|Error" && false || true; then
        if [ -f "$output_file" ]; then
            echo -e "  ${GREEN}✓ Segment $segment_num created${NC}"
        else
            echo -e "  ${RED}✗ Segment $segment_num creation failed${NC}"
        fi
    else
        echo -e "  ${RED}✗ Segment $segment_num creation failed${NC}"
    fi
    
    start_time=$(echo "$start_time + $SEGMENT_DURATION" | bc -l)
    ((segment_num++))
done

echo ""
echo -e "${GREEN}Split complete!${NC}"
echo ""
echo "Created segments in: $OUTPUT_DIR"
echo ""
ls -lh "$OUTPUT_DIR"/${name}_short_*.webm 2>/dev/null | awk '{print "  - " $9 " (" $5 ")"}'
