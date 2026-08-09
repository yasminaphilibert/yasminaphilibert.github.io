# Video Optimization Guide

This guide explains how to optimize videos for your portfolio while maintaining quality and resolution.

## Quick Start

1. **Upload your raw videos** to `public/videos/raw/`
2. **Run the optimization script:**
   ```bash
   chmod +x scripts/optimize-videos.sh
   ./scripts/optimize-videos.sh
   ```
3. **Use the optimized videos** in your project markdown files

## Video Optimization Strategy

### 1. One Format: MP4
- **MP4 (H.264 + AAC)**: the only format that plays everywhere, including
  Safari and every iOS version. This is what the site ships.
- **WebM (VP9)**: compresses better, but Safari and iOS before 17.4 refuse it.
  The site was WebM-only for a while and no video played on an iPhone, so WebM
  is no longer published. Don't reintroduce it as the sole format.

### 2. Compression Settings

#### WebM (VP9) - Best Compression
```bash
ffmpeg -i input.mp4 \
  -c:v libvpx-vp9 \
  -crf 30 \
  -b:v 0 \
  -c:a libopus \
  -b:a 128k \
  -movflags +faststart \
  output.webm
```

**Settings explained:**
- `-crf 30`: Quality level (18-32, lower = better quality, larger file)
- `-b:v 0`: Variable bitrate (allows better quality at same file size)
- `-b:a 128k`: Audio bitrate (128k is good quality for web)

#### MP4 (H.264) - Universal Fallback
```bash
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -preset slow \
  -crf 23 \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  output.mp4
```

**Settings explained:**
- `-preset slow`: Better compression (slower encoding, smaller files)
- `-crf 23`: Quality level (18-28, lower = better quality)
- `-movflags +faststart`: Enables progressive download

### 3. Poster Images (Thumbnails)
Create a thumbnail to show before the video loads:
```bash
ffmpeg -i input.mp4 \
  -ss 00:00:01 \
  -vframes 1 \
  -q:v 2 \
  output_poster.jpg
```

## File Structure

```
public/
  videos/
    raw/              # Upload your original videos here
      video1.mp4
      video2.mov
    video1.webm       # Optimized WebM
    video1.mp4        # Optimized MP4
    video1_poster.jpg # Thumbnail
    video2.webm
    video2.mp4
    video2_poster.jpg
```

## Using Videos in Projects

Add videos to your project markdown frontmatter:

```yaml
---
title: "My Project"
slug: "my-project"
# ... other fields ...
galleryVideos:
  - "public/videos/video1.mp4"
  - "public/videos/video2.mp4"
---
```

The Video component will automatically:
- Lazy load videos (only when in viewport)
- Show poster image before loading
- Resolve any video path to its `.mp4` sibling before requesting it
- Handle play/pause controls

## Quality vs File Size

### Recommended Settings by Use Case

**High Quality (Larger files, ~5-10MB per minute):**
- WebM: `-crf 25`
- MP4: `-crf 20`

**Balanced (Recommended, ~2-5MB per minute):**
- WebM: `-crf 30`
- MP4: `-crf 23`

**Smaller Files (~1-2MB per minute):**
- WebM: `-crf 35`
- MP4: `-crf 28`

## Manual Optimization

If you need to optimize a single video manually:

```bash
# WebM
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus -b:a 128k output.webm

# MP4
ffmpeg -i input.mp4 -c:v libx264 -preset slow -crf 23 -c:a aac -b:a 128k -movflags +faststart output.mp4

# Poster
ffmpeg -i input.mp4 -ss 00:00:01 -vframes 1 -q:v 2 poster.jpg
```

## Tips

1. **Resolution**: Keep original resolution if possible. The compression will handle file size.
2. **Length**: Shorter videos (under 2 minutes) work best for web portfolios.
3. **Frame Rate**: 30fps is usually sufficient for web. 60fps only if needed.
4. **Aspect Ratio**: Square (1:1) or 16:9 work best for the gallery grid.
5. **File Naming**: Use descriptive names without spaces (e.g., `project-demo.mp4`)

## Troubleshooting

**FFmpeg not found:**
- macOS: `brew install ffmpeg`
- Ubuntu/Debian: `sudo apt-get install ffmpeg`
- Windows: Download from https://ffmpeg.org/download.html

**Videos not loading:**
- Check file paths in markdown (should start with `public/videos/`)
- Ensure the `.mp4` exists — whatever extension the markdown names, the player
  requests the `.mp4`
- Check browser console for errors

**Videos return 200 but never play (especially on the live site):**
- Fetch the file directly and look at the first line. If it reads
  `version https://git-lfs.github.com/spec/v1`, you're being served a Git LFS
  pointer, not a video. Videos must be plain git objects — see `.gitattributes`.
  The deploy workflow fails the build if a pointer ever reaches `dist/videos/`.

**Video shows 0:00 duration / black screen when opened directly:**
- The WebM file likely has missing or corrupt metadata (duration not written, or non-streamable encoding).
- Re-encode the file so the container and metadata are correct:
  ```bash
  chmod +x scripts/fix-video-metadata.sh
  ./scripts/fix-video-metadata.sh                                    # fix all .webm in public/videos/
  ./scripts/fix-video-metadata.sh "public/videos/Your-Video.webm"   # fix one file
  ```
- Or re-export from your editor and run `./scripts/optimize-videos.sh` with the new file in `public/videos/raw/`.

**Large file sizes:**
- Lower CRF value (e.g., 35 for WebM, 28 for MP4)
- Consider reducing resolution if original is very high (4K+)
- Use `-preset slower` for MP4 (better compression, slower encoding)
