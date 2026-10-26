import React, { useState, useEffect } from 'react';
import { X, Plus, Check, Sparkles, ShoppingBag, Trash2, Leaf } from 'lucide-react';
import { getPotSwatchClass } from '../lib/api.js';
import { buildWhatsAppUrl, WhatsAppIcon } from '../lib/whatsapp.jsx';

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
      productName: `${comboSize}-Plant Self-Watering Box`,
      imageUrl: currentSlots[0]?.imageUrl || '/images/hero-1.jpg',
      potColor,
      potSize: `Set of ${comboSize} Hydro-Wick Pots`,
      unitPrice: comboPrice,
      quantity: 1,
      isBundle: true,
      bundleItems: currentSlots.map((s) => s.name)
    });
    onClose();
  };

  const bundleWaUrl = buildWhatsAppUrl(
    storeConfig,
    isComplete
      ? `Hi Greenzo Pune! I want to order my curated ${comboSize}-Plant Self-Watering Box @ ₹${comboPrice} (${potColor} pots): ${currentSlots
          .map((s, idx) => `${idx + 1}. ${s.name}`)
          .join(', ')}.`
      : `Hi Greenzo Pune! Help me curate my ${comboSize}-Plant Self-Watering Box @ ₹${comboPrice}.`
  );

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-3 sm:p-6">
      <div onClick={onClose} className="absolute inset-0 animate-fade-in bg-canopy-950/60 backdrop-blur-md" />
      <div className="relative flex max-h-[92vh] w-full max-w-[980px] animate-scale-in flex-col overflow-hidden rounded-[28px] border border-canopy-950/12 bg-linen-50 shadow-elevated">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 bg-canopy-950 px-6 py-5 text-white">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" /> Signature Bestseller Offer
            </div>
            <h3 className="mt-1 font-serif text-2xl font-medium tracking-tight sm:text-[28px]">
              Curate Your {comboSize}-Plant Box — <span className="italic font-normal text-emerald-200">₹{comboPrice}</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close bundle builder"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto bg-linen-50 p-5 sm:p-6">
          <div className="rounded-[20px] border border-canopy-950/10 bg-white p-4 shadow-soft sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-canopy-950">
                  Your {comboSize} Slots — {currentSlots.length}/{comboSize}
                </p>
                <p className="text-xs text-stone-500">Tap a slot to remove • Tap plants below to add</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="hidden text-xs font-semibold text-stone-600 sm:inline">Pot Finish:</span>
                {POT_PALETTE.map((color) => (
                  <button
                    key={color}
                    onClick={() => setPotColor(color)}
                    title={color}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold transition ${
                      potColor === color
                        ? 'border-canopy-950 bg-canopy-950 text-white'
                        : 'border-canopy-950/10 bg-linen-50 text-stone-700 hover:bg-white'
                    }`}
                  >
                    <span className={`h-3 w-3 rounded-full border border-black/10 ${getPotSwatchClass(color)}`} />
                    <span className="hidden sm:inline">{color.split(' ')[1] || color}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: comboSize }).map((_, idx) => {
                const plant = currentSlots[idx];
                return plant ? (
                  <div
                    key={`${plant.slug}-${idx}`}
                    className="relative flex items-center gap-3 rounded-2xl border border-canopy-950/10 bg-linen-50 p-3"
                  >
                    <img
                      src={plant.imageUrl}
                      alt={plant.name}
                      className="h-12 w-12 shrink-0 rounded-xl border border-canopy-950/10 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-canopy-950">{plant.name}</p>
                      <p className="text-[11px] font-medium text-stone-500">₹{plant.price} value</p>
                    </div>
                    <button
                      onClick={() => removeSlotAt(idx)}
                      aria-label={`Remove ${plant.name}`}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-canopy-950/10 bg-white transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <div
                    key={`empty-${idx}`}
                    className="flex h-[72px] flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-canopy-950/12 bg-white p-3 text-xs font-medium text-stone-500"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-linen-100">
                      <Plus className="h-3 w-3" />
                    </span>
                    Pick #{idx + 1}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-stone-600">
              <Leaf className="h-3.5 w-3.5 text-canopy-600" /> Available Indoor Plants — Tap to Add
            </h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {eligible.map((plant) => {
                const count = currentSlots.filter((s) => s.slug === plant.slug).length;
                const disabled = currentSlots.length >= comboSize;
                return (
                  <div
                    key={plant.slug}
                    onClick={() => !disabled && addPlantToBox(plant)}
                    className={`group cursor-pointer rounded-[18px] border bg-white p-3 transition ${
                      disabled
                        ? 'cursor-not-allowed border-canopy-950/10 opacity-60'
                        : 'border-canopy-950/10 hover:border-canopy-700 hover:shadow-soft'
                    }`}
                  >
                    <div className="relative mb-2.5 aspect-square overflow-hidden rounded-xl border border-canopy-950/10 bg-linen-50">
                      <img
                        src={plant.imageUrl}
                        alt={plant.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      {count > 0 && (
                        <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-canopy-950 px-2 py-0.5 text-[10px] font-bold text-white">
                          <Check className="h-3 w-3 text-emerald-300" /> {count}×
                        </span>
                      )}
                    </div>
                    <p className="truncate text-[13px] font-bold text-canopy-950">{plant.name}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[11.5px] font-semibold text-stone-500">₹{plant.price}</span>
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-canopy-950/10 bg-linen-50 transition group-hover:border-canopy-950 group-hover:bg-canopy-950 group-hover:text-white">
                        <Plus className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-canopy-950/10 bg-white px-6 py-4 sm:flex-row">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-canopy-950 num">₹{comboPrice}</span>
              {individualTotal > comboPrice && (
                <span className="text-sm text-stone-400 line-through num">₹{individualTotal}</span>
              )}
              {savings > 0 && (
                <span className="rounded-full border border-canopy-600/20 bg-canopy-50 px-2.5 py-0.5 text-xs font-bold text-canopy-800">
                  Save ₹{savings}
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-stone-500">
              {comboSize} self-watering pots ({potColor}) • Free delivery &amp; WhatsApp photo proof
            </p>
          </div>

          <div className="flex w-full flex-wrap items-center justify-end gap-2.5 sm:w-auto">
            <a
              href={bundleWaUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-whatsapp px-5 text-xs sm:text-sm font-bold text-white shadow-whatsapp transition hover:bg-whatsapp-dark active:scale-95 sm:flex-initial"
            >
              <WhatsAppIcon className="h-4 w-4" /> Order on WhatsApp
            </a>
            <button
              disabled={!isComplete}
              onClick={handleConfirmBundle}
              className={`inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full px-6 text-xs sm:text-sm font-bold transition sm:flex-initial ${
                isComplete
                  ? 'bg-canopy-950 text-white shadow-soft hover:bg-canopy-800 active:scale-95'
                  : 'cursor-not-allowed bg-linen-100 text-stone-400'
              }`}
            >
              <ShoppingBag className="h-4 w-4 text-emerald-300" />{' '}
              {isComplete ? `Add Box to Bag — ₹${comboPrice}` : `Select ${comboSize - currentSlots.length} more`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
