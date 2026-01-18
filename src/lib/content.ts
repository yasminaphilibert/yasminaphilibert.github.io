import matter from 'gray-matter';

// Import all markdown files at build time using Vite's glob import
const serviceFiles = import.meta.glob('/content/services/*.md', { as: 'raw', eager: true });
const projectFiles = import.meta.glob('/content/projects/**/*.md', { as: 'raw', eager: true });
const configFile = import.meta.glob('/content/config.md', { as: 'raw', eager: true });

// Type definitions
export interface ServiceContent {
  title: string;
  subtitle: string;
  slug: string;
  infoColor: string;
  heroImage: string;
  order: number;
  description: string;
}

export interface ProjectContent {
  title: string;
  slug: string;
  service: string;
  location: string;
  year: string;
  heroImage: string;
  galleryImages: string[];
  order: number;
  featured: boolean;
  description: string[];
}

export interface SiteConfig {
  siteName: string;
  tagline: string;
  email: string;
  socialLinks: {
    linkedin: string;
    instagram: string;
    behance: string;
  };
}

// Parse markdown content
function parseMarkdown<T>(content: string): { data: T; content: string } {
  const { data, content: body } = matter(content);
  return { data: data as T, content: body.trim() };
}

// Get site configuration
export function getSiteConfig(): SiteConfig {
  const configPath = Object.keys(configFile)[0];
  if (!configPath) {
    return {
      siteName: 'Marcus Chen',
      tagline: 'Creative Direction & Design',
      email: 'hello@marcuschen.com',
      socialLinks: {
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com',
        behance: 'https://behance.net'
      }
    };
  }
  
  const { data } = parseMarkdown<SiteConfig>(configFile[configPath]);
  return data;
}

// Load all services
export function loadServices(): ServiceContent[] {
  const services: ServiceContent[] = [];
  
  for (const [path, content] of Object.entries(serviceFiles)) {
    const { data, content: body } = parseMarkdown<Omit<ServiceContent, 'description'>>(content);
    services.push({
      ...data,
      description: body
    });
  }
  
  return services.sort((a, b) => a.order - b.order);
}

// Load all projects, optionally filtered by service
export function loadProjects(serviceSlug?: string): ProjectContent[] {
  const projects: ProjectContent[] = [];
  
  for (const [path, content] of Object.entries(projectFiles)) {
    const { data, content: body } = parseMarkdown<Omit<ProjectContent, 'description'>>(content);
    
    // Parse description into paragraphs
    const descriptionParagraphs = body
      .split('\n\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);
    
    const project: ProjectContent = {
      ...data,
      galleryImages: data.galleryImages || [],
      featured: data.featured || false,
      description: descriptionParagraphs
    };
    
    if (!serviceSlug || project.service === serviceSlug) {
      projects.push(project);
    }
  }
  
  return projects.sort((a, b) => a.order - b.order);
}

// Get a single service by slug
export function getServiceBySlugFromContent(slug: string): ServiceContent | undefined {
  const services = loadServices();
  return services.find(s => s.slug === slug);
}

// Get a single project by slug
export function getProjectBySlugFromContent(slug: string): (ProjectContent & { serviceColor: string; serviceTitle: string }) | undefined {
  const projects = loadProjects();
  const project = projects.find(p => p.slug === slug);
  
  if (!project) return undefined;
  
  const service = getServiceBySlugFromContent(project.service);
  
  return {
    ...project,
    serviceColor: service?.infoColor || '#000000',
    serviceTitle: service?.title || ''
  };
}

// Get featured projects
export function getFeaturedProjects(): ProjectContent[] {
  return loadProjects().filter(p => p.featured);
}
