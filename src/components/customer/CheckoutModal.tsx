import React, { useState } from 'react';
import { CartItem, Address, Order, Coupon } from '../../types';
import { X, MapPin, CreditCard, Smartphone, Wallet, Banknote, ShieldCheck, CheckCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  addresses: Address[];
  appliedCoupon: Coupon | null;
  onPlaceOrder: (order: Order) => void;
  selectedLocation?: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  addresses,
  appliedCoupon,
  onPlaceOrder,
  selectedLocation = 'Hitech City, Hyderabad',
}) => {
  if (!isOpen || cartItems.length === 0) return null;

  const [selectedAddress, setSelectedAddress] = useState<Address>(addresses[0] || {
    id: 'addr-default',
    title: 'Home',
    addressLine: `Flat 402, Cyber Towers Lane, ${selectedLocation}`,
    city: selectedLocation.split(',')[1]?.trim() || 'Hyderabad',
    zipCode: '500081',
  });

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Wallet' | 'COD'>('UPI');
  const [upiProvider, setUpiProvider] = useState<'gpay' | 'phonepe' | 'paytm'>('gpay');
  const [cardDetails, setCardDetails] = useState({ number: '4532 •••• •••• 8821', name: 'Bondada Manoj Kumar', expiry: '08/28' });
  const [isPlacing, setIsPlacing] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);
  const tax = subtotal * 0.09;
  const deliveryFee = subtotal > 350 ? 0 : 30;
  let discount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrder) {
    discount = Math.min((subtotal * appliedCoupon.discountPercent) / 100, appliedCoupon.maxDiscount);
  }
  const grandTotal = Math.max(0, subtotal + tax + deliveryFee - discount);

  const handleCompleteOrder = () => {
    setIsPlacing(true);

    // Trigger Confetti Celebration!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      const newOrder: Order = {
        id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
        customerId: 'cust-101',
        customerName: 'Bondada Manoj Kumar',
        customerPhone: '+1 (555) 901-2345',
        restaurantId: cartItems[0]?.food.restaurantId || 'rest-1',
        restaurantName: cartItems[0]?.food.restaurantName || "L'Antica Pizzeria",
        items: cartItems,
        subtotal,
        tax,
        deliveryFee,
        discount,
        total: grandTotal,
        status: 'Placed',
        paymentMethod,
        paymentStatus: 'Paid',
        deliveryAddress: selectedAddress,
        driverId: 'drv-1',
        driverName: 'Kommineni Yashwanth',
        driverPhone: '+1 (555) 888-4321',
        driverAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        estimatedDeliveryTime: '25 mins away',
        otp: `${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: 'Just now',
      };

      onPlaceOrder(newOrder);
      setIsPlacing(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-6">
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-zinc-100">
              Checkout & Payment
            </h3>
            <p className="text-xs text-zinc-500">Secure 256-Bit Encrypted Order Placement</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Step 1: Address Selection */}
          <div>
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#FF6B00]" />
              <span>1. Select Delivery Address</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {addresses.map((addr) => {
                const isSelected = selectedAddress.id === addr.id;
                return (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => setSelectedAddress(addr)}
                    className={`p-4 rounded-2xl text-left border transition-all ${
                      isSelected
                        ? 'border-[#FF6B00] bg-[#FF6B00]/10 text-zinc-900 dark:text-zinc-100 font-semibold'
                        : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm">{addr.title}</span>
                      {isSelected && <CheckCircle className="w-4 h-4 text-[#FF6B00]" />}
                    </div>
                    <p className="text-xs">{addr.addressLine}</p>
                    <p className="text-[11px] text-zinc-400 mt-1">{addr.city}, {addr.zipCode}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Payment Options */}
          <div>
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>2. Choose Payment Method</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {[
                { type: 'UPI', label: 'UPI / QR', icon: <Smartphone className="w-4 h-4" /> },
                { type: 'Card', label: 'Cards', icon: <CreditCard className="w-4 h-4" /> },
                { type: 'Wallet', label: 'Wallet', icon: <Wallet className="w-4 h-4" /> },
                { type: 'COD', label: 'Cash on Del.', icon: <Banknote className="w-4 h-4" /> },
              ].map((p) => {
                const isSelected = paymentMethod === p.type;
                return (
                  <button
                    key={p.type}
                    type="button"
                    onClick={() => setPaymentMethod(p.type as any)}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 border text-xs font-bold transition-all ${
                      isSelected
                        ? 'border-[#FF6B00] bg-[#FF6B00] text-white shadow-md'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {p.icon}
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-options based on method */}
            {paymentMethod === 'UPI' && (
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 flex items-center justify-around">
                {[
                  { id: 'gpay', label: 'Google Pay', color: 'text-blue-500' },
                  { id: 'phonepe', label: 'PhonePe', color: 'text-purple-500' },
                  { id: 'paytm', label: 'Paytm UPI', color: 'text-cyan-500' },
                ].map((u) => (
                  <button
                    key={u.id}
                    onClick={() => setUpiProvider(u.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      upiProvider === u.id
                        ? 'bg-white dark:bg-zinc-900 border-[#FF6B00] text-[#FF6B00] shadow-sm'
                        : 'border-transparent text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            )}

            {paymentMethod === 'Card' && (
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-2 text-xs">
                <input
                  type="text"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 font-mono"
                  placeholder="Card Number"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                    className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700"
                    placeholder="Name on Card"
                  />
                  <input
                    type="text"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700"
                    placeholder="MM/YY"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Final Order Summary Breakdown */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 space-y-2 text-xs">
            <h5 className="font-bold text-zinc-800 dark:text-zinc-200 mb-2">Order Items Summary</h5>
            {cartItems.map((ci) => (
              <div key={ci.id} className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>{ci.quantity}x {ci.food.name}</span>
                <span className="font-medium">₹{ci.itemTotal.toFixed(2)}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 flex justify-between font-bold text-sm text-zinc-900 dark:text-zinc-100">
              <span>Total Payable</span>
              <span className="text-[#FF6B00]">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-zinc-400 font-bold uppercase">Amount to pay</p>
            <p className="font-display font-bold text-xl text-[#FF6B00]">₹{grandTotal.toFixed(2)}</p>
          </div>

          <button
            onClick={handleCompleteOrder}
            disabled={isPlacing}
            className="px-8 py-3.5 rounded-2xl bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-sm shadow-xl shadow-[#FF6B00]/30 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isPlacing ? (
              <span>Authorizing Payment...</span>
            ) : (
              <>
                <span>Place Order</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
