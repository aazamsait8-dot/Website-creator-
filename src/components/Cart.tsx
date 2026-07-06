import React, { useState } from 'react';
import { X, Minus, Plus, Trash2, Clock, CreditCard, CheckCircle, Utensils, Receipt, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

type OrderMode = 'dine-in' | 'takeaway';

export default function Cart({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartProps) {
  const [orderMode, setOrderMode] = useState<OrderMode>('dine-in');
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [kitchenNotes, setKitchenNotes] = useState('');
  
  // Checkout sequence state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<{
    orderId: string;
    items: CartItem[];
    subtotal: number;
    total: number;
    mode: OrderMode;
    details: string;
    prepTime: string;
  } | null>(null);

  if (!isOpen) return null;

  // Financial calculations
  const subtotal = cartItems.reduce((acc, curr) => acc + curr.menuItem.price * curr.quantity, 0);
  const taxRate = 0.0825; // 8.25%
  const tax = subtotal * taxRate;
  const serviceCharge = subtotal > 0 ? (orderMode === 'dine-in' ? 3.50 : 1.50) : 0;
  const total = subtotal + tax + serviceCharge;

  const totalItemCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  // Form Validations
  const isFormValid = () => {
    if (cartItems.length === 0) return false;
    if (!customerName.trim()) return false;
    if (orderMode === 'dine-in' && !tableNumber) return false;
    if (orderMode === 'takeaway' && !pickupTime) return false;
    return true;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsSubmitting(true);

    // Simulate server processing
    setTimeout(() => {
      const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
      const details = orderMode === 'dine-in' ? `Table ${tableNumber}` : `Pickup at ${pickupTime}`;
      
      // Calculate max prep time from selected items
      const maxPrepVal = cartItems.reduce((max, item) => {
        const minStr = item.menuItem.prepTime.replace(' min', '');
        const val = parseInt(minStr, 10) || 10;
        return val > max ? val : max;
      }, 10);

      setPlacedOrder({
        orderId,
        items: [...cartItems],
        subtotal,
        total,
        mode: orderMode,
        details,
        prepTime: `${maxPrepVal + 5} min`,
      });

      setIsSubmitting(false);
      onClearCart();
    }, 1500);
  };

  const resetOrderState = () => {
    setPlacedOrder(null);
    setTableNumber('');
    setCustomerName('');
    setPickupTime('');
    setKitchenNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-container">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
      />

      {/* Slide Drawer panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 text-white shadow-2xl flex flex-col border-l border-slate-800 animate-slide-left relative">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Receipt className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-serif font-bold">Your Order Bill</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-slate-400 hover:text-white rounded-lg transition-colors hover:bg-slate-800"
              id="close-cart-btn"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {placedOrder ? (
            /* --- SUCCESS CONFIRMATION RECEIPT SCREEN --- */
            <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-between" id="receipt-screen">
              <div className="space-y-6 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 text-emerald-400">
                  <CheckCircle className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">Order Sent to Kitchen!</h3>
                  <p className="text-xs text-slate-400 mt-1">Our chefs have received your tickets.</p>
                </div>

                {/* Ticket Details */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-left space-y-4">
                  <div className="flex justify-between items-center text-xs text-slate-400 font-mono pb-3 border-b border-slate-800/80">
                    <span>Ticket: <span className="text-slate-200 font-bold">{placedOrder.orderId}</span></span>
                    <span>{placedOrder.mode === 'dine-in' ? 'Dine-In' : 'Takeaway'}</span>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {placedOrder.items.map((item) => (
                      <div key={item.menuItem.id} className="flex justify-between text-xs font-mono">
                        <span className="text-slate-300">
                          {item.quantity}x <span className="text-white">{item.menuItem.name}</span>
                        </span>
                        <span className="text-slate-300">${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Summary math */}
                  <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Kitchen Service Loc</span>
                      <span className="text-white">{placedOrder.details}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Est. Prep Time</span>
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {placedOrder.prepTime}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-200 font-bold pt-1.5 border-t border-dashed border-slate-800">
                      <span>Total Paid</span>
                      <span className="text-amber-400">${placedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl text-left flex items-start space-x-2.5">
                  <Utensils className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {placedOrder.mode === 'dine-in' 
                      ? "Please stay seated. A service waiter will bring the dishes to your table as soon as they are freshly prepared." 
                      : "We will prepare your dishes shortly. Please arrive at our pickup counter in the front lobby at your designated pickup time."}
                  </p>
                </div>
              </div>

              <button
                onClick={resetOrderState}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3.5 rounded-xl text-sm transition-all mt-8 active:scale-95 cursor-pointer"
                id="receipt-done-btn"
              >
                Done & Close
              </button>
            </div>
          ) : (
            /* --- ACTIVE ORDER / CART STREAM --- */
            <>
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                
                {cartItems.length === 0 ? (
                  /* Empty state */
                  <div className="h-96 flex flex-col items-center justify-center text-center space-y-4" id="cart-empty">
                    <div className="h-14 w-14 rounded-full bg-slate-950/80 flex items-center justify-center text-slate-500 border border-slate-800">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-300">Your cart is empty</p>
                      <p className="text-slate-500 text-xs mt-1 font-light max-w-[240px] mx-auto">
                        Add items from our premium digital menu to get started.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Item Stream List */
                  <div className="space-y-4" id="cart-items-list">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                      Your Selected Items ({totalItemCount})
                    </p>
                    {cartItems.map((item) => (
                      <div
                        key={item.menuItem.id}
                        className="flex items-center space-x-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80"
                        id={`cart-item-row-${item.menuItem.id}`}
                      >
                        {/* Compact thumbnail */}
                        <img
                          src={item.menuItem.image}
                          alt={item.menuItem.name}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-800 shrink-0"
                        />
                        
                        {/* Info details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-white truncate">{item.menuItem.name}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">${item.menuItem.price.toFixed(2)} each</span>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg">
                            <button
                              onClick={() => onUpdateQuantity(item.menuItem.id, Math.max(1, item.quantity - 1))}
                              className="text-slate-400 hover:text-white"
                              id={`cart-minus-${item.menuItem.id}`}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-white text-[11px] font-bold font-mono w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.menuItem.id, item.quantity + 1)}
                              className="text-slate-400 hover:text-white"
                              id={`cart-plus-${item.menuItem.id}`}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => onRemoveItem(item.menuItem.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                            title="Remove"
                            id={`cart-remove-${item.menuItem.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Service Details Form */}
                {cartItems.length > 0 && (
                  <form onSubmit={handlePlaceOrder} className="border-t border-slate-800/80 pt-5 space-y-4" id="cart-checkout-form">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                      Service & Ordering Details
                    </p>

                    {/* Dining Mode selector tabs */}
                    <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-xl border border-slate-850">
                      <button
                        type="button"
                        onClick={() => setOrderMode('dine-in')}
                        className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                          orderMode === 'dine-in'
                            ? 'bg-slate-800 text-amber-400 font-bold border border-slate-700/50'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Table Service
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderMode('takeaway')}
                        className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                          orderMode === 'takeaway'
                            ? 'bg-slate-800 text-amber-400 font-bold border border-slate-700/50'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Quick Takeaway
                      </button>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Alexander Hamilton"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-amber-500 text-slate-200"
                          id="customer-name-input"
                        />
                      </div>

                      {orderMode === 'dine-in' ? (
                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">
                            Your Table Number *
                          </label>
                          <select
                            required
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-amber-500 text-slate-200"
                            id="table-select"
                          >
                            <option value="">Select table number...</option>
                            <option value="1">Table 1 - Front window</option>
                            <option value="2">Table 2 - Lounge sofa</option>
                            <option value="3">Table 3 - Fireplace</option>
                            <option value="4">Table 4 - Cozy Booth</option>
                            <option value="5">Table 5 - Outdoor patio</option>
                            <option value="6">Table 6 - Outdoor patio</option>
                            <option value="Bar-A">Bar stool A</option>
                            <option value="Bar-B">Bar stool B</option>
                          </select>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">
                            Estimated Pickup Time *
                          </label>
                          <select
                            required
                            value={pickupTime}
                            onChange={(e) => setPickupTime(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-amber-500 text-slate-200"
                            id="pickup-time-select"
                          >
                            <option value="">Select pickup slot...</option>
                            <option value="In 15 mins">As soon as possible (In 15 mins)</option>
                            <option value="In 30 mins">In 30 minutes</option>
                            <option value="In 45 mins">In 45 minutes</option>
                            <option value="In 1 hour">In 1 hour</option>
                            <option value="Later (See Notes)">Later (Specify in kitchen notes)</option>
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">
                          Special Chef Notes (Allergies, extra seasoning, etc.)
                        </label>
                        <textarea
                          placeholder="e.g. Gluten allergy, make steak medium, extra napkins."
                          value={kitchenNotes}
                          onChange={(e) => setKitchenNotes(e.target.value)}
                          rows={2}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-amber-500 text-slate-200 resize-none"
                          id="chef-notes-textarea"
                        />
                      </div>
                    </div>
                  </form>
                )}
              </div>

              {/* Financial calculations and submission trigger */}
              {cartItems.length > 0 && (
                <div className="bg-slate-950/80 border-t border-slate-800 p-6 space-y-4">
                  {/* Itemized math */}
                  <div className="space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Items Subtotal</span>
                      <span className="text-slate-200">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Sales Tax (8.25%)</span>
                      <span className="text-slate-200">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>{orderMode === 'dine-in' ? 'Table Service' : 'Pickup Setup'} Charge</span>
                      <span className="text-slate-200">${serviceCharge.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-white font-bold pt-2 border-t border-slate-800/80">
                      <span>Grand Total</span>
                      <span className="text-amber-400 font-mono text-base">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Submission triggers */}
                  <div className="pt-2">
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting || !isFormValid()}
                      className={`w-full font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center space-x-2 shadow-lg cursor-pointer ${
                        isFormValid() && !isSubmitting
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/5 hover:shadow-amber-500/15 active:scale-98'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
                      }`}
                      id="place-order-submit-btn"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Sending to Kitchen...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4.5 w-4.5" />
                          <span>Place & Ticket Order</span>
                        </>
                      )}
                    </button>
                    {!customerName.trim() && (
                      <p className="text-[10px] text-center text-rose-400 mt-2 font-mono">
                        * Please type your name to authorize kitchen tickets.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
