import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section - connects seamlessly with header */}
      <motion.section 
        className="bg-secondary -mt-8 pt-16 pb-12 px-6 md:px-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold text-secondary-foreground mb-4">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl text-secondary-foreground/80 max-w-2xl">
            Have a project in mind? Let's create something amazing together.
          </p>
        </div>
      </motion.section>

      {/* Info Bar with rounded bottom */}
      <div 
        className="py-6 px-6 md:px-12 rounded-b-[2rem]"
        style={{ backgroundColor: "#FF6B6B" }}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <span className="text-sm font-medium text-white">
            Available for freelance
          </span>
          <span className="text-sm font-medium text-white">
            Based in San Francisco
          </span>
        </div>
      </div>

      {/* Contact Form Section */}
      <section className="py-16 px-6 md:px-12 bg-background">
        <div className="max-w-3xl mx-auto">
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Name
                </label>
                <Input 
                  id="name"
                  placeholder="Your name"
                  className="bg-muted border-0 rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="bg-muted border-0 rounded-xl h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium text-foreground">
                Subject
              </label>
              <Input 
                id="subject"
                placeholder="What's this about?"
                className="bg-muted border-0 rounded-xl h-12"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-foreground">
                Message
              </label>
              <Textarea 
                id="message"
                placeholder="Tell me about your project..."
                className="bg-muted border-0 rounded-xl min-h-[160px] resize-none"
              />
            </div>

            <Button 
              type="submit"
              className="w-full md:w-auto px-12 py-6 h-auto rounded-xl text-base font-medium"
              style={{ backgroundColor: "#FF6B6B" }}
            >
              Send Message
            </Button>
          </motion.form>

          {/* Alternative Contact */}
          <motion.div
            className="mt-16 pt-12 border-t border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
              Or reach out directly
            </h2>
            <div className="space-y-4">
              <a 
                href="mailto:hello@mstudio.com"
                className="block text-lg text-muted-foreground hover:text-foreground transition-colors"
              >
                hello@mstudio.com
              </a>
              <p className="text-lg text-muted-foreground">
                San Francisco, California
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Back to Home */}
      <section className="bg-muted">
        <Link 
          to="/"
          className="block py-12 px-6 md:px-12 hover:bg-muted/80 transition-colors duration-300"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <span className="text-sm text-muted-foreground block mb-2">Back to</span>
              <span className="font-display text-2xl md:text-3xl font-semibold text-foreground">Home</span>
            </div>
            <span className="text-4xl text-muted-foreground">←</span>
          </div>
        </Link>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
