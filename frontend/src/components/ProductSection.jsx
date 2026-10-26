import React, { useState, useMemo } from 'react';
import {
  Heart, Star, ShoppingBag, Eye, Sun, Shield, Wind, SlidersHorizontal, Sparkles,
  RotateCcw, ArrowRight, Truck, Leaf, ArrowUpRight
} from 'lucide-react';
import { getPotSwatchClass } from '../lib/api.js';
import Reveal from './Reveal.jsx';

const FILTERS = [
  { id: 'all', label: 'All editions', icon: null },
  { id: 'low-light', label: 'Low light · AC', icon: Sun },
  { id: 'air-purifier', label: 'Air purifying', icon: Wind },
  { id: 'pet-safe', label: 'Pet friendly', icon: Shield }
];

export default function ProductSection({
  products = [],
  categories = [],
  activeCategory,
  onSelectCategory,
  searchQuery,
  onClearSearch,
  wishlist = [],
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  onOpenBundle
}) {
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
  const isFiltered = activeCategory !== 'all' || roomFilter !== 'all' || Boolean(searchQuery);
  const activeCatName = categories.find((c) => c.slug === activeCategory)?.name;

  return (
    <section id="shop" className="relative bg-white py-16 lg:py-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(176,138,62,0.10),transparent_65%)] blur-2xl" />
      </div>
      <div className="shell relative">
        {/* Heading */}
        <div className="mb-9 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <Reveal className="max-w-[720px]">
            <span className="eyebrow"><span className="h-px w-7 bg-brass-500/70" /> The atelier collection</span>
            <h2 className="display-section mt-3 text-canopy-950">
              Living sculptures, <span className="italic text-canopy-700">calibrated</span>
              <br className="hidden sm:block" /> for modern homes.
            </h2>
            <p className="lede mt-4 max-w-[58ch]">
              Pune-acclimatised hydro-wick planters — a 14-day reservoir, air-purifying foliage, and a finish
              palette built for warm, minimal interiors.
            </p>
          </Reveal>

          <Reveal delay={120} className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5 rounded-full border border-canopy-950/10 bg-linen-50 px-4 py-2.5">
              <span className="font-serif text-[19px] leading-none text-canopy-950 num">{filtered.length}</span>
              <span className="text-[10.5px] font-medium leading-tight text-stone-500">editions<br />in view</span>
            </div>
            <button onClick={onOpenBundle} className="btn btn-dark btn-md group/btn">
              <Sparkles className="h-4 w-4 text-brass-300" />
              Build a 4-plant box
              <span className="btn-disc ml-1 h-8 w-8 bg-brass-400 text-canopy-950"><ArrowRight className="h-3.5 w-3.5" /></span>
            </button>
          </Reveal>
        </div>

        {/* Filter bar */}
        <div className="sticky top-[68px] z-30 mb-8">
          <div className="flex flex-col items-stretch justify-between gap-2.5 rounded-[20px] border border-canopy-950/10 bg-linen-50/90 p-2 shadow-soft backdrop-blur-xl lg:flex-row lg:items-center">
            <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
              <span className="hidden shrink-0 items-center gap-1.5 pl-2 pr-1 text-[9.5px] font-extrabold uppercase tracking-[0.18em] text-stone-400 sm:inline-flex">
                <SlidersHorizontal className="h-3.5 w-3.5" /> Filter
              </span>
              {FILTERS.map((pill) => {
                const Icon = pill.icon;
                const active = roomFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    onClick={() => setRoomFilter(pill.id)}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-semibold transition-all duration-500 ease-silk ${
                      active
                        ? 'bg-canopy-950 text-linen-50 shadow-sm'
                        : 'text-stone-600 hover:bg-white hover:text-canopy-950'
                    }`}
                  >
                    {Icon && <Icon className={`h-3.5 w-3.5 ${active ? 'text-brass-300' : 'text-stone-400'}`} />}
                    {pill.label}
                  </button>
                );
              })}
              {activeCategory !== 'all' && (
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brass-500/30 bg-brass-50 px-3 py-2 text-[11px] font-bold text-brass-700">
                  {activeCatName}
                  <button onClick={() => onSelectCategory('all')} aria-label="Clear category"><ArrowUpRight className="h-3 w-3 rotate-45" /></button>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 pr-0.5">
              {isFiltered && (
                <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-full border border-canopy-950/10 bg-white px-3 py-2 text-[11.5px] font-semibold text-stone-600 transition hover:text-canopy-950">
                  <RotateCcw className="h-3 w-3" /> Reset
                </button>
              )}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-9 cursor-pointer appearance-none rounded-full border border-canopy-950/10 bg-white pl-3.5 pr-8 text-[11.5px] font-semibold text-canopy-900 focus:outline-none"
                >
                  <option value="featured">Curator&apos;s pick</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="rating">Highest rated</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[8px] text-stone-400">▼</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-canopy-950/15 bg-linen-50 p-14 text-center">
            <p className="font-serif text-[24px] text-canopy-950">No editions match that filter</p>
            <p className="mt-1 text-[13px] text-stone-500">Try a different sanctuary or clear your filters.</p>
            <button onClick={reset} className="btn btn-dark btn-sm mt-6">Show all plants</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-4">
            {filtered.map((plant, i) => {
              const isWishlisted = wishlist.includes(plant.slug);
              const chosenColor = selectedColors[plant.slug] || plant.potColors?.[0] || 'Matte Ivory';
              const discount = Math.round(((plant.originalPrice - plant.price) / plant.originalPrice) * 100);
              const secondaryImg = plant.gallery?.[1] || plant.imageUrl;
              return (
                <Reveal key={plant.slug} delay={Math.min(i * 70, 420)} as="article" className="group flex flex-col overflow-hidden rounded-[22px] border border-canopy-950/[0.09] bg-white transition-all duration-500 ease-silk hover:-translate-y-1.5 hover:border-canopy-950/20 hover:shadow-soft-lg">
                  <div className="relative aspect-[4/4.1] overflow-hidden bg-linen-100">
                    <img
                      src={plant.imageUrl}
                      alt={plant.name}
                      loading="lazy"
                      onClick={() => onQuickView(plant)}
                      className="absolute inset-0 h-full w-full cursor-pointer object-cover transition-all duration-700 ease-silk group-hover:scale-[1.04] group-hover:opacity-0"
                    />
                    <img
                      src={secondaryImg}
                      alt=""
                      loading="lazy"
                      onClick={() => onQuickView(plant)}
                      className="absolute inset-0 h-full w-full cursor-pointer scale-[1.04] object-cover opacity-0 transition-all duration-700 ease-silk group-hover:scale-100 group-hover:opacity-100"
                    />

                    {discount > 0 && (
                      <span className="absolute left-3 top-3 rounded-full bg-canopy-950/90 px-2.5 py-1 text-[9.5px] font-extrabold uppercase tracking-[0.12em] text-brass-300 backdrop-blur">
                        −{discount}% · save
                      </span>
                    )}

                    <div className="absolute right-3 top-3 flex flex-col gap-1.5">
                      <button
                        onClick={() => onToggleWishlist(plant.slug)}
                        aria-label="Toggle wishlist"
                        className={`grid h-8 w-8 place-items-center rounded-full border border-white/60 bg-linen-50/90 shadow-sm backdrop-blur transition hover:scale-105 ${
                          isWishlisted ? 'text-terracotta-500' : 'text-canopy-900'
                        }`}
                      >
                        <Heart className={`h-3.5 w-3.5 ${isWishlisted ? 'fill-terracotta-500' : ''}`} />
                      </button>
                      <button
                        onClick={() => onQuickView(plant)}
                        aria-label="Quick view"
                        className="hidden h-8 w-8 place-items-center rounded-full border border-white/60 bg-linen-50/90 text-canopy-900 shadow-sm backdrop-blur transition hover:scale-105 sm:grid"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="absolute inset-x-3 bottom-14 flex flex-wrap items-center gap-1.5 transition-opacity duration-300 sm:bottom-3 sm:group-hover:opacity-0">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-linen-50/90 px-2.5 py-1 text-[10px] font-semibold text-canopy-950 shadow-sm backdrop-blur">
                        <Sun className="h-2.5 w-2.5 text-brass-600" /> {plant.lightLevel}
                      </span>
                      {plant.badge && (
                        <span className="hidden rounded-full bg-canopy-950/85 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.1em] text-linen-100 backdrop-blur sm:inline-flex">
                          {plant.badge}
                        </span>
                      )}
                    </div>

                    <div className="absolute inset-x-2 bottom-2 transition-all duration-500 ease-silk sm:translate-y-[130%] sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                      <button
                        onClick={() => onAddToCart({ slug: plant.slug, productName: plant.name, imageUrl: plant.imageUrl, potColor: chosenColor, potSize: 'Medium (5 inch Self-Watering)', unitPrice: plant.price, quantity: 1, isBundle: false })}
                        className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-canopy-950 text-[11.5px] font-semibold text-linen-50 shadow-lg transition hover:bg-brass-500 hover:text-canopy-950"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" /> Quick add — ₹{plant.price}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate font-serif text-[12px] italic text-stone-500">{plant.botanicalName}</p>
                      <span className="inline-flex shrink-0 items-center gap-1 text-[10.5px] font-bold text-canopy-950">
                        <Star className="h-2.5 w-2.5 fill-brass-500 text-brass-500" /> {plant.rating.toFixed(1)}
                        <span className="font-normal text-stone-400">({plant.reviewCount})</span>
                      </span>
                    </div>

                    <h3 onClick={() => onQuickView(plant)} className="mt-1.5 cursor-pointer font-serif text-[17px] leading-tight text-canopy-950 transition-colors hover:text-canopy-700">
                      {plant.name}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 min-h-[32px] text-[11.5px] leading-relaxed text-stone-500">{plant.shortDescription}</p>

                    <div className="mt-3 flex items-center justify-between gap-2 border-t border-canopy-950/[0.07] pt-3">
                      <span className="truncate text-[10px] font-medium text-stone-400">
                        Pot · <span className="font-semibold text-canopy-900">{chosenColor}</span>
                      </span>
                      <div className="flex shrink-0 items-center gap-1">
                        {(plant.potColors || []).slice(0, 4).map((color) => (
                          <button
                            key={color}
                            title={color}
                            aria-label={color}
                            onClick={() => setSelectedColors((p) => ({ ...p, [plant.slug]: color }))}
                            className={`h-[15px] w-[15px] rounded-full border-2 transition duration-300 ${getPotSwatchClass(color)} ${
                              chosenColor === color ? 'scale-110 border-canopy-950' : 'border-white shadow-sm hover:scale-105'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 flex items-end justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-serif text-[20px] font-medium leading-none tracking-tight text-canopy-950 num">₹{plant.price}</span>
                          <span className="text-[11px] text-stone-400 line-through num">₹{plant.originalPrice}</span>
                        </div>
                        <span className="mt-1 flex items-center gap-1 text-[10px] font-medium text-canopy-700">
                          <Leaf className="h-2.5 w-2.5" /> Hydro-wick included
                        </span>
                      </div>
                      <span className={`rounded-full border px-2 py-1 text-[9.5px] font-bold uppercase tracking-[0.08em] ${
                        plant.stockQty > 20
                          ? 'border-canopy-700/15 bg-canopy-50 text-canopy-700'
                          : 'border-terracotta-500/20 bg-terracotta-50 text-terracotta-600'
                      }`}>
                        {plant.stockQty} left
                      </span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-stone-500">
          <span className="inline-flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-canopy-700" /> Free delivery ₹499+</span>
          <span className="h-3 w-px bg-canopy-950/10" />
          <span className="inline-flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-canopy-700" /> 7-day healthy guarantee</span>
          <span className="h-3 w-px bg-canopy-950/10" />
          <a href="#deal" className="link-line font-semibold text-canopy-950">Weekly atelier deal →</a>
        </div>
      </div>
    </section>
  );
}
