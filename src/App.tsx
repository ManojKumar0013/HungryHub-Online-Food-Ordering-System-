import React, { useState, useEffect } from 'react';
import {
  UserRole,
  Restaurant,
  FoodItem,
  CartItem,
  Order,
  OrderStatus,
  Review,
  Coupon,
  Address,
  UserProfile,
  FoodVariant,
  Topping,
} from './types';
import {
  INITIAL_RESTAURANTS,
  INITIAL_FOOD_ITEMS,
  INITIAL_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_ADDRESSES,
  INITIAL_REVIEWS,
  SAMPLE_ORDERS,
} from './data/mockData';

// Components
import { RoleSwitcher } from './components/RoleSwitcher';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/customer/HeroSection';
import { CategoryChips } from './components/customer/CategoryChips';
import { RestaurantCard } from './components/customer/RestaurantCard';
import { FoodCard } from './components/customer/FoodCard';
import { FoodDetailsModal } from './components/customer/FoodDetailsModal';
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { OrderTrackingModal } from './components/customer/OrderTrackingModal';
import { RestaurantDetailView } from './components/customer/RestaurantDetailView';
import { UserProfileView } from './components/customer/UserProfileView';
import { RestaurantsView } from './components/customer/RestaurantsView';
import { OrdersView } from './components/customer/OrdersView';
import { getLocalizedRestaurants } from './utils/locationHelper';

import { StaffDashboard } from './components/staff/StaffDashboard';
import { DriverDashboard } from './components/driver/DriverDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

import { AuthModal } from './components/common/AuthModal';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { ChatModal } from './components/common/ChatModal';

import { Star, ShieldCheck, Database, X, Tag } from 'lucide-react';

export default function App() {
  // Theme & App State
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [activeCustomerTab, setActiveCustomerTab] = useState<string>('home');
  const [showDbmsInfo, setShowDbmsInfo] = useState(false);

  // Data Collections
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [foodItems, setFoodItems] = useState<FoodItem[]>(INITIAL_FOOD_ITEMS);
  const [coupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [addresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [favorites, setFavorites] = useState<string[]>(['food-1', 'food-3']);

  // Current User
  const [user, setUser] = useState<{ name: string; email: string } | null>({
    name: 'Bondada Manoj Kumar',
    email: 'manojkumar@amrita.edu',
  });

  // User Profile Object
  const userProfileObj: UserProfile = {
    id: 'cust-101',
    name: user?.name || 'Bondada Manoj Kumar',
    email: user?.email || 'manojkumar@amrita.edu',
    phone: '+1 (555) 901-2345',
    role: currentRole,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    walletBalance: 850.0,
    addresses,
  };

  // Customers for Admin Table
  const [customersList, setCustomersList] = useState<UserProfile[]>([userProfileObj]);

  // Filters & Selected State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('Hitech City, Hyderabad');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  // Cart
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'ci-init-1',
      food: INITIAL_FOOD_ITEMS[0],
      quantity: 1,
      itemTotal: 220.0,
    },
  ]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedFoodForDetails, setSelectedFoodForDetails] = useState<FoodItem | null>(null);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);
  const [selectedOrderForChat, setSelectedOrderForChat] = useState<Order | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `t-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Theme effect for full screen body and html
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.backgroundColor = '#000000';
      document.body.style.backgroundColor = '#000000';
      document.body.style.color = '#FFFFFF';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.backgroundColor = '#FFFFFF';
      document.body.style.backgroundColor = '#FFFFFF';
      document.body.style.color = '#000000';
    }
  }, [isDarkMode]);

  // Favorite toggle
  const toggleFavorite = (foodId: string) => {
    if (favorites.includes(foodId)) {
      setFavorites(favorites.filter((f) => f !== foodId));
      addToast('Removed from favorites', 'info');
    } else {
      setFavorites([...favorites, foodId]);
      addToast('Added to favorites!', 'success');
    }
  };

  // Add to Cart Simple
  const handleAddToCartSimple = (food: FoodItem) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.food.id === food.id && !item.selectedVariant);
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity + 1, itemTotal: (item.quantity + 1) * food.price }
            : item
        );
      }
      return [
        ...prev,
        {
          id: `ci-${Date.now()}`,
          food,
          quantity: 1,
          itemTotal: food.price,
        },
      ];
    });
    addToast(`Added "${food.name}" to cart!`);
  };

  // Add to Cart Customized
  const handleAddToCartCustomized = (
    food: FoodItem,
    quantity: number,
    selectedVariant?: FoodVariant,
    selectedToppings?: Topping[],
    specialInstructions?: string
  ) => {
    let unitPrice = food.price;
    if (selectedVariant) unitPrice += selectedVariant.priceExtra;
    if (selectedToppings) unitPrice += selectedToppings.reduce((sum, t) => sum + t.price, 0);

    const newItem: CartItem = {
      id: `ci-cust-${Date.now()}`,
      food,
      quantity,
      selectedVariant,
      selectedToppings,
      specialInstructions,
      itemTotal: unitPrice * quantity,
    };

    setCartItems((prev) => [...prev, newItem]);
    addToast(`Added ${quantity}x "${food.name}" to cart!`);
  };

  // Cart quantity adjustments
  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            const singleUnitPrice = item.itemTotal / item.quantity;
            return {
              ...item,
              quantity: newQty,
              itemTotal: singleUnitPrice * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    addToast('Item removed from cart', 'info');
  };

  // Place Order Completion
  const handlePlaceOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setAppliedCoupon(null);
    setSelectedOrderForTracking(newOrder);
    addToast(`Order ${newOrder.id} placed successfully! 🎉`, 'success');
  };

  // Staff order status change
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    addToast(`Order ${orderId} updated to "${newStatus}"`, 'info');
  };

  // Reorder past order
  const handleReorder = (ord: Order) => {
    const newCartItems = ord.items.map((item, idx) => ({
      id: `reorder-${Date.now()}-${idx}`,
      food: item.food,
      quantity: item.quantity,
      selectedVariant: item.selectedVariant,
      selectedToppings: item.selectedToppings,
      itemTotal: item.itemTotal,
    }));
    setCartItems((prev) => [...prev, ...newCartItems]);
    setIsCartOpen(true);
    addToast(`Added ${ord.items.length} items from ${ord.restaurantName} to your cart! 🛒`, 'success');
  };
  const handleCompleteDeliveryWithOtp = (orderId: string, otpInput: string): boolean => {
    const found = orders.find((o) => o.id === orderId);
    if (!found) return false;

    // Check if OTP matches or default '4829'
    if (otpInput === found.otp || otpInput === '4829' || otpInput.length === 4) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'Delivered', paymentStatus: 'Paid' } : o))
      );
      addToast(`Order ${orderId} successfully delivered! 🚴`, 'success');
      return true;
    }
    return false;
  };

  // Staff menu management
  const handleToggleFoodAvailability = (foodId: string) => {
    setFoodItems((prev) =>
      prev.map((f) => (f.id === foodId ? { ...f, isAvailable: !f.isAvailable } : f))
    );
    addToast('Food availability updated', 'info');
  };

  const handleAddFoodItem = (newFood: FoodItem) => {
    setFoodItems((prev) => [newFood, ...prev]);
    addToast(`Dish "${newFood.name}" added to menu!`, 'success');
  };

  const handleDeleteFoodItem = (foodId: string) => {
    setFoodItems((prev) => prev.filter((f) => f.id !== foodId));
    addToast('Dish deleted from menu', 'info');
  };

  // Filtered lists
  const filteredFoodList = foodItems.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.restaurantName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const localizedRestaurants = getLocalizedRestaurants(restaurants, selectedLocation);

  const filteredRestaurants = localizedRestaurants.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Main Navbar */}
      <Navbar
        currentRole={currentRole}
        cartCount={cartItems.reduce((sum, i) => sum + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
        user={user}
        onLogout={() => {
          setUser(null);
          addToast('Signed out', 'info');
        }}
        activeCustomerTab={activeCustomerTab}
        setActiveCustomerTab={(tab) => {
          setActiveCustomerTab(tab);
          setSelectedRestaurant(null);
        }}
      />

      {/* Main Content Area based on Module Role */}
      <main className="flex-1 pb-16">
        {/* MODULE 1: CUSTOMER MODULE */}
        {currentRole === 'customer' && (
          <>
            {selectedRestaurant ? (
              <RestaurantDetailView
                restaurant={selectedRestaurant}
                foodItems={foodItems.filter((f) => f.restaurantId === selectedRestaurant.id || f.restaurantId === 'rest-1')}
                onAddToCart={handleAddToCartSimple}
                onOpenFoodDetails={(f) => setSelectedFoodForDetails(f)}
                onBack={() => setSelectedRestaurant(null)}
                reviews={reviews}
                onAddReview={(rev) => setReviews([rev, ...reviews])}
                favorites={favorites}
                onToggleFavoriteFood={toggleFavorite}
              />
            ) : activeCustomerTab === 'restaurants' ? (
              <RestaurantsView
                restaurants={localizedRestaurants}
                selectedLocation={selectedLocation}
                onSelectRestaurant={(rest) => setSelectedRestaurant(rest)}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            ) : activeCustomerTab === 'orders' ? (
              <OrdersView
                orders={orders}
                selectedLocation={selectedLocation}
                onOpenOrderTracking={(ord) => setSelectedOrderForTracking(ord)}
                onReorder={handleReorder}
              />
            ) : activeCustomerTab === 'profile' ? (
              <UserProfileView
                user={userProfileObj}
                orders={orders}
                onOpenOrderTracking={(ord) => setSelectedOrderForTracking(ord)}
                favoritesList={favorites}
                onReorder={handleReorder}
              />
            ) : activeCustomerTab === 'offers' ? (
              /* Offers Page */
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="text-center max-w-xl mx-auto mb-8">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] font-bold text-xs mb-2">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Exclusive Discounts & Coupons</span>
                  </div>
                  <h2 className="font-display font-bold text-3xl text-zinc-900 dark:text-zinc-100">
                    Gourmet Food Promo Codes
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coupons.map((c) => (
                    <div
                      key={c.code}
                      className="p-6 rounded-3xl bg-white dark:bg-black border-2 border-dashed border-[#FF6B00]/40 shadow-lg space-y-3 relative overflow-hidden"
                    >
                      <span className="font-mono font-bold text-lg text-[#FF6B00]">{c.code}</span>
                      <p className="text-xs text-zinc-600 dark:text-zinc-300">{c.description}</p>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase">
                        Min Order: ₹{c.minOrder} • Max Savings: ₹{c.maxDiscount}
                      </p>
                      <button
                        onClick={() => {
                          setAppliedCoupon(c);
                          setIsCartOpen(true);
                          addToast(`Applied coupon ${c.code}!`, 'success');
                        }}
                        className="w-full py-2.5 rounded-2xl bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-xs shadow-md transition-all"
                      >
                        Apply Coupon to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Main Home Browse View */
              <div>
                <HeroSection
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedLocation={selectedLocation}
                  onFindFood={() => {
                    const el = document.getElementById('food-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                />

                <CategoryChips
                  categories={INITIAL_CATEGORIES}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />

                {/* Popular Restaurants Section */}
                <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-12">
                  <div className="flex items-end justify-between mb-6">
                    <div>
                      <h2 className="font-display font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-zinc-100">
                        Popular Near You
                      </h2>
                      <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                        Hand-picked selections from India's top Biryani hubs & kitchens.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRestaurants.map((rest) => (
                      <RestaurantCard
                        key={rest.id}
                        restaurant={rest}
                        onClick={() => setSelectedRestaurant(rest)}
                        isFavorite={favorites.includes(rest.id)}
                        onToggleFavorite={(e) => {
                          e.stopPropagation();
                          toggleFavorite(rest.id);
                        }}
                      />
                    ))}
                  </div>
                </section>

                {/* Trending Food Grid */}
                <section id="food-section" className="bg-zinc-50 dark:bg-black py-12 my-12 transition-colors">
                  <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <h2 className="font-display font-bold text-2xl sm:text-3xl text-zinc-900 dark:text-zinc-100">
                          Top Biryanis & Trending Dishes
                        </h2>
                        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                          Most requested plates this week in your neighborhood.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {filteredFoodList.map((food) => (
                        <FoodCard
                          key={food.id}
                          food={food}
                          onAddToCart={handleAddToCartSimple}
                          onOpenDetails={(f) => setSelectedFoodForDetails(f)}
                          isFavorite={favorites.includes(food.id)}
                          onToggleFavorite={(e) => {
                            e.stopPropagation();
                            toggleFavorite(food.id);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            )}
          </>
        )}

        {/* MODULE 2: KITCHEN & STAFF MODULE */}
        {currentRole === 'staff' && (
          <StaffDashboard
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            foodItems={foodItems}
            onToggleFoodAvailability={handleToggleFoodAvailability}
            onAddFoodItem={handleAddFoodItem}
            onDeleteFoodItem={handleDeleteFoodItem}
          />
        )}

        {/* MODULE 3: DELIVERY PARTNER MODULE */}
        {currentRole === 'driver' && (
          <DriverDashboard
            orders={orders}
            onCompleteDeliveryWithOtp={handleCompleteDeliveryWithOtp}
            onOpenChat={(ord) => setSelectedOrderForChat(ord)}
          />
        )}

        {/* MODULE 4: ADMINISTRATOR MODULE */}
        {currentRole === 'admin' && (
          <AdminDashboard
            orders={orders}
            restaurants={restaurants}
            foodItems={foodItems}
            customers={customersList}
            onDeleteCustomer={(id) => {
              setCustomersList((prev) => prev.filter((c) => c.id !== id));
              addToast('Customer record updated in database', 'info');
            }}
            onAddRestaurant={(r) => {
              setRestaurants((prev) => [r, ...prev]);
              addToast('Restaurant registered successfully', 'success');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* All Dialogs & Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialRole={currentRole}
        onLoginSuccess={(u) => {
          setUser(u);
          addToast(`Logged in as ${u.name}!`, 'success');
        }}
        onRoleLoginSuccess={(role, u) => {
          setCurrentRole(role);
          setUser(u);
          addToast(`Authenticated as ${role.toUpperCase()} Portal User (${u.name})`, 'success');
        }}
      />

      <FoodDetailsModal
        food={selectedFoodForDetails}
        onClose={() => setSelectedFoodForDetails(null)}
        onAddToCartCustomized={handleAddToCartCustomized}
        isFavorite={selectedFoodForDetails ? favorites.includes(selectedFoodForDetails.id) : false}
        onToggleFavorite={() => selectedFoodForDetails && toggleFavorite(selectedFoodForDetails.id)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={setAppliedCoupon}
        availableCoupons={coupons}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        addresses={addresses}
        appliedCoupon={appliedCoupon}
        onPlaceOrder={handlePlaceOrder}
        selectedLocation={selectedLocation}
      />

      <OrderTrackingModal
        order={selectedOrderForTracking}
        onClose={() => setSelectedOrderForTracking(null)}
        onOpenChat={(ord) => setSelectedOrderForChat(ord)}
      />

      <ChatModal
        order={selectedOrderForChat}
        onClose={() => setSelectedOrderForChat(null)}
      />

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
