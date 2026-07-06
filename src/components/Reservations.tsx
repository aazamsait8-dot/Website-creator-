import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, CheckCircle, X, MapPin, Trash2, AlertCircle, Sparkles } from 'lucide-react';
import { Reservation } from '../types';
import { RESTAURANT_INFO } from '../data';

interface ReservationsProps {
  isModal?: boolean;
  onCloseModal?: () => void;
}

export default function Reservations({ isModal = false, onCloseModal }: ReservationsProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [seating, setSeating] = useState<'dining' | 'bar' | 'patio'>('dining');
  const [notes, setNotes] = useState('');
  
  // Bookings list state
  const [bookings, setBookings] = useState<Reservation[]>([]);
  const [confirmedBooking, setConfirmedBooking] = useState<Reservation | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Load existing bookings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ambroisie_reservations');
    if (saved) {
      try {
        setBookings(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse bookings", err);
      }
    }
  }, []);

  // Prevent past date selection
  const minDateStr = useMemo(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const timeSlots = [
    '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'
  ];

  function useMemo<T>(factory: () => T, deps: any[]): T {
    return React.useMemo(factory, deps);
  }

  const handleBookTable = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !email.trim() || !phone.trim() || !date || !time) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    const newBooking: Reservation = {
      id: "RES-" + Math.floor(1000 + Math.random() * 9000),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      date,
      time,
      guests,
      seating,
      notes: notes.trim(),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    localStorage.setItem('ambroisie_reservations', JSON.stringify(updatedBookings));

    setConfirmedBooking(newBooking);

    // Reset fields
    setName('');
    setEmail('');
    setPhone('');
    setDate('');
    setTime('');
    setGuests(2);
    setSeating('dining');
    setNotes('');
  };

  const handleCancelBooking = (id: string) => {
    const updated = bookings.filter(b => b.id !== id);
    setBookings(updated);
    localStorage.setItem('ambroisie_reservations', JSON.stringify(updated));
  };

  const seatingLabels = {
    dining: 'Main Dining Room',
    bar: 'Classic Lounge & Bar',
    patio: 'Cozy Fireside Patio'
  };

  const formContent = (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="reservation-grid-container">
      {/* Form Card */}
      <div className={`${isModal ? 'lg:col-span-12' : 'lg:col-span-7'} bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6`}>
        <div className="flex items-center space-x-2 text-amber-500">
          <Sparkles className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-wider font-mono">Guaranteed Placement</span>
        </div>
        
        <div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">Select Date & Atmosphere</h3>
          <p className="text-xs text-slate-400 mt-1">Book private cubbyholes, outdoor patio space, or bar tables.</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleBookTable} className="space-y-4" id="table-booking-form">
          {/* Guest Party & Seating preference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1.5">
                Number of Guests
              </label>
              <div className="relative">
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <select
                  required
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                  <option value={12}>Large Party (9 - 12 Guests)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1.5">
                Atmosphere & Seating
              </label>
              <select
                value={seating}
                onChange={(e) => setSeating(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="dining">Main Dining Room (Standard)</option>
                <option value="patio">Cozy Fireside Patio (Outdoor)</option>
                <option value="bar">Classic Lounge & Bar (Stools)</option>
              </select>
            </div>
          </div>

          {/* Date & Time selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1.5">
                Select Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="date"
                  required
                  min={minDateStr}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1.5">
                Available Time Slots
              </label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <select
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="">Choose slot...</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Customer Personal Details */}
          <div className="space-y-4 pt-3 border-t border-slate-800/60">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Thomas Jefferson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jefferson@republican.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. (212) 555-0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1.5">
                Special Requests / Dietary Restrictions
              </label>
              <textarea
                placeholder="e.g. Wheelchair access, high chair for kids, celebrating anniversary, peanut allergy..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 resize-none font-light"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3.5 rounded-xl text-xs sm:text-sm tracking-wide transition-all shadow-md active:scale-95 cursor-pointer mt-4"
            id="book-submit-btn"
          >
            Confirm Reservation Spot
          </button>
        </form>
      </div>

      {/* Bookings History list */}
      {!isModal && (
        <div className="lg:col-span-5 space-y-6" id="reservation-history-column">
          <div className="bg-slate-950/40 border border-slate-800 p-6 rounded-2xl shadow-md">
            <h4 className="font-serif text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <span className="text-amber-500">◆</span>
              <span>Your Bookings</span>
            </h4>

            {bookings.length === 0 ? (
              <div className="text-center py-10" id="bookings-history-empty">
                <Calendar className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400 text-xs font-light">No reservations made yet.</p>
                <p className="text-slate-500 text-[10px] mt-1">Bookings made in this browser session appear here.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[440px] overflow-y-auto pr-1" id="bookings-history-list">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 space-y-3.5 relative hover:border-slate-750 transition-colors"
                    id={`booking-row-${b.id}`}
                  >
                    <button
                      onClick={() => handleCancelBooking(b.id)}
                      className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 transition-colors p-1"
                      title="Cancel Booking"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="flex items-center space-x-2 text-xs font-mono font-medium text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded-md w-fit">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{b.id} CONFIRMED</span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <p className="text-slate-300 font-medium">Name: <span className="text-white">{b.name}</span></p>
                      <p className="text-slate-300">Party Size: <span className="text-white font-semibold">{b.guests} Guests</span></p>
                      <p className="text-slate-300">Section: <span className="text-white font-mono">{seatingLabels[b.seating]}</span></p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Date: <span className="text-slate-200">{b.date}</span></span>
                      <span>Time: <span className="text-slate-200">{b.time}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-start space-x-3 text-xs text-slate-400 leading-relaxed">
            <MapPin className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-white mb-1">Arrival Instructions</h5>
              <p className="font-light">
                Please arrive 5-10 minutes early. We hold reserved tables for up to 15 minutes after the booking time before releasing them. If you need to modify your party size, call us directly at {RESTAURANT_INFO.phone}.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Dynamic Success dialog overlay */}
      {confirmedBooking && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-6 text-center animate-scale-up">
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 text-emerald-400">
              <CheckCircle className="h-7 w-7" />
            </div>
            
            <div>
              <h3 className="font-serif text-2xl font-bold text-white">Table Reserved!</h3>
              <p className="text-xs text-slate-400 mt-1">We are excited to host you at {RESTAURANT_INFO.name}.</p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-left space-y-3 font-mono text-xs text-slate-300">
              <div className="flex justify-between border-b border-slate-850 pb-2">
                <span>Confirmation ID</span>
                <span className="text-amber-400 font-bold">{confirmedBooking.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Guest Count</span>
                <span className="text-white font-bold">{confirmedBooking.guests} People</span>
              </div>
              <div className="flex justify-between">
                <span>Seating Area</span>
                <span className="text-white capitalize">{confirmedBooking.seating}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-850">
                <span>Date</span>
                <span className="text-white font-medium">{confirmedBooking.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Time Slot</span>
                <span className="text-white font-medium">{confirmedBooking.time}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed font-light">
              A reservation confirmation receipt has been simulated. You can view or cancel this active booking in the "Your Bookings" side drawer on the reservations section.
            </p>

            <button
              onClick={() => {
                setConfirmedBooking(null);
                if (isModal && onCloseModal) onCloseModal();
              }}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3.5 rounded-xl text-sm transition-all active:scale-95 cursor-pointer"
              id="confirm-modal-ok-btn"
            >
              Excellent, Thank You!
            </button>
          </div>
        </div>
      )}

      {/* Display as Inline Section or Modal */}
      {isModal ? (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-850 rounded-3xl max-w-xl w-full p-1 shadow-2xl relative my-auto">
            {/* Close */}
            <button
              onClick={onCloseModal}
              className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-white bg-slate-950/50 hover:bg-slate-950 rounded-full border border-slate-800"
              id="close-reservations-modal"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="p-4 max-h-[90vh] overflow-y-auto">
              {formContent}
            </div>
          </div>
        </div>
      ) : (
        <section id="reservations" className="py-24 bg-slate-950 border-t border-slate-900 relative scroll-mt-12">
          {/* Orbs */}
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-500/5 rounded-full filter blur-3xl -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Title */}
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4" id="reservations-title-block">
              <span className="text-amber-500 text-xs font-bold tracking-widest uppercase block">Reserve Your Experience</span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                Table Reservations
              </h2>
              <div className="h-0.5 w-16 bg-amber-500 mx-auto rounded-full mt-4" />
              <p className="text-slate-400 text-sm sm:text-base font-light leading-relaxed">
                Experience unparalleled hospitality. Choose your preferred atmosphere, date, and party size to secure your spot today. For corporate bookings larger than 12 guests, contact us at {RESTAURANT_INFO.email}.
              </p>
            </div>

            {formContent}
          </div>
        </section>
      )}
    </>
  );
}
