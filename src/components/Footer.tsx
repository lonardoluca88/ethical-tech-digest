
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white shadow-sm mt-8 py-4">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>&copy; {currentYear} Ethical Tech Digest. Tutti i diritti riservati.</p>
        <p className="mt-1">
          Un prodotto di <a href="https://trasformazioneconsapevole.it" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Trasformazione Consapevole
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
