import React, { useState } from 'react';
import { Star, Quote, CheckCircle2, Plus, X } from 'lucide-react';
import { api } from '../lib/api.js';

export default function TestimonialsSection({
  reviews = [],
  products = [],
  onReviewAdded,
  onNotify
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    city: 'Pune',
    rating: 5,
    plantPurchased: products[0]?.name || '4-Plant Self-Watering Combo @ ₹999',
    comment: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerName.trim() || !form.comment.trim()) return;
    setSubmitting(true);
    try {
      const { review } = await api.submitReview(form);
      onReviewAdded(review);
      setModalOpen(false);
      setForm({ ...form, customerName: '', comment: '' });
      onNotify('Thank you! Your verified review is now live 🌿');
    } catch (err) {
      onNotify(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16 lg:py-20 bg-linen-100">
      <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-canopy-600 text-[11px] font-bold tracking-[0.28em] uppercase">
              Verified Plant Parents
            </span>
            <h2 className="font-serif text-[32px] lg:text-[42px] text-canopy-950 font-semibold leading-tight mt-2">
              Reviews From Our Customers
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-brass-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-brass-500" />
                ))}
              </div>
              <span className="text-xs font-semibold text-canopy-800">
                4.9 / 5 Average across 2,847+ Deliveries
              </span>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="self-start sm:self-auto h-10 px-5 rounded-full bg-white hover:bg-canopy-900 hover:text-white border border-canopy-900/15 text-canopy-950 text-xs font-semibold inline-flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Write a Review</span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.slice(0, 4).map((rev, i) => (
            <div
              key={rev.id || i}
              className="bg-white rounded-2xl p-6 shadow-soft border border-canopy-900/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-brass-500">
                    {[...Array(rev.rating || 5)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-brass-500" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-canopy-100" />
                </div>

                <p className="text-[13.5px] leading-relaxed text-canopy-900/85">
                  “{rev.comment}”
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-canopy-900/8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-canopy-900 text-emerald-200 font-serif font-bold text-sm flex items-center justify-center shrink-0">
                  {rev.avatarInitials || 'GP'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-canopy-950 truncate">{rev.customerName}</p>
                  <p className="text-[11px] text-canopy-700/75 flex items-center gap-1 truncate">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{rev.city} • Verified</span>
                  </p>
                  <p className="text-[10.5px] text-canopy-600 font-medium truncate mt-0.5">
                    {rev.plantPurchased}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setModalOpen(false)}
            className="absolute inset-0 bg-canopy-950/60 backdrop-blur-sm"
          />
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-elevated space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl font-semibold text-canopy-950">
                Share Your Greenzo Experience
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-linen-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-canopy-800 mb-1">Your Name</label>
                <input
                  required
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  placeholder="e.g. Rohan Joshi"
                  className="w-full h-10 px-3 rounded-xl border border-canopy-900/15 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-canopy-800 mb-1">City</label>
                <input
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Pune"
                  className="w-full h-10 px-3 rounded-xl border border-canopy-900/15 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-canopy-800 mb-1">
                Plant Purchased
              </label>
              <select
                value={form.plantPurchased}
                onChange={(e) => setForm({ ...form, plantPurchased: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-canopy-900/15 text-sm bg-white"
              >
                <option value="4-Plant Self-Watering Combo @ ₹999">
                  4-Plant Self-Watering Combo @ ₹999
                </option>
                {products.map((p) => (
                  <option key={p.slug} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-canopy-800 mb-1">
                Your Review
              </label>
              <textarea
                required
                rows={3}
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                placeholder="How did your plants arrive? How is the self-watering pot working?"
                className="w-full p-3 rounded-xl border border-canopy-900/15 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-11 rounded-full bg-canopy-900 hover:bg-canopy-950 text-white text-sm font-semibold transition"
            >
              {submitting ? 'Publishing...' : 'Publish Review'}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
