import React, { useState, useEffect } from 'react';
import { X, Plus, Check, Sparkles, ShoppingBag, Trash2 } from 'lucide-react';
import { getPotSwatchClass } from '../lib/api.js';

const POT_PALETTE = ['Matte Ivory', 'Forest Sage', 'Terracotta Sand', 'Charcoal Matte'];

export default function BundleBuilderModal({
  isOpen,
  onClose,
  storeConfig = {},
  products = [],
  onAddBundleToCart
}) {
  const comboPrice = Number(storeConfig.comboBundlePrice || 999);
  const comboSize = Math.max(2, Math.min(8, Number(storeConfig.comboBundleSize || 4)));

  const eligible = products.filter((p) => p.bundleEligible !== false);
  const [slots, setSlots] = useState([]);
  const [potColor, setPotColor] = useState('Matte Ivory');

  useEffect(() => {
    if (isOpen && eligible.length > 0 && slots.length === 0) {
      setSlots(eligible.slice(0, comboSize));
    }
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

  const removeSlotAt = (idx) => {
    setSlots(currentSlots.filter((_, i) => i !== idx));
  };

  const handleConfirmBundle = () => {
    if (!isComplete) return;
    onAddBundleToCart({
      slug: `bundle-${comboPrice}-${Date.now()}`,
      productName: `${comboSize}-Plant Self-Watering Sanctuary Box`,
      imageUrl: currentSlots[0]?.imageUrl || '/images/hero-1.jpg',
      potColor,
      potSize: `Set of ${comboSize} Self-Watering Pots`,
      unitPrice: comboPrice,
      quantity: 1,
      isBundle: true,
      bundleItems: currentSlots.map((s) => s.name)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-canopy-950/65 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-[960px] max-h-[90vh] bg-linen-50 rounded-3xl shadow-elevated border border-canopy-900/10 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-canopy-900 text-white flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-emerald-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Signature Greenzo Offer
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium mt-0.5">
              Customize Your {comboSize}-Plant Self-Watering Box @ ₹{comboPrice}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-canopy-900/10 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-sm font-semibold text-canopy-950">
                  Your {comboSize} Self-Watering Slots ({currentSlots.length}/{comboSize} Selected)
                </p>
                <p className="text-xs text-canopy-700/75">
                  Click any slot to swap, or pick your favorite plants below.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-canopy-800">Pot Finish:</span>
                {POT_PALETTE.map((color) => (
                  <button
                    key={color}
                    onClick={() => setPotColor(color)}
                    title={color}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium border flex items-center gap-1.5 transition ${
                      potColor === color
                        ? 'bg-canopy-900 text-white border-canopy-900'
                        : 'bg-linen-50 text-canopy-900 border-canopy-900/15 hover:bg-linen-100'
                    }`}
                  >
                    <span
                      className={`w-3 h-3 rounded-full border border-black/15 ${getPotSwatchClass(
                        color
                      )}`}
                    />
                    <span className="hidden sm:inline">{color.split(' ')[1] || color}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Array.from({ length: comboSize }).map((_, slotIdx) => {
                const plant = currentSlots[slotIdx];
                return plant ? (
                  <div
                    key={`${plant.slug}-${slotIdx}`}
                    className="relative rounded-xl bg-linen-50 border border-canopy-900/15 p-2.5 flex items-center gap-2.5"
                  >
                    <img
                      src={plant.imageUrl}
                      alt={plant.name}
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-canopy-950 truncate">{plant.name}</p>
                      <p className="text-[11px] text-canopy-700/70">Worth ₹{plant.price}</p>
                    </div>
                    <button
                      onClick={() => removeSlotAt(slotIdx)}
                      title="Remove from slot"
                      className="w-6 h-6 rounded-full bg-white hover:bg-red-50 text-canopy-700 hover:text-red-600 border border-canopy-900/10 flex items-center justify-center shrink-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div
                    key={`empty-${slotIdx}`}
                    className="rounded-xl border-2 border-dashed border-canopy-900/20 p-3 flex items-center justify-center text-xs text-canopy-700/60 h-[68px]"
                  >
                    + Pick Plant #{slotIdx + 1}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-canopy-700 mb-3">
              Tap Any Nursery Plant to Add to Your Box
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {eligible.map((plant) => {
                const countInBox = currentSlots.filter((s) => s.slug === plant.slug).length;
                return (
                  <div
                    key={plant.slug}
                    onClick={() => addPlantToBox(plant)}
                    className={`group rounded-2xl bg-white p-3 border transition cursor-pointer ${
                      currentSlots.length >= comboSize
                        ? 'opacity-65 cursor-not-allowed border-canopy-900/10'
                        : 'border-canopy-900/10 hover:border-canopy-800 hover:shadow-sm'
                    }`}
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-linen-100 mb-2.5">
                      <img
                        src={plant.imageUrl}
                        alt={plant.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {countInBox > 0 && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-canopy-900 text-white text-[10px] font-bold flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-300" /> {countInBox}x
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] font-semibold text-canopy-950 truncate">
                      {plant.name}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[11.5px] text-canopy-700/70">Solo ₹{plant.price}</span>
                      <span className="w-6 h-6 rounded-full bg-linen-100 group-hover:bg-canopy-900 group-hover:text-white flex items-center justify-center transition">
                        <Plus className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Sticky Action Bar */}
        <div className="px-6 py-4 bg-white border-t border-canopy-900/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-canopy-950">₹{comboPrice}</span>
              {individualTotal > comboPrice && (
                <span className="text-sm text-canopy-700/60 line-through">₹{individualTotal}</span>
              )}
              {savings > 0 && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-bold">
                  Instant Save ₹{savings} + Free Shipping
                </span>
              )}
            </div>
            <p className="text-xs text-canopy-700/75">
              Includes {comboSize} Self-Watering Pots ({potColor}) + Capillary Wicks + Eco Packaging
            </p>
          </div>

          <button
            disabled={!isComplete}
            onClick={handleConfirmBundle}
            className={`w-full sm:w-auto h-12 px-7 rounded-full font-semibold text-sm inline-flex items-center justify-center gap-2 transition ${
              isComplete
                ? 'bg-canopy-900 hover:bg-canopy-950 text-white shadow-md active:scale-95'
                : 'bg-canopy-900/20 text-canopy-900/50 cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-300" />
            <span>
              {isComplete
                ? `Add ${comboSize}-Plant Box to Bag • ₹${comboPrice}`
                : `Select ${comboSize - currentSlots.length} More`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
