import React from 'react';
import { Restaurant } from '../../types';
import { Star, Clock, MapPin, Heart } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onClick,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <div
      onClick={onClick}
      className="group bg-white dark:bg-black rounded-3xl overflow-hidden soft-shadow border border-zinc-200/60 dark:border-zinc-800 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer relative flex flex-col"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Favorite Button */}
        <button
          onClick={onToggleFavorite}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-md text-zinc-600 hover:scale-110 transition-all z-10"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-zinc-500'}`} />
        </button>

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-2.5 py-1 rounded-xl flex items-center gap-1 font-bold text-xs shadow-sm text-zinc-900 dark:text-zinc-100">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{restaurant.rating}</span>
          <span className="text-zinc-400 font-normal">({restaurant.reviewCount})</span>
        </div>

        {/* Discount / Promo Badge */}
        {restaurant.discountBadge && (
          <div className="absolute bottom-3 left-3 bg-[#FF6B00] text-white font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-lg shadow-sm">
            {restaurant.discountBadge}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100 group-hover:text-[#FF6B00] transition-colors">
              {restaurant.name}
            </h3>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
              ₹{restaurant.priceForTwo} for 2
            </span>
          </div>

          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-1">
            {restaurant.cuisine.join(' • ')}
          </p>
        </div>

        <div className="flex items-center gap-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
            <span>{restaurant.distance}</span>
          </div>
          {restaurant.isFreeDelivery && (
            <span className="ml-auto text-[11px] font-bold text-[#FF6B00] uppercase tracking-wide">
              Free Delivery
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
