
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsGrid from '@/components/NewsGrid';
import CategoryFilter from '@/components/CategoryFilter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NewsCategory, NewsItem } from '@/lib/types';
import { dummyNews } from '@/lib/dummyData';
import { Search, X } from 'lucide-react';

const STORAGE_KEYS = {
  NEWS: 'ethicalTechDigest_news'
};

const Index = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');
  
  useEffect(() => {
    // Load all news from localStorage or use dummy data as fallback
    setIsLoading(true);
    
    try {
      const savedNews = localStorage.getItem(STORAGE_KEYS.NEWS);
      if (savedNews) {
        const parsedNews = JSON.parse(savedNews);
        setNews(Array.isArray(parsedNews) ? parsedNews : dummyNews);
      } else {
        setNews(dummyNews);
      }
    } catch (error) {
      console.error('Errore nel caricare le notizie:', error);
      setNews(dummyNews);
    }
    
    setIsLoading(false);
  }, []);
  
  // Ordina le notizie per data (più recenti prima)
  const sortedNews = [...news].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Filter news by category and search query
  const filteredNews = sortedNews
    .filter(item => selectedCategory === 'all' || item.category === selectedCategory)
    .filter(item => {
      if (!searchQuery) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) || 
        (item.summary && item.summary.toLowerCase().includes(query)) || 
        (item.content && item.content.toLowerCase().includes(query))
      );
    });
  
  // Group news by date
  const groupByDate = (items: NewsItem[]) => {
    const grouped = items.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = [];
      }
      acc[item.date].push(item);
      return acc;
    }, {} as Record<string, NewsItem[]>);
    
    // Sort dates in descending order (newest first)
    return Object.entries(grouped)
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('it-IT', options);
  };
  
  const groupedNews = groupByDate(filteredNews);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setSearchInput('');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-heading font-bold mb-2">
            Ethical Tech Digest
          </h1>
          <p className="text-muted-foreground">
            Le notizie più rilevanti sui risvolti etici delle nuove tecnologie
          </p>
        </div>
        
        <div className="mb-6 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Cerca notizie..."
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
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Risultati per: <span className="font-medium text-foreground">"{searchQuery}"</span>
                {filteredNews.length > 0 && (
                  <span> ({filteredNews.length} risultat{filteredNews.length === 1 ? 'o' : 'i'})</span>
                )}
              </p>
              <Button variant="ghost" size="sm" onClick={clearSearch}>Cancella ricerca</Button>
            </div>
          )}
          
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>
        
        {isLoading ? (
          <div className="py-10 text-center">
            <p className="text-lg text-muted-foreground">Caricamento notizie...</p>
          </div>
        ) : groupedNews.length > 0 ? (
          <div className="space-y-8">
            {groupedNews.map(([date, items]) => (
              <div key={date}>
                <h2 className="text-xl font-medium mb-4 border-b pb-2">
                  {formatDate(date)}
                </h2>
                <NewsGrid news={items} searchQuery={searchQuery} />
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

export default Index;
