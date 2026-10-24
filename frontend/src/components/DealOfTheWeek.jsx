import React, { useState, useEffect } from 'react';
import { Star, Check, Clock, ShoppingBag, Heart } from 'lucide-react';
import { getPotSwatchClass } from '../lib/api.js';

export default function DealOfTheWeek({
  dealProduct,
  isWishlisted,
  onToggleWishlist,
  onAddToCart
}) {
  const product = dealProduct || {
    slug: 'zamia-green',
    name: 'Zamia Green (ZZ Plant)',
    botanicalName: 'Zamioculcas zamiifolia',
    price: 269,
    maxPrice: 319,
    originalPrice: 349,
    rating: 4.9,
    reviewCount: 312,
    imageUrl: '/images/zamia-green.jpg',
    description:
      'Zamia Green is a sculptural low-maintenance indoor plant with glossy emerald paddle leaves. Paired with our signature dual-chamber self-watering pot, it thrives in apartments and AC workspaces while filtering indoor air.',
    potColors: ['Matte Ivory', 'Forest Sage', 'Terracotta Sand', 'Charcoal Matte'],
    features: [
      '14-day self-watering wick',
      'Thrives in AC offices',
      'Air-purifying foliage',
      '7-day healthy plant replacement'
    ]
  };

  const [potSize, setPotSize] = useState('Medium (5 inch Self-Watering)');
  const [potColor, setPotColor] = useState(product.potColors?.[0] || 'Matte Ivory');
  const [timeLeft, setTimeLeft] = useState({ d: '02', h: '14', m: '36', s: '49' });

  useEffect(() => {
    const endTs = Date.now() + (2 * 86400 + 14 * 3600 + 36 * 60 + 49) * 1000;
    const timer = setInterval(() => {
      const diff = Math.max(0, endTs - Date.now());
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({
        d: String(d).padStart(2, '0'),
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0')
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activePrice =
    potSize === 'Large (6.5 inch Self-Watering)' ? product.maxPrice : product.price;

  return (
    <section id="deal" className="py-16 lg:py-20 bg-white">
      <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-terracotta-600 text-[11px] font-bold tracking-[0.28em] uppercase">
              Best Deals • Limited Nursery Batch
            </span>
            <h2 className="font-serif text-[32px] lg:text-[42px] text-canopy-950 font-semibold leading-tight mt-2">
              This Week’s Plant Deal You Can’t Miss
            </h2>
          </div>

          {/* Live Ticking Countdown */}
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-linen-100 border border-canopy-900/10 self-start md:self-auto">
            <Clock className="w-4 h-4 text-terracotta-600" />
            <span className="text-xs font-semibold text-canopy-800">Batch closes in:</span>
            <div className="flex items-center gap-1 font-mono text-sm font-bold text-canopy-950">
              <span className="px-2 py-0.5 rounded bg-white shadow-sm">{timeLeft.d}d</span>:
              <span className="px-2 py-0.5 rounded bg-white shadow-sm">{timeLeft.h}h</span>:
              <span className="px-2 py-0.5 rounded bg-white shadow-sm">{timeLeft.m}m</span>:
              <span className="px-2 py-0.5 rounded bg-white shadow-sm">{timeLeft.s}s</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center rounded-3xl bg-linen-50 border border-canopy-900/10 p-6 sm:p-8 lg:p-10 shadow-soft">
          {/* Studio Product Visual */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl overflow-hidden bg-white p-3 shadow-sm border border-canopy-900/5">
              <img
                src={product.imageUrl}
                alt={product.name}
                loading="lazy"
                className="w-full aspect-[4/3.6] object-cover rounded-xl"
              />
            </div>
            <span className="absolute top-6 left-6 px-3.5 py-1.5 rounded-full bg-terracotta-600 text-white text-xs font-bold shadow-md">
              FLAT 23% OFF
            </span>
          </div>

          {/* Deal Configuration & Copy */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-1 text-brass-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-brass-500" />
                ))}
              </div>
              <span className="text-xs font-semibold text-canopy-800">
                {product.rating} ({product.reviewCount} verified Pune & India reviews)
              </span>
              <span className="px-3 py-1 rounded-full bg-canopy-100 text-canopy-800 text-[11px] font-semibold">
                Self-Watering Indicator Window
              </span>
            </div>

            <div>
              <p className="italic font-serif text-base text-canopy-700">{product.botanicalName}</p>
              <h3 className="font-serif text-3xl lg:text-4xl font-semibold text-canopy-950 mt-0.5">
                {product.name}
              </h3>
            </div>

            <p className="text-[14.5px] leading-relaxed text-canopy-800/80 max-w-2xl">
              {product.description}
            </p>

            {/* 4 Key Benefits */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {(product.features || []).map((feat) => (
                <div
                  key={feat}
                  className="flex items-center gap-2 text-[12.5px] font-medium text-canopy-900"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Interactive Size & Finish Selector */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[11.5px] font-bold uppercase tracking-wider text-canopy-700 mb-2">
                  Select Planter Size
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Medium 5"', full: 'Medium (5 inch Self-Watering)', price: product.price },
                    { label: 'Large 6.5"', full: 'Large (6.5 inch Self-Watering)', price: product.maxPrice }
                  ].map((opt) => (
                    <button
                      key={opt.full}
                      type="button"
                      onClick={() => setPotSize(opt.full)}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        potSize === opt.full
                          ? 'bg-canopy-900 text-white border-canopy-900'
                          : 'bg-white text-canopy-900 border-canopy-900/15 hover:border-canopy-800'
                      }`}
                    >
                      <div className="text-xs font-semibold">{opt.label}</div>
                      <div className="text-[11px] opacity-80">₹{opt.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11.5px] font-bold uppercase tracking-wider text-canopy-700 mb-2">
                  Pot Colour: <span className="text-canopy-950">{potColor}</span>
                </label>
                <div className="flex items-center gap-2.5 h-[52px] px-3.5 rounded-xl bg-white border border-canopy-900/15">
                  {(product.potColors || []).map((color) => (
                    <button
                      key={color}
                      type="button"
                      title={color}
                      onClick={() => setPotColor(color)}
                      className={`w-6 h-6 rounded-full border transition ${getPotSwatchClass(
                        color
                      )} ${
                        potColor === color
                          ? 'ring-2 ring-offset-2 ring-canopy-900 scale-110'
                          : 'border-black/20 hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Price & Action */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <div className="mr-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-canopy-950">₹{activePrice}.00</span>
                  <span className="text-base text-canopy-700/50 line-through">
                    ₹{product.originalPrice}.00
                  </span>
                </div>
                <span className="text-xs text-emerald-700 font-semibold">
                  Inclusive of Self-Watering Pot & Nutrient Soil
                </span>
              </div>

              <button
                onClick={() =>
                  onAddToCart({
                    slug: product.slug,
                    productName: product.name,
                    imageUrl: product.imageUrl,
                    potColor,
                    potSize,
                    unitPrice: activePrice,
                    quantity: 1,
                    isBundle: false
                  })
                }
                className="h-12 px-7 rounded-full bg-canopy-900 hover:bg-canopy-950 text-white text-sm font-semibold inline-flex items-center gap-2 shadow-md transition active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-300" />
                <span>Add Deal to Bag</span>
              </button>

              <button
                onClick={() => onToggleWishlist(product.slug)}
                className="h-12 px-5 rounded-full bg-white hover:bg-linen-100 border border-canopy-900/15 text-canopy-900 text-sm font-semibold inline-flex items-center gap-2 transition"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted ? 'fill-terracotta-500 text-terracotta-500' : ''
                  }`}
                />
                <span>{isWishlisted ? 'Saved' : 'Wishlist'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
