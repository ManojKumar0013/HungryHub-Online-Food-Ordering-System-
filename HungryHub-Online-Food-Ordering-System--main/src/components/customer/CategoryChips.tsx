import React from 'react';
import { Category } from '../../types';
import { Utensils, Pizza, Flame, Fish, IceCream, Soup, Wine, Ham } from 'lucide-react';

interface CategoryChipsProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Pizza':
        return <Pizza className="w-4 h-4" />;
      case 'Ham':
        return <Ham className="w-4 h-4" />;
      case 'Fish':
        return <Fish className="w-4 h-4" />;
      case 'IceCream':
        return <IceCream className="w-4 h-4" />;
      case 'Soup':
        return <Soup className="w-4 h-4" />;
      case 'Flame':
        return <Flame className="w-4 h-4" />;
      case 'Wine':
        return <Wine className="w-4 h-4" />;
      default:
        return <Utensils className="w-4 h-4" />;
    }
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-6 overflow-hidden">
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-2">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.name || (cat.name === 'All' && selectedCategory === 'All');
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs transition-all shadow-sm ${
                isActive
                  ? 'bg-[#FF6B00] text-white shadow-md shadow-[#FF6B00]/20 scale-105'
                  : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-[#FF6B00] hover:text-[#FF6B00] border border-zinc-200 dark:border-zinc-700'
              }`}
            >
              {getCategoryIcon(cat.icon)}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
