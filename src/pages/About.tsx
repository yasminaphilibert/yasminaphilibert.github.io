import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="section-spacing">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium leading-tight mb-8">
              About the studio
            </h1>
            
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                M—Studio is the creative practice of Marcus Chen, a multidisciplinary 
                creative director working across visual art, graphic design, and 
                sound engineering.
              </p>
              
              <p>
                With over a decade of experience shaping brand identities and 
                immersive experiences, the studio bridges the gap between visual 
                and auditory storytelling. Each project is approached as a unique 
                canvas—whether designing a visual identity system or engineering 
                the sonic landscape for a film.
              </p>
              
              <p>
                The work spans collaborations with global brands, independent 
                artists, cultural institutions, and forward-thinking startups. 
                Every project shares a commitment to craft, conceptual depth, 
                and emotional resonance.
              </p>
              
              <p>
                Based in Los Angeles, working globally.
              </p>
            </div>

            <motion.div 
              className="mt-16 pt-8 border-t border-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h2 className="text-2xl font-display font-medium mb-6">Services</h2>
              <ul className="grid md:grid-cols-2 gap-3 text-muted-foreground">
                <li>Creative Direction</li>
                <li>Visual Identity</li>
                <li>Graphic Design</li>
                <li>Art Direction</li>
                <li>Sound Engineering</li>
                <li>Audio Production</li>
                <li>Brand Strategy</li>
                <li>Motion Design</li>
              </ul>
            </motion.div>

            <motion.div 
              className="mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <h2 className="text-2xl font-display font-medium mb-6">Contact</h2>
              <a 
                href="mailto:hello@mstudio.com" 
                className="text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                hello@mstudio.com
              </a>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
