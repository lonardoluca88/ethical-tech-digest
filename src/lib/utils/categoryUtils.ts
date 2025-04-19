
import { NewsCategory } from '@/lib/types';

/**
 * Get the localized name of a news category
 */
export const getCategoryName = (category: NewsCategory): string => {
  switch (category) {
    case 'ai': return 'Intelligenza Artificiale';
    case 'robotics': return 'Robotica';
    case 'biotech': return 'Biotecnologia';
    default: return 'Tecnologia';
  }
};

/**
 * Get search keywords for a specific category
 */
export const getCategoryKeywords = (category: NewsCategory): string[] => {
  switch (category) {
    case 'ai':
      return ['artificial intelligence', 'machine learning', 'deep learning', 'neural network', 'AI ethics', 'generative AI', 'large language model', 'LLM'];
    case 'robotics':
      return ['robotics', 'automation', 'autonomous', 'robot', 'drone', 'robot ethics', 'robotic process', 'human-robot interaction'];
    case 'biotech':
      return ['biotechnology', 'genomics', 'crispr', 'genetic engineering', 'bioethics', 'synthetic biology', 'gene editing', 'biotech ethics'];
    default:
      return ['ethics', 'technology', 'digital ethics'];
  }
};
