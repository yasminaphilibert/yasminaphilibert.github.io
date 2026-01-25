  import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { getNavbarContent } from "@/lib/content";
import TextScramble from "./TextScramble";

const Header = () => {
  const navbar = getNavbarContent();
  const location = useLocation();
  const isHomepage = location.pathname === "/";

  return (
    <motion.header 
      className="rounded-b-[2rem] px-6 py-8 md:px-12 md:py-10 overflow-hidden"
      style={{ backgroundColor: navbar.bgColor || undefined }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          {/* Tagline - Left */}
          <div className="text-sm font-medium text-primary-foreground hidden md:block flex-shrink-0">
            {navbar.tagline.map((line, index) => (
              <span key={index}>
                {line}
                {index < navbar.tagline.length - 1 && <br />}
              </span>
            ))}
          </div>

          {/* Logo - Center */}
          <Link to="/" className="flex flex-col items-center gap-2 flex-shrink-0 min-w-0">
            <img 
              src="/yasyntha_logo.svg" 
              alt="Yasyntha Logo" 
              className="h-8 md:h-12 w-auto"
            />
            <span className="text-2xl md:text-4xl font-semibold tracking-tight text-primary-foreground break-words" style={{ fontFamily: 'var(--font-logo)', fontSize: 'var(--font-size-logo)' }}>
              <TextScramble
                as="span"
                scramblePercentage={100}
                scrambleRadius={30}
                scrambleSpeed={100}
                autoTrigger={isHomepage}
                autoTriggerDuration={2000}
              >
                {navbar.logo}
              </TextScramble>
            </span>
          </Link>

          {/* Navigation - Right */}
          <nav className="flex items-center gap-4 md:gap-6 lg:gap-8 flex-shrink-0">
            {navbar.navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className="text-sm font-medium text-primary-foreground hover:opacity-70 transition-opacity duration-200 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
