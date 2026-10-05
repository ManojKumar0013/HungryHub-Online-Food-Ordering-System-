import React, { useState } from 'react';
import { Restaurant, FoodItem, Review } from '../../types';
import { Star, Clock, MapPin, Search, Filter, Phone, Heart, ThumbsUp, MessageSquare, Plus } from 'lucide-react';
import { FoodCard } from './FoodCard';

interface RestaurantDetailViewProps {
  restaurant: Restaurant;
  foodItems: FoodItem[];
  onAddToCart: (food: FoodItem) => void;
  onOpenFoodDetails: (food: FoodItem) => void;
  onBack: () => void;
  reviews: Review[];
  onAddReview: (review: Review) => void;
  favorites: string[];
  onToggleFavoriteFood: (foodId: string) => void;
}

export const RestaurantDetailView: React.FC<RestaurantDetailViewProps> = ({
  restaurant,
  foodItems,
  onAddToCart,
  onOpenFoodDetails,
  onBack,
  reviews,
  onAddReview,
  favorites,
  onToggleFavoriteFood,
}) => {
  const [menuSearch, setMenuSearch] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews' | 'about'>('menu');

  // Review state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const filteredFoods = foodItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(menuSearch.toLowerCase());
    const matchesVeg = vegOnly ? item.isVeg : true;
    return matchesSearch && matchesVeg;
  });

  const categories = Array.from(new Set(filteredFoods.map((f) => f.category)));

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const rev: Review = {
      id: `rev-${Date.now()}`,
      userName: 'Bondada Manoj Kumar',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: newRating,
      date: 'Just now',
      comment: newComment,
      likes: 0,
    };

    onAddReview(rev);
    setNewComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="text-xs font-bold text-zinc-500 hover:text-[#FF6B00] flex items-center gap-1 transition-colors"
      >
        ← Back to All Restaurants
      </button>

      {/* Restaurant Header Banner */}
      <div className="relative rounded-[32px] overflow-hidden bg-zinc-900 text-white shadow-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url('${restaurant.bannerImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />

        <div className="relative p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#FF6B00] font-bold text-xs uppercase tracking-wider">
                {restaurant.cuisine[0]}
              </span>
              <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {restaurant.rating} ({restaurant.reviewCount} Reviews)
              </span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight mb-2">
              {restaurant.name}
            </h1>

            <p className="text-zinc-300 text-sm max-w-xl font-medium mb-4">
              {restaurant.cuisine.join(' • ')} • {restaurant.address}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-300 font-semibold">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-[#FF6B00]" />
                <span>{restaurant.deliveryTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-[#FF6B00]" />
                <span>{restaurant.distance}</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4 text-[#FF6B00]" />
                <span>{restaurant.phone}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-zinc-300 tracking-wider">Status</span>
            <p className="font-display font-bold text-lg text-emerald-400 mt-0.5">Open Now</p>
            <p className="text-[11px] text-zinc-300 mt-1">Closes at 11:00 PM</p>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex gap-4 font-bold text-sm">
          {[
            { id: 'menu', label: 'Menu Items' },
            { id: 'reviews', label: `Reviews & Ratings (${reviews.length})` },
            { id: 'about', label: 'Info & Hygiene' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-[#FF6B00] text-[#FF6B00]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Veg Only Switcher */}
        {activeTab === 'menu' && (
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
              vegOnly
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700'
            }`}
          >
            <div className="w-3 h-3 rounded-sm border-2 border-current flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-current" />
            </div>
            <span>Veg Only</span>
          </button>
        )}
      </div>

      {/* Tab 1: Menu Items */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          {/* Search bar inside restaurant menu */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              placeholder="Search in L'Antica Pizzeria menu..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
            />
          </div>

          {categories.length === 0 ? (
            <div className="py-12 text-center text-zinc-400">
              <p className="font-bold text-base">No food items found matching your filters.</p>
              <button
                onClick={() => {
                  setMenuSearch('');
                  setVegOnly(false);
                }}
                className="mt-2 text-xs text-[#FF6B00] font-bold hover:underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            categories.map((catName) => {
              const catFoods = filteredFoods.filter((f) => f.category === catName);
              return (
                <div key={catName} className="space-y-4">
                  <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-zinc-100 border-l-4 border-[#FF6B00] pl-3">
                    {catName}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {catFoods.map((food) => (
                      <FoodCard
                        key={food.id}
                        food={food}
                        onAddToCart={onAddToCart}
                        onOpenDetails={onOpenFoodDetails}
                        isFavorite={favorites.includes(food.id)}
                        onToggleFavorite={(e) => {
                          e.stopPropagation();
                          onToggleFavoriteFood(food.id);
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Reviews & Ratings */}
      {activeTab === 'reviews' && (
        <div className="space-y-8">
          {/* Post a Review Form */}
          <form
            onSubmit={handlePostReview}
            className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-4"
          >
            <h4 className="font-display font-bold text-base text-zinc-900 dark:text-zinc-100">
              Leave a Customer Review
            </h4>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 font-semibold">Your Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= newRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-zinc-300 dark:text-zinc-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your experience about taste, portion, packaging, and delivery time..."
              className="w-full p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 border-none focus:ring-2 focus:ring-[#FF6B00] h-24 resize-none"
            />

            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-[#FF6B00] text-white font-bold text-xs shadow-md hover:bg-[#e05e00]"
            >
              Post Review
            </button>
          </form>

          {/* Existing Reviews List */}
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 soft-shadow space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.userAvatar}
                      alt={rev.userName}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <div>
                      <h5 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{rev.userName}</h5>
                      <span className="text-[10px] text-zinc-400">{rev.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{rev.rating}.0</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">{rev.comment}</p>

                {rev.foodItemName && (
                  <span className="inline-block text-[10px] font-bold text-[#FF6B00] bg-[#FF6B00]/10 px-2.5 py-0.5 rounded-full">
                    Ordered: {rev.foodItemName}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: About & Info */}
      {activeTab === 'about' && (
        <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4 text-xs text-zinc-600 dark:text-zinc-300">
          <h4 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100">
            About {restaurant.name}
          </h4>
          <p>
            Renowned across India for culinary excellence, authentic dhandi dum techniques, hand-ground royal spices, and uncompromised quality delivered fresh daily.
          </p>
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
            <p><strong>Address:</strong> {restaurant.address}</p>
            <p><strong>Phone:</strong> {restaurant.phone}</p>
            <p><strong>FSSAI License:</strong> 10019022008819</p>
            <p><strong>Safety Protocols:</strong> 100% Temperature checks, Sanitized Kitchen Workstations</p>
          </div>
        </div>
      )}
    </div>
  );
};
