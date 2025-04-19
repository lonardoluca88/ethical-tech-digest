
import { NewsCategory } from '@/lib/types';

export interface PerplexitySearchResponse {
  id: string;
  choices: {
    index: number;
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }[];
}

export interface NewsSearchResult {
  title: string;
  url: string;
  summary: string;
  date: string;
  category?: NewsCategory;
}
