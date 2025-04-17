
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsGrid from '@/components/NewsGrid';
import { Button } from '@/components/ui/button';
import { NewsItem } from '@/lib/types';
import { dummyNews } from '@/lib/dummyData';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const STORAGE_KEYS = {
  NEWS: 'ethicalTechDigest_news'
};

const Weekly = () => {
  const [weeklyNews, setWeeklyNews] = useState<NewsItem[]>([]);
  const [currentWeek, setCurrentWeek] = useState<number>(0); // 0 = current week, -1 = last week, etc.
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Get date range for the selected week
  const getWeekDates = (weekOffset: number) => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 for Sunday, 1 for Monday, etc.
    
    // Calculate the start of the week (Monday)
    const start = new Date(now);
    start.setDate(now.getDate() - currentDay + (currentDay === 0 ? -6 : 1) + (weekOffset * 7));
    
    // Calculate the end of the week (Sunday)
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    return { start, end };
  };
  
  // Format date range for display
  const formatDateRange = (start: Date, end: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long'
    };
    
    const startStr = start.toLocaleDateString('it-IT', options);
    const endStr = end.toLocaleDateString('it-IT', options);
    const year = end.getFullYear();
    
    return `${startStr} - ${endStr} ${year}`;
  };
  
  useEffect(() => {
    // Load news from localStorage or use dummy data as fallback
    setIsLoading(true);
    
    try {
      const savedNews = localStorage.getItem(STORAGE_KEYS.NEWS);
      let newsToUse = dummyNews;
      
      if (savedNews) {
        const parsedNews = JSON.parse(savedNews);
        newsToUse = Array.isArray(parsedNews) ? parsedNews : dummyNews;
      }
      
      // Filter by the selected week's date range if needed
      const { start, end } = getWeekDates(currentWeek);
      
      // Ensure we're comparing dates properly
      const weeklyFiltered = newsToUse.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= start && itemDate <= end;
      });
      
      setWeeklyNews(weeklyFiltered);
    } catch (error) {
      console.error('Errore nel caricare le notizie:', error);
      setWeeklyNews([]);
    }
    
    setIsLoading(false);
  }, [currentWeek]);
  
  const { start, end } = getWeekDates(currentWeek);
  const dateRangeDisplay = formatDateRange(start, end);
  
  // Group news by category
  const groupByCategory = (items: NewsItem[]) => {
    const categories = {
      ai: { label: 'Intelligenza Artificiale', items: [] as NewsItem[] },
      robotics: { label: 'Robotica', items: [] as NewsItem[] },
      biotech: { label: 'Biotecnologia', items: [] as NewsItem[] },
    };
    
    items.forEach(item => {
      if (categories[item.category]) {
        categories[item.category].items.push(item);
      }
    });
    
    return Object.values(categories).filter(category => category.items.length > 0);
  };
  
  const groupedNews = groupByCategory(weeklyNews);
  
  const handlePrevWeek = () => {
    setCurrentWeek(currentWeek - 1);
  };
  
  const handleNextWeek = () => {
    if (currentWeek < 0) {
      setCurrentWeek(currentWeek + 1);
    }
  };
  
  const handleCurrentWeek = () => {
    setCurrentWeek(0);
  };
  
  const isCurrentWeek = currentWeek === 0;
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-heading font-bold mb-2">
            Riepilogo Settimanale
          </h1>
          <p className="text-muted-foreground">
            Tutte le notizie più importanti della settimana
          </p>
        </div>
        
        <div className="flex items-center justify-between mb-6 border-b pb-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrevWeek}
            className="flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Settimana Precedente</span>
            <span className="sm:hidden">Prec</span>
          </Button>
          
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span className="font-medium">{dateRangeDisplay}</span>
          </div>
          
          <div>
            {isCurrentWeek ? (
              <Button variant="outline" size="sm" disabled>
                <span className="hidden sm:inline">Settimana Corrente</span>
                <span className="sm:hidden">Corrente</span>
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCurrentWeek}
                  className="hidden sm:flex items-center gap-1"
                >
                  <Calendar size={16} />
                  Settimana Corrente
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleNextWeek}
                  className="flex items-center gap-1"
                >
                  <span className="hidden sm:inline">Settimana Successiva</span>
                  <span className="sm:hidden">Succ</span>
                  <ChevronRight size={16} />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {isLoading ? (
          <div className="py-10 text-center">
            <p className="text-lg text-muted-foreground">Caricamento notizie...</p>
          </div>
        ) : groupedNews.length > 0 ? (
          <div className="space-y-10">
            {groupedNews.map(category => (
              <div key={category.label}>
                <h2 className="text-2xl font-medium mb-4">
                  {category.label}
                </h2>
                <NewsGrid news={category.items} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="text-lg text-muted-foreground">
              Nessuna notizia disponibile per questa settimana.
            </p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Weekly;
