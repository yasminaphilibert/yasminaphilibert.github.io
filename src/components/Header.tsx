import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { getNavbarContent } from "@/lib/content";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const Header = () => {
  const navbar = getNavbarContent();

  return (
    <motion.header 
      className="rounded-b-[2rem] px-6 py-3 md:px-12 md:py-4 overflow-hidden"
      style={{ backgroundColor: navbar.bgColor || undefined }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-3 items-center">
          {/* Left Section */}
          <div className="flex items-center">
            {/* Tagline - Left (Desktop only) */}
            <div className="text-sm font-medium text-primary-foreground hidden md:block">
              {navbar.tagline.map((line, index) => (
                <span key={index}>
                  {line}
                  {index < navbar.tagline.length - 1 && <br />}
                </span>
              ))}
            </div>

            {/* Mobile Menu Button - Left (Mobile only) */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button 
                    className="p-2 text-primary-foreground hover:opacity-70 transition-opacity duration-200"
                    aria-label="Open menu"
                  >
                    <Menu className="h-6 w-6" />
                  </button>
                </SheetTrigger>
                <SheetContent 
                  side="right" 
                  className="w-[300px] sm:w-[400px]"
                  style={{ backgroundColor: navbar.bgColor || undefined }}
                >
                  <div className="flex flex-col gap-8 mt-8">
                    {/* Tagline - Mobile */}
                    <div className="text-sm font-medium text-primary-foreground">
                      {navbar.tagline.map((line, index) => (
                        <span key={index}>
                          {line}
                          {index < navbar.tagline.length - 1 && <br />}
                        </span>
                      ))}
                    </div>

                    {/* Navigation Links - Mobile */}
                    <nav className="flex flex-col gap-6">
                      {navbar.navLinks.map((link) => (
                        <Link 
                          key={link.path}
                          to={link.path} 
                          className="text-lg font-medium text-primary-foreground hover:opacity-70 transition-opacity duration-200"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Logo - Center */}
          <div className="flex justify-center">
            <Link
              to="/"
              className="flex items-center flex-shrink-0 min-w-0"
            >
              <img
                src={`${import.meta.env.BASE_URL}yasyntha_lockup.png`}
                alt="Yasyntha"
                className="h-20 md:h-32 w-auto"
              />
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center justify-end">
            {/* Navigation - Right (Desktop only) */}
            <nav className="hidden md:flex items-center gap-4 md:gap-6 lg:gap-8">
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
      </div>
    </motion.header>
  );
};

export default Header;
