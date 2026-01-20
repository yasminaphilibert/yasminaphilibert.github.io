import { Link } from "react-router-dom";
import { Linkedin, Instagram } from "lucide-react";
import { getFooterContent } from "@/lib/content";

interface FooterProps {
  bgColor?: string;
}

const LinktreeIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 20 20" 
    fill="currentColor"
    className={className}
    width="20" 
    height="20"
  >
    <path d="m11.332 5.491 3.073-3.159L16.19 4.16l-3.223 3.073H17.5v2.536h-4.556l3.245 3.152-1.784 1.79L10 10.285 5.595 14.71 3.81 12.927l3.245-3.152H2.5V7.232h4.534L3.811 4.16l1.784-1.827 3.073 3.16V1h2.664zM8.668 13.4h2.664v6.017H8.668z"/>
  </svg>
);

const Footer = ({ bgColor }: FooterProps) => {
  const footer = getFooterContent();
  const currentYear = new Date().getFullYear();
  const footerBgColor = bgColor || footer.bgColor || "#FF69B4";
  
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return <Linkedin size={20} />;
      case 'instagram':
        return <Instagram size={20} />;
      case 'linktree':
        return <LinktreeIcon />;
      default:
        return null;
    }
  };
  
  return (
    <footer 
      className="w-full px-6 py-12 md:px-12 md:py-16 rounded-t-[2rem]"
      style={{ backgroundColor: footerBgColor }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <p className="text-sm text-black/70">
          © {footer.startYear}–{currentYear}. {footer.copyrightName}
        </p>
        
        <div className="flex items-center gap-4">
          {footer.socialLinks.map((social) => (
            <a 
              key={social.platform}
              href={social.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-black/70 hover:text-black transition-colors"
              aria-label={social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
            >
              {getSocialIcon(social.platform)}
            </a>
          ))}
        </div>
        
        <nav className="flex items-center gap-6">
          {footer.navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className="text-sm text-black/70 hover:text-black transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
