import React, { useState, useEffect, useMemo } from 'react';
import { Star, MessageSquare, Check, User, Calendar, Plus, X } from 'lucide-react';
import { Review } from '../types';
import { INITIAL_REVIEWS, MENU_ITEMS } from '../data';

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // New review form fields
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [dishName, setDishName] = useState('');
  
  const [successMsg, setSuccessMsg] = useState(false);

  // Load reviews from localStorage + INITIAL_REVIEWS on mount
  useEffect(() => {
    const saved = localStorage.getItem('ambroisie_reviews');
    if (saved) {
      try {
        setReviews(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse reviews", err);
        setReviews(INITIAL_REVIEWS);
      }
    } else {
      setReviews(INITIAL_REVIEWS);
      localStorage.setItem('ambroisie_reviews', JSON.stringify(INITIAL_REVIEWS));
    }
  }, []);

  // Compute stats in real-time
  const stats = useMemo(() => {
    if (reviews.length === 0) return { avg: 5.0, total: 0, breakdown: [0, 0, 0, 0, 0] };
    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = parseFloat((sum / total).toFixed(1));
    
    // Breakdown for 1-5 stars
    const counts = [0, 0, 0, 0, 0]; // 5, 4, 3, 2, 1
    reviews.forEach((r) => {
      const idx = 5 - r.rating;
      if (idx >= 0 && idx < 5) {
        counts[idx]++;
      }
    });

    const breakdown = counts.map((count) => Math.round((count / total) * 100));
    return { avg, total, breakdown };
  }, [reviews]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    const newReview: Review = {
      id: "REV-" + Math.floor(1000 + Math.random() * 9000),
      author: author.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toISOString().split('T')[0],
      dishName: dishName || undefined,
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem('ambroisie_reviews', JSON.stringify(updated));

    // Reset Form
    setAuthor('');
    setRating(5);
    setComment('');
    setDishName('');
    setShowForm(false);
    
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
    }, 3000);
  };

  return (
    <section id="reviews" className="py-24 bg-slate-900 border-t border-slate-800 relative scroll-mt-12">
      {/* Decors */}
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-amber-500/5 rounded-full filter blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4" id="reviews-title-block">
          <span className="text-amber-500 text-xs font-bold tracking-widest uppercase block">Guest Feedback</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Loved By Culinary Enthusiasts
          </h2>
          <div className="h-0.5 w-16 bg-amber-500 mx-auto rounded-full mt-4" />
          <p className="text-slate-400 text-sm sm:text-base font-light leading-relaxed">
            Read reviews from verified gourmet diners, or leave your own notes on how we can continue providing the absolute finest dining experience.
          </p>
        </div>

        {/* Dashboard Stat Summary & Action trigger */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-950/60 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-12" id="reviews-summary-dashboard">
          {/* Average Stars Column */}
          <div className="lg:col-span-4 text-center border-b lg:border-b-0 lg:border-r border-slate-800 pb-6 lg:pb-0 lg:pr-8">
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest font-mono">Overall Rating</h4>
            <div className="flex items-baseline justify-center space-x-2 mt-3">
              <span className="text-5xl font-serif font-bold text-white font-mono">{stats.avg}</span>
              <span className="text-slate-500 text-sm">/ 5.0</span>
            </div>
            <div className="flex justify-center space-x-1 mt-2.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4.5 w-4.5 ${
                    star <= Math.round(stats.avg) ? 'text-amber-500 fill-amber-500' : 'text-slate-700'
                  }`}
                />
              ))}
            </div>
            <p className="text-slate-500 text-xs mt-3 font-light font-mono">Based on {stats.total} verified reviews</p>
          </div>

          {/* Breakdown bars column */}
          <div className="lg:col-span-5 space-y-2 px-0 sm:px-6">
            {[5, 4, 3, 2, 1].map((stars, index) => (
              <div key={stars} className="flex items-center text-xs text-slate-400">
                <span className="w-12 font-mono">{stars} Stars</span>
                <div className="flex-1 h-2 bg-slate-900 rounded-full mx-3 overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${stats.breakdown[index]}%` }}
                  />
                </div>
                <span className="w-8 text-right font-mono text-slate-500">{stats.breakdown[index]}%</span>
              </div>
            ))}
          </div>

          {/* Trigger column */}
          <div className="lg:col-span-3 text-center lg:text-right">
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm tracking-wide transition-all shadow-md active:scale-95 cursor-pointer"
              id="write-review-btn"
            >
              <Plus className="h-4.5 w-4.5" />
              <span>Write a Review</span>
            </button>
            {successMsg && (
              <div className="mt-3 text-xs text-emerald-400 flex items-center justify-center lg:justify-end gap-1 font-mono">
                <Check className="h-4 w-4 shrink-0" />
                <span>Review submitted!</span>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Review Submission Form */}
        {showForm && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 mb-12 shadow-2xl animate-scale-up" id="review-submission-form-card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-amber-500" />
                <span>Tell Us About Your Dining Experience</span>
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 text-slate-500 hover:text-white rounded-lg transition-colors hover:bg-slate-900"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4" id="new-review-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Martha Washington"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1.5">
                    Which Dish Did You Order? (Optional)
                  </label>
                  <select
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Choose item...</option>
                    {MENU_ITEMS.map((item) => (
                      <option key={item.id} value={item.name}>{item.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic Interactive Star selection */}
              <div>
                <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1.5">
                  Rating Selection
                </label>
                <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 w-fit px-4 py-2 rounded-xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none group active:scale-90 transition-transform"
                      id={`star-selector-${star}`}
                    >
                      <Star
                        className={`h-6 w-6 transition-colors ${
                          star <= rating 
                            ? 'text-amber-500 fill-amber-500' 
                            : 'text-slate-700 group-hover:text-slate-500'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-slate-400 text-xs font-bold font-mono ml-3">
                    {rating === 5 ? 'Excellent!' : rating === 4 ? 'Very Good' : rating === 3 ? 'Good / Average' : rating === 2 ? 'Disappointing' : 'Poor'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1.5">
                  Your Review Comments *
                </label>
                <textarea
                  required
                  placeholder="Share details of your dish taste, spacing, service wait time, and recommendations..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 resize-none font-light"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm tracking-wide transition-all active:scale-95 cursor-pointer"
                  id="submit-review-form-btn"
                >
                  Post Review Ticket
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews Feed Stream */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" id="reviews-feed-grid">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-slate-950 border border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-700/80 transition-colors"
              id={`review-card-${rev.id}`}
            >
              <div className="space-y-3">
                {/* Rating star line */}
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-3.5 w-3.5 ${
                        s <= rev.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-800'
                      }`}
                    />
                  ))}
                </div>

                {/* Comment text */}
                <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author, reviewed dish details */}
              <div className="pt-4 border-t border-slate-900/80 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white leading-none">{rev.author}</h5>
                    {rev.dishName && (
                      <span className="text-[10px] text-amber-500 mt-0.5 block truncate max-w-[140px]" title={rev.dishName}>
                        Tried: {rev.dishName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-[10px] text-slate-500 font-mono">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{rev.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
