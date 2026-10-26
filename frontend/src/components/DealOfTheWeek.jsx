import React, { useState, useEffect } from 'react';
import { Star, Check, Clock, ShoppingBag, Heart, Truck, Leaf, Sparkles, Timer } from 'lucide-react';
import { getPotSwatchClass } from '../lib/api.js';
import Reveal from './Reveal.jsx';

export default function DealOfTheWeek({ dealProduct, isWishlisted, onToggleWishlist, onAddToCart }) {
  const product = dealProduct || {
    slug: 'zamia-green', name: 'Zamia Green (ZZ Plant)', botanicalName: 'Zamioculcas zamiifolia', price: 269, maxPrice: 319, originalPrice: 349, rating: 4.9, reviewCount: 312, imageUrl: '/images/zamia-green.jpg',
    description: 'Sculptural emerald foliage in our signature hydro-wick atelier pot — thrives in low light & AC workspaces, purifying air.', potColors: ['Matte Ivory', 'Forest Sage', 'Terracotta Sand', 'Charcoal Matte'], features: ['14-day reservoir', 'AC office ready', 'Air-purifying', '7-day guarantee']
  };
  const [potSize, setPotSize] = useState('Medium (5 inch Self-Watering)');
  const [potColor, setPotColor] = useState(product.potColors?.[0] || 'Matte Ivory');
  const [timeLeft, setTimeLeft] = useState({ d: '02', h: '14', m: '36', s: '49' });

  useEffect(() => {
    const end = Date.now() + (2 * 86400 + 14 * 3600 + 36 * 60 + 49) * 1000;
    const t = setInterval(() => {
      const diff = Math.max(0, end - Date.now());
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ d: String(d).padStart(2, '0'), h: String(h).padStart(2, '0'), m: String(m).padStart(2, '0'), s: String(s).padStart(2, '0') });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const activePrice = potSize === 'Large (6.5 inch Self-Watering)' ? product.maxPrice : product.price;
  const discount = Math.round(((product.originalPrice - activePrice) / product.originalPrice) * 100);

  return (
    <section id="deal" className="relative overflow-hidden bg-linen-50 py-16 lg:py-24">
      <div className="pointer-events-none absolute -right-32 top-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(191,92,55,0.13),transparent_65%)] blur-2xl" />
      <div className="shell relative">
        <Reveal className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div className="max-w-[640px]">
            <span className="eyebrow"><span className="h-px w-7 bg-terracotta-500/70" /> Atelier batch · limited</span>
            <h2 className="display-section mt-3 text-canopy-950">
              This week&apos;s most <span className="italic text-terracotta-600">collected</span> edition
            </h2>
            <p className="lede mt-3 max-w-[52ch]">
              One plant, one week, one honest price — hand-picked from the healthiest bench at the nursery.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 rounded-full border border-canopy-950/10 bg-white px-3 py-2 shadow-soft">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-terracotta-50 text-terracotta-600">
              <Timer className="h-4 w-4" />
            </span>
            <span className="hidden text-[10px] font-extrabold uppercase tracking-[0.16em] text-stone-500 sm:inline">Ends in</span>
            <div className="flex items-center gap-1 font-mono text-[13px] font-bold text-canopy-950 num">
              {[['d', timeLeft.d], ['h', timeLeft.h], ['m', timeLeft.m]].map(([u, v]) => (
                <React.Fragment key={u}>
                  <span className="rounded-lg border border-canopy-950/10 bg-linen-50 px-2 py-1">{v}<span className="ml-0.5 text-[9px] font-semibold text-stone-400">{u}</span></span>
                  <span className="text-stone-300">:</span>
                </React.Fragment>
              ))}
              <span className="rounded-lg bg-canopy-950 px-2 py-1 text-brass-300">{timeLeft.s}<span className="ml-0.5 text-[9px] font-semibold text-brass-300/60">s</span></span>
            </div>
          </div>
        </Reveal>

        <Reveal dir="scale" className="overflow-hidden rounded-[28px] border border-canopy-950/10 bg-white shadow-card">
          <div className="grid lg:grid-cols-12">
            {/* Media */}
            <div className="relative border-b border-canopy-950/[0.08] bg-linen-75 p-4 sm:p-6 lg:col-span-5 lg:border-b-0 lg:border-r">
              <div className="group relative overflow-hidden rounded-[20px] border border-canopy-950/10 bg-white">
                <img src={product.imageUrl} alt={product.name} className="aspect-[4/3.7] w-full object-cover transition-transform duration-[1400ms] ease-silk group-hover:scale-[1.04]" />
                <span className="absolute left-3 top-3 rounded-full bg-terracotta-600 px-2.5 py-1 text-[9.5px] font-extrabold uppercase tracking-[0.12em] text-white shadow-sm">
                  Flat {discount}% off
                </span>
                <button
                  onClick={() => onToggleWishlist(product.slug)}
                  aria-label="Toggle wishlist"
                  className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/70 bg-linen-50/90 shadow-sm backdrop-blur transition hover:scale-105 ${isWishlisted ? 'text-terracotta-500' : 'text-canopy-900'}`}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-terracotta-500' : ''}`} />
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <span className="flex items-center gap-2 rounded-xl border border-canopy-950/10 bg-white px-3 py-2 text-[11px] font-medium text-stone-600">
                  <Leaf className="h-3.5 w-3.5 text-canopy-600" /> 14-day reservoir
                </span>
                <span className="flex items-center gap-2 rounded-xl border border-canopy-950/10 bg-white px-3 py-2 text-[11px] font-medium text-stone-600">
                  <Truck className="h-3.5 w-3.5 text-canopy-600" /> Free delivery
                </span>
              </div>
              <p className="mt-3 text-center text-[10px] text-stone-400">Photo proof of your exact plant before dispatch</p>
            </div>

            {/* Details */}
            <div className="p-6 sm:p-8 lg:col-span-7 lg:p-9">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-brass-500 text-brass-500" />)}
                </span>
                <span className="text-[11.5px] font-semibold text-stone-600 num">{product.rating} · {product.reviewCount} verified</span>
                <span className="tag border border-canopy-700/15 bg-canopy-50 text-canopy-700">Hydro-wick indicator</span>
              </div>

              <p className="mt-4 font-serif text-[13px] italic text-stone-500">{product.botanicalName}</p>
              <h3 className="mt-1 font-serif text-[28px] leading-tight text-canopy-950 sm:text-[34px]">{product.name}</h3>
              <p className="mt-2.5 max-w-[52ch] text-[13px] leading-relaxed text-stone-600">{product.description}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {(product.features || []).map((f) => (
                  <span key={f} className="inline-flex items-center gap-1.5 rounded-full border border-canopy-950/10 bg-linen-50 px-3 py-1.5 text-[10.5px] font-medium text-canopy-900">
                    <Check className="h-3 w-3 text-canopy-600" /> {f}
                  </span>
                ))}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-[9.5px] font-extrabold uppercase tracking-[0.18em] text-stone-400">Planter size</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Medium 5″', full: 'Medium (5 inch Self-Watering)', price: product.price },
                      { label: 'Large 6.5″', full: 'Large (6.5 inch Self-Watering)', price: product.maxPrice }
                    ].map((opt) => (
                      <button
                        key={opt.full}
                        onClick={() => setPotSize(opt.full)}
                        className={`rounded-2xl border p-3 text-left transition-all duration-500 ease-silk ${
                          potSize === opt.full
                            ? 'border-canopy-950 bg-canopy-950 text-linen-50 shadow-soft'
                            : 'border-canopy-950/10 bg-white hover:border-canopy-950/25'
                        }`}
                      >
                        <p className="text-[11.5px] font-semibold">{opt.label}</p>
                        <p className={`text-[10.5px] num ${potSize === opt.full ? 'text-brass-300' : 'text-stone-500'}`}>₹{opt.price}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-[9.5px] font-extrabold uppercase tracking-[0.18em] text-stone-400">
                    Pot finish · <span className="normal-case tracking-normal text-canopy-900">{potColor}</span>
                  </p>
                  <div className="flex h-[62px] items-center gap-2.5 rounded-2xl border border-canopy-950/10 bg-linen-50 px-4">
                    {(product.potColors || []).map((c) => (
                      <button
                        key={c}
                        title={c}
                        onClick={() => setPotColor(c)}
                        className={`h-7 w-7 rounded-full border-2 transition duration-300 ${getPotSwatchClass(c)} ${
                          potColor === c ? 'scale-110 border-canopy-950 ring-2 ring-canopy-950/15 ring-offset-1' : 'border-white shadow-sm hover:scale-105'
                        }`}
                      />
                    ))}
                    <span className="ml-auto text-[10px] text-stone-400">Matte glaze</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-canopy-950/[0.08] pt-5">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-[32px] leading-none tracking-tight text-canopy-950 num">₹{activePrice}</span>
                    <span className="text-[13px] text-stone-400 line-through num">₹{product.originalPrice}</span>
                  </div>
                  <p className="mt-1 text-[10.5px] font-medium text-canopy-700">Inclusive of hydro-wick planter & substrate</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={() => onAddToCart({ slug: product.slug, productName: product.name, imageUrl: product.imageUrl, potColor, potSize, unitPrice: activePrice, quantity: 1, isBundle: false })}
                    className="btn btn-dark btn-md group/btn"
                  >
                    <ShoppingBag className="h-4 w-4 text-brass-300" /> Add to bag
                  </button>
                  <span className="hidden items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-stone-400 sm:flex">
                    <Sparkles className="h-3 w-3 text-brass-500" /> Collector&apos;s pick
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
