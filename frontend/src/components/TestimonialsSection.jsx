import React, { useState } from 'react';
import { Star, CheckCircle2, Plus, X, Sparkles, Quote } from 'lucide-react';
import { api } from '../lib/api.js';
import Reveal from './Reveal.jsx';

export default function TestimonialsSection({ reviews = [], products = [], onReviewAdded, onNotify }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    city: 'Pune',
    rating: 5,
    plantPurchased: products[0]?.name || '4-Plant Atelier Box @ ₹999',
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
      onNotify('Thank you — your review is now live 🌿');
    } catch (err) {
      onNotify(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = 'w-full rounded-xl border border-canopy-950/10 bg-linen-50 px-3.5 text-[13px] text-canopy-950 placeholder:text-stone-400 transition focus:border-canopy-950/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brass-500/10';

  return (
    <section className="border-y border-canopy-950/[0.08] bg-linen-75 py-16 lg:py-24">
      <div className="shell">
        <div className="mb-9 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <Reveal className="max-w-[640px]">
            <span className="eyebrow"><span className="h-px w-7 bg-brass-500/70" /> Verified plant parents</span>
            <h2 className="display-section mt-3 text-canopy-950">
              Collectors speak — <span className="italic text-canopy-700">quiet joy,</span> cleaner air
            </h2>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-brass-500 text-brass-500" />)}
              </span>
              <span className="text-[12px] font-semibold text-canopy-950 num">4.9 / 5</span>
              <span className="h-3 w-px bg-canopy-950/15" />
              <span className="text-[11.5px] text-stone-500">2,847+ plants delivered across India</span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <button onClick={() => setModalOpen(true)} className="btn btn-outline btn-sm group/btn">
              <Plus className="h-3.5 w-3.5" /> Write a review
            </button>
          </Reveal>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {reviews.slice(0, 4).map((rev, i) => (
            <Reveal
              key={rev.id || i}
              delay={i * 80}
              as="figure"
              className="group flex flex-col justify-between rounded-[22px] border border-canopy-950/[0.09] bg-white p-5 shadow-soft transition-all duration-500 ease-silk hover:-translate-y-1 hover:shadow-soft-lg"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="flex items-center gap-0.5">
                    {[...Array(rev.rating || 5)].map((_, idx) => <Star key={idx} className="h-3.5 w-3.5 fill-brass-500 text-brass-500" />)}
                  </span>
                  <Quote className="h-5 w-5 text-brass-300 transition-transform duration-500 group-hover:-rotate-12" />
                </div>
                <blockquote className="mt-3 font-serif text-[15px] leading-[1.55] text-canopy-950">
                  “{rev.comment}”
                </blockquote>
              </div>

              <figcaption className="mt-5 flex items-center gap-3 border-t border-canopy-950/[0.07] pt-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-canopy-950 font-serif text-[13px] font-semibold text-brass-300 ring-1 ring-brass-500/25">
                  {rev.avatarInitials || rev.customerName?.slice(0, 2)?.toUpperCase() || 'GZ'}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[11.5px] font-bold text-canopy-950">{rev.customerName}</span>
                  <span className="flex items-center gap-1 text-[10.5px] text-stone-500">
                    <CheckCircle2 className="h-3 w-3 text-canopy-600" /> {rev.city} · Verified
                  </span>
                  <span className="block truncate text-[10px] text-stone-400">{rev.plantPurchased}</span>
                </span>
              </figcaption>
            </Reveal>
          ))}
        </div>

        <div className="mt-7 flex items-center justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-canopy-950/10 bg-white/70 px-4 py-2 text-[10.5px] text-stone-500">
            <Sparkles className="h-3 w-3 text-brass-500" /> Every review is tied to a verified Razorpay or COD order
          </span>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[85] flex items-center justify-center p-4">
          <div onClick={() => setModalOpen(false)} className="absolute inset-0 animate-fade-in bg-canopy-950/60 backdrop-blur-sm" />
          <form onSubmit={handleSubmit} className="relative w-full max-w-md animate-scale-in space-y-4 rounded-[26px] border border-canopy-950/10 bg-linen-50 p-6 shadow-elevated">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="eyebrow">Share your experience</span>
                <h3 className="mt-1.5 font-serif text-[24px] leading-tight text-canopy-950">How is your atelier doing?</h3>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} aria-label="Close" className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-canopy-950/10 bg-white text-canopy-900">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[0.14em] text-stone-500">Your name</span>
                <input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="Rohan Joshi" className={`${inputCls} h-10`} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[0.14em] text-stone-500">City</span>
                <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Pune" className={`${inputCls} h-10`} />
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[0.14em] text-stone-500">Plant purchased</span>
              <select value={form.plantPurchased} onChange={(e) => setForm({ ...form, plantPurchased: e.target.value })} className={`${inputCls} h-10`}>
                <option value="4-Plant Atelier Box @ ₹999">4-Plant Atelier Box @ ₹999</option>
                {products.map((p) => <option key={p.slug} value={p.name}>{p.name}</option>)}
              </select>
            </label>

            <div>
              <span className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[0.14em] text-stone-500">Rating</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })} aria-label={`${n} stars`}>
                    <Star className={`h-6 w-6 transition ${n <= form.rating ? 'fill-brass-500 text-brass-500' : 'text-stone-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[0.14em] text-stone-500">Your review</span>
              <textarea required rows={3} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="How did your plants arrive? How is the hydro-wick working?" className={`${inputCls} py-2.5`} />
            </label>

            <button type="submit" disabled={submitting} className="btn btn-dark btn-md w-full">
              {submitting ? 'Publishing…' : 'Publish review'}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
