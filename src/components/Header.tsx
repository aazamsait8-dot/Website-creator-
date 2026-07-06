import React, { useState, useEffect } from 'react';
import { ShoppingBag, Calendar, Menu as MenuIcon, X, Clock, ChefHat } from 'lucide-react';
import { RESTAURANT_INFO } from '../data';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenBookModal: () => void;
}

export default function Header({
  cartCount,
  onOpenCart,
  activeSection,
  onNavigate,
  onOpenBookModal,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check if open (11:30 AM to 10:00 PM for simplicity)
    const checkOpenStatus = () => {
      const now = new Date();
      const currentHour = now.getHours() + now.getMinutes() / 60;
      const isOpenTime = currentHour >= RESTAURANT_INFO.openingHourNum && currentHour < RESTAURANT_INFO.closingHourNum;
      setIsShopOpen(isOpenTime);
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: 'Menu', id: 'menu' },
    { label: 'Reservations', id: 'reservations' },
    { label: 'Reviews', id: 'reviews' },
    { label: 'Find Us', id: 'footer' },
  ];

  const handleLinkClick = (id: string) => {
    setIsOpen(false);
    onNavigate(id);
  };

  return (
    <header
      id="app-header"
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-lg py-3'
          : 'bg-gradient-to-b from-slate-950/80 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => onNavigate('hero')} 
          className="flex items-center space-x-2 cursor-pointer group"
          id="header-logo"
        >
          <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/30 group-hover:bg-amber-500/20 transition-all">
            <ChefHat className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-white block">
              {RESTAURANT_INFO.name}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-amber-500 block">
              Modern Bistro
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8" id="desktop-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleLinkClick(item.id)}
              className={`text-sm font-medium tracking-wide transition-colors relative py-1 hover:text-amber-400 ${
                activeSection === item.id ? 'text-amber-400' : 'text-slate-300'
              }`}
              id={`nav-${item.id}`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4" id="header-actions">
          {/* Opening Indicator */}
          <div className="hidden lg:flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700">
            <span className={`h-2 w-2 rounded-full ${isShopOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-slate-300 font-medium font-mono text-[11px]">
              {isShopOpen ? 'OPEN NOW' : 'CLOSED'}
            </span>
          </div>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 text-slate-300 hover:text-amber-400 transition-colors bg-slate-800/50 hover:bg-slate-800 rounded-full border border-slate-700/50"
            aria-label="Shopping Cart"
            id="cart-trigger-btn"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-slate-950 animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Reserve Quick Button */}
          <button
            onClick={onOpenBookModal}
            className="hidden sm:flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-95 cursor-pointer"
            id="quick-book-btn"
          >
            <Calendar className="h-4 w-4" />
            <span>Book Table</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-amber-400 transition-colors"
            id="mobile-menu-toggle"
          >
            {isOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-slate-950/98 backdrop-blur-md z-30 flex flex-col justify-between py-8 px-6 border-t border-slate-800 animate-fade-in" id="mobile-nav-drawer">
          <div className="space-y-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className={`block w-full text-left text-lg font-medium py-2 border-b border-slate-800/50 hover:text-amber-400 transition-colors ${
                  activeSection === item.id ? 'text-amber-400' : 'text-slate-300'
                }`}
                id={`mobile-nav-${item.id}`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenBookModal();
              }}
              className="w-full flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-600 text-slate-950 py-3 rounded-xl font-semibold transition-all mt-4"
              id="mobile-nav-book-btn"
            >
              <Calendar className="h-5 w-5" />
              <span>Book a Table</span>
            </button>
          </div>

          <div className="border-t border-slate-800/80 pt-6 space-y-3">
            <div className="flex items-center justify-center space-x-2 text-xs text-slate-400 font-mono">
              <Clock className="h-4 w-4 text-amber-500" />
              <span>Weekday: {RESTAURANT_INFO.hours.weekday}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-xs text-slate-400 font-mono">
              <Clock className="h-4 w-4 text-amber-500" />
              <span>Weekend: {RESTAURANT_INFO.hours.weekend}</span>
            </div>
            <p className="text-center text-[11px] text-slate-500 uppercase tracking-widest mt-2">
              {RESTAURANT_INFO.hours.days}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
