# Hero Image vs Thumbnail Image

The portfolio now supports separate images for:
- **Hero Image**: Used on the detail page (project/service page)
- **Thumbnail Image**: Used in cards, lists, and galleries

## Why Separate?

This allows you to:
- Use a detailed/wide hero image for the full page
- Use a cropped/optimized thumbnail for cards
- Use different aspect ratios for different contexts
- Use videos for hero while using static images for thumbnails (or vice versa)

## How to Use

### Projects

In your project markdown file:

```yaml
---
title: "My Project"
slug: "my-project"
service: "visual-art"
heroImage: "public/videos/hero-video.webm"      # Full hero for detail page
thumbnailImage: "public/images/thumbnail.jpg"   # Thumbnail for cards/lists
location: "Paris, France"
year: "2024"
---
```

**If `thumbnailImage` is not provided**, it will automatically fall back to `heroImage`.

### Services

In your service markdown file:

```yaml
---
title: "AI Studio"
slug: "ai-studio"
heroImage: "public/videos/service-hero.webm"     # Hero for service page
thumbnailImage: "public/images/service-card.jpg" # Thumbnail for service cards
infoColor: "#FF6B6B"
subtitle: "Creative AI"
order: 1
---
```

## Examples

### Example 1: Video Hero, Image Thumbnail

```yaml
---
title: "Motion Design"
slug: "motion-design"
heroImage: "public/videos/motion-hero.webm"        # Video hero
thumbnailImage: "public/images/motion-thumb.jpg"   # Static thumbnail
---
```

**Result:**
- Cards/lists show the static thumbnail (faster loading)
- Detail page shows the video hero (immersive experience)

### Example 2: Different Crops

```yaml
---
title: "Brand Identity"
slug: "brand-identity"
heroImage: "public/images/hero-wide.jpg"           # Wide format for hero
thumbnailImage: "public/images/thumb-square.jpg"  # Square crop for cards
---
```

**Result:**
- Cards use square thumbnail (better for grid layouts)
- Detail page uses wide hero (better for full-width display)

### Example 3: Same Image (Backward Compatible)

```yaml
---
title: "Simple Project"
slug: "simple-project"
heroImage: "public/images/project.jpg"  # Used for both hero and thumbnail
---
```

**Result:**
- If `thumbnailImage` is not provided, `heroImage` is used for both
- Fully backward compatible with existing projects

## Where Each Image is Used

### Hero Image (`heroImage`)
- ✅ Project detail page (full-width hero)
- ✅ Service detail page (full-width hero)
- ❌ NOT used in cards/lists/galleries

### Thumbnail Image (`thumbnailImage`)
- ✅ Project cards (ProjectCard component)
- ✅ Project grid cards (ProjectGridCard component)
- ✅ Service cards (ServiceCard component)
- ✅ Project lists/galleries
- ❌ NOT used on detail pages

## Best Practices

1. **Hero Images**: 
   - Can be videos or images
   - Should be high quality
   - Wide format works well (16:9 or wider)
   - Can be larger file size (only loads on detail page)

2. **Thumbnail Images**:
   - Should be optimized for fast loading
   - Square or portrait format works well for cards
   - Smaller file size recommended (loads in lists/galleries)
   - Static images preferred (videos can work but may be slower)

3. **When to Use Separate Images**:
   - Hero is a video, thumbnail should be static
   - Different aspect ratios needed
   - Hero is very large, thumbnail should be optimized
   - Different crops work better in different contexts

4. **When to Use Same Image**:
   - Simple projects where one image works for both
   - Image is already optimized for both contexts
   - You want consistency between card and detail page

## Migration

Existing projects will continue to work! If you don't specify `thumbnailImage`, the system automatically uses `heroImage` for both purposes.

To migrate:
1. Add `thumbnailImage` field to your markdown files
2. Point it to an optimized thumbnail version
3. Keep `heroImage` for the detail page

No breaking changes - everything is backward compatible!
