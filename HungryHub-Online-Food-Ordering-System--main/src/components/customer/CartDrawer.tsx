import React, { useState } from 'react';
import { CartItem, Coupon } from '../../types';
import { X, ShoppingBag, Plus, Minus, Trash2, Tag, ArrowRight, Check } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
  availableCoupons: Coupon[];
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedCoupon,
  onApplyCoupon,
  availableCoupons,
}) => {
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);
  const tax = subtotal * 0.09; // 9% GST / Tax
  const deliveryFee = subtotal > 350 || subtotal === 0 ? 0 : 30;

  let discount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrder) {
    const calcDiscount = (subtotal * appliedCoupon.discountPercent) / 100;
    discount = Math.min(calcDiscount, appliedCoupon.maxDiscount);
  }

  const grandTotal = Math.max(0, subtotal + tax + deliveryFee - discount);

  const handleApplyPromoCode = () => {
    setCouponError('');
    const found = availableCoupons.find((c) => c.code.toUpperCase() === promoCodeInput.trim().toUpperCase());
    if (found) {
      if (subtotal < found.minOrder) {
        setCouponError(`Minimum order amount for ${found.code} is ₹${found.minOrder}`);
        return;
      }
      onApplyCoupon(found);
      setPromoCodeInput('');
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 h-full shadow-2xl border-l border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#FF6B00]/10 text-[#FF6B00]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100">Your Food Basket</h3>
              <p className="text-xs text-zinc-500">{cartItems.length} items selected</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400">
              <ShoppingBag className="w-16 h-16 stroke-1 text-zinc-300 dark:text-zinc-700 mb-4 animate-bounce" />
              <h4 className="font-display font-bold text-lg text-zinc-700 dark:text-zinc-300 mb-1">
                Your cart is empty
              </h4>
              <p className="text-xs text-zinc-500 max-w-xs mb-6">
                Explore local gourmet restaurants and add delicious dishes to your order.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-2xl bg-[#FF6B00] text-white font-semibold text-xs shadow-md"
              >
                Browse Restaurants
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 flex items-center gap-3"
              >
                <img
                  src={item.food.image}
                  alt={item.food.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                    {item.food.name}
                  </h5>
                  {item.selectedVariant && (
                    <p className="text-[10px] text-zinc-500">{item.selectedVariant.name}</p>
                  )}
                  {item.selectedToppings && item.selectedToppings.length > 0 && (
                    <p className="text-[10px] text-zinc-400 truncate">
                      +{item.selectedToppings.map((t) => t.name).join(', ')}
                    </p>
                  )}
                  <p className="font-display font-bold text-xs text-[#FF6B00] mt-1">
                    ₹{item.itemTotal.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700 shrink-0">
                  <button
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="p-1 text-zinc-500 hover:text-zinc-900"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-5 text-center font-bold text-xs">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="p-1 text-zinc-500 hover:text-zinc-900"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-1 text-zinc-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}

          {/* Coupon Code Section */}
          {cartItems.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
                <Tag className="w-4 h-4" />
                <span>Apply Promo Code or Coupon</span>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Coupon '{appliedCoupon.code}' Applied!</span>
                  </div>
                  <button
                    onClick={() => onApplyCoupon(null)}
                    className="text-[10px] text-rose-500 hover:underline uppercase"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    placeholder="HUNGRY20"
                    className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 text-xs font-semibold uppercase border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                  />
                  <button
                    onClick={handleApplyPromoCode}
                    className="px-4 py-2 rounded-xl bg-[#FF6B00] text-white font-bold text-xs hover:bg-[#e05e00]"
                  >
                    Apply
                  </button>
                </div>
              )}

              {couponError && <p className="text-[11px] text-rose-500 font-medium">{couponError}</p>}

              {/* Suggested coupons list */}
              <div className="space-y-1.5 pt-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Available Offers:</p>
                {availableCoupons.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setPromoCodeInput(c.code);
                      onApplyCoupon(c);
                    }}
                    className="w-full text-left p-2 rounded-xl bg-white dark:bg-zinc-800/80 hover:bg-amber-500/10 text-[11px] flex items-center justify-between border border-zinc-200/50 dark:border-zinc-700/50 transition-colors"
                  >
                    <span className="font-bold text-[#FF6B00]">{c.code}</span>
                    <span className="text-zinc-500 truncate max-w-[180px]">{c.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 space-y-3">
            <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax & Restaurant GST (9%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? <span className="text-emerald-500 font-bold">FREE</span> : `₹${deliveryFee.toFixed(2)}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Discount Applied</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 flex justify-between font-display font-bold text-base text-zinc-900 dark:text-zinc-100">
                <span>Grand Total</span>
                <span className="text-[#FF6B00]">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-sm shadow-xl shadow-[#FF6B00]/30 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
