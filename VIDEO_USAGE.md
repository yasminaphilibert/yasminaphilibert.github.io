# Using Videos in Your Portfolio

You can now use videos (`.webm` or `.mp4`) anywhere you would normally use images! The system automatically detects video files and renders them appropriately.

## Supported Video Formats

- `.webm` (recommended - best compression)
- `.mp4` (universal fallback)
- `.mov`, `.avi`, `.mkv` (will be converted to webm/mp4)

## Where You Can Use Videos

### 1. Hero Images (Project or Service)

In your project or service markdown frontmatter, use a video instead of an image:

```yaml
---
title: "My Project"
slug: "my-project"
service: "visual-art"
heroImage: "public/videos/my-video.webm"  # Video instead of image!
location: "Paris, France"
year: "2024"
---
```

**Note:** Hero videos will autoplay, loop, and be muted (no controls).

### 2. Gallery Items

Mix images and videos in your gallery:

```yaml
---
title: "My Project"
slug: "my-project"
galleryImages:
  - "public/images/image1.jpg"
  - "public/videos/video1.webm"  # Video in gallery!
  - "public/images/image2.jpg"
  - "public/videos/video2.mp4"   # Another video!
---
```

**Note:** Gallery videos will show controls and require user interaction to play.

### 3. Service Hero Images

```yaml
---
title: "AI Studio"
slug: "ai-studio"
heroImage: "public/videos/ai-demo.webm"  # Video hero!
infoColor: "#FF6B6B"
---
```

## Video Optimization

Before using videos, optimize them using the provided script:

```bash
# 1. Upload raw videos to public/videos/raw/
# 2. Run optimization script
./scripts/optimize-videos.sh

# This creates:
# - public/videos/my-video.webm (optimized WebM)
# - public/videos/my-video.mp4 (optimized MP4)
# - public/videos/my-video_poster.jpg (thumbnail)
```

## Best Practices

1. **Use WebM when possible** - Better compression, smaller file sizes
2. **Keep videos short** - Under 2 minutes for best performance
3. **Optimize first** - Always run the optimization script
4. **Poster images** - Automatically generated, but you can provide custom ones
5. **File naming** - Use descriptive names without spaces (e.g., `project-demo.webm`)

## Examples

### Example Project with Video Hero

```yaml
---
title: "Motion Design Showcase"
slug: "motion-showcase"
service: "visual-art"
heroImage: "public/videos/motion-hero.webm"
location: "New York, USA"
year: "2024"
galleryImages:
  - "public/images/still1.jpg"
  - "public/videos/process.mp4"
  - "public/images/still2.jpg"
---
```

### Example Service with Video Hero

```yaml
---
title: "Sound Design"
slug: "sound"
heroImage: "public/videos/sound-hero.webm"
infoColor: "#9B59B6"
subtitle: "Audio & Music"
order: 2
---
```

## How It Works

The `Media` component automatically:
- Detects if a file is a video (by extension)
- Renders `<Video>` component for videos
- Renders `<img>` for images
- Handles poster images automatically
- Provides WebM/MP4 fallbacks for maximum compatibility

You don't need to change anything in your markdown - just use video file paths instead of image paths!
