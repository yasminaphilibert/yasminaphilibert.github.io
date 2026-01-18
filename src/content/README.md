# Content Management Guide

This folder contains all the editable content for your portfolio website. Each markdown file controls different parts of the site.

## Directory Structure

```
src/content/
├── config.md              # Global site settings (name, email, social links)
├── services/              # Service pages
│   ├── visual-identity.md
│   ├── graphic-design.md
│   └── sound-engineering.md
└── projects/              # Project pages organized by service
    ├── visual-identity/
    │   ├── chromatic-visions.md
    │   ├── brand-horizon.md
    │   └── identity-shift.md
    ├── graphic-design/
    │   ├── noir-typography.md
    │   ├── editorial-essence.md
    │   └── poster-series.md
    └── sound-engineering/
        ├── resonance-studio.md
        ├── sonic-landscapes.md
        └── film-score.md
```

## How to Edit Content

### Editing Existing Content

1. Open any `.md` file in a text editor
2. Edit the content between the `---` markers (frontmatter) or the description below
3. Save the file
4. The website will update automatically

### Service File Structure

```markdown
---
title: "Visual Identity"           # Display name
subtitle: "Art Direction"          # Subtitle shown on cards
slug: "visual-identity"            # URL path (don't change unless updating links)
infoColor: "#6BCB77"              # Card accent color (hex format)
heroImage: "/images/services/visual-identity-hero.jpg"  # Hero image path
order: 1                          # Display order (1 = first)
---

Description text goes here. This appears on the service page.
```

### Project File Structure

```markdown
---
title: "Chromatic Visions"         # Project name
slug: "chromatic-visions"          # URL path
service: "visual-identity"         # Parent service slug
location: "Los Angeles, CA"        # Project location
year: "2024"                       # Project year
heroImage: "/images/projects/chromatic-visions/hero.jpg"
galleryImages:                     # Additional gallery images
  - "/images/projects/chromatic-visions/gallery-1.jpg"
  - "/images/projects/chromatic-visions/gallery-2.jpg"
order: 1                          # Display order within service
featured: true                    # Show on homepage (true/false)
---

Project description goes here. Each paragraph becomes a separate block.

Second paragraph of the description.
```

## Adding New Projects

1. Create a new `.md` file in the appropriate service folder
2. Copy the structure from an existing project file
3. Update all the fields with your new project info
4. Add images to the corresponding `/public/images/projects/` folder

## Adding Images

1. Place images in `/public/images/` folder:
   - Service images: `/public/images/services/`
   - Project images: `/public/images/projects/[project-slug]/`
2. Reference them in markdown using the path starting with `/images/`

## Color Reference

Current service colors:
- Visual Identity: `#6BCB77` (green)
- Graphic Design: `#7B5EA7` (purple)
- Sound Engineering: `#E8A87C` (coral/orange)

You can use any hex color code.

## Tips

- **Slugs** are used in URLs - use lowercase with hyphens (e.g., `my-project`)
- **Order** determines display sequence - lower numbers appear first
- **Featured** projects appear on the homepage
- Keep descriptions concise - each paragraph break creates a new text block
