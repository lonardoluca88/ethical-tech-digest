
import React from 'react';
import { Brain, Dna, Cog } from "lucide-react";
import { NewsCategory } from '@/lib/types';

interface CategoryIconProps {
  category: NewsCategory;
  size?: number;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ 
  category, 
  size = 20,
  className = "" 
}) => {
  switch (category) {
    case 'ai':
      return <Brain size={size} className={`text-ai ${className}`} />;
    case 'robotics':
      return <Cog size={size} className={`text-robotics ${className}`} />;
    case 'biotech':
      return <Dna size={size} className={`text-biotech ${className}`} />;
    default:
      return null;
  }
};

export const getCategoryColor = (category: NewsCategory): string => {
  switch (category) {
    case 'ai':
      return 'text-ai';
    case 'robotics':
      return 'text-robotics';
    case 'biotech':
      return 'text-biotech';
    default:
      return 'text-gray-500';
  }
};

export const getCategoryBgColor = (category: NewsCategory): string => {
  switch (category) {
    case 'ai':
      return 'bg-blue-100';
    case 'robotics':
      return 'bg-green-100';
    case 'biotech':
      return 'bg-purple-100';
    default:
      return 'bg-gray-100';
  }
};

export const getCategoryName = (category: NewsCategory): string => {
  switch (category) {
    case 'ai':
      return 'Intelligenza Artificiale';
    case 'robotics':
      return 'Robotica';
    case 'biotech':
      return 'Biotecnologia';
    default:
      return 'Categoria Sconosciuta';
  }
};
