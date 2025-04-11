
import React from 'react';
import { Button } from '@/components/ui/button';
import { NewsCategory } from '@/lib/types';
import { CategoryIcon, getCategoryName } from './icons/CategoryIcons';

interface CategoryFilterProps {
  selectedCategory: NewsCategory | 'all';
  onChange: (category: NewsCategory | 'all') => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selectedCategory, 
  onChange 
}) => {
  const categories: (NewsCategory | 'all')[] = ['all', 'ai', 'robotics', 'biotech'];
  
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? 'default' : 'outline'}
          className={`flex items-center gap-1 ${selectedCategory === category ? 'shadow-sm' : ''}`}
          onClick={() => onChange(category)}
          size="sm"
        >
          {category !== 'all' ? (
            <>
              <CategoryIcon category={category} size={16} />
              <span className="hidden sm:inline">{getCategoryName(category)}</span>
            </>
          ) : (
            'Tutte le categorie'
          )}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
