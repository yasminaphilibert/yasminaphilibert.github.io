// Import all markdown files at build time using Vite's glob import
const serviceFiles = import.meta.glob('/src/content/services/*.md', { as: 'raw', eager: true });
const projectFiles = import.meta.glob('/src/content/projects/**/*.md', { as: 'raw', eager: true });
const configFile = import.meta.glob('/src/content/config.md', { as: 'raw', eager: true });
const aboutFile = import.meta.glob('/src/content/about.md', { as: 'raw', eager: true });

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

export interface AboutContent {
  title: string;
  label: string;
  email: string;
  location: string;
  experienceLabel: string;
  introParagraphs: string[];
  services: string[];
  experienceText: string;
  experienceNote: string;
}

// Simple browser-compatible frontmatter parser
function parseFrontmatter(content: string): { data: Record<string, unknown>; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { data: {}, content: content.trim() };
  }
  
  const frontmatterStr = match[1];
  const body = match[2];
  
  // Parse YAML-like frontmatter
  const data: Record<string, unknown> = {};
  let currentKey = '';
  let inArray = false;
  let arrayValues: string[] = [];
  
  const lines = frontmatterStr.split('\n');
  
  for (const line of lines) {
    // Check for array item
    if (line.match(/^\s+-\s+/)) {
      const value = line.replace(/^\s+-\s+/, '').replace(/^["']|["']$/g, '').trim();
      arrayValues.push(value);
      continue;
    }
    
    // If we were building an array, save it
    if (inArray && currentKey && arrayValues.length > 0) {
      data[currentKey] = arrayValues;
      arrayValues = [];
      inArray = false;
    }
    
    // Check for nested object (like socialLinks:)
    if (line.match(/^[a-zA-Z_]+:\s*$/)) {
      // Start of object or array - skip for simple parsing
      continue;
    }
    
    // Check for key: value pair
    const keyValueMatch = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (keyValueMatch) {
      const [, key, value] = keyValueMatch;
      currentKey = key;
      
      if (value === '') {
        // Could be start of array
        inArray = true;
        arrayValues = [];
      } else {
        // Clean up the value (remove quotes)
        let cleanValue: string | number | boolean = value.replace(/^["']|["']$/g, '').trim();
        
        // Parse boolean
        if (cleanValue === 'true') cleanValue = true as unknown as string;
        else if (cleanValue === 'false') cleanValue = false as unknown as string;
        // Parse number
        else if (/^\d+$/.test(cleanValue)) cleanValue = parseInt(cleanValue, 10) as unknown as string;
        
        data[key] = cleanValue;
        inArray = false;
      }
    }
  }
  
  // Save last array if any
  if (inArray && currentKey && arrayValues.length > 0) {
    data[currentKey] = arrayValues;
  }
  
  return { data, content: body.trim() };
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
  
  const { data } = parseFrontmatter(configFile[configPath] as string);
  return data as unknown as SiteConfig;
}

// Load all services
export function loadServices(): ServiceContent[] {
  const services: ServiceContent[] = [];
  
  for (const [, content] of Object.entries(serviceFiles)) {
    const { data, content: body } = parseFrontmatter(content as string);
    services.push({
      title: data.title as string || '',
      subtitle: data.subtitle as string || '',
      slug: data.slug as string || '',
      infoColor: data.infoColor as string || '#000000',
      heroImage: data.heroImage as string || '',
      order: data.order as number || 0,
      description: body
    });
  }
  
  return services.sort((a, b) => a.order - b.order);
}

// Load all projects, optionally filtered by service
export function loadProjects(serviceSlug?: string): ProjectContent[] {
  const projects: ProjectContent[] = [];
  
  for (const [, content] of Object.entries(projectFiles)) {
    const { data, content: body } = parseFrontmatter(content as string);
    
    // Parse description into paragraphs
    const descriptionParagraphs = body
      .split('\n\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);
    
    const project: ProjectContent = {
      title: data.title as string || '',
      slug: data.slug as string || '',
      service: data.service as string || '',
      location: data.location as string || '',
      year: data.year as string || '',
      heroImage: data.heroImage as string || '',
      galleryImages: (data.galleryImages as string[]) || [],
      order: data.order as number || 0,
      featured: data.featured as boolean || false,
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

// Load about page content
export function getAboutContent(): AboutContent {
  const aboutPath = Object.keys(aboutFile)[0];
  
  const defaultAbout: AboutContent = {
    title: 'M—Studio',
    label: 'About',
    email: 'hello@mstudio.com',
    location: 'Based in Los Angeles, working globally.',
    experienceLabel: 'Experience',
    introParagraphs: [],
    services: [],
    experienceText: '',
    experienceNote: ''
  };
  
  if (!aboutPath) {
    return defaultAbout;
  }
  
  const { data, content: body } = parseFrontmatter(aboutFile[aboutPath] as string);
  
  // Parse the body content with custom section markers
  const sections = body.split(/\n---(\w+)\n/);
  
  // First section is the intro paragraphs (before any ---section marker)
  const introParagraphs = sections[0]
    .split('\n\n')
    .map(p => p.trim())
    .filter(p => p.length > 0);
  
  // Parse other sections
  let services: string[] = [];
  let experienceText = '';
  let experienceNote = '';
  
  for (let i = 1; i < sections.length; i += 2) {
    const sectionName = sections[i];
    const sectionContent = sections[i + 1]?.trim() || '';
    
    if (sectionName === 'services') {
      services = sectionContent.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    } else if (sectionName === 'experience') {
      experienceText = sectionContent;
    } else if (sectionName === 'experienceNote') {
      experienceNote = sectionContent;
    }
  }
  
  return {
    title: data.title as string || defaultAbout.title,
    label: data.label as string || defaultAbout.label,
    email: data.email as string || defaultAbout.email,
    location: data.location as string || defaultAbout.location,
    experienceLabel: data.experienceLabel as string || defaultAbout.experienceLabel,
    introParagraphs,
    services,
    experienceText,
    experienceNote
  };
}
