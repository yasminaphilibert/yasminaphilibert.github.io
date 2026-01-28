// Import all markdown files at build time using Vite's glob import
const serviceFiles = import.meta.glob('/src/content/services/*.md', { as: 'raw', eager: true });
const projectFiles = import.meta.glob('/src/content/projects/**/*.md', { as: 'raw', eager: true });
const configFile = import.meta.glob('/src/content/config.md', { as: 'raw', eager: true });
const aboutFile = import.meta.glob('/src/content/about.md', { as: 'raw', eager: true });
const workFile = import.meta.glob('/src/content/work.md', { as: 'raw', eager: true });
const navbarFile = import.meta.glob('/src/content/navbar.md', { as: 'raw', eager: true });
const footerFile = import.meta.glob('/src/content/footer.md', { as: 'raw', eager: true });
const contactFile = import.meta.glob('/src/content/contact.md', { as: 'raw', eager: true });

// Type definitions
export interface ServiceContent {
  title: string;
  subtitle: string;
  slug: string;
  infoColor: string;
  heroImage: string; // Image/video for the service detail page
  thumbnailImage?: string; // Optional thumbnail for cards/lists (falls back to heroImage if not provided)
  order: number;
  projectsGridBackground?: string; // Optional custom projects grid background color
  description: string;
}

export interface ProjectContent {
  title: string;
  slug: string;
  service: string;
  location: string;
  year: string;
  heroImage: string; // Image/video for the project detail page
  thumbnailImage?: string; // Optional thumbnail for cards/lists (falls back to heroImage if not provided)
  heroImagePosition?: string; // Optional object-position for hero image (e.g., "center top")
  galleryImages: string[];
  galleryVideos?: string[]; // Optional gallery videos
  order: number;
  featured: boolean;
  barColor?: string; // Optional custom bar color, falls back to service color
  galleryBackground?: string; // Optional custom gallery background color
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
  // Color customization
  backgroundColor?: string;
  secondSectionBgColor?: string;
  titleColor?: string;
  textColor?: string;
  labelColor?: string;
  linkColor?: string;
  mutedTextColor?: string;
}

export interface NavLink {
  label: string;
  path: string;
}

export interface NavbarContent {
  tagline: string[];
  logo: string;
  bgColor?: string;
  navLinks: NavLink[];
}

export interface SocialLink {
  platform: string;
  url: string;
  enabled: boolean;
}

export interface FooterContent {
  copyrightName: string;
  startYear: number;
  bgColor?: string;
  socialLinks: SocialLink[];
  navLinks: NavLink[];
}

export interface WorkContent {
  title: string;
  subtitle: string;
  heroBackgroundColor?: string;
  infoBarColor?: string;
  projectsBackgroundColor?: string;
  backToHomeBackgroundColor?: string;
}

export interface ContactContent {
  title: string;
  subtitle: string;
  infoBarText1: string;
  infoBarText2: string;
  email: string;
  location: string;
  infoBarColor?: string;
  alternativeContactTitle?: string;
  heroBackgroundColor?: string;
  formBackgroundColor?: string;
  backToHomeBackgroundColor?: string;
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
  let inObjectArray = false;
  let objectArrayValues: Record<string, unknown>[] = [];
  let currentObject: Record<string, unknown> = {};
  
  const lines = frontmatterStr.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;
    
    const currentIndent = line.match(/^(\s*)/)?.[1].length || 0;
    const isArrayItem = line.match(/^\s+-\s+/);
    const isTopLevel = currentIndent === 0;
    
    // Save previous array/object array when we hit a new top-level key
    if (isTopLevel && currentKey) {
      if (inObjectArray) {
        // Save the current object if it has properties before saving the array
        if (Object.keys(currentObject).length > 0) {
          objectArrayValues.push(currentObject);
          currentObject = {};
        }
        if (objectArrayValues.length > 0) {
          data[currentKey] = objectArrayValues;
          objectArrayValues = [];
          inObjectArray = false;
        }
      } else if (inArray && arrayValues.length > 0) {
        data[currentKey] = arrayValues;
        arrayValues = [];
        inArray = false;
      }
    }
    
    // Check for array item (starts with -)
    if (isArrayItem) {
      // If we have a current object being built, save it
      if (inObjectArray && Object.keys(currentObject).length > 0) {
        objectArrayValues.push(currentObject);
        currentObject = {};
      }
      
      // Check if this is an object item (next line is indented more, or this line has a key:value)
      const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
      const isObjectItem = (nextLine && nextLine.match(/^\s{4,}/)) || line.match(/^\s+-\s+[a-zA-Z_]+:\s*/);
      
      if (isObjectItem) {
        inObjectArray = true;
        inArray = false;
        
        // If this line itself has a key:value (like "- label: value"), parse it
        const inlineKeyValue = line.match(/^\s+-\s+([a-zA-Z_]+):\s*(.*)$/);
        if (inlineKeyValue) {
          const [, key, value] = inlineKeyValue;
          let cleanValue: string | number | boolean = value.replace(/^["']|["']$/g, '').trim();
          
          // Parse boolean
          if (cleanValue === 'true') cleanValue = true as unknown as string;
          else if (cleanValue === 'false') cleanValue = false as unknown as string;
          // Parse number
          else if (/^\d+$/.test(cleanValue)) cleanValue = parseInt(cleanValue, 10) as unknown as string;
          
          currentObject[key] = cleanValue;
        }
        continue;
      } else {
        // Simple array item
        const value = line.replace(/^\s+-\s+/, '').replace(/^["']|["']$/g, '').trim();
        arrayValues.push(value);
        inArray = true;
        continue;
      }
    }
    
    // Check for nested object property (indented with 4+ spaces, under an array item)
    // Must not be an array item itself (doesn't start with -)
    if (inObjectArray && currentIndent >= 4 && !isArrayItem) {
      const keyValueMatch = line.match(/^\s+([a-zA-Z_]+):\s*(.*)$/);
      if (keyValueMatch) {
        const [, key, value] = keyValueMatch;
        let cleanValue: string | number | boolean = value.replace(/^["']|["']$/g, '').trim();
        
        // Parse boolean
        if (cleanValue === 'true') cleanValue = true as unknown as string;
        else if (cleanValue === 'false') cleanValue = false as unknown as string;
        // Parse number
        else if (/^\d+$/.test(cleanValue)) cleanValue = parseInt(cleanValue, 10) as unknown as string;
        
        currentObject[key] = cleanValue;
      }
      continue;
    }
    
    // Check for top-level key: value pair
    if (isTopLevel) {
      const keyValueMatch = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
      if (keyValueMatch) {
        const [, key, value] = keyValueMatch;
        
        // Before switching to a new key, save the current object if we're in an object array
        if (inObjectArray && currentKey && Object.keys(currentObject).length > 0) {
          objectArrayValues.push(currentObject);
          currentObject = {};
        }
        
        currentKey = key;
        
        if (value === '') {
          // Start of array (will be detected by next lines)
          inArray = false;
          inObjectArray = false;
          arrayValues = [];
          objectArrayValues = [];
        } else {
          // Simple key-value
          let cleanValue: string | number | boolean = value.replace(/^["']|["']$/g, '').trim();
          
          // Parse boolean
          if (cleanValue === 'true') cleanValue = true as unknown as string;
          else if (cleanValue === 'false') cleanValue = false as unknown as string;
          // Parse number
          else if (/^\d+$/.test(cleanValue)) cleanValue = parseInt(cleanValue, 10) as unknown as string;
          
          data[key] = cleanValue;
          inArray = false;
          inObjectArray = false;
        }
      }
    }
  }
  
  // Save last array of objects if any
  if (inObjectArray && currentKey) {
    if (Object.keys(currentObject).length > 0) {
      objectArrayValues.push(currentObject);
    }
    if (objectArrayValues.length > 0) {
      data[currentKey] = objectArrayValues;
    }
  }
  
  // Save last simple array if any
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
      thumbnailImage: data.thumbnailImage as string | undefined,
      order: data.order as number || 0,
      projectsGridBackground: data.projectsGridBackground as string | undefined,
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
      thumbnailImage: data.thumbnailImage as string | undefined,
      heroImagePosition: data.heroImagePosition as string | undefined,
      galleryImages: (data.galleryImages as string[]) || [],
      galleryVideos: (data.galleryVideos as string[]) || [],
      order: data.order as number || 0,
      featured: data.featured as boolean || false,
      barColor: data.barColor as string | undefined,
      galleryBackground: data.galleryBackground as string | undefined,
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
      // Split services content - services list vs experience text (paragraph after blank line)
      const parts = sectionContent.split(/\n\n+/);
      // First part(s) are services (short lines), last part is experience text (long paragraph)
      const serviceLines: string[] = [];
      let expText = '';
      
      for (const part of parts) {
        const trimmed = part.trim();
        if (!trimmed) continue;
        
        // Check if this part looks like a services list (multiple short lines) or experience text (long paragraph)
        const lines = trimmed.split('\n').map(s => s.trim()).filter(s => s.length > 0);
        const isServicesList = lines.length > 1 || (lines.length === 1 && lines[0].length < 50 && !lines[0].includes('.'));
        
        if (isServicesList) {
          serviceLines.push(...lines);
        } else {
          // This is experience text (long paragraph)
          expText = trimmed;
        }
      }
      
      services = serviceLines;
      // If we found experience text in the services section, use it
      if (expText && !experienceText) {
        experienceText = expText;
      }
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
    experienceNote,
    backgroundColor: data.backgroundColor as string | undefined,
    secondSectionBgColor: data.secondSectionBgColor as string | undefined,
    titleColor: data.titleColor as string | undefined,
    textColor: data.textColor as string | undefined,
    labelColor: data.labelColor as string | undefined,
    linkColor: data.linkColor as string | undefined,
    mutedTextColor: data.mutedTextColor as string | undefined
  };
}

// Get navbar content
export function getNavbarContent(): NavbarContent {
  const navbarPath = Object.keys(navbarFile)[0];
  
  const defaultNavbar: NavbarContent = {
    tagline: ['Creative Director'],
    logo: 'M—Studio',
    navLinks: [
      { label: 'My Work', path: '/work' },
      { label: 'About', path: '/about' },
      { label: 'Get in touch', path: '/contact' }
    ]
  };
  
  if (!navbarPath) {
    return defaultNavbar;
  }
  
  const { data } = parseFrontmatter(navbarFile[navbarPath] as string);
  
  // Parse tagline - can be string (single line) or array (multiple lines)
  let tagline: string[] = defaultNavbar.tagline;
  if (data.tagline) {
    if (Array.isArray(data.tagline)) {
      tagline = (data.tagline as string[]).filter(line => line.trim().length > 0);
    } else {
      // Backward compatibility: single string becomes array with one item
      tagline = [(data.tagline as string).trim()].filter(line => line.length > 0);
    }
  }
  
  // Parse navLinks array of objects
  const navLinks = Array.isArray(data.navLinks) ? (data.navLinks as Array<Record<string, unknown>>) : [];
  const parsedNavLinks: NavLink[] = navLinks.map(link => ({
    label: (link.label as string) || '',
    path: (link.path as string) || ''
  }));
  
  return {
    tagline: tagline.length > 0 ? tagline : defaultNavbar.tagline,
    logo: (data.logo as string) || defaultNavbar.logo,
    bgColor: (data.bgColor as string) || undefined,
    navLinks: parsedNavLinks.length > 0 ? parsedNavLinks : defaultNavbar.navLinks
  };
}

// Get footer content
export function getFooterContent(): FooterContent {
  const footerPath = Object.keys(footerFile)[0];
  
  const defaultFooter: FooterContent = {
    copyrightName: 'Marcus Chen',
    startYear: 2018,
    bgColor: '#FF69B4',
    socialLinks: [
      { platform: 'linkedin', url: 'https://linkedin.com', enabled: true },
      { platform: 'instagram', url: 'https://instagram.com', enabled: true },
      { platform: 'behance', url: 'https://behance.net', enabled: true }
    ],
    navLinks: [
      { label: 'About', path: '/about' },
      { label: 'Contact', path: '/contact' }
    ]
  };
  
  if (!footerPath) {
    return defaultFooter;
  }
  
  const { data } = parseFrontmatter(footerFile[footerPath] as string);
  
  // Parse socialLinks array of objects
  const socialLinks = Array.isArray(data.socialLinks) ? (data.socialLinks as Array<Record<string, unknown>>) : [];
  const parsedSocialLinks: SocialLink[] = socialLinks
    .map(link => ({
      platform: (link.platform as string) || '',
      url: (link.url as string) || '',
      enabled: link.enabled !== undefined ? (link.enabled as boolean) : true
    }))
    .filter(link => link.enabled && link.platform && link.url);
  
  // Parse navLinks array of objects
  const navLinks = Array.isArray(data.navLinks) ? (data.navLinks as Array<Record<string, unknown>>) : [];
  const parsedNavLinks: NavLink[] = navLinks.map(link => ({
    label: (link.label as string) || '',
    path: (link.path as string) || ''
  }));
  
  return {
    copyrightName: (data.copyrightName as string) || defaultFooter.copyrightName,
    startYear: (data.startYear as number) || defaultFooter.startYear,
    bgColor: (data.bgColor as string) || defaultFooter.bgColor,
    socialLinks: parsedSocialLinks.length > 0 ? parsedSocialLinks : defaultFooter.socialLinks,
    navLinks: parsedNavLinks.length > 0 ? parsedNavLinks : defaultFooter.navLinks
  };
}

// Get work page content
export function getWorkContent(): WorkContent {
  const workPath = Object.keys(workFile)[0];
  
  const defaultWork: WorkContent = {
    title: 'My Work',
    subtitle: 'A collection of projects across visual identity, graphic design, and sound.',
    heroBackgroundColor: '#F8F8F8',
    infoBarColor: '#4ECDC4',
    projectsBackgroundColor: '#FFFFFF',
    backToHomeBackgroundColor: '#F5F5F5'
  };
  
  if (!workPath) {
    return defaultWork;
  }
  
  const { data } = parseFrontmatter(workFile[workPath] as string);
  
  return {
    title: (data.title as string) || defaultWork.title,
    subtitle: (data.subtitle as string) || defaultWork.subtitle,
    heroBackgroundColor: (data.heroBackgroundColor as string) || defaultWork.heroBackgroundColor,
    infoBarColor: (data.infoBarColor as string) || defaultWork.infoBarColor,
    projectsBackgroundColor: (data.projectsBackgroundColor as string) || defaultWork.projectsBackgroundColor,
    backToHomeBackgroundColor: (data.backToHomeBackgroundColor as string) || defaultWork.backToHomeBackgroundColor
  };
}

// Get contact page content
export function getContactContent(): ContactContent {
  const contactPath = Object.keys(contactFile)[0];
  
  const defaultContact: ContactContent = {
    title: 'Get in Touch',
    subtitle: "Have a project in mind? Let's create something amazing together.",
    infoBarText1: 'Available for freelance',
    infoBarText2: 'Based in Paris & Barcelona',
    email: 'yasynthamusic@gmail.com',
    location: 'Paris - Barcelona',
    infoBarColor: '#ffb4ec',
    alternativeContactTitle: 'Or reach out directly'
  };
  
  if (!contactPath) {
    return defaultContact;
  }
  
  const { data } = parseFrontmatter(contactFile[contactPath] as string);
  
  return {
    title: data.title !== undefined ? (data.title as string) : defaultContact.title,
    subtitle: data.subtitle !== undefined ? (data.subtitle as string) : defaultContact.subtitle,
    infoBarText1: data.infoBarText1 !== undefined ? (data.infoBarText1 as string) : defaultContact.infoBarText1,
    infoBarText2: data.infoBarText2 !== undefined ? (data.infoBarText2 as string) : defaultContact.infoBarText2,
    email: data.email !== undefined ? (data.email as string) : defaultContact.email,
    location: data.location !== undefined ? (data.location as string) : defaultContact.location,
    infoBarColor: data.infoBarColor !== undefined ? (data.infoBarColor as string) : defaultContact.infoBarColor,
    alternativeContactTitle: data.alternativeContactTitle !== undefined ? (data.alternativeContactTitle as string) : defaultContact.alternativeContactTitle,
    heroBackgroundColor: data.heroBackgroundColor !== undefined && (data.heroBackgroundColor as string).trim() !== '' ? (data.heroBackgroundColor as string) : undefined,
    formBackgroundColor: data.formBackgroundColor !== undefined && (data.formBackgroundColor as string).trim() !== '' ? (data.formBackgroundColor as string) : undefined,
    backToHomeBackgroundColor: data.backToHomeBackgroundColor !== undefined && (data.backToHomeBackgroundColor as string).trim() !== '' ? (data.backToHomeBackgroundColor as string) : undefined
  };
}
