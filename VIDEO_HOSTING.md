# Video Hosting Options

Since GitHub has a 100 MB file size limit, large video files need special handling. Here are your options:

## Option 1: Git LFS (Git Large File Storage) - Recommended

**Best for:** Keeping videos in your repository

Git LFS stores large files separately but keeps them in your git history.

### Setup:
```bash
# Install Git LFS (if not already installed)
brew install git-lfs

# Initialize Git LFS in your repo
git lfs install

# Track video files
git lfs track "public/videos/*.webm"
git lfs track "public/videos/*.mp4"

# Add the .gitattributes file
git add .gitattributes

# Now add your videos normally
git add public/videos/*.webm
git commit -m "Add videos with Git LFS"
git push
```

**Pros:**
- Videos stay in your repository
- Works seamlessly with GitHub
- Free for public repos (1 GB storage, 1 GB bandwidth/month)

**Cons:**
- Requires Git LFS installation
- Limited free bandwidth for private repos

## Option 2: External Video Hosting Services

### A. Cloudinary (Recommended for Web)

**Best for:** Automatic optimization and CDN delivery

1. Sign up at https://cloudinary.com (free tier available)
2. Upload videos to Cloudinary
3. Get optimized URLs
4. Update your markdown files:

```yaml
heroImage: "https://res.cloudinary.com/your-cloud/video/upload/v1234567/your-video.webm"
```

**Pros:**
- Automatic optimization
- CDN delivery (fast worldwide)
- Free tier: 25 GB storage, 25 GB bandwidth/month
- Automatic format conversion

**Cons:**
- Requires external account
- Videos not in your repo

### B. Vimeo / YouTube

**Best for:** Maximum compatibility

1. Upload to Vimeo/YouTube
2. Use embed codes or direct links
3. Update Video component to support iframe embeds

**Pros:**
- Unlimited storage
- Excellent compression
- Built-in player features

**Cons:**
- Requires iframe embedding
- Less control over player

### C. AWS S3 + CloudFront

**Best for:** Professional projects with high traffic

1. Upload to S3 bucket
2. Configure CloudFront CDN
3. Use CDN URLs in your markdown

**Pros:**
- Scalable
- Fast CDN
- Pay-as-you-go

**Cons:**
- Requires AWS account
- More complex setup
- Costs money at scale

## Option 3: Keep Videos Local (Current Setup)

**Best for:** Development and small deployments

Keep videos in `public/videos/` but:
- Add to `.gitignore` (already done)
- Deploy videos separately to your hosting service
- Or use a deployment service that handles large files

**Pros:**
- Simple
- No external dependencies

**Cons:**
- Videos not in git
- Need to deploy separately
- Larger deployment size

## Recommendation

For your portfolio, I recommend **Git LFS** because:
1. Videos stay in your repository
2. Works seamlessly with GitHub Pages/Vercel/Netlify
3. Free for public repos
4. No external dependencies for users

Would you like me to set up Git LFS for you?
