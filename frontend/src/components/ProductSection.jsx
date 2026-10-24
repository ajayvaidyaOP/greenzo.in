import React, { useState, useMemo } from 'react';
import {
  Heart,
  Star,
  ShoppingBag,
  Eye,
  Sun,
  Shield,
  Wind,
  SlidersHorizontal,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { getPotSwatchClass } from '../lib/api.js';

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
  const [roomFilter, setRoomFilter] = useState('all'); // all | low-light | pet-safe | air-purifier
  const [sortBy, setSortBy] = useState('featured');
  const [selectedColors, setSelectedColors] = useState({});

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (activeCategory && activeCategory !== 'all') {
      list = list.filter((p) => p.categorySlug === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.botanicalName.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.lightLevel.toLowerCase().includes(q)
      );
    }

    if (roomFilter === 'low-light') {
      list = list.filter((p) => p.lightLevel.toLowerCase().includes('low'));
    } else if (roomFilter === 'pet-safe') {
      list = list.filter((p) => p.petFriendly);
    } else if (roomFilter === 'air-purifier') {
      list = list.filter((p) => p.airPurifying);
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    }

    return list;
  }, [products, activeCategory, searchQuery, roomFilter, sortBy]);

  const handleResetFilters = () => {
    onSelectCategory('all');
    setRoomFilter('all');
    setSortBy('featured');
    onClearSearch();
  };

  return (
    <section
      id="shop"
      className="relative bg-canopy-900 py-14 lg:py-20 text-white overflow-hidden"
    >
      {/* Subtle decorative radial botanical glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[320px] bg-emerald-500/10 blur-3xl rounded-full"
      />

      <div className="max-w-[1320px] mx-auto px-4 lg:px-8 relative">
        {/* Editorial Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <span className="text-emerald-300 text-[11px] font-semibold tracking-[0.28em] uppercase">
              Curated Bestsellers • Self-Watering Series
            </span>
            <h2 className="font-serif text-[32px] sm:text-[40px] lg:text-[44px] leading-tight font-medium text-white mt-2">
              Plants Everyone’s Talking About This Month
            </h2>
          </div>

          <button
            onClick={onOpenBundle}
            className="self-start lg:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-400/15 hover:bg-emerald-400/25 border border-emerald-300/30 text-emerald-100 text-[13px] font-semibold transition"
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Pick Any 4 Plants @ ₹999 →</span>
          </button>
        </div>

        {/* Interactive Smart Room & Light Matcher Filter Bar */}
        <div className="bg-white/8 backdrop-blur-sm border border-white/12 rounded-2xl p-3.5 lg:p-4 mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
            <span className="text-[11.5px] font-semibold uppercase tracking-wider text-emerald-200/80 mr-1 flex items-center gap-1.5 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Match Space:
            </span>

            {[
              { id: 'all', label: 'All Plants', icon: null },
              { id: 'low-light', label: 'Low-Light / AC Room', icon: Sun },
              { id: 'air-purifier', label: 'NASA Air Purifiers', icon: Wind },
              { id: 'pet-safe', label: 'Pet Friendly', icon: Shield }
            ].map((pill) => {
              const Icon = pill.icon;
              const active = roomFilter === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => setRoomFilter(pill.id)}
                  className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-medium inline-flex items-center gap-1.5 shrink-0 transition ${
                    active
                      ? 'bg-white text-canopy-950 font-semibold shadow-sm'
                      : 'bg-white/10 text-linen-100 hover:bg-white/18'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{pill.label}</span>
                </button>
              );
            })}

            {activeCategory !== 'all' && (
              <span className="px-3 py-1.5 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-[12px] text-emerald-100 shrink-0">
                Category: {categories.find((c) => c.slug === activeCategory)?.name || activeCategory}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            {(activeCategory !== 'all' || roomFilter !== 'all' || searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="text-[12px] text-emerald-200 hover:text-white inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            )}

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort plants"
              className="h-9 px-3.5 rounded-xl bg-canopy-950/70 border border-white/15 text-[12.5px] text-linen-100 focus:outline-none focus:border-emerald-300"
            >
              <option value="featured">Sort: Featured Bestsellers</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
            <p className="font-serif text-2xl text-white">No plants match that exact filter combination</p>
            <p className="text-sm text-emerald-100/70 mt-2">
              Reset filters to explore all self-watering indoor plants grown at our Pune nursery.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-5 px-6 py-2.5 rounded-full bg-white text-canopy-950 text-sm font-semibold"
            >
              Show All Plants
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {filteredProducts.map((plant) => {
              const isWishlisted = wishlist.includes(plant.slug);
              const chosenColor = selectedColors[plant.slug] || plant.potColors?.[0] || 'Matte Ivory';
              const discountPct = Math.round(
                ((plant.originalPrice - plant.price) / plant.originalPrice) * 100
              );

              return (
                <div
                  key={plant.slug}
                  className="group bg-white text-canopy-950 rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-transform duration-300 hover:-translate-y-1.5 flex flex-col"
                >
                  {/* Image Stage */}
                  <div className="relative aspect-[4/3.6] bg-linen-100 overflow-hidden">
                    <img
                      src={plant.imageUrl}
                      alt={plant.name}
                      loading="lazy"
                      onClick={() => onQuickView(plant)}
                      className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top Left Badge */}
                    {plant.badge && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-canopy-950/90 text-white text-[10.5px] font-semibold tracking-wide">
                        {plant.badge}
                      </span>
                    )}

                    {/* Top Right Quick Actions */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <button
                        onClick={() => onToggleWishlist(plant.slug)}
                        aria-label="Toggle wishlist"
                        className="w-8 h-8 rounded-full bg-white/92 hover:bg-white shadow-sm flex items-center justify-center transition"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isWishlisted
                              ? 'fill-terracotta-500 text-terracotta-500'
                              : 'text-canopy-800'
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => onQuickView(plant)}
                        aria-label="Quick view details"
                        className="w-8 h-8 rounded-full bg-white/92 hover:bg-white shadow-sm flex items-center justify-center text-canopy-800 transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Light condition subtle pill */}
                    <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[10.5px] font-medium text-canopy-900">
                      ☀️ {plant.lightLevel}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 lg:p-5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between text-[11.5px] text-canopy-700/75">
                      <span className="italic font-serif text-[13px] truncate">
                        {plant.botanicalName}
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-canopy-900 shrink-0">
                        <Star className="w-3.5 h-3.5 fill-brass-500 text-brass-500" />
                        {plant.rating.toFixed(1)}
                        <span className="text-canopy-700/50 font-normal">({plant.reviewCount})</span>
                      </span>
                    </div>

                    <h3
                      onClick={() => onQuickView(plant)}
                      className="font-serif text-[20px] font-semibold text-canopy-950 mt-1 cursor-pointer hover:text-canopy-700 transition leading-snug"
                    >
                      {plant.name}
                    </h3>

                    <p className="text-[12.5px] text-canopy-800/70 line-clamp-2 mt-1 leading-relaxed">
                      {plant.shortDescription}
                    </p>

                    {/* Pot Finish Swatch Selector */}
                    <div className="mt-3.5 pt-3 border-t border-canopy-900/8 flex items-center justify-between">
                      <span className="text-[11px] text-canopy-800/70 font-medium">
                        Pot: <strong className="text-canopy-950">{chosenColor}</strong>
                      </span>
                      <div className="flex items-center gap-1.5">
                        {(plant.potColors || []).map((color) => (
                          <button
                            key={color}
                            type="button"
                            title={color}
                            onClick={() =>
                              setSelectedColors((prev) => ({ ...prev, [plant.slug]: color }))
                            }
                            className={`w-4 h-4 rounded-full border transition ${getPotSwatchClass(
                              color
                            )} ${
                              chosenColor === color
                                ? 'ring-2 ring-offset-1 ring-canopy-900 border-white scale-110'
                                : 'border-black/20 hover:scale-105'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="mt-4 flex items-center justify-between gap-3 pt-1">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[19px] font-bold text-canopy-950">
                            ₹{plant.price}
                          </span>
                          <span className="text-[12.5px] text-canopy-700/50 line-through">
                            ₹{plant.originalPrice}
                          </span>
                        </div>
                        {discountPct > 0 && (
                          <span className="text-[10.5px] font-semibold text-emerald-700">
                            Save {discountPct}% • Self-Watering
                          </span>
                        )}
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
                        className="h-10 px-4 rounded-xl bg-canopy-900 hover:bg-canopy-950 text-white text-[12.5px] font-semibold inline-flex items-center gap-1.5 transition active:scale-95 shrink-0"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
