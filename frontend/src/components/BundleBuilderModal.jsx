import React, { useState, useEffect } from 'react';
import { X, Plus, Check, Sparkles, ShoppingBag, Trash2, Leaf } from 'lucide-react';
import { getPotSwatchClass } from '../lib/api.js';

const POT_PALETTE = ['Matte Ivory', 'Forest Sage', 'Terracotta Sand', 'Charcoal Matte'];

export default function BundleBuilderModal({ isOpen, onClose, storeConfig = {}, products = [], onAddBundleToCart }) {
  const comboPrice = Number(storeConfig.comboBundlePrice || 999);
  const comboSize = Math.max(2, Math.min(8, Number(storeConfig.comboBundleSize || 4)));
  const eligible = products.filter((p) => p.bundleEligible !== false);
  const [slots, setSlots] = useState([]);
  const [potColor, setPotColor] = useState('Matte Ivory');

  useEffect(() => {
    if (isOpen && eligible.length > 0 && slots.length === 0) setSlots(eligible.slice(0, comboSize));
  }, [isOpen, eligible, comboSize, slots.length]);

  if (!isOpen) return null;

  const currentSlots = slots.slice(0, comboSize);
  const individualTotal = currentSlots.reduce((sum, p) => sum + (p?.price || 269), 0);
  const savings = Math.max(0, individualTotal - comboPrice);
  const isComplete = currentSlots.length === comboSize;

  const addPlantToBox = (plant) => {
    if (currentSlots.length >= comboSize) return;
    setSlots([...currentSlots, plant]);
  };
  const removeSlotAt = (idx) => setSlots(currentSlots.filter((_, i) => i !== idx));
  const handleConfirmBundle = () => {
    if (!isComplete) return;
    onAddBundleToCart({
      slug: `bundle-${comboPrice}-${Date.now()}`,
      productName: `${comboSize}-Plant Atelier Box`,
      imageUrl: currentSlots[0]?.imageUrl || '/images/hero-1.jpg',
      potColor,
      potSize: `Set of ${comboSize} Hydro-Wick Pots`,
      unitPrice: comboPrice,
      quantity: 1,
      isBundle: true,
      bundleItems: currentSlots.map((s) => s.name),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div onClick={onClose} className="absolute inset-0 bg-canopy-950/60 backdrop-blur-md" />
      <div className="relative w-full max-w-[980px] max-h-[92vh] bg-white rounded-[28px] shadow-elevated border border-stone-100 overflow-hidden flex flex-col">
        {/* Header — atelier */}
        <div className="px-6 py-5 bg-canopy-950 text-white flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.16em] uppercase font-bold text-emerald-300">
              <Sparkles className="w-3.5 h-3.5" /> Signature Atelier Offer
            </div>
            <h3 className="font-serif text-2xl sm:text-[28px] font-medium tracking-tight mt-1">
              Curate Your {comboSize}-Plant Box — <span className="italic font-normal text-emerald-200">₹{comboPrice}</span>
            </h3>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 flex items-center justify-center text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-linen-50">
          <div className="bg-white rounded-[20px] p-4 sm:p-5 border border-stone-100 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-sm font-semibold text-canopy-950">Your {comboSize} Slots — {currentSlots.length}/{comboSize}</p>
                <p className="text-xs text-stone-500">Tap a slot to remove • Pick plants below to fill</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-stone-600 hidden sm:inline">Pot:</span>
                {POT_PALETTE.map((color) => (
                  <button
                    key={color}
                    onClick={() => setPotColor(color)}
                    title={color}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 transition ${potColor === color ? 'bg-canopy-950 text-white border-canopy-950' : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-white'}`}
                  >
                    <span className={`w-3 h-3 rounded-full border border-black/10 ${getPotSwatchClass(color)}`} />
                    <span className="hidden sm:inline">{color.split(' ')[1] || color}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Array.from({ length: comboSize }).map((_, idx) => {
                const plant = currentSlots[idx];
                return plant ? (
                  <div key={`${plant.slug}-${idx}`} className="relative rounded-2xl bg-stone-50 border border-stone-100 p-3 flex items-center gap-3">
                    <img src={plant.imageUrl} alt={plant.name} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-100" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-canopy-950 truncate">{plant.name}</p>
                      <p className="text-[11px] text-stone-500">₹{plant.price} value</p>
                    </div>
                    <button onClick={() => removeSlotAt(idx)} className="w-7 h-7 rounded-full bg-white border border-stone-200 hover:bg-red-50 hover:text-red-600 flex items-center justify-center shrink-0 transition">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div key={`empty-${idx}`} className="rounded-2xl border-2 border-dashed border-stone-200 bg-white p-3 flex flex-col items-center justify-center gap-1 h-[72px] text-xs text-stone-500">
                    <span className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center"><Plus className="w-3 h-3" /></span>
                    Pick #{idx + 1}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-bold tracking-[0.12em] uppercase text-stone-600 mb-3 flex items-center gap-2">
              <Leaf className="w-3.5 h-3.5" /> Atelier Collection — Tap to Add
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {eligible.map((plant) => {
                const count = currentSlots.filter((s) => s.slug === plant.slug).length;
                const disabled = currentSlots.length >= comboSize;
                return (
                  <div
                    key={plant.slug}
                    onClick={() => !disabled && addPlantToBox(plant)}
                    className={`group rounded-[18px] bg-white p-3 border transition cursor-pointer ${disabled ? 'opacity-60 cursor-not-allowed border-stone-100' : 'border-stone-100 hover:border-canopy-900 hover:shadow-soft'}`}
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-50 mb-2.5 border border-stone-100">
                      <img src={plant.imageUrl} alt={plant.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      {count > 0 && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-canopy-950 text-white text-[10px] font-bold flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-300" /> {count}×
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] font-semibold text-canopy-950 truncate">{plant.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[11.5px] text-stone-500">₹{plant.price}</span>
                      <span className="w-7 h-7 rounded-full bg-linen-50 group-hover:bg-canopy-950 group-hover:text-white flex items-center justify-center transition border border-stone-100 group-hover:border-canopy-950">
                        <Plus className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-white border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-canopy-950">₹{comboPrice}</span>
              {individualTotal > comboPrice && <span className="text-sm text-stone-400 line-through">₹{individualTotal}</span>}
              {savings > 0 && <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-bold">Save ₹{savings}</span>}
            </div>
            <p className="text-xs text-stone-500">{comboSize} hydro-wick pots ({potColor}) • Free shipping & photo confirmation</p>
          </div>
          <button
            disabled={!isComplete}
            onClick={handleConfirmBundle}
            className={`w-full sm:w-auto h-12 px-7 rounded-full font-semibold text-sm inline-flex items-center justify-center gap-2 transition ${isComplete ? 'bg-canopy-950 hover:bg-black text-white shadow-soft active:scale-95' : 'bg-stone-100 text-stone-400 cursor-not-allowed'}`}
          >
            <ShoppingBag className="w-4 h-4" /> {isComplete ? `Add Box to Bag — ₹${comboPrice}` : `Select ${comboSize - currentSlots.length} more`}
          </button>
        </div>
      </div>
    </div>
  );
}
