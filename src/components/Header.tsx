import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <motion.header 
      className="bg-primary rounded-b-[2rem] px-6 py-8 md:px-12 md:py-10"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Tagline - Left */}
          <span className="text-sm font-medium text-primary-foreground hidden md:block">
            Creative Director
          </span>

          {/* Logo - Center */}
          <Link to="/" className="font-display text-2xl md:text-4xl font-semibold tracking-tight text-primary-foreground">
            M—Studio
          </Link>

          {/* Navigation - Right */}
          <nav className="flex items-center gap-6 md:gap-8">
            <Link 
              to="/work" 
              className="text-sm font-medium text-primary-foreground underline underline-offset-4 hover:opacity-70 transition-opacity duration-200"
            >
              My Work
            </Link>
            <Link 
              to="/about" 
              className="text-sm font-medium text-primary-foreground underline underline-offset-4 hover:opacity-70 transition-opacity duration-200"
            >
              About
            </Link>
            <a 
              href="mailto:hello@mstudio.com" 
              className="text-sm font-medium text-primary-foreground underline underline-offset-4 hover:opacity-70 transition-opacity duration-200"
            >
              Get in touch
            </a>
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
