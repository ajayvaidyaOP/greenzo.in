import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Trash2, Sparkles, Sun, ArrowRight } from 'lucide-react';
import { getPotSwatchClass } from '../lib/api.js';
import { buildWhatsAppUrl, WhatsAppIcon } from '../lib/whatsapp.jsx';

export default function WishlistDrawer({
  isOpen,
  onClose,
  storeConfig = {},
  products = [],
  wishlist = [],
  onToggleWishlist,
  onAddToCart,
  onOpenBundle,
  onSelectProduct,
  onOpenQuiz
}) {
  const [chosenColors, setChosenColors] = useState({});

  if (!isOpen) return null;

  const comboPrice = Number(storeConfig.comboBundlePrice || 999);
  const comboSize = Number(storeConfig.comboBundleSize || 4);
  const savedPlants = products.filter((p) => wishlist.includes(p.slug));
  const totalValue = savedPlants.reduce((sum, p) => sum + p.price, 0);

  const handleMoveAllToBag = () => {
    savedPlants.forEach((plant) => {
      const potColor = chosenColors[plant.slug] || plant.potColors?.[0] || 'Matte Ivory';
      onAddToCart({
        slug: plant.slug,
        productName: plant.name,
        imageUrl: plant.imageUrl,
        potColor,
        potSize: 'Medium (5 inch Self-Watering)',
        unitPrice: plant.price,
        quantity: 1,
        isBundle: false
      });
    });
    onClose();
  };

  const handleBundleFromWishlist = () => {
    if (savedPlants.length >= comboSize) {
      const topSet = savedPlants.slice(0, comboSize);
      onAddToCart({
        slug: `wishlist-bundle-${comboPrice}-${Date.now()}`,
        productName: `Saved ${comboSize}-Plant Box`,
        imageUrl: topSet[0]?.imageUrl || '/images/hero-1.jpg',
        potColor: 'Matte Ivory',
        potSize: `Set of ${comboSize} Hydro-Wick Pots`,
        unitPrice: comboPrice,
        quantity: 1,
        isBundle: true,
        bundleItems: topSet.map((p) => p.name)
      });
      onClose();
    } else {
      onClose();
      onOpenBundle?.();
    }
  };

  const wishlistWaUrl = buildWhatsAppUrl(
    storeConfig,
    `Hi Greenzo Pune! Here are my saved wishlist plants:\n${savedPlants
      .map((p, i) => `${i + 1}. ${p.name} (₹${p.price})`)
      .join('\n')}\nCan you share live photos of these?`
  );

  return (
    <div className="fixed inset-0 z-[88]">
      <div onClick={onClose} className="absolute inset-0 animate-fade-in bg-canopy-950/60 backdrop-blur-sm" />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[440px] animate-slide-in-right flex-col bg-linen-50 shadow-elevated">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-canopy-950/10 bg-white px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-terracotta-50 text-terracotta-600">
              <Heart className="h-4 w-4 fill-terracotta-500 text-terracotta-500" />
            </span>
            <div>
              <h3 className="font-serif text-[20px] font-semibold leading-tight text-canopy-950">
                Saved Plants ({savedPlants.length})
              </h3>
              <p className="text-[11px] font-medium text-stone-500">Your personal sanctuary shortlist</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close wishlist"
            className="grid h-9 w-9 place-items-center rounded-full border border-canopy-950/10 bg-linen-50 text-stone-600 transition hover:bg-white hover:text-canopy-950"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {savedPlants.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4 py-12 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full border border-canopy-950/10 bg-white text-terracotta-400 shadow-soft">
                <Heart className="h-7 w-7" />
              </span>
              <div>
                <h4 className="font-serif text-[22px] font-semibold text-canopy-950">Your wishlist is empty</h4>
                <p className="mx-auto mt-1 max-w-[260px] text-xs leading-relaxed text-stone-500">
                  Tap the ❤️ icon on any plant to shortlist it here, or take our 30-second Plant Finder Quiz!
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onOpenQuiz?.();
                  }}
                  className="btn btn-dark btn-sm"
                >
                  <Sparkles className="h-3.5 w-3.5 text-emerald-300" /> Take 30-Sec Plant Quiz
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              {/* Bundle Upsell Banner */}
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-canopy-600/25 bg-canopy-950 p-3.5 text-white shadow-soft">
                <div>
                  <span className="text-[9.5px] font-extrabold uppercase tracking-[0.18em] text-emerald-300">
                    Smart Bundle Tip
                  </span>
                  <p className="mt-0.5 text-xs font-semibold leading-snug">
                    {savedPlants.length >= comboSize
                      ? `Turn ${comboSize} saved plants into a ₹${comboPrice} Box & save!`
                      : `Save ${comboSize - savedPlants.length} more or build a ${comboSize}-Plant Box @ ₹${comboPrice}`}
                  </p>
                </div>
                <button
                  onClick={handleBundleFromWishlist}
                  className="shrink-0 rounded-full bg-emerald-400 px-3 py-1.5 text-[11px] font-extrabold text-canopy-950 transition hover:bg-emerald-300"
                >
                  {savedPlants.length >= comboSize ? `Make ₹${comboPrice} Box` : 'Open Box'}
                </button>
              </div>

              {savedPlants.map((plant) => {
                const potColor = chosenColors[plant.slug] || plant.potColors?.[0] || 'Matte Ivory';
                return (
                  <div
                    key={plant.slug}
                    className="flex gap-3.5 rounded-2xl border border-canopy-950/10 bg-white p-3.5 shadow-soft"
                  >
                    <img
                      src={plant.imageUrl}
                      alt={plant.name}
                      onClick={() => {
                        onClose();
                        onSelectProduct?.(plant);
                      }}
                      className="h-20 w-20 shrink-0 cursor-pointer rounded-xl border border-canopy-950/10 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          onClick={() => {
                            onClose();
                            onSelectProduct?.(plant);
                          }}
                          className="cursor-pointer truncate text-[13.5px] font-bold text-canopy-950 hover:text-canopy-600"
                        >
                          {plant.name}
                        </h4>
                        <button
                          onClick={() => onToggleWishlist(plant.slug)}
                          aria-label={`Remove ${plant.name}`}
                          className="text-stone-400 transition hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="mt-0.5 flex items-center gap-1 text-[10.5px] font-semibold text-stone-500">
                        <Sun className="h-2.5 w-2.5 text-brass-500" /> {plant.lightLevel}
                      </p>

                      <div className="mt-2 flex items-center gap-1.5">
                        {(plant.potColors || []).slice(0, 4).map((c) => (
                          <button
                            key={c}
                            title={c}
                            onClick={() => setChosenColors((prev) => ({ ...prev, [plant.slug]: c }))}
                            className={`h-4 w-4 rounded-full border-2 ${getPotSwatchClass(c)} ${
                              potColor === c ? 'scale-110 border-canopy-950' : 'border-white shadow-sm'
                            }`}
                          />
                        ))}
                        <span className="truncate text-[10px] font-medium text-stone-400">{potColor}</span>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-extrabold text-canopy-950 num">₹{plant.price}</span>
                          <span className="text-[10.5px] text-stone-400 line-through num">₹{plant.originalPrice}</span>
                        </div>
                        <button
                          onClick={() =>
                            onAddToCart({
                              slug: plant.slug,
                              productName: plant.name,
                              imageUrl: plant.imageUrl,
                              potColor,
                              potSize: 'Medium (5 inch Self-Watering)',
                              unitPrice: plant.price,
                              quantity: 1,
                              isBundle: false
                            })
                          }
                          className="inline-flex h-8 items-center gap-1 rounded-full bg-canopy-950 px-3 text-[11px] font-bold text-white transition hover:bg-canopy-700"
                        >
                          <ShoppingBag className="h-3 w-3 text-emerald-300" /> Add
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {savedPlants.length > 0 && (
          <div className="space-y-2.5 border-t border-canopy-950/10 bg-white p-5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-stone-500">Shortlist Total ({savedPlants.length} plants)</span>
              <span className="text-base font-extrabold text-canopy-950 num">₹{totalValue}</span>
            </div>

            <button
              onClick={handleMoveAllToBag}
              className="btn btn-dark h-11 w-full text-xs sm:text-sm"
            >
              <ShoppingBag className="h-4 w-4 text-emerald-300" /> Move All {savedPlants.length} to Bag
              <ArrowRight className="h-4 w-4" />
            </button>

            <a
              href={wishlistWaUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-full items-center justify-center gap-2 rounded-full border border-whatsapp/40 bg-whatsapp-soft text-xs font-bold text-whatsapp-deep transition hover:bg-whatsapp hover:text-white"
            >
              <WhatsAppIcon className="h-4 w-4" /> Share Wishlist / Ask Live Photos on WhatsApp
            </a>
          </div>
        )}
      </aside>
    </div>
  );
}
