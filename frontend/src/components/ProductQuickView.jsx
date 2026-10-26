import React, { useState, useEffect } from 'react';
import { X, Star, Droplets, Sun, Wind, Check, ShoppingBag, Leaf } from 'lucide-react';
import { getPotSwatchClass } from '../lib/api.js';

export default function ProductQuickView({ product, onClose, onAddToCart }) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div onClick={onClose} className="absolute inset-0 bg-canopy-950/60 backdrop-blur-md" />
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-white rounded-[28px] shadow-elevated border border-stone-100 overflow-hidden grid md:grid-cols-12">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-50 hover:bg-stone-100 border border-stone-100 flex items-center justify-center text-stone-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left — Gallery */}
        <div className="md:col-span-6 p-6 sm:p-7 bg-linen-75 border-b md:border-b-0 md:border-r border-stone-100 flex flex-col">
          <div className="rounded-[20px] overflow-hidden aspect-square bg-white border border-stone-100 p-2">
            <img src={activeImg || product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-[14px]" />
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-2.5 mt-4 overflow-x-auto no-scrollbar">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(img)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition ${activeImg === img ? 'border-canopy-950 shadow-sm' : 'border-white/0 opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          <div className="mt-4 inline-flex items-center gap-2 text-xs text-stone-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Hydro-wick atelier pot • 14-day reservoir
          </div>
        </div>

        {/* Right — Details */}
        <div className="md:col-span-6 p-6 sm:p-8 space-y-4 overflow-y-auto">
          <div className="inline-flex items-center gap-2">
            <span className="w-7 h-px bg-canopy-900/20" />
            <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-canopy-700">Atelier Edition</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="italic font-serif text-sm">{product.botanicalName}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 font-semibold text-canopy-950">
              <Star className="w-3.5 h-3.5 fill-brass-500 text-brass-500" /> {product.rating} ({product.reviewCount})
            </span>
            <span className="px-2 py-1 rounded-full bg-linen-50 border border-stone-100 text-[11px] hidden sm:inline-flex">Indoor • Pune grown</span>
          </div>

          <h3 className="font-serif text-[30px] font-semibold leading-tight tracking-tight text-canopy-950">{product.name}</h3>

          <div className="flex items-baseline gap-3">
            <span className="text-[28px] font-bold tracking-tight text-canopy-950">₹{unitPrice}</span>
            <span className="text-sm text-stone-400 line-through">₹{product.originalPrice}</span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] font-bold">In Stock • {product.stockQty} left</span>
          </div>

          <p className="text-[13.5px] leading-relaxed text-stone-600">{product.description}</p>

          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Sun, label: 'Light', value: product.lightLevel },
              { icon: Droplets, label: 'Water', value: product.waterSchedule },
              { icon: Wind, label: 'Benefit', value: 'Air Purifying' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
                <Icon className="w-4 h-4 text-canopy-700 mb-1" />
                <div className="text-[10px] font-bold tracking-widest uppercase text-stone-500">{label}</div>
                <div className="text-[12px] font-semibold text-canopy-950 leading-tight mt-1 line-clamp-2">{value}</div>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-stone-500 block mb-2">Planter Size</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Medium 5″', full: 'Medium (5 inch Self-Watering)', price: product.price },
                  { label: 'Large 6.5″', full: 'Large (6.5 inch Self-Watering)', price: product.maxPrice },
                ].map((s) => (
                  <button
                    key={s.full}
                    onClick={() => setPotSize(s.full)}
                    className={`p-3 rounded-2xl border text-left transition ${potSize === s.full ? 'bg-canopy-950 text-white border-canopy-950 shadow-soft' : 'bg-white border-stone-100 hover:border-stone-200'}`}
                  >
                    <div className="text-xs font-semibold">{s.label}</div>
                    <div className="text-[11px] opacity-70">₹{s.price}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-stone-500 block mb-2">
                Pot Finish — <span className="text-canopy-950 normal-case tracking-normal font-semibold">{potColor}</span>
              </span>
              <div className="flex items-center gap-2.5">
                {(product.potColors || []).map((color) => (
                  <button
                    key={color}
                    title={color}
                    onClick={() => setPotColor(color)}
                    className={`w-7 h-7 rounded-full border-2 transition ${getPotSwatchClass(color)} ${potColor === color ? 'ring-2 ring-offset-2 ring-canopy-950 border-white scale-110' : 'border-white shadow-sm'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            {(product.features || []).slice(0, 3).map((f) => (
              <div key={f} className="flex items-center gap-2 text-xs font-medium text-stone-700 bg-stone-50 border border-stone-100 rounded-full px-3 py-2">
                <span className="w-5 h-5 rounded-full bg-white border border-stone-100 flex items-center justify-center"><Check className="w-3 h-3 text-emerald-700" /></span> {f}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center border border-stone-200 rounded-full h-11 px-1 bg-white">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-9 h-9 rounded-full hover:bg-stone-50 flex items-center justify-center text-sm font-bold">−</button>
              <span className="w-8 text-center text-sm font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-9 h-9 rounded-full hover:bg-stone-50 flex items-center justify-center text-sm font-bold">+</button>
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
                  isBundle: false,
                });
                onClose();
              }}
              className="flex-1 h-11 rounded-full bg-canopy-950 hover:bg-black text-white text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-soft transition active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-300" /> Add to Bag — ₹{unitPrice * qty}
            </button>
          </div>
          <p className="text-[11px] text-stone-500 flex items-center gap-1.5 justify-center"><Leaf className="w-3 h-3" /> Free photo confirmation before dispatch</p>
        </div>
      </div>
    </div>
  );
}
