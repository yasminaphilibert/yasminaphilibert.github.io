import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAboutContent } from "@/lib/content";

const About = () => {
  const about = getAboutContent();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* About Content Section - extends the header color */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full px-6 py-16 md:px-12 md:py-24 -mt-8 rounded-b-[2rem]"
        style={{ backgroundColor: about.backgroundColor || "hsl(330, 100%, 71%)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12">
            {/* Label - Left */}
            <div className="md:col-span-2">
              <span 
                className="text-sm"
                style={{ color: about.labelColor || "rgba(0, 0, 0, 0.6)" }}
              >
                {about.label}
              </span>
            </div>

            {/* Main Content - Center */}
            <div className="md:col-span-6">
              <h1 
                className="font-display text-3xl md:text-4xl lg:text-5xl font-medium mb-8"
                style={{ color: about.titleColor || "#000000" }}
              >
                {about.title}
              </h1>
              <div 
                className="space-y-6 text-lg md:text-xl leading-relaxed"
                style={{ color: about.textColor || "rgba(0, 0, 0, 0.7)" }}
              >
                {about.introParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
                <p>{about.location}</p>
              </div>
            </div>

            {/* Contact & Services - Right */}
            <div className="md:col-span-4 space-y-12">
              <div>
                <h2 
                  className="text-sm mb-4"
                  style={{ color: about.labelColor || "rgba(0, 0, 0, 0.6)" }}
                >
                  Contact
                </h2>
                <a 
                  href={`mailto:${about.email}`}
                  className="underline underline-offset-4 hover:opacity-70 transition-opacity"
                  style={{ color: about.linkColor || "#000000" }}
                >
                  {about.email}
                </a>
              </div>
              
              <div>
                <h2 
                  className="text-sm mb-4"
                  style={{ color: about.labelColor || "rgba(0, 0, 0, 0.6)" }}
                >
                  Services
                </h2>
                <ul 
                  className="space-y-2"
                  style={{ color: about.textColor || "rgba(0, 0, 0, 0.7)" }}
                >
                  {about.services.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Additional Info Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full px-6 py-16 md:px-12 md:py-24"
        style={{ backgroundColor: about.secondSectionBgColor || undefined }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-2">
            </div>
            <div className="md:col-span-6">
              <p 
                className="text-lg leading-relaxed"
                style={{ color: about.mutedTextColor || undefined }}
              >
                {about.experienceText}
              </p>
            </div>
            <div className="md:col-span-4">
              <p 
                className="text-sm"
                style={{ color: about.mutedTextColor || undefined }}
              >
                {about.experienceNote}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default About;