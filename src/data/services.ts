import { loadServices, loadProjects, getServiceBySlugFromContent, getProjectBySlugFromContent } from '@/lib/content';
import type { ComparisonPair } from '@/lib/content';
import { encodeAssetUrl } from '@/lib/utils';

// Fallback images for when content images aren't available yet
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

// Image mapping for backward compatibility
const fallbackImages: Record<string, string> = {
  'chromatic-visions': project1,
  'brand-horizon': project2,
  'identity-shift': project3,
  'noir-typography': project2,
  'editorial-essence': project1,
  'poster-series': project3,
  'resonance-studio': project3,
  'sonic-landscapes': project1,
  'film-score': project2,
  'visual-identity': project1,
  'graphic-design': project2,
  'sound-engineering': project3,
};

export interface Project {
  title: string;
  location: string;
  year: string;
  image: string; // Thumbnail image for cards/lists
  heroImage: string; // Hero image for detail page
  heroImagePosition?: string; // Optional object-position for hero image
  slug: string;
  description: string[];
  barColor?: string; // Optional custom bar color
  galleryImages?: string[]; // Gallery images from markdown
  galleryVideos?: string[]; // Gallery videos from markdown
  galleryBackground?: string; // Optional custom gallery background color
  tags?: string[];
  keywords?: string[];
  toolsUsed?: string[];
  comparisonPairs?: ComparisonPair[]; // Optional before/after slider pairs
  magazinePages?: string[]; // Optional page-turning magazine, in reading order
}

export interface Service {
  title: string;
  subtitle: string;
  description: string;
  image: string; // Thumbnail image for cards/lists
  heroImage: string; // Hero image for detail page
  slug: string;
  infoColor: string;
  projectsGridBackground?: string; // Optional custom projects grid background color
  homeIntro?: string; // Short intro for home page, before each service card
  soundCloudUrl?: string; // Optional SoundCloud link (e.g. for Sound service)
  projects: Project[];
}

// Helper to normalize image/video paths from markdown (public/ -> /)
// Vite serves public/ at the site root, so we must use root-relative URLs.
// Avoid double slash (//) which browsers treat as protocol-relative URL (e.g. https://images/...).
function normalizeImagePath(path: string): string {
  if (!path || path.trim() === '') {
    return path;
  }
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '/';
  const baseWithSlash = base === '' || base === '/' ? '/' : base + '/';

  // In dev, use raw path so Vite's static server can resolve filenames with spaces/comma.
  // In production (e.g. GitHub Pages), use encoded path for strict servers.
  const useEncoded = !import.meta.env.DEV;
  const encodeIfNeeded = (p: string) => (useEncoded ? encodeAssetUrl(p) : p);

  // Convert "public/..." to root-relative (required for production)
  if (path.startsWith('public/')) {
    return encodeIfNeeded(baseWithSlash + path.substring(7));
  }

  let out: string;
  if (path.startsWith('/') && (base === '' || base === '/')) {
    out = encodeIfNeeded(path);
    return out;
  }
  if (path.startsWith(baseWithSlash) || path === base) {
    return encodeIfNeeded(path);
  }
  if (path.startsWith('/')) {
    const result = base === '' || base === '/' ? path : base + path;
    out = encodeIfNeeded(result);
    return out;
  }
  const result = baseWithSlash + path;
  out = encodeIfNeeded(result);
  return out;
}

// Helper to resolve image path with fallback
function resolveImage(imagePath: string, slug: string): string {
  // Use the image path from markdown if provided, otherwise fallback
  if (imagePath && imagePath.trim() !== '') {
    return normalizeImagePath(imagePath);
  }
  return fallbackImages[slug] || project1;
}

// Helper to normalize multiple image paths (for gallery images)
function normalizeImagePaths(paths: string[]): string[] {
  return paths.map(path => normalizeImagePath(path));
}

// Normalize the image paths inside comparison pairs. normalizeImagePath is NOT
// idempotent in production (it URL-encodes), so each pair must pass through here
// exactly once — see the getProjectBySlug branches below.
function normalizeComparisonPairs(pairs?: ComparisonPair[]): ComparisonPair[] {
  return (pairs || []).map(p => ({
    label: p.label,
    left: normalizeImagePath(p.left),
    right: normalizeImagePath(p.right)
  }));
}

// Helper to normalize video paths (same as images)
function normalizeVideoPaths(paths: string[]): string[] {
  return paths.map(path => normalizeImagePath(path));
}

// Load services from markdown content
export const services: Service[] = (() => {
  try {
    const contentServices = loadServices();
    
    return contentServices.map(service => {
      const serviceProjects = loadProjects(service.slug);
      
      return {
        title: service.title,
        subtitle: service.subtitle,
        description: service.description,
        image: resolveImage(service.thumbnailImage || service.heroImage, service.slug),
        heroImage: resolveImage(service.heroImage, service.slug),
        slug: service.slug,
        infoColor: service.infoColor,
        projectsGridBackground: service.projectsGridBackground,
        homeIntro: service.homeIntro,
        soundCloudUrl: service.soundCloudUrl,
        projects: serviceProjects.map(project => {
          const rawGallery = project.galleryImages || [];
          const normalizedGallery = normalizeImagePaths(rawGallery);
          return {
          title: project.title,
          location: project.location,
          year: project.year,
          image: resolveImage(project.thumbnailImage || project.heroImage, project.slug),
          heroImage: resolveImage(project.heroImage, project.slug),
          heroImagePosition: project.heroImagePosition,
          slug: project.slug,
          description: project.description,
          barColor: project.barColor,
          galleryImages: normalizedGallery,
          galleryVideos: normalizeVideoPaths(project.galleryVideos || []),
          galleryBackground: project.galleryBackground,
          tags: project.tags || [],
          keywords: project.keywords || [],
          toolsUsed: project.toolsUsed || [],
          comparisonPairs: normalizeComparisonPairs(project.comparisonPairs),
          magazinePages: normalizeImagePaths(project.magazinePages || []),
        };
        })
      };
    });
  } catch (error) {
    console.error('Error loading content from markdown:', error);
    return [];
  }
})();

export const getAllProjects = (): (Project & { serviceSlug: string; serviceColor: string; barColor?: string; heroImage: string })[] => {
  // Load all projects directly from markdown to ensure we get all projects
  const allProjectsFromContent = loadProjects();
  
  return allProjectsFromContent.map(project => {
    // Find the service that matches this project's service field
    const matchingService = services.find(s => s.slug === project.service);
    
    // If no matching service found, try to find by slug or use first available service as fallback
    const service = matchingService || services.find(s => s.slug === 'graphic-design') || services[0];
    
    return {
      title: project.title,
      location: project.location,
      year: project.year,
      image: resolveImage(project.thumbnailImage || project.heroImage, project.slug),
      heroImage: resolveImage(project.heroImage, project.slug),
      heroImagePosition: project.heroImagePosition,
      slug: project.slug,
      description: project.description,
      barColor: project.barColor,
      galleryImages: normalizeImagePaths(project.galleryImages || []),
      galleryVideos: normalizeVideoPaths(project.galleryVideos || []),
      galleryBackground: project.galleryBackground,
      tags: project.tags || [],
      keywords: project.keywords || [],
      toolsUsed: project.toolsUsed || [],
      comparisonPairs: normalizeComparisonPairs(project.comparisonPairs),
      magazinePages: normalizeImagePaths(project.magazinePages || []),
      serviceSlug: service?.slug || project.service,
      serviceColor: project.barColor || service?.infoColor || '#000000'
    };
  });
};

export const getServiceBySlug = (slug: string): Service | undefined => {
  return services.find(s => s.slug === slug);
};

export const getProjectBySlug = (slug: string): (Project & { serviceSlug: string; serviceColor: string; serviceTitle: string; heroImage: string }) | undefined => {
  // Always load from markdown so tags/keywords are current
  const allProjectsFromContent = loadProjects();
  const projectContent = allProjectsFromContent.find(p => p.slug === slug);

  // First try to find in services array (for resolved images and bar colors)
  for (const service of services) {
    const project = service.projects.find(p => p.slug === slug);
    if (project && projectContent) {
      return {
        ...project,
        heroImage: project.heroImage || project.image,
        galleryImages: project.galleryImages || [],
        galleryVideos: project.galleryVideos || [],
        galleryBackground: project.galleryBackground,
        tags: projectContent.tags ?? project.tags ?? [],
        keywords: projectContent.keywords ?? project.keywords ?? [],
        toolsUsed: projectContent.toolsUsed ?? project.toolsUsed ?? [],
        comparisonPairs: project.comparisonPairs ?? normalizeComparisonPairs(projectContent.comparisonPairs),
        magazinePages: project.magazinePages ?? normalizeImagePaths(projectContent.magazinePages || []),
        serviceSlug: service.slug,
        serviceColor: project.barColor || service.infoColor,
        serviceTitle: service.title
      };
    }
    if (project) {
      // Content not found but project in services (legacy) – still attach tags/keywords from content if we have them
      const content = allProjectsFromContent.find(p => p.slug === slug);
      return {
        ...project,
        heroImage: project.heroImage || project.image,
        galleryImages: project.galleryImages || [],
        galleryVideos: project.galleryVideos || [],
        galleryBackground: project.galleryBackground,
        tags: content?.tags ?? project.tags ?? [],
        keywords: content?.keywords ?? project.keywords ?? [],
        toolsUsed: content?.toolsUsed ?? project.toolsUsed ?? [],
        comparisonPairs: project.comparisonPairs ?? normalizeComparisonPairs(content?.comparisonPairs),
        magazinePages: project.magazinePages ?? normalizeImagePaths(content?.magazinePages || []),
        serviceSlug: service.slug,
        serviceColor: project.barColor || service.infoColor,
        serviceTitle: service.title
      };
    }
  }
  
  // If not found in services, use markdown-only
  if (projectContent) {
    // Find the matching service
    const matchingService = services.find(s => s.slug === projectContent.service);
    const service = matchingService || services.find(s => s.slug === 'graphic-design') || services[0];
    
    return {
      title: projectContent.title,
      location: projectContent.location,
      year: projectContent.year,
      image: resolveImage(projectContent.thumbnailImage || projectContent.heroImage, projectContent.slug),
      heroImage: resolveImage(projectContent.heroImage, projectContent.slug),
      heroImagePosition: projectContent.heroImagePosition,
      slug: projectContent.slug,
      description: projectContent.description,
      barColor: projectContent.barColor,
      galleryImages: normalizeImagePaths(projectContent.galleryImages || []),
      galleryVideos: normalizeVideoPaths(projectContent.galleryVideos || []),
      galleryBackground: projectContent.galleryBackground,
      tags: projectContent.tags || [],
      keywords: projectContent.keywords || [],
      toolsUsed: projectContent.toolsUsed || [],
      comparisonPairs: normalizeComparisonPairs(projectContent.comparisonPairs),
      magazinePages: normalizeImagePaths(projectContent.magazinePages || []),
      serviceSlug: service?.slug || projectContent.service,
      serviceColor: projectContent.barColor || service?.infoColor || '#000000',
      serviceTitle: service?.title || 'Project'
    };
  }

  return undefined;
};
