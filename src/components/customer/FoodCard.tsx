import React from 'react';
import { FoodItem } from '../../types';
import { Star, Plus, Flame, Heart } from 'lucide-react';

interface FoodCardProps {
  food: FoodItem;
  onAddToCart: (food: FoodItem) => void;
  onOpenDetails: (food: FoodItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  food,
  onAddToCart,
  onOpenDetails,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <div className="group bg-white dark:bg-black rounded-3xl p-4 soft-shadow border border-zinc-200/60 dark:border-zinc-800 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Top Image & Floating Icons */}
        <div
          onClick={() => onOpenDetails(food)}
          className="relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden mb-3 bg-zinc-100 dark:bg-zinc-800 cursor-pointer"
        >
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Veg/Non-Veg Badge */}
          <div className="absolute top-2.5 left-2.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm p-1 rounded-lg border border-zinc-200/50">
            <div
              className={`w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center ${
                food.isVeg ? 'border-emerald-600' : 'border-rose-600'
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  food.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              />
            </div>
          </div>

          {/* Favorite Button */}
          <button
            onClick={onToggleFavorite}
            className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm text-zinc-600 hover:scale-110 transition-all z-10"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-zinc-500'}`} />
          </button>

          {/* Bestseller Badge */}
          {food.isBestseller && (
            <div className="absolute bottom-2.5 left-2.5 bg-amber-500 text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
              ★ Bestseller
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mb-2">
          <div className="flex items-center justify-between gap-1 mb-1">
            <h4
              onClick={() => onOpenDetails(food)}
              className="font-display font-bold text-base text-zinc-900 dark:text-zinc-100 group-hover:text-[#FF6B00] transition-colors cursor-pointer line-clamp-1"
            >
              {food.name}
            </h4>
          </div>

          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3 leading-relaxed">
            {food.description}
          </p>
        </div>
      </div>

      {/* Footer / Price & Add */}
      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100">
              ₹{food.price.toFixed(2)}
            </span>
            {food.originalPrice && (
              <span className="text-xs text-zinc-400 line-through">₹{food.originalPrice.toFixed(2)}</span>
            )}
          </div>
          {food.calories && (
            <span className="text-[10px] text-zinc-400 flex items-center gap-0.5">
              <Flame className="w-2.5 h-2.5 text-amber-500" /> {food.calories} kcal
            </span>
          )}
        </div>

        <button
          onClick={() => onAddToCart(food)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FF6B00]/10 hover:bg-[#FF6B00] text-[#FF6B00] hover:text-white font-bold text-xs transition-all active:scale-95 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>ADD</span>
        </button>
      </div>
    </div>
  );
};
