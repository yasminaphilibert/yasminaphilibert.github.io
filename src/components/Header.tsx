import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <motion.header 
      className="header-bar"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Tagline - Left */}
          <span className="tagline hidden md:block">
            Creative Director
          </span>

          {/* Logo - Center */}
          <Link to="/" className="logo-text">
            M—Studio
          </Link>

          {/* Navigation - Right */}
          <nav className="flex items-center gap-6 md:gap-8">
            <Link to="/about" className="nav-link">
              About
            </Link>
            <a href="mailto:hello@mstudio.com" className="nav-link">
              Get in touch
            </a>
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
