import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuItem, CartItem } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import Menu from './components/Menu';
import Reservations from './components/Reservations';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import Cart from './components/Cart';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Sync scroll position with active header link using Intersection Observer
  useEffect(() => {
    const sections = ['hero', 'menu', 'reservations', 'reviews', 'footer'];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.15, rootMargin: '-10% 0px -60% 0px' }
      );
      
      observer.observe(el);
      return { el, observer };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) {
          obs.observer.unobserve(obs.el);
        }
      });
    };
  }, []);

  // Cart operations
  const handleAddToCart = (menuItem: MenuItem, quantity: number) => {
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex((item) => item.menuItem.id === menuItem.id);
      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { menuItem, quantity }];
      }
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.menuItem.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.menuItem.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartItems = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-300 antialiased selection:bg-amber-500 selection:text-slate-950" id="restaurant-portal-app">
      {/* Navigation Header */}
      <Header
        cartCount={totalCartItems}
        onOpenCart={() => setIsCartOpen(true)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenBookModal={() => setIsBookModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        {/* Hero Section */}
        <Hero
          onExploreMenu={() => handleNavigate('menu')}
          onOpenBookModal={() => setIsBookModalOpen(true)}
        />

        {/* Interactive Menu Section */}
        <Menu onAddToCart={handleAddToCart} />

        {/* Table Booking Reservations Section */}
        <Reservations />

        {/* Reviews Testimonial Section */}
        <Reviews />
      </main>

      {/* Contact & Location Footer */}
      <Footer />

      {/* Slideout Shopping Cart Drawer with Motion Transition */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50"
            id="motion-cart-portal"
          >
            <Cart
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
              cartItems={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveCartItem}
              onClearCart={handleClearCart}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reservation Quick Booking Modal Overlay with Motion Animation */}
      <AnimatePresence>
        {isBookModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
            id="motion-reservations-portal"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-xl"
            >
              <Reservations
                isModal={true}
                onCloseModal={() => setIsBookModalOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
