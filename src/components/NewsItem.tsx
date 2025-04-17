
import React from 'react';
import { NewsItem as NewsItemType, NewsSource } from '@/lib/types';
import { CategoryIcon, getCategoryName } from './icons/CategoryIcons';
import { dummySources } from '@/lib/dummyData';
import { ExternalLink } from 'lucide-react';
import { useLinkChecker } from '@/hooks/useLinkChecker';

interface NewsItemProps {
  item: NewsItemType;
}

const STORAGE_KEYS = {
  SOURCES: 'ethicalTechDigest_sources'
};

const NewsItem: React.FC<NewsItemProps> = ({ item }) => {
  const { isValid, isLoading } = useLinkChecker(item.url);
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('it-IT', options);
  };

  // Get sources from localStorage or use dummy sources as fallback
  let sources: NewsSource[] = dummySources;
  try {
    const savedSources = localStorage.getItem(STORAGE_KEYS.SOURCES);
    if (savedSources) {
      const parsedSources = JSON.parse(savedSources);
      sources = Array.isArray(parsedSources) ? parsedSources : dummySources;
    }
  } catch (error) {
    console.error('Errore nel caricare le fonti:', error);
  }

  const source = sources.find(source => source.id === item.sourceId);
  
  return (
    <div className="news-card animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <div className={`category-badge category-badge-${item.category} flex items-center gap-1`}>
          <CategoryIcon category={item.category} size={14} />
          <span>{getCategoryName(item.category)}</span>
        </div>
        <span className="text-xs text-muted-foreground">{formatDate(item.date)}</span>
      </div>
      
      <h3 className="text-lg font-medium mb-2">{item.title}</h3>
      
      {item.summary && (
        <p className="text-sm text-gray-600 mb-3">{item.summary}</p>
      )}
      
      <div className="flex justify-between items-center text-xs mt-3">
        <span className="text-muted-foreground">
          Fonte: {source?.name || 'Fonte sconosciuta'}
        </span>
        
        {isLoading ? (
          <span className="text-muted-foreground text-xs italic">Verifica link in corso...</span>
        ) : isValid ? (
          <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary hover:underline"
          >
            Leggi articolo <ExternalLink size={12} />
          </a>
        ) : null}
      </div>
    </div>
  );
};

export default NewsItem;
