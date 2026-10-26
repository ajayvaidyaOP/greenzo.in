import React, { useState, useEffect } from 'react';
import { Star, Check, ShoppingBag, Heart, Truck, Leaf, Timer } from 'lucide-react';
import { getPotSwatchClass } from '../lib/api.js';
import { buildWhatsAppUrl, WhatsAppIcon } from '../lib/whatsapp.jsx';
import PincodeChecker from './PincodeChecker.jsx';
import Reveal from './Reveal.jsx';

export default function DealOfTheWeek({ storeConfig = {}, dealProduct, isWishlisted, onToggleWishlist, onAddToCart }) {
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
      'Sculptural emerald foliage in our signature 14-day self-watering pot — thrives effortlessly in low light & AC workspaces while purifying indoor air.',
    potColors: ['Matte Ivory', 'Forest Sage', 'Terracotta Sand', 'Charcoal Matte'],
    features: ['14-day reservoir', 'AC office ready', 'Air-purifying', '7-day guarantee']
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
      setTimeLeft({
        d: String(d).padStart(2, '0'),
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0')
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const activePrice = potSize === 'Large (6.5 inch Self-Watering)' ? product.maxPrice : product.price;
  const discount = Math.round(((product.originalPrice - activePrice) / product.originalPrice) * 100);
  const waDealUrl = buildWhatsAppUrl(
    storeConfig,
    `Hi Greenzo! I'd like to order the Weekly Deal: ${product.name} (${potSize}, ${potColor}) @ ₹${activePrice}.`
  );

  return (
    <section id="deal" className="relative overflow-hidden bg-linen-50 py-14 lg:py-20">
      <div className="pointer-events-none absolute -right-32 top-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(31,127,88,0.12),transparent_65%)] blur-2xl" />
      <div className="shell relative">
        <Reveal className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div className="max-w-[640px]">
            <span className="eyebrow">Nursery spotlight · limited batch</span>
            <h2 className="display-section mt-2 text-canopy-950">
              This week&apos;s featured <span className="italic text-canopy-600">bestseller</span>
            </h2>
            <p className="lede mt-2.5 max-w-[52ch]">
              Hand-picked from the healthiest bench at our Pune greenhouse — special weekly pricing while stocks last.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 rounded-full border border-canopy-950/10 bg-white px-3.5 py-2 shadow-soft">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-terracotta-50 text-terracotta-600">
              <Timer className="h-4 w-4" />
            </span>
            <span className="hidden text-[10px] font-extrabold uppercase tracking-[0.16em] text-stone-500 sm:inline">
              Ends in
            </span>
            <div className="flex items-center gap-1 font-mono text-[13px] font-bold text-canopy-950 num">
              {[
                ['d', timeLeft.d],
                ['h', timeLeft.h],
                ['m', timeLeft.m]
              ].map(([u, v]) => (
                <React.Fragment key={u}>
                  <span className="rounded-lg border border-canopy-950/10 bg-linen-50 px-2 py-1">
                    {v}
                    <span className="ml-0.5 text-[9px] font-semibold text-stone-400">{u}</span>
                  </span>
                  <span className="text-stone-300">:</span>
                </React.Fragment>
              ))}
              <span className="rounded-lg bg-canopy-950 px-2 py-1 text-emerald-300">
                {timeLeft.s}
                <span className="ml-0.5 text-[9px] font-semibold text-emerald-300/70">s</span>
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal dir="scale" className="overflow-hidden rounded-[28px] border border-canopy-950/10 bg-white shadow-card">
          <div className="grid lg:grid-cols-12">
            {/* Media */}
            <div className="relative border-b border-canopy-950/[0.08] bg-linen-75 p-4 sm:p-6 lg:col-span-5 lg:border-b-0 lg:border-r">
              <div className="group relative overflow-hidden rounded-[20px] border border-canopy-950/10 bg-white">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="aspect-[4/3.7] w-full object-cover transition-transform duration-1000 ease-silk group-hover:scale-[1.04]"
                />
                <span className="absolute left-3 top-3 rounded-full bg-terracotta-600 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white shadow-sm">
                  Flat {discount}% Off
                </span>
                <button
                  onClick={() => onToggleWishlist(product.slug)}
                  aria-label="Toggle wishlist"
                  className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/70 bg-white/92 shadow-sm backdrop-blur transition hover:scale-105 ${
                    isWishlisted ? 'text-terracotta-500' : 'text-canopy-900'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-terracotta-500' : ''}`} />
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <span className="flex items-center gap-2 rounded-xl border border-canopy-950/10 bg-white px-3 py-2 text-[11px] font-semibold text-stone-700">
                  <Leaf className="h-3.5 w-3.5 text-canopy-600" /> 14-day self-watering
                </span>
                <span className="flex items-center gap-2 rounded-xl border border-canopy-950/10 bg-white px-3 py-2 text-[11px] font-semibold text-stone-700">
                  <Truck className="h-3.5 w-3.5 text-canopy-600" /> Free Pune dispatch
                </span>
              </div>
              <p className="mt-3 text-center text-[10.5px] font-medium text-stone-500">
                Live WhatsApp photo of your exact plant shared before shipping
              </p>
            </div>

            {/* Details */}
            <div className="p-6 sm:p-8 lg:col-span-7 lg:p-9">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-brass-500 text-brass-500" />
                  ))}
                </span>
                <span className="text-[11.5px] font-bold text-stone-600 num">
                  {product.rating} · {product.reviewCount} verified reviews
                </span>
                <span className="tag border border-canopy-600/20 bg-canopy-50 text-canopy-700">
                  Hydro-wick planter included
                </span>
              </div>

              <p className="mt-3.5 font-serif text-[13px] italic text-stone-500">{product.botanicalName}</p>
              <h3 className="mt-1 font-serif text-[28px] font-medium leading-tight text-canopy-950 sm:text-[34px]">
                {product.name}
              </h3>
              <p className="mt-2.5 max-w-[54ch] text-[13.5px] leading-relaxed text-stone-600">{product.description}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {(product.features || []).map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center gap-1.5 rounded-full border border-canopy-950/10 bg-linen-50 px-3 py-1.5 text-[11px] font-semibold text-canopy-900"
                  >
                    <Check className="h-3 w-3 text-canopy-600 stroke-[2.5]" /> {f}
                  </span>
                ))}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-stone-500">
                    Planter Size
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Medium 5″', full: 'Medium (5 inch Self-Watering)', price: product.price },
                      { label: 'Large 6.5″', full: 'Large (6.5 inch Self-Watering)', price: product.maxPrice }
                    ].map((opt) => (
                      <button
                        key={opt.full}
                        onClick={() => setPotSize(opt.full)}
                        className={`rounded-2xl border p-3 text-left transition-all duration-300 ${
                          potSize === opt.full
                            ? 'border-canopy-950 bg-canopy-950 text-white shadow-soft'
                            : 'border-canopy-950/10 bg-white hover:border-canopy-600/35'
                        }`}
                      >
                        <p className="text-[12px] font-bold">{opt.label}</p>
                        <p className={`text-[11px] font-semibold num ${potSize === opt.full ? 'text-emerald-300' : 'text-stone-500'}`}>
                          ₹{opt.price}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-stone-500">
                    Pot Finish · <span className="normal-case tracking-normal text-canopy-900">{potColor}</span>
                  </p>
                  <div className="flex h-[62px] items-center gap-2.5 rounded-2xl border border-canopy-950/10 bg-linen-50 px-4">
                    {(product.potColors || []).map((c) => (
                      <button
                        key={c}
                        title={c}
                        onClick={() => setPotColor(c)}
                        className={`h-7 w-7 rounded-full border-2 transition duration-200 ${getPotSwatchClass(c)} ${
                          potColor === c
                            ? 'scale-110 border-canopy-950 ring-2 ring-canopy-950/15 ring-offset-1'
                            : 'border-white shadow-sm hover:scale-105'
                        }`}
                      />
                    ))}
                    <span className="ml-auto text-[10.5px] font-medium text-stone-400">Matte finish</span>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <PincodeChecker compact />
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-canopy-950/[0.08] pt-5">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-[32px] font-semibold leading-none tracking-tight text-canopy-950 num">
                      ₹{activePrice}
                    </span>
                    <span className="text-[13px] text-stone-400 line-through num">₹{product.originalPrice}</span>
                  </div>
                  <p className="mt-1 text-[11px] font-semibold text-canopy-700">
                    Includes self-watering planter &amp; organic mix
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
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
                    className="btn btn-dark btn-md"
                  >
                    <ShoppingBag className="h-4 w-4 text-emerald-300" /> Add to Bag
                  </button>

                  <a
                    href={waDealUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-whatsapp btn-md"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> Order on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
