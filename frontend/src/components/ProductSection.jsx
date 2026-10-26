import React, { useState, useMemo } from 'react';
import { Heart, Star, ShoppingBag, Eye, Sun, Shield, Wind, SlidersHorizontal, Sparkles, RotateCcw, ArrowRight, Truck, Leaf } from 'lucide-react';
import { getPotSwatchClass } from '../lib/api.js';

export default function ProductSection({ products = [], categories = [], activeCategory, onSelectCategory, searchQuery, onClearSearch, wishlist = [], onToggleWishlist, onAddToCart, onQuickView, onOpenBundle }) {
  const [roomFilter, setRoomFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedColors, setSelectedColors] = useState({});

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCategory && activeCategory !== 'all') list = list.filter((p) => p.categorySlug === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => [p.name, p.botanicalName, p.shortDescription, p.lightLevel].join(' ').toLowerCase().includes(q));
    }
    if (roomFilter === 'low-light') list = list.filter((p) => p.lightLevel.toLowerCase().includes('low'));
    else if (roomFilter === 'pet-safe') list = list.filter((p) => p.petFriendly);
    else if (roomFilter === 'air-purifier') list = list.filter((p) => p.airPurifying);
    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    return list;
  }, [products, activeCategory, searchQuery, roomFilter, sortBy]);

  const reset = () => { onSelectCategory('all'); setRoomFilter('all'); setSortBy('featured'); onClearSearch(); };

  return (
    <section id="shop" className="relative bg-white py-14 lg:py-16 overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-5 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
          <div className="max-w-[680px]">
            <div className="inline-flex items-center gap-2"><span className="w-7 h-px bg-stone-300" /><span className="text-[11px] font-bold tracking-[0.18em] uppercase text-canopy-700">The Atelier Collection</span><span className="px-2.5 py-1 rounded-full bg-linen-50 border border-stone-100 text-[11px] font-semibold text-canopy-800">{filtered.length} editions</span></div>
            <h2 className="mt-3 font-serif text-[32px] sm:text-[40px] lg:text-[44px] leading-[0.94] tracking-[-0.02em] font-semibold text-canopy-950 text-balance">Living sculptures, <span className="italic font-normal text-canopy-700">calibrated</span> for modern homes.</h2>
            <p className="mt-3 text-[13.5px] leading-relaxed text-stone-600 max-w-[60ch]">Pune-acclimatized hydro-wick pots — 14-day reservoir, air-purifying foliage, made to thrive in low light & AC.</p>
          </div>
          <button onClick={onOpenBundle} className="self-start lg:self-auto inline-flex items-center gap-2.5 pl-5 pr-2 py-2 rounded-full bg-canopy-950 text-white hover:bg-black transition shadow-card group"><Sparkles className="w-4 h-4 text-emerald-300" /><span className="text-[13px] font-semibold">Build 4-Plant Box — ₹999</span><span className="w-8 h-8 rounded-full bg-white text-canopy-950 flex items-center justify-center group-hover:translate-x-0.5 transition"><ArrowRight className="w-4 h-4" /></span></button>
        </div>

        <div className="sticky top-[68px] z-30 -mx-5 lg:mx-0 px-5 lg:px-0 mb-6">
          <div className="rounded-[16px] bg-white border border-stone-200 shadow-card p-2.5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.12em] uppercase text-stone-500 shrink-0"><SlidersHorizontal className="w-3.5 h-3.5" /> Filter</span>
              {[
                { id: 'all', label: 'All Editions', icon: null },
                { id: 'low-light', label: 'Low Light • AC', icon: Sun },
                { id: 'air-purifier', label: 'Air Purifying', icon: Wind },
                { id: 'pet-safe', label: 'Pet Friendly', icon: Shield },
              ].map((pill) => {
                const Icon = pill.icon; const active = roomFilter === pill.id;
                return <button key={pill.id} onClick={() => setRoomFilter(pill.id)} className={`px-3.5 py-2 rounded-full text-[12.5px] font-medium inline-flex items-center gap-1.5 shrink-0 border transition ${active ? 'bg-canopy-950 text-white border-canopy-950' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-white'}`}>{Icon && <Icon className="w-3.5 h-3.5" />}{pill.label}</button>;
              })}
              {activeCategory !== 'all' && <span className="px-3 py-2 rounded-full bg-linen-50 border border-stone-200 text-xs font-semibold text-canopy-950 shrink-0">{categories.find((c) => c.slug === activeCategory)?.name}</span>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {(activeCategory !== 'all' || roomFilter !== 'all' || searchQuery) && <button onClick={reset} className="px-3 py-2 rounded-full bg-white border border-stone-200 text-xs font-medium text-stone-600 flex items-center gap-1"><RotateCcw className="w-3.5 h-3.5" /> Clear</button>}
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="h-9 px-3.5 rounded-full bg-stone-50 border border-stone-200 text-[12.5px] font-medium text-stone-700 focus:outline-none"><option value="featured">Featured — Curator&apos;s Pick</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option><option value="rating">Highest Rated</option></select>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-[20px] border border-dashed border-stone-200 bg-stone-50 p-10 text-center"><p className="font-serif text-xl font-semibold text-canopy-950">No editions match that filter</p><p className="text-sm text-stone-600 mt-1">Try clearing filters.</p><button onClick={reset} className="mt-5 h-10 px-6 rounded-full bg-canopy-950 text-white text-sm font-semibold">Show All</button></div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {filtered.map((plant) => {
              const isWishlisted = wishlist.includes(plant.slug);
              const chosenColor = selectedColors[plant.slug] || plant.potColors?.[0] || 'Matte Ivory';
              const discount = Math.round(((plant.originalPrice - plant.price) / plant.originalPrice) * 100);
              const secondaryImg = plant.gallery?.[1] || plant.imageUrl;
              return (
                <article key={plant.slug} className="group flex flex-col overflow-hidden rounded-[18px] bg-white border border-stone-100 shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
                  <div className="relative aspect-[4/3.6] bg-linen-50 overflow-hidden">
                    {/* Primary image */}
                    <img src={plant.imageUrl} alt={plant.name} loading="lazy" onClick={() => onQuickView(plant)} className="absolute inset-0 w-full h-full object-cover group-hover:opacity-0 transition duration-500 cursor-pointer" />
                    {/* Secondary on hover */}
                    <img src={secondaryImg} alt={plant.name} loading="lazy" onClick={() => onQuickView(plant)} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition duration-500 cursor-pointer" />

                    {/* Ribbon discount */}
                    {discount > 0 && <span className="ribbon">Save {discount}%</span>}

                    {plant.badge && <span className="absolute top-3 right-12 px-2.5 py-1 rounded-full bg-white text-canopy-950 text-[11px] font-semibold shadow-sm border border-stone-100 hidden lg:inline-flex">{plant.badge}</span>}

                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <button onClick={() => onToggleWishlist(plant.slug)} className="w-8 h-8 rounded-full bg-white shadow-card border border-stone-100 flex items-center justify-center hover:shadow-elevated transition"><Heart className={`w-4 h-4 ${isWishlisted ? 'fill-terracotta-500 text-terracotta-500' : 'text-stone-600'}`} /></button>
                      <button onClick={() => onQuickView(plant)} className="w-8 h-8 rounded-full bg-white shadow-card border border-stone-100 hidden sm:flex items-center justify-center text-stone-600 hover:text-canopy-950 transition"><Eye className="w-4 h-4" /></button>
                    </div>

                    <div className="absolute bottom-3 left-3 right-12 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur border border-white/60 text-[11px] font-medium text-canopy-950 shadow-sm"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {plant.lightLevel}</span>
                      <span className="hidden sm:inline-flex text-[11px] font-medium text-white bg-black/45 backdrop-blur px-2.5 py-1 rounded-full border border-white/15"><Truck className="w-3 h-3" /> Free deliv.</span>
                    </div>

                    {/* Hover quick add bar */}
                    <div className="absolute bottom-0 inset-x-0 p-2 translate-y-full group-hover:translate-y-0 transition duration-300">
                      <button onClick={() => onAddToCart({ slug: plant.slug, productName: plant.name, imageUrl: plant.imageUrl, potColor: chosenColor, potSize: 'Medium (5 inch Self-Watering)', unitPrice: plant.price, quantity: 1, isBundle: false })} className="w-full h-9 rounded-full bg-canopy-950 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg hover:bg-black transition">
                        <ShoppingBag className="w-3.5 h-3.5 text-emerald-300" /> Quick Add — ₹{plant.price}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center justify-between gap-2">
                      <span className="italic font-serif text-[12px] text-stone-500 truncate">{plant.botanicalName}</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-canopy-950 bg-linen-50 border border-stone-100 px-2 py-0.5 rounded-full"><Star className="w-3 h-3 fill-brass-500 text-brass-500" /> {plant.rating.toFixed(1)}</span>
                    </div>
                    <h3 onClick={() => onQuickView(plant)} className="mt-1 font-serif text-[16px] sm:text-[17px] font-semibold leading-tight text-canopy-950 line-clamp-1 cursor-pointer hover:text-canopy-800">{plant.name}</h3>
                    <p className="mt-1 text-[12px] leading-relaxed text-stone-600 line-clamp-2 min-h-[34px]">{plant.shortDescription}</p>

                    <div className="mt-3 flex items-center justify-between pt-3 border-t border-stone-100">
                      <span className="text-[11px] font-medium text-stone-500">Pot — <span className="font-semibold text-canopy-950">{chosenColor}</span></span>
                      <div className="flex items-center gap-1">
                        {(plant.potColors || []).slice(0, 4).map((color) => (
                          <button key={color} title={color} onClick={() => setSelectedColors((p) => ({ ...p, [plant.slug]: color }))} className={`w-[16px] h-[16px] rounded-full border-2 transition ${getPotSwatchClass(color)} ${chosenColor === color ? 'border-canopy-950 ring-2 ring-canopy-950/15 scale-110' : 'border-white shadow-sm'}`} />
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 flex items-end justify-between gap-3">
                      <div>
                        <div className="flex items-baseline gap-1.5"><span className="text-[18px] font-bold tracking-tight text-canopy-950">₹{plant.price}</span><span className="text-xs text-stone-400 line-through">₹{plant.originalPrice}</span></div>
                        <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1"><Leaf className="w-3 h-3" /> Hydro-wick included</span>
                      </div>
                      <span className="hidden lg:inline-flex text-[11px] text-stone-500 bg-stone-50 border border-stone-100 px-2 py-1 rounded-full">{plant.stockQty} left</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
        <p className="mt-8 text-center text-xs text-stone-500">Pune-acclimatized • Plastic-free kraft pods • <a href="#deal" className="underline decoration-stone-300 underline-offset-4 hover:text-canopy-950">Weekly Atelier Deal →</a></p>
      </div>
    </section>
  );
}
