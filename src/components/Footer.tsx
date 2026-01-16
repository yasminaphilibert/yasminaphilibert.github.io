const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 md:py-16 border-t border-border">
      <div className="container-custom">
        <p className="text-sm text-muted-foreground">
          © 2018–{currentYear}. Marcus Chen
        </p>
      </div>
    </footer>
  );
};

export default Footer;
