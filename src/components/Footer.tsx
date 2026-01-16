import { Link } from "react-router-dom";

interface FooterProps {
  bgColor?: string;
}

const Footer = ({ bgColor = "#FF69B4" }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer 
      className="w-full px-6 py-12 md:px-12 md:py-16 rounded-t-[2rem]"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="text-sm text-black/70">
          © 2018–{currentYear}. Marcus Chen
        </p>
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
