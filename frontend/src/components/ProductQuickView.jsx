import React, { useState, useEffect } from 'react';
import { X, Star, Droplets, Sun, Wind, Check, ShoppingBag } from 'lucide-react';
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

  const unitPrice =
    potSize === 'Large (6.5 inch Self-Watering)' ? product.maxPrice : product.price;
  const gallery = product.gallery?.length ? product.gallery : [product.imageUrl];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-canopy-950/65 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-elevated overflow-y-auto grid md:grid-cols-12">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-linen-100 hover:bg-linen-200 flex items-center justify-center text-canopy-950"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Gallery */}
        <div className="md:col-span-6 p-5 sm:p-6 bg-linen-50 flex flex-col justify-between">
          <div className="rounded-2xl overflow-hidden aspect-square bg-white shadow-sm">
            <img
              src={activeImg || product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-2.5 mt-3">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(img)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                    activeImg === img ? 'border-canopy-900' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Details */}
        <div className="md:col-span-6 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-xs text-canopy-700">
            <span className="italic font-serif text-sm">{product.botanicalName}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 font-bold text-canopy-950">
              <Star className="w-3.5 h-3.5 fill-brass-500 text-brass-500" />
              {product.rating} ({product.reviewCount})
            </span>
          </div>

          <h3 className="font-serif text-3xl font-semibold text-canopy-950 leading-tight">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl font-bold text-canopy-950">₹{unitPrice}</span>
            <span className="text-sm text-canopy-700/50 line-through">
              ₹{product.originalPrice}
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-bold">
              In Stock ({product.stockQty} left)
            </span>
          </div>

          <p className="text-[13.5px] leading-relaxed text-canopy-800/80">
            {product.description}
          </p>

          {/* Care Specs Strip */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="p-2.5 rounded-xl bg-linen-50 border border-canopy-900/8">
              <Sun className="w-4 h-4 text-canopy-700 mb-1" />
              <div className="text-[10px] uppercase font-bold text-canopy-700/70">Light</div>
              <div className="text-[11.5px] font-semibold text-canopy-950 leading-tight mt-0.5">
                {product.lightLevel}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-linen-50 border border-canopy-900/8">
              <Droplets className="w-4 h-4 text-canopy-700 mb-1" />
              <div className="text-[10px] uppercase font-bold text-canopy-700/70">Watering</div>
              <div className="text-[11.5px] font-semibold text-canopy-950 leading-tight mt-0.5">
                {product.waterSchedule}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-linen-50 border border-canopy-900/8">
              <Wind className="w-4 h-4 text-canopy-700 mb-1" />
              <div className="text-[10px] uppercase font-bold text-canopy-700/70">Benefit</div>
              <div className="text-[11.5px] font-semibold text-canopy-950 leading-tight mt-0.5">
                Air Purifying
              </div>
            </div>
          </div>

          {/* Size & Pot Color */}
          <div className="space-y-3 pt-1">
            <div>
              <span className="text-xs font-bold text-canopy-800 block mb-1.5">Planter Size</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Medium 5"', full: 'Medium (5 inch Self-Watering)', price: product.price },
                  { label: 'Large 6.5"', full: 'Large (6.5 inch Self-Watering)', price: product.maxPrice }
                ].map((s) => (
                  <button
                    key={s.full}
                    onClick={() => setPotSize(s.full)}
                    className={`p-2 rounded-xl border text-left text-xs transition ${
                      potSize === s.full
                        ? 'bg-canopy-900 text-white border-canopy-900 font-semibold'
                        : 'border-canopy-900/15 text-canopy-900'
                    }`}
                  >
                    {s.label} — ₹{s.price}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-canopy-800 block mb-1.5">
                Self-Watering Pot Finish: <span className="text-canopy-950">{potColor}</span>
              </span>
              <div className="flex items-center gap-2.5">
                {(product.potColors || []).map((color) => (
                  <button
                    key={color}
                    onClick={() => setPotColor(color)}
                    title={color}
                    className={`w-6 h-6 rounded-full border ${getPotSwatchClass(color)} ${
                      potColor === color
                        ? 'ring-2 ring-offset-2 ring-canopy-900'
                        : 'border-black/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            {(product.features || []).slice(0, 3).map((f) => (
              <div key={f} className="flex items-center gap-2 text-xs text-canopy-800">
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>{f}</span>
              </div>
            ))}
          </div>

          {/* Quantity + Add */}
          <div className="flex items-center gap-3 pt-3">
            <div className="flex items-center border border-canopy-900/15 rounded-full h-11 px-2">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-8 h-8 text-base font-bold"
              >
                −
              </button>
              <span className="w-7 text-center text-sm font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-8 h-8 text-base font-bold"
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
              className="flex-1 h-11 rounded-full bg-canopy-900 hover:bg-canopy-950 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-300" />
              <span>Add to Bag • ₹{unitPrice * qty}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
