import React, { useState, useEffect } from 'react';
import { ChefHat, ArrowRight, Clock, MapPin, Sparkles, Star } from 'lucide-react';
import { RESTAURANT_INFO } from '../data';

interface HeroProps {
  onExploreMenu: () => void;
  onOpenBookModal: () => void;
}

export default function Hero({ onExploreMenu, onOpenBookModal }: HeroProps) {
  const [isOpenNow, setIsOpenNow] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  useEffect(() => {
    const updateTimeAndStatus = () => {
      const now = new Date();
      // Format time
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setCurrentTimeStr(timeStr);

      // Check open status (11:30 AM = 11.5 to 10:00 PM = 22.0)
      const currentHour = now.getHours() + now.getMinutes() / 60;
      const isOpen = currentHour >= RESTAURANT_INFO.openingHourNum && currentHour < RESTAURANT_INFO.closingHourNum;
      setIsOpenNow(isOpen);
    };

    updateTimeAndStatus();
    const interval = setInterval(updateTimeAndStatus, 30000); // update every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-slate-950 text-white pt-24 pb-16 overflow-hidden"
    >
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&auto=format&fit=crop&q=80"
          alt="Restaurant Ambiance"
          className="w-full h-full object-cover opacity-35 scale-105 animate-[zoom_60s_infinite_alternate]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
      </div>

      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full filter blur-3xl -z-10" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-3xl -z-10" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left" id="hero-copy">
            {/* Tag / Welcome Badge */}
            <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-amber-400 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Michelin-Inspired Chef Recipes</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              Culinary Art <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                Crafted With Passion
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-slate-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              Welcome to <span className="font-medium text-white">{RESTAURANT_INFO.name}</span>. Experience a delicate symphony of contemporary flavors, pristine locally-sourced ingredients, and a warm, inviting dining lounge.
            </p>

            {/* Key Advantages */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left max-w-lg mx-auto lg:mx-0" id="hero-perks">
              <div className="flex items-start space-x-2.5">
                <div className="h-5 w-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">100% Fresh</h4>
                  <p className="text-slate-400 text-[11px]">Organic & farm-sourced</p>
                </div>
              </div>
              <div className="flex items-start space-x-2.5">
                <div className="h-5 w-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Gourmet Chef</h4>
                  <p className="text-slate-400 text-[11px]">3 Michelin Star background</p>
                </div>
              </div>
              <div className="flex items-start space-x-2.5">
                <div className="h-5 w-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Fine Ambience</h4>
                  <p className="text-slate-400 text-[11px]">Indoor & patio lounge</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4" id="hero-ctas">
              <button
                onClick={onExploreMenu}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-8 py-3.5 rounded-full font-bold tracking-wide transition-all shadow-lg shadow-amber-500/15 cursor-pointer hover:shadow-amber-500/25 active:scale-98"
                id="hero-explore-btn"
              >
                <span>Explore Our Menu</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={onOpenBookModal}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-850 text-white border border-slate-700 hover:border-slate-600 px-8 py-3.5 rounded-full font-semibold tracking-wide transition-all cursor-pointer active:scale-98"
                id="hero-reserve-btn"
              >
                <span>Reserve a Table</span>
              </button>
            </div>
          </div>

          {/* Right Side: Interactive Live Status Card */}
          <div className="lg:col-span-5 flex justify-center" id="hero-status-panel">
            <div className="w-full max-w-sm bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full filter blur-xl" />
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-slate-400 text-xs font-mono uppercase tracking-widest">Live Status</span>
                <span className="text-slate-400 text-[11px] font-mono">{currentTimeStr}</span>
              </div>

              {/* Opened/Closed Large Indicator */}
              <div className="flex items-center space-x-4 mb-6">
                <div className={`p-3 rounded-xl border ${
                  isOpenNow 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}>
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className={`text-xl font-bold tracking-tight ${isOpenNow ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isOpenNow ? 'We are Open!' : 'We are Closed'}
                    </h3>
                    <span className={`h-2.5 w-2.5 rounded-full ${isOpenNow ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                  </div>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {isOpenNow ? 'Ready to serve you hot meals' : 'Opens daily at 11:30 AM'}
                  </p>
                </div>
              </div>

              {/* Operating Hours List */}
              <div className="space-y-3.5 border-t border-slate-800/80 pt-5">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <span className="h-1.5 w-1.5 bg-amber-500 rounded-full" />
                    <span>Weekdays (Mon - Fri)</span>
                  </div>
                  <span className="text-slate-200 font-mono font-medium">{RESTAURANT_INFO.hours.weekday}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <span className="h-1.5 w-1.5 bg-amber-500 rounded-full" />
                    <span>Weekends (Sat - Sun)</span>
                  </div>
                  <span className="text-slate-200 font-mono font-medium">{RESTAURANT_INFO.hours.weekend}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <span className="h-1.5 w-1.5 bg-amber-500 rounded-full" />
                    <span>Contact Line</span>
                  </div>
                  <span className="text-amber-400 font-mono font-medium">{RESTAURANT_INFO.phone}</span>
                </div>
              </div>

              {/* Quick Address Short link */}
              <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-start space-x-2 text-[11px] text-slate-400">
                <MapPin className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-light">{RESTAURANT_INFO.address}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
