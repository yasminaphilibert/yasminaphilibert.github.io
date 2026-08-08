# Content Management Guide

This folder contains all the editable content for the portfolio website. Each markdown file controls different parts of the site.

## Directory Structure

```
src/content/
├── config.md              # Global site settings (name, email, social links)
├── index.md               # Home page hero
├── about.md               # About page
├── work.md                # Work index page
├── contact.md             # Contact page
├── navbar.md              # Header logo, tagline, nav links
├── footer.md              # Footer social links, nav links, copyright
├── services/              # Service pages
│   ├── visual-identity.md
│   ├── visual-art.md
│   ├── ai-studio.md
│   └── sound.md
└── projects/              # Project pages organized by service
    ├── visual-identity/
    │   ├── brand-hug-me.md
    │   └── him-her.md
    ├── visual-art/
    │   ├── akasadhatu.md
    │   ├── from-sound.md
    │   └── nodaleto.md
    └── ai-studio/
        ├── face-transition.md
        ├── glass-skin.md
        ├── heavy-metal.md
        ├── makeup.md
        ├── nocturnal-transit-after-speed.md
        ├── not-human.md
        ├── smiles.md
        └── soft-machine.md
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
subtitle: "Print & Digital"        # Subtitle shown on cards
slug: "visual-identity"            # URL path (don't change unless updating links)
infoColor: "#203987"               # Card accent color (hex format)
heroImage: "public/images/services/visual-identity/hero.png"
thumbnailImage: "public/images/services/visual-identity/hero.png"
projectsGridBackground: "#634056"  # Optional: projects grid background color
order: 1                           # Display order (1 = first)
homeIntro: ""                      # Optional short intro on the home page
soundCloudUrl: ""                  # Optional (Sound service only)
---

Description text goes here. This appears on the service page.
```

### Project File Structure

```markdown
---
title: "Hug Me"                    # Project name
slug: "brand-hug-me"               # URL path
service: "visual-identity"         # Parent service slug
location: "Paris, France"          # Project location
year: "2018"                       # Project year
heroImage: "/images/services/visual-identity/hero.png"
heroImagePosition: "center top"    # Optional object-position for the hero
thumbnailImage: "/images/services/visual-identity/thumb.png"
galleryImages:                     # Additional gallery images
  - "/images/services/visual-identity/page_08.png"
  - "/images/services/visual-identity/page_09.png"
galleryBackground: "#8d6f70"       # Optional gallery background color
order: 1                           # Display order within service
featured: false                    # Show on homepage (true/false)
barColor: "#FF6B6B"                # Optional: custom bar color (overrides service color)
tags:                              # Rendered under "Tags"
  - brand
  - visual identity
keywords:                          # Rendered under "Keywords"
  - HUG ME
  - comfort
toolsUsed:                         # Rendered under "Tools used"
  - Premiere Pro
  - After Effects
---

Project description goes here. Each paragraph becomes a separate block.

Second paragraph of the description.
```

## Adding New Projects

1. Create a new `.md` file in the appropriate service folder
2. Copy the structure from an existing project file
3. Update all the fields with your new project info
4. Add images to the corresponding `/public/images/services/` folder

## Adding Images

1. Place images in the `/public/images/` folder:
   - Service and project images: `/public/images/services/[service-slug]/`
   - Videos: `/public/videos/`
2. Reference them in markdown using a path starting with `/images/` or `public/images/`
   (both work — `public/` is stripped automatically)

## Color Reference

Current service colors:
- Visual Identity: `#203987` (blue)
- Visual Art: `#524063` (purple)
- AI Studio: `#f3917a` (coral)
- Sound: `#7bbc96` (green)

You can use any hex color code.

## Tips

- **Slugs** are used in URLs — use lowercase with hyphens (e.g., `my-project`)
- **Order** determines display sequence — lower numbers appear first
- **Featured** projects appear on the homepage
- Always wrap frontmatter values in double quotes — a missing quote breaks the page
- Keep descriptions concise — each paragraph break creates a new text block
