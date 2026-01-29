import { loadServices, loadProjects, getServiceBySlugFromContent, getProjectBySlugFromContent } from '@/lib/content';
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

  // Convert "public/..." to root-relative (required for production)
  if (path.startsWith('public/')) {
    return encodeAssetUrl(baseWithSlash + path.substring(7));
  }
  if (path.startsWith('/') && (base === '' || base === '/')) {
    return encodeAssetUrl(path);
  }
  if (path.startsWith(baseWithSlash) || path === base) {
    return encodeAssetUrl(path);
  }
  if (path.startsWith('/')) {
    const result = base === '' || base === '/' ? path : base + path;
    return encodeAssetUrl(result);
  }
  const result = baseWithSlash + path;
  return encodeAssetUrl(result);
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
        projects: serviceProjects.map(project => ({
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
          galleryBackground: project.galleryBackground
        }))
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
      serviceSlug: service?.slug || project.service,
      serviceColor: project.barColor || service?.infoColor || '#000000'
    };
  });
};

export const getServiceBySlug = (slug: string): Service | undefined => {
  return services.find(s => s.slug === slug);
};

export const getProjectBySlug = (slug: string): (Project & { serviceSlug: string; serviceColor: string; serviceTitle: string; heroImage: string }) | undefined => {
  // First try to find in services array (for backward compatibility)
  for (const service of services) {
    const project = service.projects.find(p => p.slug === slug);
    if (project) {
      return {
        ...project,
        heroImage: project.heroImage || project.image, // Fallback to image if heroImage not set
        galleryImages: project.galleryImages || [],
        galleryVideos: project.galleryVideos || [],
        galleryBackground: project.galleryBackground,
        serviceSlug: service.slug,
        serviceColor: project.barColor || service.infoColor, // Use project's barColor if set
        serviceTitle: service.title
      };
    }
  }
  
  // If not found, search all projects directly from markdown
  const allProjectsFromContent = loadProjects();
  const projectContent = allProjectsFromContent.find(p => p.slug === slug);
  
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
      serviceSlug: service?.slug || projectContent.service,
      serviceColor: projectContent.barColor || service?.infoColor || '#000000',
      serviceTitle: service?.title || 'Project'
    };
  }
  
  return undefined;
};
