
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsGrid from '@/components/NewsGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NewsItem } from '@/lib/types';
import { dummyNews } from '@/lib/dummyData';
import { ChevronLeft, ChevronRight, Calendar, Search, X } from 'lucide-react';
import { NewsFetchingService } from '@/lib/newsFetchingService';
import { toast } from 'sonner';

const STORAGE_KEYS = {
  NEWS: 'ethicalTechDigest_news'
};

const Weekly = () => {
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [weeklyNews, setWeeklyNews] = useState<NewsItem[]>([]);
  const [currentWeek, setCurrentWeek] = useState<number>(0); // 0 = current week, -1 = last week, etc.
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');
  
  // Get date range for the selected week
  const getWeekDates = (weekOffset: number) => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 for Sunday, 1 for Monday, etc.
    
    // Calculate the start of the week (Monday)
    const start = new Date(now);
    start.setDate(now.getDate() - currentDay + (currentDay === 0 ? -6 : 1) + (weekOffset * 7));
    start.setHours(0, 0, 0, 0);
    
    // Calculate the end of the week (Sunday)
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    
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
  
  // Load all news
  useEffect(() => {
    // Initialize news scheduler
    NewsFetchingService.scheduleDailyFetch();
    
    setIsLoading(true);
    
    try {
      const savedNews = localStorage.getItem(STORAGE_KEYS.NEWS);
      let newsToUse = dummyNews;
      
      if (savedNews) {
        const parsedNews = JSON.parse(savedNews);
        newsToUse = Array.isArray(parsedNews) ? parsedNews : dummyNews;
      } else {
        // If no news in localStorage, add dummy news and then fetch real news
        localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(dummyNews));
        
        // Try to fetch news
        NewsFetchingService.fetchNews()
          .then(result => {
            if (result.success && result.newArticlesCount && result.newArticlesCount > 0) {
              // Reload news from localStorage since fetchNews updates it
              const updatedNews = localStorage.getItem(STORAGE_KEYS.NEWS);
              if (updatedNews) {
                const parsedUpdatedNews = JSON.parse(updatedNews);
                setAllNews(parsedUpdatedNews);
                toast.success(`Trovati ${result.newArticlesCount} nuovi articoli`);
              }
            }
          })
          .catch(error => {
            console.error('Error fetching news:', error);
          });
      }
      
      // Sort news by date (newest first)
      const sortedNews = [...newsToUse].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      setAllNews(sortedNews);
    } catch (error) {
      console.error('Errore nel caricare le notizie:', error);
      setAllNews([]);
    }
    
    setIsLoading(false);
    
    // Listen for news fetch events from the widget
    const handleWidgetFetchNews = () => {
      NewsFetchingService.fetchNews()
        .then(result => {
          if (result.success && result.newArticlesCount && result.newArticlesCount > 0) {
            // Reload news from localStorage
            const updatedNews = localStorage.getItem(STORAGE_KEYS.NEWS);
            if (updatedNews) {
              const parsedUpdatedNews = JSON.parse(updatedNews);
              setAllNews(parsedUpdatedNews);
              toast.success(`Trovati ${result.newArticlesCount} nuovi articoli`);
            }
          }
        })
        .catch(error => {
          console.error('Error fetching news from widget event:', error);
        });
    };
    
    window.addEventListener('ethicalTechDigest_fetchNews', handleWidgetFetchNews);
    
    return () => {
      window.removeEventListener('ethicalTechDigest_fetchNews', handleWidgetFetchNews);
    };
  }, []);
  
  // Filter news by week whenever allNews or currentWeek changes
  useEffect(() => {
    const { start, end } = getWeekDates(currentWeek);
    
    // Filter by the selected week's date range
    const weeklyFiltered = allNews.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });
    
    setWeeklyNews(weeklyFiltered);
  }, [allNews, currentWeek]);
  
  const { start, end } = getWeekDates(currentWeek);
  const dateRangeDisplay = formatDateRange(start, end);
  
  // Filter news by search query
  const filteredNews = weeklyNews.filter(item => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) || 
      (item.summary && item.summary.toLowerCase().includes(query)) || 
      (item.content && item.content.toLowerCase().includes(query))
    );
  });
  
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
  
  const groupedNews = groupByCategory(filteredNews);
  
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
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setSearchInput('');
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
        
        <div className="flex items-center justify-between mb-4 border-b pb-3">
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
        
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Cerca notizie settimanali..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              {searchInput && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0" 
                  onClick={() => setSearchInput('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Button type="submit">Cerca</Button>
          </form>
          
          {searchQuery && (
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-muted-foreground">
                Risultati per: <span className="font-medium text-foreground">"{searchQuery}"</span>
                {filteredNews.length > 0 && (
                  <span> ({filteredNews.length} risultat{filteredNews.length === 1 ? 'o' : 'i'})</span>
                )}
              </p>
              <Button variant="ghost" size="sm" onClick={clearSearch}>Cancella ricerca</Button>
            </div>
          )}
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
                <NewsGrid news={category.items} searchQuery={searchQuery} />
              </div>
            ))}
          </div>
        ) : (
          <NewsGrid news={[]} searchQuery={searchQuery} />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Weekly;
