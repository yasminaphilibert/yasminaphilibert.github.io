import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Label from "@/components/Label";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <Header />

      <div className="container-custom flex-1">
        <section className="mt-4 card-surface bg-sand px-7 py-20 md:px-14 md:py-28">
          <Label>Error 404</Label>
          <h1 className="display-heading mt-6 text-[2.4rem] md:text-[3.8rem] max-w-[18ch]">
            This page <span className="serif-accent">went missing</span>
          </h1>
          <Link to="/" className="link-cta mt-8">
            Return to home &rarr;
          </Link>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
