import React, { useState } from 'react';
import { FoodItem, FoodVariant, Topping } from '../../types';
import { X, Star, Plus, Minus, Flame, Heart, Share2, Check } from 'lucide-react';

interface FoodDetailsModalProps {
  food: FoodItem | null;
  onClose: () => void;
  onAddToCartCustomized: (
    food: FoodItem,
    quantity: number,
    selectedVariant?: FoodVariant,
    selectedToppings?: Topping[],
    specialInstructions?: string
  ) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const FoodDetailsModal: React.FC<FoodDetailsModalProps> = ({
  food,
  onClose,
  onAddToCartCustomized,
  isFavorite,
  onToggleFavorite,
}) => {
  if (!food) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<FoodVariant | undefined>(food.variants?.[0]);
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [instructions, setInstructions] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);

  const calculateTotal = () => {
    let base = food.price;
    if (selectedVariant) base += selectedVariant.priceExtra;
    const toppingsExtra = selectedToppings.reduce((sum, t) => sum + t.price, 0);
    return (base + toppingsExtra) * quantity;
  };

  const toggleTopping = (topping: Topping) => {
    if (selectedToppings.some((t) => t.id === topping.id)) {
      setSelectedToppings(selectedToppings.filter((t) => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Top Sticky Bar */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={onToggleFavorite}
            className="p-2.5 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-zinc-700 dark:text-zinc-200 hover:scale-110 transition-all shadow-md"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2.5 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-zinc-700 dark:text-zinc-200 hover:scale-110 transition-all shadow-md relative"
          >
            {copiedShare ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-zinc-700 dark:text-zinc-200 hover:scale-110 transition-all shadow-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-6">
          {/* Header Image */}
          <div className="relative h-64 sm:h-72 -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-6 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6 sm:left-8 right-6 text-white">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FF6B00] font-bold text-[10px] uppercase tracking-wider">
                  {food.category}
                </span>
                <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-xs font-semibold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {food.rating} ({food.reviewCount} reviews)
                </span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl">{food.name}</h2>
            </div>
          </div>

          {/* Restaurant & Description */}
          <div>
            <p className="text-xs font-semibold text-[#FF6B00] uppercase tracking-wider mb-1">
              By {food.restaurantName}
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{food.description}</p>
          </div>

          {/* Nutrition & Prep Time */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 text-center border border-zinc-200/50 dark:border-zinc-700/50">
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Calories</p>
              <p className="font-display font-bold text-sm text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-1 mt-0.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" /> {food.calories || 650} kcal
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Protein</p>
              <p className="font-display font-bold text-sm text-zinc-800 dark:text-zinc-200 mt-0.5">
                {food.protein || '32g'}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Prep Time</p>
              <p className="font-display font-bold text-sm text-zinc-800 dark:text-zinc-200 mt-0.5">
                {food.prepTimeMinutes} mins
              </p>
            </div>
          </div>

          {/* Ingredients list */}
          {food.ingredients && food.ingredients.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-2">
                Fresh Ingredients
              </h3>
              <div className="flex flex-wrap gap-2">
                {food.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 font-medium"
                  >
                    • {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Variants Selection */}
          {food.variants && food.variants.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-2">
                Select Portion / Size
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {food.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`p-3 rounded-2xl text-xs font-semibold flex items-center justify-between border transition-all ${
                      selectedVariant?.id === v.id
                        ? 'border-[#FF6B00] bg-[#FF6B00]/10 text-[#FF6B00]'
                        : 'border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <span>{v.name}</span>
                    <span>+{v.priceExtra > 0 ? `₹${v.priceExtra.toFixed(2)}` : 'Included'}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Extra Toppings */}
          {food.toppings && food.toppings.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-2">
                Extra Gourmet Toppings
              </h3>
              <div className="space-y-2">
                {food.toppings.map((top) => {
                  const isChecked = selectedToppings.some((t) => t.id === top.id);
                  return (
                    <button
                      key={top.id}
                      onClick={() => toggleTopping(top)}
                      className={`w-full p-3 rounded-2xl text-xs font-semibold flex items-center justify-between border transition-all ${
                        isChecked
                          ? 'border-[#FF6B00] bg-[#FF6B00]/10 text-[#FF6B00]'
                          : 'border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                            isChecked ? 'bg-[#FF6B00] border-[#FF6B00] text-white' : 'border-zinc-400'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{top.name}</span>
                      </div>
                      <span>+₹{top.price.toFixed(2)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div>
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-2">
              Special Kitchen Instructions
            </h3>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="E.g. Extra spicy, sauce on the side, no cutlery needed..."
              className="w-full p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 border-none focus:ring-2 focus:ring-[#FF6B00] resize-none h-20"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Quantity:</span>
            <div className="flex items-center gap-2 bg-zinc-200 dark:bg-zinc-800 p-1.5 rounded-2xl">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1.5 rounded-xl bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center font-bold text-sm text-zinc-900 dark:text-zinc-100">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-1.5 rounded-xl bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              onAddToCartCustomized(food, quantity, selectedVariant, selectedToppings, instructions);
              onClose();
            }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-sm shadow-xl shadow-[#FF6B00]/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Add to Cart</span>
            <span>•</span>
            <span>₹{calculateTotal().toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
