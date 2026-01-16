import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

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

export const services: Service[] = [
  {
    title: "Visual Identity",
    subtitle: "Art Direction",
    description: "Crafting distinctive visual systems that communicate brand essence across all touchpoints.",
    image: project1,
    slug: "visual-identity",
    infoColor: "#6BCB77",
    projects: [
      {
        title: "Chromatic Visions",
        location: "Los Angeles, CA",
        year: "2024",
        image: project1,
        slug: "chromatic-visions",
        description: [
          "A comprehensive visual identity project exploring the intersection of color theory and brand storytelling.",
          "Working closely with the client, we developed a flexible color palette that shifts based on context while maintaining brand recognition."
        ]
      },
      {
        title: "Brand Horizon",
        location: "San Francisco, CA",
        year: "2023",
        image: project2,
        slug: "brand-horizon",
        description: [
          "Complete brand identity system for a tech startup focused on sustainable innovation.",
          "The visual language bridges technology and nature through organic geometric forms."
        ]
      },
      {
        title: "Identity Shift",
        location: "Chicago, IL",
        year: "2022",
        image: project3,
        slug: "identity-shift",
        description: [
          "Rebranding project for a heritage fashion house entering the contemporary market.",
          "Balanced legacy elements with modern minimalism."
        ]
      }
    ]
  },
  {
    title: "Graphic Design",
    subtitle: "Print & Digital",
    description: "Bold typography and thoughtful compositions that capture attention and communicate with clarity.",
    image: project2,
    slug: "graphic-design",
    infoColor: "#7B5EA7",
    projects: [
      {
        title: "Noir Typography",
        location: "New York, NY",
        year: "2023",
        image: project2,
        slug: "noir-typography",
        description: [
          "An exploration of contrast and negative space through typography-driven design.",
          "The monochromatic approach was elevated through strategic use of neon accents."
        ]
      },
      {
        title: "Editorial Essence",
        location: "Paris, FR",
        year: "2023",
        image: project1,
        slug: "editorial-essence",
        description: [
          "Magazine design system for a quarterly arts publication.",
          "Flexible grid system accommodating diverse visual content."
        ]
      },
      {
        title: "Poster Series",
        location: "Berlin, DE",
        year: "2022",
        image: project3,
        slug: "poster-series",
        description: [
          "Limited edition poster series for international music festival.",
          "Each piece explores the intersection of sound visualization and graphic form."
        ]
      }
    ]
  },
  {
    title: "Sound Engineering",
    subtitle: "Audio Production",
    description: "Professional audio engineering and production services for artists, studios, and brands.",
    image: project3,
    slug: "sound-engineering",
    infoColor: "#E8A87C",
    projects: [
      {
        title: "Resonance Studio",
        location: "London, UK",
        year: "2022",
        image: project3,
        slug: "resonance-studio",
        description: [
          "A complete audio engineering project for an independent recording studio.",
          "The project involved mixing and mastering over 40 tracks across multiple genres."
        ]
      },
      {
        title: "Sonic Landscapes",
        location: "Tokyo, JP",
        year: "2023",
        image: project1,
        slug: "sonic-landscapes",
        description: [
          "Immersive audio installation for contemporary art exhibition.",
          "Spatial audio design creating distinct sonic environments."
        ]
      },
      {
        title: "Film Score",
        location: "Los Angeles, CA",
        year: "2024",
        image: project2,
        slug: "film-score",
        description: [
          "Original score and sound design for independent feature film.",
          "Blending orchestral elements with electronic textures."
        ]
      }
    ]
  }
];

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
