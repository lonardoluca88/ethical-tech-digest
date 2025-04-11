
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings, Calendar, Home } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl font-heading font-bold text-primary">Ethical Tech Digest</h1>
          <p className="text-sm text-muted-foreground">
            Notizie etiche sulle nuove tecnologie
          </p>
        </div>
        
        <nav className="flex space-x-2">
          <Link to="/">
            <Button 
              variant={location.pathname === '/' ? 'default' : 'outline'}
              size="sm"
              className="flex items-center gap-1"
            >
              <Home size={16} />
              <span className="hidden sm:inline">Oggi</span>
            </Button>
          </Link>
          
          <Link to="/weekly">
            <Button 
              variant={location.pathname === '/weekly' ? 'default' : 'outline'}
              size="sm"
              className="flex items-center gap-1"
            >
              <Calendar size={16} />
              <span className="hidden sm:inline">Settimanale</span>
            </Button>
          </Link>
          
          <Link to="/admin">
            <Button 
              variant={location.pathname === '/admin' ? 'default' : 'outline'}
              size="sm"
              className="flex items-center gap-1"
            >
              <Settings size={16} />
              <span className="hidden sm:inline">Admin</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
