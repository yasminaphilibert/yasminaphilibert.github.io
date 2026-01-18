import { loadServices, loadProjects, getServiceBySlugFromContent, getProjectBySlugFromContent } from '@/lib/content';

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
  image: string;
  slug: string;
  description: string[];
}

export interface Service {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  slug: string;
  infoColor: string;
  projects: Project[];
}

// Helper to resolve image path with fallback
function resolveImage(imagePath: string, slug: string): string {
  // If the image path starts with /images/, check if it exists
  // For now, use fallback images since we haven't moved images yet
  if (imagePath.startsWith('/images/')) {
    return fallbackImages[slug] || project1;
  }
  return imagePath || fallbackImages[slug] || project1;
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
        image: resolveImage(service.heroImage, service.slug),
        slug: service.slug,
        infoColor: service.infoColor,
        projects: serviceProjects.map(project => ({
          title: project.title,
          location: project.location,
          year: project.year,
          image: resolveImage(project.heroImage, project.slug),
          slug: project.slug,
          description: project.description
        }))
      };
    });
  } catch (error) {
    console.error('Error loading content from markdown:', error);
    return [];
  }
})();

export const getAllProjects = (): (Project & { serviceSlug: string; serviceColor: string })[] => {
  return services.flatMap(service => 
    service.projects.map(project => ({
      ...project,
      serviceSlug: service.slug,
      serviceColor: service.infoColor
    }))
  );
};

export const getServiceBySlug = (slug: string): Service | undefined => {
  return services.find(s => s.slug === slug);
};

export const getProjectBySlug = (slug: string): (Project & { serviceSlug: string; serviceColor: string; serviceTitle: string }) | undefined => {
  for (const service of services) {
    const project = service.projects.find(p => p.slug === slug);
    if (project) {
      return {
        ...project,
        serviceSlug: service.slug,
        serviceColor: service.infoColor,
        serviceTitle: service.title
      };
    }
  }
  return undefined;
};
