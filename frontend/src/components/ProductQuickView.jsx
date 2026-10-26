import React, { useState, useEffect } from 'react';
import { X, Star, Droplets, Sun, Wind, Check, ShoppingBag, Leaf } from 'lucide-react';
import { getPotSwatchClass } from '../lib/api.js';
import { buildWhatsAppUrl, WhatsAppIcon } from '../lib/whatsapp.jsx';
import PincodeChecker from './PincodeChecker.jsx';

export default function ProductQuickView({ storeConfig = {}, product, onClose, onAddToCart }) {
  const [activeImg, setActiveImg] = useState('');
  const [potColor, setPotColor] = useState('Matte Ivory');
  const [potSize, setPotSize] = useState('Medium (5 inch Self-Watering)');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
      setActiveImg(product.imageUrl);
      setPotColor(product.potColors?.[0] || 'Matte Ivory');
      setPotSize('Medium (5 inch Self-Watering)');
      setQty(1);
    }
  }, [product]);

  if (!product) return null;

  const unitPrice = potSize === 'Large (6.5 inch Self-Watering)' ? product.maxPrice : product.price;
  const gallery = product.gallery?.length ? product.gallery : [product.imageUrl];
  const waProductUrl = buildWhatsAppUrl(
    storeConfig,
    `Hi Greenzo! I want to order / see a live photo of ${product.name} (${potSize}, ${potColor}) × ${qty} — Total ₹${unitPrice * qty}.`
  );

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-3 sm:p-6">
      <div onClick={onClose} className="absolute inset-0 animate-fade-in bg-canopy-950/60 backdrop-blur-md" />
      <div className="relative grid max-h-[92vh] w-full max-w-5xl animate-scale-in overflow-hidden rounded-[28px] border border-canopy-950/12 bg-white shadow-elevated md:grid-cols-12">
        <button
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-canopy-950/10 bg-white text-stone-600 shadow-sm transition hover:bg-linen-50 hover:text-canopy-950"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left — Gallery */}
        <div className="flex flex-col border-b border-canopy-950/10 bg-linen-75 p-5 sm:p-7 md:col-span-6 md:border-b-0 md:border-r">
          <div className="aspect-square overflow-hidden rounded-[20px] border border-canopy-950/10 bg-white p-2 shadow-soft">
            <img
              src={activeImg || product.imageUrl}
              alt={product.name}
              className="h-full w-full rounded-[14px] object-cover"
            />
          </div>
          {gallery.length > 1 && (
            <div className="no-scrollbar mt-4 flex gap-2.5 overflow-x-auto">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(img)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    activeImg === img
                      ? 'border-canopy-950 shadow-sm'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
          <div className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-stone-600">
            <span className="h-2 w-2 rounded-full bg-canopy-600" /> 14-day self-watering planter included
          </div>
        </div>

        {/* Right — Details */}
        <div className="space-y-4 overflow-y-auto p-6 sm:p-8 md:col-span-6">
          <div className="inline-flex items-center gap-2">
            <span className="eyebrow">Pune Nursery Edition</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
            <span className="font-serif text-sm italic">{product.botanicalName}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 font-bold text-canopy-950">
              <Star className="h-3.5 w-3.5 fill-brass-500 text-brass-500" /> {product.rating} ({product.reviewCount})
            </span>
            <span className="hidden rounded-full border border-canopy-950/10 bg-linen-50 px-2.5 py-0.5 text-[11px] font-semibold sm:inline-flex">
              Indoor · AC Ready
            </span>
          </div>

          <h3 className="font-serif text-[28px] font-semibold leading-tight tracking-tight text-canopy-950 sm:text-[30px]">
            {product.name}
          </h3>

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-serif text-[28px] font-bold tracking-tight text-canopy-950 num">₹{unitPrice}</span>
            <span className="text-sm text-stone-400 line-through num">₹{product.originalPrice}</span>
            <span className="rounded-full border border-canopy-600/20 bg-canopy-50 px-2.5 py-1 text-[11px] font-bold text-canopy-800">
              In Stock · {product.stockQty} left
            </span>
          </div>

          <p className="text-[13.5px] leading-relaxed text-stone-600">{product.description}</p>

          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Sun, label: 'Light', value: product.lightLevel },
              { icon: Droplets, label: 'Water', value: product.waterSchedule },
              { icon: Wind, label: 'Benefit', value: 'Air Purifying' }
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-2xl border border-canopy-950/10 bg-linen-50 p-3">
                <Icon className="mb-1 h-4 w-4 text-canopy-700" />
                <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500">{label}</div>
                <div className="mt-1 line-clamp-2 text-[12px] font-bold leading-tight text-canopy-950">{value}</div>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500">
                Planter Size
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Medium 5″', full: 'Medium (5 inch Self-Watering)', price: product.price },
                  { label: 'Large 6.5″', full: 'Large (6.5 inch Self-Watering)', price: product.maxPrice }
                ].map((s) => (
                  <button
                    key={s.full}
                    onClick={() => setPotSize(s.full)}
                    className={`rounded-2xl border p-3 text-left transition ${
                      potSize === s.full
                        ? 'border-canopy-950 bg-canopy-950 text-white shadow-soft'
                        : 'border-canopy-950/10 bg-white hover:border-canopy-600/35'
                    }`}
                  >
                    <div className="text-xs font-bold">{s.label}</div>
                    <div className={`text-[11px] font-semibold num ${potSize === s.full ? 'text-emerald-300' : 'text-stone-500'}`}>
                      ₹{s.price}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500">
                Pot Finish — <span className="font-bold normal-case tracking-normal text-canopy-950">{potColor}</span>
              </span>
              <div className="flex items-center gap-2.5">
                {(product.potColors || []).map((color) => (
                  <button
                    key={color}
                    title={color}
                    onClick={() => setPotColor(color)}
                    className={`h-7 w-7 rounded-full border-2 transition ${getPotSwatchClass(color)} ${
                      potColor === color
                        ? 'scale-110 border-white ring-2 ring-canopy-950 ring-offset-2'
                        : 'border-white shadow-sm'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            {(product.features || []).slice(0, 3).map((f) => (
              <div
                key={f}
                className="flex items-center gap-2 rounded-full border border-canopy-950/10 bg-linen-50 px-3 py-1.5 text-xs font-semibold text-stone-700"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-canopy-950/10 bg-white">
                  <Check className="h-3 w-3 text-canopy-600" />
                </span>{' '}
                {f}
              </div>
            ))}
          </div>

          <PincodeChecker compact />

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <div className="flex h-11 items-center rounded-full border border-canopy-950/12 bg-linen-50 px-1">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold hover:bg-white"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-bold num">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold hover:bg-white"
              >
                +
              </button>
            </div>

            <button
              onClick={() => {
                onAddToCart({
                  slug: product.slug,
                  productName: product.name,
                  imageUrl: product.imageUrl,
                  potColor,
                  potSize,
                  unitPrice,
                  quantity: qty,
                  isBundle: false
                });
                onClose();
              }}
              className="flex-1 min-w-[160px] h-11 rounded-full bg-canopy-950 hover:bg-canopy-800 text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 shadow-soft transition active:scale-95"
            >
              <ShoppingBag className="h-4 w-4 text-emerald-300" /> Add to Bag — ₹{unitPrice * qty}
            </button>

            <a
              href={waProductUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full h-11 rounded-full bg-whatsapp hover:bg-whatsapp-dark text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 shadow-whatsapp transition active:scale-95"
            >
              <WhatsAppIcon className="h-4 w-4" /> Order / Ask Live Photo on WhatsApp
            </a>
          </div>

          <p className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-stone-500">
            <Leaf className="h-3 w-3 text-canopy-600" /> Free WhatsApp photo confirmation before dispatch
          </p>
        </div>
      </div>
    </div>
  );
}
