import React, { useState, useMemo } from 'react';
import { Search, Flame, Leaf, Clock, Star, Plus, Minus, X, Info, Check, Utensils } from 'lucide-react';
import { MENU_ITEMS } from '../data';
import { MenuItem } from '../types';

interface MenuProps {
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

type CategoryType = 'all' | 'starters' | 'mains' | 'desserts' | 'drinks';
type DietaryFilter = 'all' | 'vegan' | 'vegetarian' | 'gluten-free' | 'spicy';

export default function Menu({ onAddToCart }: MenuProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [detailQuantity, setDetailQuantity] = useState(1);
  const [addedItemName, setAddedItemName] = useState<string | null>(null);

  const categories: { label: string; value: CategoryType }[] = [
    { label: 'All Courses', value: 'all' },
    { label: 'Starters', value: 'starters' },
    { label: 'Mains', value: 'mains' },
    { label: 'Desserts', value: 'desserts' },
    { label: 'Drinks', value: 'drinks' },
  ];

  const dietaryPills: { label: string; value: DietaryFilter; icon: React.ReactNode }[] = [
    { label: 'All Dishes', value: 'all', icon: <Utensils className="h-3.5 w-3.5" /> },
    { label: 'Vegan', value: 'vegan', icon: <Leaf className="h-3.5 w-3.5 text-emerald-500" /> },
    { label: 'Vegetarian', value: 'vegetarian', icon: <Leaf className="h-3.5 w-3.5 text-green-400" /> },
    { label: 'Gluten-Free', value: 'gluten-free', icon: <span className="text-[11px] font-bold text-amber-500 font-mono">GF</span> },
    { label: 'Spicy', value: 'spicy', icon: <Flame className="h-3.5 w-3.5 text-rose-500" /> },
  ];

  // Filtered Items
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      
      const matchesDietary =
        dietaryFilter === 'all' ||
        (dietaryFilter === 'vegan' && item.dietary.includes('vegan')) ||
        (dietaryFilter === 'vegetarian' && (item.dietary.includes('vegetarian') || item.dietary.includes('vegan'))) ||
        (dietaryFilter === 'gluten-free' && item.dietary.includes('gluten-free')) ||
        (dietaryFilter === 'spicy' && item.dietary.includes('spicy'));

      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesDietary && matchesSearch;
    });
  }, [activeCategory, dietaryFilter, searchQuery]);

  const handleQuickAdd = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    onAddToCart(item, 1);
    
    // Trigger localized visual toast
    setAddedItemName(item.name);
    setTimeout(() => {
      setAddedItemName(null);
    }, 2000);
  };

  const openDishDetails = (item: MenuItem) => {
    setSelectedDish(item);
    setDetailQuantity(1);
  };

  const handleModalAdd = () => {
    if (selectedDish) {
      onAddToCart(selectedDish, detailQuantity);
      setAddedItemName(selectedDish.name);
      setSelectedDish(null);
      setTimeout(() => {
        setAddedItemName(null);
      }, 2000);
    }
  };

  return (
    <section id="menu" className="py-24 bg-slate-900 border-t border-slate-800 relative scroll-mt-12">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-amber-500/5 rounded-full filter blur-3xl -z-10" />
      <div className="absolute top-10 right-0 w-80 h-80 bg-emerald-500/5 rounded-full filter blur-3xl -z-10" />

      {/* Floating Mini Success Toast */}
      {addedItemName && (
        <div className="fixed bottom-6 right-6 bg-slate-950 border border-emerald-500/30 text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center space-x-2.5 animate-slide-up">
          <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Check className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Added to order!</p>
            <p className="text-[10px] text-slate-400 line-clamp-1">{addedItemName}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4" id="menu-title-block">
          <span className="text-amber-500 text-xs font-bold tracking-widest uppercase block">Our Culinary Offering</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Discover Our Gourmet Menu
          </h2>
          <div className="h-0.5 w-16 bg-amber-500 mx-auto rounded-full mt-4" />
          <p className="text-slate-400 text-sm sm:text-base font-light leading-relaxed">
            Every dish is prepared to order by our expert culinary team using fresh ingredients. Select your favorite course, apply filters to match your dietary preference, and add directly to your dining bill.
          </p>
        </div>

        {/* Filters and Search Bar Container */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 sm:p-6 mb-12 shadow-md space-y-5" id="menu-filters-controls">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search savory dishes, ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                id="menu-search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category Tabs */}
            <div className="flex items-center space-x-1.5 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none" id="menu-categories-scroll">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    activeCategory === cat.value
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                  id={`cat-btn-${cat.value}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Filters */}
          <div className="border-t border-slate-800/60 pt-4 flex flex-wrap items-center gap-2.5" id="menu-dietary-row">
            <span className="text-slate-400 text-xs font-medium mr-2">Dietary:</span>
            {dietaryPills.map((pill) => (
              <button
                key={pill.value}
                onClick={() => setDietaryFilter(pill.value)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 border cursor-pointer ${
                  dietaryFilter === pill.value
                    ? 'bg-slate-800 border-amber-500/50 text-amber-400'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-300 hover:bg-slate-900'
                }`}
                id={`dietary-btn-${pill.value}`}
              >
                {pill.icon}
                <span>{pill.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" id="menu-items-grid">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => openDishDetails(item)}
                className="group bg-slate-950 rounded-2xl overflow-hidden border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300 hover:shadow-xl hover:shadow-slate-950/50 flex flex-col cursor-pointer"
                id={`dish-card-${item.id}`}
              >
                {/* Image Container with Badges */}
                <div className="relative h-48 sm:h-52 overflow-hidden shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />

                  {/* Hot / Popular Badge */}
                  {item.popular && (
                    <span className="absolute top-3 left-3 flex items-center space-x-1 bg-amber-500 text-slate-950 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md">
                      <Star className="h-3 w-3 fill-slate-950" />
                      <span>Popular Choice</span>
                    </span>
                  )}

                  {/* Prep Time Badge */}
                  <span className="absolute bottom-3 right-3 flex items-center space-x-1 bg-slate-900/90 backdrop-blur-md text-slate-300 text-[10px] font-medium px-2 py-1 rounded-md border border-slate-700/50">
                    <Clock className="h-3 w-3 text-amber-500" />
                    <span>{item.prepTime}</span>
                  </span>
                </div>

                {/* Card Info Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    {/* Rating & Calories */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-slate-200 text-xs font-bold font-mono">{item.rating}</span>
                      </div>
                      <span className="text-slate-400 text-[11px] font-mono font-light">{item.calories} kcal</span>
                    </div>

                    {/* Dish Title */}
                    <h3 className="font-serif text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                      {item.name}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-400 text-xs font-light leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    {/* Dietary Tags */}
                    {item.dietary.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.dietary.map((tag) => (
                          <span
                            key={tag}
                            className="bg-slate-900 text-[9px] text-slate-400 capitalize px-2 py-0.5 rounded border border-slate-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Pricing and Action row */}
                  <div className="flex items-center justify-between pt-5 mt-4 border-t border-slate-900">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase tracking-widest">Price</span>
                      <span className="text-lg font-mono font-bold text-amber-400">${item.price.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={(e) => handleQuickAdd(e, item)}
                      className="flex items-center space-x-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl transition-all active:scale-95 cursor-pointer shadow-md shadow-amber-500/5 hover:shadow-amber-500/15"
                      id={`add-btn-${item.id}`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-950/40 border border-slate-800/50 rounded-2xl max-w-xl mx-auto" id="menu-empty-state">
            <Info className="h-10 w-10 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-300 font-medium">No dishes found matching filters.</p>
            <p className="text-slate-500 text-xs mt-1 font-light">Try adjusting your search terms or choosing a different course.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setDietaryFilter('all');
                setSearchQuery('');
              }}
              className="mt-4 inline-flex text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* Gourmet Dish Details Overlay Modal */}
      {selectedDish && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" id="dish-modal">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-scale-up my-auto">
            
            {/* Close Trigger */}
            <button
              onClick={() => setSelectedDish(null)}
              className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-white bg-slate-950/50 hover:bg-slate-950 rounded-full border border-slate-800 transition-colors"
              id="close-dish-modal"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Detailed image banner */}
              <div className="md:col-span-5 h-48 md:h-full relative min-h-[200px]">
                <img
                  src={selectedDish.image}
                  alt={selectedDish.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900 via-transparent to-transparent opacity-90" />
                
                {selectedDish.popular && (
                  <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow">
                    Chef Special
                  </span>
                )}
              </div>

              {/* Informative description */}
              <div className="md:col-span-7 p-6 sm:p-8 space-y-5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest font-mono">
                      {selectedDish.category}
                    </span>
                    <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                      <Clock className="h-3.5 w-3.5 text-amber-500" />
                      <span>{selectedDish.prepTime} Preparation</span>
                    </div>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                    {selectedDish.name}
                  </h3>

                  <div className="flex items-center space-x-4 text-xs font-mono">
                    <div className="flex items-center space-x-1 text-slate-200">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      <span className="font-bold">{selectedDish.rating} / 5</span>
                    </div>
                    <span className="text-slate-600">|</span>
                    <span className="text-slate-400">{selectedDish.calories} Calories</span>
                  </div>

                  <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed pt-2 border-t border-slate-800">
                    {selectedDish.description}
                  </p>

                  {/* Dietary Badge Pill indicators */}
                  {selectedDish.dietary.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-2">
                      {selectedDish.dietary.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center space-x-1 bg-slate-950/80 text-[10px] text-slate-400 px-2.5 py-1 rounded-full border border-slate-800"
                        >
                          {tag === 'vegan' && <Leaf className="h-3 w-3 text-emerald-500" />}
                          {tag === 'vegetarian' && <Leaf className="h-3 w-3 text-green-400" />}
                          {tag === 'spicy' && <Flame className="h-3 w-3 text-rose-500" />}
                          <span className="capitalize">{tag}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Interactive Qty Selection and Purchase row */}
                <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Quantity controls */}
                  <div className="flex items-center space-x-3 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 self-start sm:self-auto">
                    <button
                      onClick={() => setDetailQuantity(Math.max(1, detailQuantity - 1))}
                      className="p-1 text-slate-400 hover:text-white transition-colors"
                      id="modal-qty-minus"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-white text-sm font-bold w-6 text-center font-mono">{detailQuantity}</span>
                    <button
                      onClick={() => setDetailQuantity(detailQuantity + 1)}
                      className="p-1 text-slate-400 hover:text-white transition-colors"
                      id="modal-qty-plus"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Total calculation & CTA */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 flex-1">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-500 block uppercase tracking-widest">Subtotal</span>
                      <span className="text-xl font-mono font-bold text-amber-400">
                        ${(selectedDish.price * detailQuantity).toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={handleModalAdd}
                      className="flex-1 sm:flex-initial bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                      id="modal-add-btn"
                    >
                      Add to Bill
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
