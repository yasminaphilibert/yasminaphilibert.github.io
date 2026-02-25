import { motion } from "framer-motion";
import Header from "@/components/Header";
import ServiceCard from "@/components/ServiceCard";
import Footer from "@/components/Footer";
import { services } from "@/data/services";
import { getIndexContent } from "@/lib/content";

const Index = () => {
  const indexContent = getIndexContent();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Large - full-width section below header */}
      <motion.section
        className="relative -mt-8 pt-20 pb-28 md:pt-32 md:pb-40 px-6 md:px-12 min-h-[70vh] md:min-h-[85vh] flex flex-col justify-center overflow-hidden"
        style={{
          backgroundColor: indexContent.heroBackgroundColor || "#f8f8f8",
          ...(indexContent.heroBackgroundImage && {
            backgroundImage: `url(${
              indexContent.heroBackgroundImage.startsWith("public/")
                ? `${(import.meta.env.BASE_URL || "/").replace(/\/?$/, "")}/${indexContent.heroBackgroundImage.replace(/^public\//, "")}`
                : indexContent.heroBackgroundImage
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }),
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {indexContent.heroBackgroundImage && (
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundColor: indexContent.heroBackgroundColor
                ? `${indexContent.heroBackgroundColor}10`
                : "rgba(248,248,248,0.15)",
            }}
            aria-hidden
          />
        )}
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          {indexContent.heroTitle ? (
            <h1
              className="font-display text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-semibold mb-8 md:mb-10 leading-tight tracking-tight"
              style={indexContent.heroTitleColor ? { color: indexContent.heroTitleColor } : { color: "#ffffff" }}
            >
              {indexContent.heroTitle}
            </h1>
          ) : null}
          {indexContent.heroSubtitle ? (
            <p className={`text-xl md:text-2xl lg:text-3xl text-secondary-foreground/80 max-w-2xl ${indexContent.heroTitle ? '' : 'font-display font-semibold'}`}>
              {indexContent.heroSubtitle}
            </p>
          ) : null}
        </div>
      </motion.section>

      <main>
        {services.map((service, index) => (
          <ServiceCard
            key={service.slug}
            title={service.title}
            subtitle={service.subtitle}
            description={service.description}
            image={service.image}
            slug={service.slug}
            infoColor={service.infoColor}
            homeIntro={service.homeIntro}
            index={index}
          />
        ))}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
