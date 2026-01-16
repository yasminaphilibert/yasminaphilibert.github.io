import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* About Content Section - extends the header color */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full px-6 py-16 md:px-12 md:py-24 -mt-8 rounded-b-[2rem]"
        style={{ backgroundColor: "hsl(330, 100%, 71%)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12">
            {/* Label - Left */}
            <div className="md:col-span-2">
              <span className="text-sm text-black/60">About</span>
            </div>

            {/* Main Content - Center */}
            <div className="md:col-span-6">
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-black mb-8">
                M—Studio
              </h1>
              <div className="space-y-6 text-lg md:text-xl text-black/70 leading-relaxed">
                <p>
                  M—Studio is the creative practice of Marcus Chen, a multidisciplinary 
                  creative director working across visual art, graphic design, and 
                  sound engineering.
                </p>
                <p>
                  With over a decade of experience shaping brand identities and 
                  immersive experiences, the studio bridges the gap between visual 
                  and auditory storytelling.
                </p>
                <p>
                  Based in Los Angeles, working globally.
                </p>
              </div>
            </div>

            {/* Contact & Services - Right */}
            <div className="md:col-span-4 space-y-12">
              <div>
                <h2 className="text-sm text-black/60 mb-4">Contact</h2>
                <a 
                  href="mailto:hello@mstudio.com" 
                  className="text-black underline underline-offset-4 hover:opacity-70 transition-opacity"
                >
                  hello@mstudio.com
                </a>
              </div>
              
              <div>
                <h2 className="text-sm text-black/60 mb-4">Services</h2>
                <ul className="space-y-2 text-black/70">
                  <li>Creative Direction</li>
                  <li>Visual Identity</li>
                  <li>Graphic Design</li>
                  <li>Art Direction</li>
                  <li>Sound Engineering</li>
                  <li>Audio Production</li>
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
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-2">
              <span className="text-sm text-muted-foreground">Experience</span>
            </div>
            <div className="md:col-span-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                The work spans collaborations with global brands, independent 
                artists, cultural institutions, and forward-thinking startups. 
                Every project shares a commitment to craft, conceptual depth, 
                and emotional resonance.
              </p>
            </div>
            <div className="md:col-span-4">
              <p className="text-sm text-muted-foreground">
                Featured clients include major labels, design studios, and 
                cultural organizations across three continents.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <Footer bgColor="hsl(330, 100%, 71%)" />
    </div>
  );
};

export default About;
