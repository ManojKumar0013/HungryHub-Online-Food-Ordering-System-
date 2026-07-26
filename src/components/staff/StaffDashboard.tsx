import React, { useState } from 'react';
import { Order, OrderStatus, FoodItem } from '../../types';
import { ChefHat, Clock, CheckCircle2, AlertCircle, Plus, Edit2, Trash2, Search, Flame, Power } from 'lucide-react';

interface StaffDashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  foodItems: FoodItem[];
  onToggleFoodAvailability: (foodId: string) => void;
  onAddFoodItem: (food: FoodItem) => void;
  onDeleteFoodItem: (foodId: string) => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  orders,
  onUpdateOrderStatus,
  foodItems,
  onToggleFoodAvailability,
  onAddFoodItem,
  onDeleteFoodItem,
}) => {
  const [activeTab, setActiveTab] = useState<'kds' | 'menu'>('kds');
  const [menuSearch, setMenuSearch] = useState('');

  // New Food Item Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('185.00');
  const [newCategory, setNewCategory] = useState('Pizza');
  const [newIsVeg, setNewIsVeg] = useState(true);

  const pendingOrders = orders.filter((o) => o.status === 'Placed');
  const kitchenOrders = orders.filter((o) => ['Preparing', 'Cooking', 'Packed'].includes(o.status));
  const completedOrders = orders.filter((o) => ['Out for Delivery', 'Delivered'].includes(o.status));

  const handleCreateFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem: FoodItem = {
      id: `food-staff-${Date.now()}`,
      restaurantId: 'rest-1',
      restaurantName: "L'Antica Pizzeria",
      name: newName,
      description: newDesc || 'Freshly prepared kitchen specialty.',
      price: parseFloat(newPrice) || 18.5,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      category: newCategory,
      isVeg: newIsVeg,
      rating: 5.0,
      reviewCount: 1,
      prepTimeMinutes: 15,
      ingredients: ['Fresh Dough', 'Cheese', 'House Sauce'],
      isAvailable: true,
    };

    onAddFoodItem(newItem);
    setNewName('');
    setNewDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Module Banner */}
      <div className="p-6 rounded-[32px] bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
            <ChefHat className="w-8 h-8 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl">Restaurant & Kitchen Console</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase">
                KDS Online
              </span>
            </div>
            <p className="text-xs text-amber-100 mt-1">L'Antica Pizzeria • Managing Live Kitchen Workflows & Menu Items</p>
          </div>
        </div>

        {/* Quick KDS Counters */}
        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-center">
            <span className="text-[10px] font-bold uppercase text-amber-200">Pending</span>
            <p className="font-display font-bold text-xl">{pendingOrders.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-center">
            <span className="text-[10px] font-bold uppercase text-amber-200">In Cooking</span>
            <p className="font-display font-bold text-xl">{kitchenOrders.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-6 font-bold text-sm">
        <button
          onClick={() => setActiveTab('kds')}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === 'kds'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          Kitchen Display System ({orders.length} Active)
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === 'menu'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          Menu & Inventory Management ({foodItems.length} Dishes)
        </button>
      </div>

      {/* Tab 1: KDS View */}
      {activeTab === 'kds' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Incoming / Pending */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-xs">
              <span className="uppercase tracking-wider">New Incoming Orders ({pendingOrders.length})</span>
              <AlertCircle className="w-4 h-4 text-amber-500 animate-pulse" />
            </div>

            {pendingOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border-2 border-amber-500/40 shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-[#FF6B00]">{ord.id}</span>
                  <span className="text-[11px] text-zinc-400">{ord.createdAt}</span>
                </div>
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{ord.customerName}</p>
                <div className="space-y-1 bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-xl text-xs">
                  {ord.items.map((i) => (
                    <div key={i.id} className="flex justify-between">
                      <span className="font-bold">{i.quantity}x {i.food.name}</span>
                      <span className="text-zinc-500">₹{i.itemTotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onUpdateOrderStatus(ord.id, 'Preparing')}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all"
                >
                  Accept & Start Preparing →
                </button>
              </div>
            ))}
          </div>

          {/* Column 2: In Kitchen Cooking */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-800 dark:text-orange-300 font-bold text-xs">
              <span className="uppercase tracking-wider">Kitchen Cooking ({kitchenOrders.length})</span>
              <Flame className="w-4 h-4 text-orange-500" />
            </div>

            {kitchenOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-[#FF6B00]">{ord.id}</span>
                  <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 font-bold text-[10px] uppercase">
                    {ord.status}
                  </span>
                </div>
                <div className="space-y-1 bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-xl text-xs">
                  {ord.items.map((i) => (
                    <div key={i.id} className="flex justify-between">
                      <span className="font-bold">{i.quantity}x {i.food.name}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onUpdateOrderStatus(ord.id, 'Cooking')}
                    className={`py-2 rounded-xl text-xs font-bold border ${
                      ord.status === 'Cooking' ? 'bg-orange-500 text-white' : 'border-zinc-300'
                    }`}
                  >
                    Cooking
                  </button>
                  <button
                    onClick={() => onUpdateOrderStatus(ord.id, 'Packed')}
                    className={`py-2 rounded-xl text-xs font-bold border ${
                      ord.status === 'Packed' ? 'bg-emerald-600 text-white' : 'border-zinc-300'
                    }`}
                  >
                    Packed Ready
                  </button>
                </div>

                <button
                  onClick={() => onUpdateOrderStatus(ord.id, 'Out for Delivery')}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  Handover to Delivery Partner →
                </button>
              </div>
            ))}
          </div>

          {/* Column 3: Handed Over / Out for Delivery */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
              <span className="uppercase tracking-wider">Out for Delivery ({completedOrders.length})</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>

            {completedOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm opacity-90 space-y-2"
              >
                <div className="flex justify-between text-xs">
                  <span className="font-mono font-bold text-[#FF6B00]">{ord.id}</span>
                  <span className="font-bold text-emerald-600">{ord.status}</span>
                </div>
                <p className="text-xs text-zinc-500">Rider: {ord.driverName || 'Kommineni Yashwanth'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Menu Management */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                placeholder="Search dishes..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-800 text-xs font-semibold border border-zinc-200 dark:border-zinc-700"
              />
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-xs shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Dish to Menu</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {foodItems
              .filter((f) => f.name.toLowerCase().includes(menuSearch.toLowerCase()))
              .map((food) => (
                <div
                  key={food.id}
                  className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-3 flex flex-col justify-between"
                >
                  <div className="flex gap-3">
                    <img src={food.image} alt={food.name} className="w-16 h-16 rounded-2xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">{food.name}</h4>
                      <p className="text-xs font-bold text-[#FF6B00]">₹{food.price.toFixed(2)}</p>
                      <span className="text-[10px] text-zinc-400">{food.category}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onToggleFoodAvailability(food.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                        food.isAvailable
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-600 border border-rose-500/30'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{food.isAvailable ? 'In Stock' : 'Out of Stock'}</span>
                    </button>

                    <button
                      onClick={() => onDeleteFoodItem(food.id)}
                      className="p-2 text-zinc-400 hover:text-rose-500 transition-colors"
                      title="Delete Dish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Add Food Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form
            onSubmit={handleCreateFood}
            className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-4"
          >
            <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100">Add New Dish to Menu</h3>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Dish Name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="E.g. Truffle Gnocchi"
                className="w-full p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 border-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Description</label>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Delicious hand-rolled pasta..."
                className="w-full p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 border-none resize-none h-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Price (₹)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 border-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 border-none"
                >
                  <option value="Pizza">Pizza</option>
                  <option value="Burger">Burger</option>
                  <option value="Sushi">Sushi</option>
                  <option value="Asian">Asian</option>
                  <option value="Dessert">Dessert</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 rounded-2xl bg-zinc-200 dark:bg-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-2xl bg-[#FF6B00] text-white text-xs font-bold shadow-md"
              >
                Add Dish
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
