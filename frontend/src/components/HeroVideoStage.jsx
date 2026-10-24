import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Star,
  Plus,
  MessageCircle,
  Droplets,
  Tag,
  Copy
} from 'lucide-react';

export default function HeroVideoStage({
  storeConfig = {},
  activeOffers = [],
  reels = [],
  products = [],
  onOpenBundle,
  onQuickAddProduct,
  onSelectProduct,
  onNotify
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [inView, setInView] = useState(true);
  const stageRef = useRef(null);
  const videoRef = useRef(null);

  const comboPrice = storeConfig.comboBundlePrice || 999;
  const comboSize = storeConfig.comboBundleSize || 4;
  const heroBadge = storeConfig.heroBadge || 'Empire Agro Nursery • Pune Direct';
  const whatsappNumber = storeConfig.whatsappNumber || '918883639639';

  const safeReels = reels.length
    ? reels
    : [
        {
          id: 'reel-sanctuary',
          indexLabel: '01',
          title: `${comboSize}-Plant Signature Combo`,
          subtitle: `Living Room Self-Watering Studio • ₹${comboPrice}`,
          videoUrl: '/videos/hero-sanctuary.mp4',
          posterUrl: '/images/hero-1.jpg',
          badge: 'Most Popular Bundle',
          hotspot: {
            productSlug: 'zamia-green',
            label: 'Zamia Green + Self-Watering Pot',
            priceLabel: '₹269'
          }
        }
      ];

  const currentReel = safeReels[activeIndex] || safeReels[0];
  const hotspotProduct =
    products.find((p) => p.slug === currentReel.hotspot?.productSlug) || products[0];

  const bannerOffers = activeOffers.filter((o) => o.showInBanner);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isPlaying && inView) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [activeIndex, isPlaying, inView]);

  const handleVideoEnded = () => {
    setActiveIndex((prev) => (prev + 1) % safeReels.length);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    onNotify?.(`Promo code ${code} copied! Apply it in your bag 🎁`);
  };

  return (
    <section
      id="top"
      ref={stageRef}
      className="relative overflow-hidden bg-gradient-to-b from-linen-100 via-linen-50 to-white pt-6 pb-8 lg:pt-10 lg:pb-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-36 right-0 w-[520px] h-[520px] rounded-full bg-emerald-900/5 blur-3xl"
      />

      <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Editorial Column */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-canopy-900/10 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-[11.5px] font-semibold tracking-wide text-canopy-800 uppercase">
                {heroBadge}
              </span>
            </div>

            <h1 className="font-serif text-[40px] sm:text-[48px] lg:text-[54px] leading-[1.06] font-semibold text-canopy-950 tracking-tight">
              Buy <span className="italic text-terracotta-600 font-bold">{comboSize} Plants</span>{' '}
              with Self-Watering Pots{' '}
              <span className="inline-block px-3 py-0.5 rounded-2xl bg-terracotta-50 text-terracotta-600 border border-terracotta-500/20">
                @ ₹{comboPrice}
              </span>
            </h1>

            <p className="text-[15px] lg:text-[15.5px] leading-relaxed text-canopy-900/75 max-w-xl">
              {storeConfig.heroSubheading ||
                'Transform your living room & workspace into a calm biophilic sanctuary. Every Greenzo plant arrives acclimatized in a dual-chamber 14-day capillary self-watering pot—zero soil spills, zero overwatering.'}
            </p>

            {/* Primary Conversion CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={onOpenBundle}
                className="group h-12 px-6 rounded-full bg-canopy-900 hover:bg-canopy-950 text-white text-[14px] font-semibold shadow-elevated flex items-center gap-2.5 transition active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Build Your ₹{comboPrice} Box</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#shop"
                className="h-12 px-5 rounded-full bg-white hover:bg-linen-100 text-canopy-950 border border-canopy-900/15 text-[14px] font-semibold flex items-center gap-2 transition"
              >
                <span>Shop All</span>
              </a>

              <a
                href={`https://wa.me/${whatsappNumber}?text=Hi%20Greenzo!%20Help%20me%20pick%20indoor%20plants%20for%20my%20home.`}
                target="_blank"
                rel="noreferrer"
                className="h-12 px-4 rounded-full bg-emerald-50 hover:bg-emerald-100/80 text-canopy-800 border border-emerald-600/20 text-[13px] font-semibold inline-flex items-center gap-2 transition"
              >
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Trust Metrics */}
            <div className="pt-4 border-t border-canopy-900/10 grid grid-cols-3 gap-4">
              <div>
                <div className="font-serif text-2xl font-bold text-canopy-950">50K+</div>
                <p className="text-[11.5px] text-canopy-800/70 flex items-center gap-1 mt-0.5">
                  <Truck className="w-3.5 h-3.5 text-canopy-600 shrink-0" /> Safe Deliveries
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1 font-serif text-2xl font-bold text-canopy-950">
                  4.9 <Star className="w-4 h-4 fill-brass-500 text-brass-500" />
                </div>
                <p className="text-[11.5px] text-canopy-800/70 mt-0.5">2,847+ Verified</p>
              </div>
              <div>
                <div className="font-serif text-2xl font-bold text-canopy-950">Razorpay</div>
                <p className="text-[11.5px] text-canopy-800/70 flex items-center gap-1 mt-0.5">
                  <Droplets className="w-3.5 h-3.5 text-canopy-600 shrink-0" /> Instant UPI & COD
                </p>
              </div>
            </div>
          </div>

          {/* Right Multi-Reel Cinema Video Stage */}
          <div className="lg:col-span-7">
            <div className="relative rounded-[28px] overflow-hidden bg-canopy-950 shadow-elevated border border-canopy-900/10 aspect-[16/10] sm:aspect-[16/9.6]">
              <video
                key={currentReel.videoUrl}
                ref={videoRef}
                src={currentReel.videoUrl}
                poster={currentReel.posterUrl}
                muted
                playsInline
                autoPlay
                preload="metadata"
                onEnded={handleVideoEnded}
                className="w-full h-full object-cover"
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/25" />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/15 text-white text-[11.5px] font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{currentReel.badge}</span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/80">HD Studio Reel</span>
                </div>

                <button
                  onClick={() => setIsPlaying((p) => !p)}
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  className="w-9 h-9 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
              </div>

              {hotspotProduct && (
                <div className="hidden sm:flex absolute right-4 bottom-24 items-center gap-3 p-2.5 pr-3.5 rounded-2xl bg-white/92 backdrop-blur-md shadow-lg border border-white/60 max-w-[275px] transition transform hover:-translate-y-0.5">
                  <img
                    src={hotspotProduct.imageUrl}
                    alt={hotspotProduct.name}
                    onClick={() => onSelectProduct(hotspotProduct)}
                    className="w-12 h-12 rounded-xl object-cover cursor-pointer shrink-0"
                  />
                  <div
                    onClick={() => onSelectProduct(hotspotProduct)}
                    className="min-w-0 cursor-pointer"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-canopy-600 block">
                      In This Frame
                    </span>
                    <p className="text-[12.5px] font-semibold text-canopy-950 truncate">
                      {hotspotProduct.name}
                    </p>
                    <p className="text-[12px] font-bold text-terracotta-600">
                      ₹{hotspotProduct.price}{' '}
                      <span className="text-[10.5px] text-canopy-700/60 line-through font-normal">
                        ₹{hotspotProduct.originalPrice}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => onQuickAddProduct(hotspotProduct)}
                    title="Quick Add to Bag"
                    className="w-8 h-8 rounded-full bg-canopy-900 hover:bg-canopy-950 text-white flex items-center justify-center shrink-0 transition active:scale-90"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="absolute bottom-3.5 left-3.5 right-3.5 grid grid-cols-3 gap-2">
                {safeReels.map((reel, idx) => {
                  const active = idx === activeIndex;
                  return (
                    <button
                      key={reel.id}
                      onClick={() => {
                        setActiveIndex(idx);
                        setIsPlaying(true);
                      }}
                      className={`text-left p-2.5 sm:p-3 rounded-2xl transition border overflow-hidden relative ${
                        active
                          ? 'bg-white/95 text-canopy-950 border-white shadow-md'
                          : 'bg-black/45 hover:bg-black/60 text-white border-white/15 backdrop-blur-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 text-[10px] font-bold uppercase tracking-wider opacity-75">
                        <span>Reel {reel.indexLabel}</span>
                        {active && <span className="text-emerald-700">Playing</span>}
                      </div>
                      <p className="text-[12px] sm:text-[13px] font-semibold truncate mt-0.5">
                        {reel.title}
                      </p>
                      <p
                        className={`hidden sm:block text-[10.5px] truncate ${
                          active ? 'text-canopy-700/80' : 'text-white/70'
                        }`}
                      >
                        {reel.subtitle}
                      </p>
                      {active && isPlaying && (
                        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-canopy-900/10">
                          <div key={reel.id} className="h-full bg-canopy-800 reel-progress-bar" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-2 text-[12px] text-canopy-800/75">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-canopy-700" />
                7-Day Transit Damage Free Replacement Guarantee
              </span>
              <span className="text-canopy-700 font-medium">
                Razorpay Secure UPI, Cards & COD Available
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Live Offers Strip (Managed from Admin Panel!) */}
        {bannerOffers.length > 0 && (
          <div className="mt-8 rounded-2xl bg-linen-100/90 border border-canopy-900/10 px-4 py-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-terracotta-600 shrink-0">
              <Tag className="w-3.5 h-3.5" /> Live Nursery Offers:
            </span>
            {bannerOffers.map((offer) => (
              <button
                key={offer.code}
                onClick={() => handleCopyCode(offer.code)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-canopy-950 hover:text-white border border-canopy-900/10 text-xs font-medium transition shrink-0 group shadow-sm"
              >
                <span className="font-semibold">{offer.label}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 group-hover:bg-emerald-400 text-canopy-950 font-mono text-[11px] font-bold flex items-center gap-1">
                  {offer.code} <Copy className="w-3 h-3" />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
