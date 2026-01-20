import Header from "@/components/Header";
import ServiceCard from "@/components/ServiceCard";
import Footer from "@/components/Footer";
import { services } from "@/data/services";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
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
            index={index}
          />
        ))}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
