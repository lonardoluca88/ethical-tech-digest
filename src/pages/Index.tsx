
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsGrid from '@/components/NewsGrid';
import CategoryFilter from '@/components/CategoryFilter';
import { NewsCategory, NewsItem } from '@/lib/types';
import { dummyNews } from '@/lib/dummyData';

const STORAGE_KEYS = {
  NEWS: 'ethicalTechDigest_news'
};

const Index = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Load news from localStorage or use dummy data as fallback
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
  
  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory);
  
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
        
        <div className="mb-6">
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
                <NewsGrid news={items} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="text-lg text-muted-foreground">
              Nessuna notizia trovata per la categoria selezionata.
            </p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
