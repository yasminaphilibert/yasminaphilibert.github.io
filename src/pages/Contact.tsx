import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Label from "@/components/Label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getContactContent } from "@/lib/content";

const Contact = () => {
  const contact = getContactContent();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header />

      <div className="container-custom">
        <motion.section
          className="mt-4 card-surface bg-blush px-7 py-14 md:px-14 md:py-20"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <Label>{contact.infoBarText1}</Label>
            <Label>{contact.infoBarText2}</Label>
          </div>
          <h1 className="display-heading mt-6 text-[2.1rem] md:text-[3.5rem]">{contact.title}</h1>
          <p className="body-copy mt-7 max-w-[52ch] text-lg font-medium">{contact.subtitle}</p>
        </motion.section>

        <section className="py-16 md:py-20">
          <div className="max-w-3xl">
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label htmlFor="name" className="label">
                    Name
                  </label>
                  <Input id="name" placeholder="Your name" className="bg-ink/5 border-0 rounded-xl h-12 text-base" />
                </div>
                <div className="space-y-2.5">
                  <label htmlFor="email" className="label">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="bg-ink/5 border-0 rounded-xl h-12 text-base"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label htmlFor="subject" className="label">
                  Subject
                </label>
                <Input
                  id="subject"
                  placeholder="What's this about?"
                  className="bg-ink/5 border-0 rounded-xl h-12 text-base"
                />
              </div>

              <div className="space-y-2.5">
                <label htmlFor="message" className="label">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Tell me about your project..."
                  className="bg-ink/5 border-0 rounded-xl min-h-[160px] resize-none text-base"
                />
              </div>

              <Button
                type="submit"
                className="w-full md:w-auto px-12 py-6 h-auto rounded-xl text-base font-semibold bg-ink text-paper hover:bg-ink/90"
              >
                Send Message
              </Button>
            </motion.form>

            <motion.div
              className="mt-16 pt-12 border-t border-ink/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="display-heading text-[1.5rem] md:text-[2rem]">
                {contact.alternativeContactTitle || "Or reach out directly"}
              </h2>
              <div className="mt-6 space-y-4">
                <a
                  href={`mailto:${contact.email}`}
                  className="block text-lg font-semibold text-ink underline underline-offset-[6px] decoration-ink/40 hover:decoration-ink transition-colors"
                >
                  {contact.email}
                </a>
                <p className="body-copy text-lg font-medium">{contact.location}</p>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
