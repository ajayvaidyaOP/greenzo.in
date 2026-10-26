import React, { useState, useMemo } from 'react';
import {
  Heart, Star, ShoppingBag, Eye, Sun, Shield, Wind, SlidersHorizontal, Sparkles,
  RotateCcw, ArrowRight, Truck, Leaf, X
} from 'lucide-react';
import { getPotSwatchClass } from '../lib/api.js';
import { buildWhatsAppUrl, WhatsAppIcon } from '../lib/whatsapp.jsx';
import Reveal from './Reveal.jsx';

const FILTERS = [
  { id: 'all', label: 'All Plants', icon: null },
  { id: 'low-light', label: 'Low Light & AC', icon: Sun },
  { id: 'air-purifier', label: 'Air Purifying', icon: Wind },
  { id: 'pet-safe', label: 'Pet Friendly', icon: Shield }
];

export default function ProductSection({
  storeConfig = {},
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

  const comboPrice = storeConfig.comboBundlePrice || 999;
  const comboSize = storeConfig.comboBundleSize || 4;

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCategory && activeCategory !== 'all') list = list.filter((p) => p.categorySlug === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) =>
        [p.name, p.botanicalName, p.shortDescription, p.lightLevel].join(' ').toLowerCase().includes(q)
      );
    }
    if (roomFilter === 'low-light') list = list.filter((p) => p.lightLevel.toLowerCase().includes('low'));
    else if (roomFilter === 'pet-safe') list = list.filter((p) => p.petFriendly);
    else if (roomFilter === 'air-purifier') list = list.filter((p) => p.airPurifying);

    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    return list;
  }, [products, activeCategory, searchQuery, roomFilter, sortBy]);

  const reset = () => {
    onSelectCategory('all');
    setRoomFilter('all');
    setSortBy('featured');
    onClearSearch();
  };
  const isFiltered = activeCategory !== 'all' || roomFilter !== 'all' || Boolean(searchQuery);
  const activeCatName = categories.find((c) => c.slug === activeCategory)?.name;

  return (
    <section id="shop" className="relative bg-white py-14 lg:py-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(31,127,88,0.08),transparent_65%)] blur-2xl" />
      </div>

      <div className="shell relative">
        {/* Heading */}
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <Reveal className="max-w-[680px]">
            <span className="eyebrow">Bestselling indoor collection</span>
            <h2 className="display-section mt-2 text-canopy-950">
              Self-watering plants, <span className="italic text-canopy-600">ready</span> for Indian homes.
            </h2>
            <p className="lede mt-3 max-w-[56ch]">
              Every plant arrives potted in a 14-day capillary self-watering planter with pest-free coco-perlite mix —
              plus a live WhatsApp photo of your exact plant before dispatch.
            </p>
          </Reveal>

          <Reveal delay={100} className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2.5 rounded-full border border-canopy-950/10 bg-linen-50 px-4 py-2">
              <span className="font-serif text-[19px] font-semibold leading-none text-canopy-950 num">
                {filtered.length}
              </span>
              <span className="text-[10.5px] font-semibold leading-tight text-stone-500">
                plants<br />available
              </span>
            </div>
            <button onClick={onOpenBundle} className="btn btn-dark btn-md group/btn">
              <Sparkles className="h-4 w-4 text-emerald-300" />
              {comboSize}-Plant Box · ₹{comboPrice}
              <span className="btn-disc ml-1 h-7 w-7 bg-emerald-400 text-canopy-950">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </button>
          </Reveal>
        </div>

        {/* Sticky Filter Bar */}
        <div className="sticky top-[68px] z-30 mb-8">
          <div className="flex flex-col items-stretch justify-between gap-2.5 rounded-[20px] border border-canopy-950/10 bg-linen-50/95 p-2 shadow-soft backdrop-blur-xl lg:flex-row lg:items-center">
            <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
              <span className="hidden shrink-0 items-center gap-1.5 pl-2.5 pr-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-stone-400 sm:inline-flex">
                <SlidersHorizontal className="h-3.5 w-3.5 text-canopy-600" /> Filter
              </span>
              {FILTERS.map((pill) => {
                const Icon = pill.icon;
                const active = roomFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    onClick={() => setRoomFilter(pill.id)}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-bold transition-all duration-300 ${
                      active
                        ? 'bg-canopy-950 text-white shadow-sm'
                        : 'text-stone-600 hover:bg-white hover:text-canopy-950'
                    }`}
                  >
                    {Icon && <Icon className={`h-3.5 w-3.5 ${active ? 'text-emerald-300' : 'text-canopy-600'}`} />}
                    {pill.label}
                  </button>
                );
              })}

              {activeCategory !== 'all' && (
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-canopy-600/30 bg-canopy-50 px-3 py-1.5 text-[11.5px] font-bold text-canopy-800">
                  {activeCatName}
                  <button
                    onClick={() => onSelectCategory('all')}
                    aria-label="Clear category"
                    className="rounded-full p-0.5 hover:bg-canopy-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 pr-0.5">
              {isFiltered && (
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 rounded-full border border-canopy-950/10 bg-white px-3 py-2 text-[11.5px] font-bold text-stone-600 transition hover:text-canopy-950"
                >
                  <RotateCcw className="h-3 w-3" /> Reset
                </button>
              )}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-9 cursor-pointer appearance-none rounded-full border border-canopy-950/12 bg-white pl-3.5 pr-8 text-[11.5px] font-bold text-canopy-900 focus:outline-none"
                >
                  <option value="featured">Featured Picks</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[8px] text-stone-400">
                  ▼
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-canopy-950/15 bg-linen-50 p-14 text-center">
            <p className="font-serif text-[24px] text-canopy-950">No plants match that filter</p>
            <p className="mt-1 text-[13px] text-stone-500">Try clearing filters or ask our Pune nursery on WhatsApp.</p>
            <button onClick={reset} className="btn btn-dark btn-sm mt-5">
              Show all plants
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-4">
            {filtered.map((plant, i) => {
              const isWishlisted = wishlist.includes(plant.slug);
              const chosenColor = selectedColors[plant.slug] || plant.potColors?.[0] || 'Matte Ivory';
              const discount = Math.round(((plant.originalPrice - plant.price) / plant.originalPrice) * 100);
              const secondaryImg = plant.gallery?.[1] || plant.imageUrl;
              const plantWaUrl = buildWhatsAppUrl(
                storeConfig,
                `Hi Greenzo! I'm interested in ${plant.name} (${chosenColor} self-watering pot, ₹${plant.price}). Can you share a live photo?`
              );

              return (
                <Reveal
                  key={plant.slug}
                  delay={Math.min(i * 60, 360)}
                  as="article"
                  className="group flex flex-col overflow-hidden rounded-[22px] border border-canopy-950/10 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-canopy-600/35 hover:shadow-soft-lg"
                >
                  <div className="relative aspect-[4/4.05] overflow-hidden bg-linen-75">
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

                    {/* Top-left Discount & Badge */}
                    <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1">
                      {discount > 0 && (
                        <span className="rounded-full bg-canopy-950/90 px-2.5 py-1 text-[9.5px] font-extrabold uppercase tracking-[0.1em] text-emerald-300 backdrop-blur">
                          Save {discount}%
                        </span>
                      )}
                      {plant.badge && (
                        <span className="hidden rounded-full border border-white/70 bg-white/92 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.08em] text-canopy-900 shadow-sm sm:inline-flex">
                          {plant.badge}
                        </span>
                      )}
                    </div>

                    {/* Top-right Action Stack: Wishlist, Quick View, WhatsApp */}
                    <div className="absolute right-2.5 top-2.5 flex flex-col gap-1.5">
                      <button
                        onClick={() => onToggleWishlist(plant.slug)}
                        aria-label="Toggle wishlist"
                        className={`grid h-8 w-8 place-items-center rounded-full border border-white/70 bg-white/92 shadow-sm backdrop-blur transition hover:scale-105 ${
                          isWishlisted ? 'text-terracotta-500' : 'text-canopy-900'
                        }`}
                      >
                        <Heart className={`h-3.5 w-3.5 ${isWishlisted ? 'fill-terracotta-500' : ''}`} />
                      </button>

                      <button
                        onClick={() => onQuickView(plant)}
                        aria-label="Quick view"
                        title="Quick view"
                        className="hidden h-8 w-8 place-items-center rounded-full border border-white/70 bg-white/92 text-canopy-900 shadow-sm backdrop-blur transition hover:scale-105 sm:grid"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>

                      <a
                        href={plantWaUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Ask about ${plant.name} on WhatsApp`}
                        title="Ask for live photo / order on WhatsApp"
                        className="grid h-8 w-8 place-items-center rounded-full bg-whatsapp text-white shadow-sm transition hover:scale-105 hover:bg-whatsapp-dark"
                      >
                        <WhatsAppIcon className="h-3.5 w-3.5" />
                      </a>
                    </div>

                    {/* Bottom Light Pill */}
                    <div className="absolute inset-x-2.5 bottom-2.5 flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/70 bg-white/92 px-2.5 py-1 text-[10px] font-bold text-canopy-950 shadow-sm backdrop-blur">
                        <Sun className="h-2.5 w-2.5 text-brass-500" /> {plant.lightLevel}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate font-serif text-[12px] italic text-stone-500">{plant.botanicalName}</p>
                      <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-bold text-canopy-950">
                        <Star className="h-3 w-3 fill-brass-500 text-brass-500" /> {plant.rating.toFixed(1)}
                        <span className="font-normal text-stone-400">({plant.reviewCount})</span>
                      </span>
                    </div>

                    <h3
                      onClick={() => onQuickView(plant)}
                      className="mt-1 cursor-pointer font-serif text-[17px] font-medium leading-tight text-canopy-950 transition-colors hover:text-canopy-600"
                    >
                      {plant.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 min-h-[32px] text-[11.5px] leading-relaxed text-stone-500">
                      {plant.shortDescription}
                    </p>

                    {/* Pot Color Selector */}
                    <div className="mt-3 flex items-center justify-between gap-2 border-t border-canopy-950/[0.07] pt-2.5">
                      <span className="truncate text-[10.5px] font-medium text-stone-500">
                        Pot: <span className="font-bold text-canopy-900">{chosenColor}</span>
                      </span>
                      <div className="flex shrink-0 items-center gap-1">
                        {(plant.potColors || []).slice(0, 4).map((color) => (
                          <button
                            key={color}
                            title={color}
                            aria-label={color}
                            onClick={() => setSelectedColors((p) => ({ ...p, [plant.slug]: color }))}
                            className={`h-[16px] w-[16px] rounded-full border-2 transition duration-200 ${getPotSwatchClass(
                              color
                            )} ${
                              chosenColor === color
                                ? 'scale-110 border-canopy-950'
                                : 'border-white shadow-sm hover:scale-105'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Price + Always-Visible Add Button */}
                    <div className="mt-3 flex items-center justify-between gap-2 pt-0.5">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-serif text-[21px] font-semibold leading-none tracking-tight text-canopy-950 num">
                            ₹{plant.price}
                          </span>
                          <span className="text-[11px] text-stone-400 line-through num">₹{plant.originalPrice}</span>
                        </div>
                        <span className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold text-canopy-700">
                          <Leaf className="h-2.5 w-2.5" /> Self-watering pot
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          onAddToCart({
                            slug: plant.slug,
                            productName: plant.name,
                            imageUrl: plant.imageUrl,
                            potColor: chosenColor,
                            potSize: 'Medium (5 inch Self-Watering)',
                            unitPrice: plant.price,
                            quantity: 1,
                            isBundle: false
                          })
                        }
                        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-canopy-950 px-3.5 text-[11.5px] font-bold text-white shadow-sm transition hover:bg-canopy-700 active:scale-95"
                      >
                        <ShoppingBag className="h-3.5 w-3.5 text-emerald-300" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11.5px] text-stone-500">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Truck className="h-3.5 w-3.5 text-canopy-600" /> Free delivery ₹499+
          </span>
          <span className="h-3 w-px bg-canopy-950/10" />
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Shield className="h-3.5 w-3.5 text-canopy-600" /> 7-day healthy plant guarantee
          </span>
          <span className="h-3 w-px bg-canopy-950/10" />
          <a href="#deal" className="link-line font-bold text-canopy-800">
            See Weekly Deal →
          </a>
        </div>
      </div>
    </section>
  );
}
