import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { getNavbarContent } from "@/lib/content";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Label from "./Label";

const Header = () => {
  const navbar = getNavbarContent();

  return (
    <motion.header
      className="relative z-20 container-custom pt-5 md:pt-7"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <nav className="flex items-center justify-between gap-4 rounded-full bg-ink/[0.06] px-5 py-3 md:px-7 md:py-4">
        <Link to="/" className="flex items-center min-w-0">
          {/* max-w-full is the backstop: on a very narrow phone the mark gives
              up height rather than pushing into the menu button. */}
          <img
            src={`${import.meta.env.BASE_URL}yasyntha_lockup.png`}
            alt="Yasyntha"
            className="h-8 sm:h-9 md:h-11 w-auto max-w-full object-contain"
          />
        </Link>

        <ul className="hidden md:flex items-center gap-7 lg:gap-9">
          {navbar.navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className="text-[14px] font-semibold text-ink/80 hover:text-ink transition-colors duration-200 whitespace-nowrap"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* All four disciplines, as the old bar listed them — inline here so the
            pill stays one line tall, stacked in the drawer on mobile. */}
        <div className="hidden lg:block text-right">
          <Label>{navbar.tagline.join(" · ")}</Label>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="p-1.5 text-ink hover:opacity-70 transition-opacity duration-200"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-paper border-ink/10">
              <div className="flex flex-col gap-10 mt-10">
                <div className="flex flex-col gap-1">
                  {navbar.tagline.map((line) => (
                    <Label key={line}>{line}</Label>
                  ))}
                </div>

                <nav className="flex flex-col gap-5">
                  {navbar.navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="display-heading text-2xl hover:opacity-70 transition-opacity duration-200"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.header>
  );
};

export default Header;
