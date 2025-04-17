
import React from 'react';
import { NewsItem as NewsItemType } from '@/lib/types';
import NewsItem from './NewsItem';

interface NewsGridProps {
  news: NewsItemType[];
  searchQuery?: string;
}

const NewsGrid: React.FC<NewsGridProps> = ({ news, searchQuery }) => {
  if (news.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-lg text-muted-foreground">
          {searchQuery 
            ? `Nessuna notizia trovata per "${searchQuery}".` 
            : 'Nessuna notizia trovata.'}
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {news.map((item) => (
        <NewsItem key={`news-${item.id}`} item={item} />
      ))}
    </div>
  );
};

export default NewsGrid;
