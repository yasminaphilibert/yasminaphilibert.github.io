import { Link } from "react-router-dom";
import { Linkedin, Instagram } from "lucide-react";

interface FooterProps {
  bgColor?: string;
}

const BehanceIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    width="20" 
    height="20"
  >
    <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/>
  </svg>
);

const Footer = ({ bgColor = "#FF69B4" }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer 
      className="w-full px-6 py-12 md:px-12 md:py-16 rounded-t-[2rem]"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <p className="text-sm text-black/70">
          © 2018–{currentYear}. Marcus Chen
        </p>
        
        <div className="flex items-center gap-4">
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-black/70 hover:text-black transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </a>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-black/70 hover:text-black transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={20} />
          </a>
          <a 
            href="https://behance.net" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-black/70 hover:text-black transition-colors"
            aria-label="Behance"
          >
            <BehanceIcon className="text-black/70 hover:text-black" />
          </a>
        </div>
        
        <nav className="flex items-center gap-6">
          <Link 
            to="/about" 
            className="text-sm text-black/70 hover:text-black transition-colors"
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className="text-sm text-black/70 hover:text-black transition-colors"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
