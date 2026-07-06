import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Check, Sparkles, ChefHat } from 'lucide-react';
import { RESTAURANT_INFO } from '../data';

export default function Footer() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !msg.trim()) return;

    setIsSending(true);

    // Simulate sending contact email
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      setName('');
      setEmail('');
      setMsg('');

      setTimeout(() => {
        setSentSuccess(false);
      }, 3000);
    }, 1200);
  };

  return (
    <footer id="footer" className="bg-slate-950 text-slate-300 border-t border-slate-900 pt-24 pb-12 relative overflow-hidden scroll-mt-12">
      
      {/* Decorative Orbs */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full filter blur-3xl -z-10" />
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/5 rounded-full filter blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-slate-900">
          
          {/* Column 1: Restaurant Info & Brand */}
          <div className="lg:col-span-4 space-y-6" id="footer-brand-info">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/30">
                <ChefHat className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-white tracking-wide">
                  {RESTAURANT_INFO.name}
                </h3>
                <span className="text-[10px] uppercase tracking-widest text-amber-500 block">
                  Fine Gastronomy
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 font-light leading-relaxed">
              Experience the pinnacle of culinary art, where traditional techniques meet modern gastronomy. We craft memorable meals and high-end dining moments.
            </p>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-light">{RESTAURANT_INFO.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-amber-500 shrink-0" />
                <span className="font-mono font-medium text-slate-200">{RESTAURANT_INFO.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-amber-500 shrink-0" />
                <span className="font-mono text-slate-400 hover:text-amber-400 transition-colors cursor-pointer">{RESTAURANT_INFO.email}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Blueprint Mock Map */}
          <div className="lg:col-span-4 space-y-4" id="footer-location-map">
            <div>
              <h4 className="font-serif text-lg font-bold text-white flex items-center gap-1.5">
                <span className="text-amber-500">◆</span>
                <span>Our Location</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">Gourmet District Block 482 - Free valet parking available.</p>
            </div>

            {/* City Blueprint map layout */}
            <div className="h-56 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden shadow-inner flex items-center justify-center">
              {/* Styled City Grid lines */}
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-10 pointer-events-none">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="border border-amber-500 border-dashed" />
                ))}
              </div>

              {/* Styled Streets */}
              <div className="absolute w-12 h-full bg-slate-950/80 left-12 border-l border-r border-slate-850/50 flex items-center justify-center">
                <span className="text-[9px] font-mono font-semibold tracking-widest text-slate-700 select-none rotate-90">LEXINGTON AVE</span>
              </div>
              <div className="absolute h-10 w-full bg-slate-950/80 top-1/2 -translate-y-1/2 border-t border-b border-slate-850/50 flex items-center justify-center">
                <span className="text-[9px] font-mono font-semibold tracking-widest text-slate-700 select-none">42ND STREET</span>
              </div>

              {/* Park mock area */}
              <div className="absolute right-4 top-4 w-28 h-20 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center justify-center">
                <span className="text-[9px] font-mono font-medium tracking-wider text-emerald-700/80 uppercase">Central Park</span>
              </div>

              {/* Pinpoint marker for Restaurant */}
              <div className="absolute left-[35%] top-[45%] flex flex-col items-center z-10 animate-bounce">
                <div className="relative">
                  <div className="absolute -inset-1.5 bg-amber-500/30 rounded-full animate-ping" />
                  <div className="h-8 w-8 bg-amber-500 border border-slate-950 rounded-full flex items-center justify-center text-slate-950 shadow-md">
                    <MapPin className="h-4.5 w-4.5" />
                  </div>
                </div>
                <div className="bg-slate-950/95 border border-amber-500/50 text-amber-400 text-[10px] font-bold font-mono px-2 py-1 rounded-md shadow-lg mt-1.5 whitespace-nowrap">
                  L'Ambroisie Bistro
                </div>
              </div>

              {/* Map coordinate tag */}
              <span className="absolute bottom-2 right-3 text-[9px] font-mono text-slate-600">40.7128° N, 74.0060° W</span>
            </div>
          </div>

          {/* Column 3: Styled Contact Feedback Form */}
          <div className="lg:col-span-4 space-y-4" id="footer-feedback-form">
            <div>
              <h4 className="font-serif text-lg font-bold text-white flex items-center gap-1.5">
                <span className="text-amber-500">◆</span>
                <span>Send Us a Line</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">Questions about menu catering or private events?</p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-3" id="footer-contact-form">
              <div className="grid grid-cols-2 gap-2.5">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 text-slate-200 placeholder-slate-500"
                />
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 text-slate-200 placeholder-slate-500"
                />
              </div>

              <textarea
                required
                placeholder="Type your message here..."
                rows={3}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 text-slate-200 placeholder-slate-500 resize-none font-light"
              />

              <button
                type="submit"
                disabled={isSending || sentSuccess}
                className={`w-full font-bold py-2.5 rounded-xl text-xs sm:text-xs tracking-wide transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  sentSuccess
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800 hover:bg-slate-750 text-white border border-slate-700 hover:border-slate-650'
                }`}
                id="contact-submit-btn"
              >
                {isSending ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Sending...</span>
                  </>
                ) : sentSuccess ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Message Sent Successfully!</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Send Message Ticket</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500" id="footer-bottom-row">
          <p>© 2026 L'Ambroisie Bistro. Crafted with Passion. All culinary rights reserved.</p>
          <div className="flex space-x-6">
            <span className="hover:text-amber-500 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-amber-500 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-amber-500 transition-colors cursor-pointer">Catering Licensing</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
