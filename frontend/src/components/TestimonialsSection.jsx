import React, { useState } from 'react';
import { Star, Quote, CheckCircle2, Plus, X, Sparkles } from 'lucide-react';
import { api } from '../lib/api.js';

export default function TestimonialsSection({ reviews = [], products = [], onReviewAdded, onNotify }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    city: 'Pune',
    rating: 5,
    plantPurchased: products[0]?.name || '4-Plant Atelier Box @ ₹999',
    comment: '',
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
      onNotify('Thank you — your review is now live 🌿');
    } catch (err) {
      onNotify(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16 lg:py-20 bg-linen-75 border-y border-stone-100">
      <div className="max-w-[1360px] mx-auto px-5 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-[640px]">
            <div className="inline-flex items-center gap-2">
              <span className="w-7 h-px bg-canopy-900/20" />
              <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-canopy-700">Verified Plant Parents</span>
              <span className="px-2.5 py-1 rounded-full bg-white border border-stone-100 text-[11px] font-semibold text-canopy-800">2,847+ delivered</span>
            </div>
            <h2 className="mt-3 font-serif text-[32px] lg:text-[44px] leading-[0.95] tracking-[-0.02em] font-semibold text-canopy-950">
              Collectors speak — <span className="italic font-normal">quiet joy</span>, cleaner air
            </h2>
            <div className="mt-3 flex items-center gap-2">
              <span className="flex text-brass-500">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-brass-500" />)}</span>
              <span className="text-xs font-semibold text-stone-700">4.9 / 5 average across Pune & India</span>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="self-start lg:self-auto h-10 px-5 rounded-full bg-white border border-stone-200 hover:border-canopy-900 text-canopy-950 text-xs font-semibold inline-flex items-center gap-2 hover:bg-canopy-950 hover:text-white transition"
          >
            <Plus className="w-3.5 h-3.5" /> Write a Review
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.slice(0, 4).map((rev, i) => (
            <div key={rev.id || i} className="bg-white rounded-[20px] p-6 border border-stone-100 shadow-soft hover:shadow-soft-lg transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="flex text-brass-500">{[...Array(rev.rating || 5)].map((_, idx) => <Star key={idx} className="w-3.5 h-3.5 fill-brass-500" />)}</span>
                  <span className="w-8 h-8 rounded-full bg-linen-50 flex items-center justify-center">
                    <Quote className="w-4 h-4 text-stone-400" />
                  </span>
                </div>
                <p className="font-serif text-[15px] leading-relaxed text-canopy-950">“{rev.comment}”</p>
              </div>

              <div className="pt-5 mt-6 border-t border-stone-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-canopy-950 text-white font-serif font-bold text-sm flex items-center justify-center shrink-0">
                  {rev.avatarInitials || rev.customerName?.slice(0, 2)?.toUpperCase() || 'GZ'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-canopy-950 truncate">{rev.customerName}</p>
                  <p className="text-[11px] text-stone-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {rev.city} • Verified
                  </p>
                  <p className="text-[10.5px] text-stone-500 truncate">{rev.plantPurchased}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <span className="inline-flex items-center gap-2 text-xs text-stone-500">
            <Sparkles className="w-3.5 h-3.5 text-canopy-700" /> All reviews are from verified Razorpay orders • Photos available on request
          </span>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setModalOpen(false)} className="absolute inset-0 bg-canopy-950/60 backdrop-blur-sm" />
          <form onSubmit={handleSubmit} className="relative w-full max-w-md bg-white rounded-[24px] p-6 shadow-elevated space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl font-semibold text-canopy-950">Share Your Atelier Experience</h3>
              <button type="button" onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Your Name</label>
                <input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="Rohan Joshi" className="w-full h-10 px-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-canopy-900" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">City</label>
                <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Pune" className="w-full h-10 px-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-canopy-900" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Plant Purchased</label>
              <select value={form.plantPurchased} onChange={(e) => setForm({ ...form, plantPurchased: e.target.value })} className="w-full h-10 px-3 rounded-xl border border-stone-200 text-sm bg-white">
                <option value="4-Plant Atelier Box @ ₹999">4-Plant Atelier Box @ ₹999</option>
                {products.map((p) => <option key={p.slug} value={p.name}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Your Review</label>
              <textarea required rows={3} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="How did your plants arrive? How is the hydro-wick working?" className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-canopy-900" />
            </div>
            <button type="submit" disabled={submitting} className="w-full h-11 rounded-full bg-canopy-950 hover:bg-black text-white text-sm font-semibold transition">
              {submitting ? 'Publishing...' : 'Publish Review'}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
