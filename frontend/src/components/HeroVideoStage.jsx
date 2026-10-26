import React, { useState, useRef, useEffect } from 'react';
import {
  Play, Pause, ArrowRight, ArrowUpRight, ShieldCheck, Sparkles, Layers, Star,
  Droplets, Plus, Copy, Tag, Check, Camera
} from 'lucide-react';
import Reveal from './Reveal.jsx';
import { buildWhatsAppUrl, WhatsAppIcon } from '../lib/whatsapp.jsx';

export default function HeroVideoStage({
  storeConfig = {},
  activeOffers = [],
  reels = [],
  products = [],
  onOpenBundle,
  onOpenQuiz,
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
  const perPlantPrice = Math.round(comboPrice / comboSize);
  const regularBundlePrice = comboSize * 349;

  const whatsappHeroUrl = buildWhatsAppUrl(
    storeConfig,
    `Hi Greenzo Pune! Help me pick indoor plants (interested in the ${comboSize}-Plant Self-Watering Box @ ₹${comboPrice}).`
  );

  const safeReels = reels.length
    ? reels
    : [
        {
          id: 'reel-sanctuary',
          indexLabel: '01',
          title: `${comboSize}-Plant Self-Watering Set`,
          subtitle: `Hydro-wick planters · ₹${comboPrice}`,
          videoUrl: '/videos/hero-sanctuary.mp4',
          posterUrl: '/images/hero-1.jpg',
          badge: 'Bestseller Set',
          hotspot: { productSlug: 'zamia-green' }
        },
        {
          id: 'reel-mist',
          indexLabel: '02',
          title: 'Morning Mist Greenhouse',
          subtitle: 'Empire Agro · Theur, Pune',
          videoUrl: '/videos/hero-mist.mp4',
          posterUrl: '/images/hero-2.jpg',
          badge: 'Pune Nursery',
          hotspot: { productSlug: 'monstera-deliciosa' }
        },
        {
          id: 'reel-work',
          indexLabel: '03',
          title: 'AC & Desk Sanctuary',
          subtitle: 'Air-purifying low-light picks',
          videoUrl: '/videos/hero-workspace.mp4',
          posterUrl: '/images/hero-3.jpg',
          badge: 'Low-Light Ready',
          hotspot: { productSlug: 'snake-plant' }
        }
      ];

  const currentReel = safeReels[activeIndex] || safeReels[0];
  const hotspotProduct =
    products.find((p) => p.slug === currentReel.hotspot?.productSlug) || products[0];
  const bannerOffers = activeOffers.filter((o) => o.showInBanner);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying && inView) v.play().catch(() => {});
    else v.pause();
  }, [activeIndex, isPlaying, inView]);

  const handleVideoEnded = () => setActiveIndex((p) => (p + 1) % safeReels.length);
  const copy = (code) => {
    navigator.clipboard?.writeText(code);
    onNotify?.(`Coupon ${code} copied!`);
  };

  return (
    <section
      ref={stageRef}
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-canopy-50/70 via-white to-linen-50 botanical-grid"
    >
      {/* Sunlit conservatory ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 -top-28 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(31,127,88,0.14),transparent_68%)] blur-2xl" />
        <div className="absolute -right-28 top-8 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(221,169,75,0.15),transparent_68%)] blur-2xl" />
      </div>

      <div className="shell relative pt-6 pb-8 lg:pt-8 lg:pb-12">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
          {/* ——— Left Column: Crisp, High-Converting Value Prop (Fits 100% Above the Fold) ——— */}
          <div className="lg:col-span-6">
            <Reveal>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-canopy-600/20 bg-canopy-50 px-3 py-1 text-[11px] font-bold text-canopy-800">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-canopy-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-canopy-600" />
                  </span>
                  Grown at Empire Agro, Pune
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-brass-400/35 bg-brass-50 px-3 py-1 text-[11px] font-bold text-canopy-950">
                  <Star className="h-3 w-3 fill-brass-500 text-brass-500" /> 4.9/5 · 2,847+ Homes
                </span>
              </div>
            </Reveal>

            <Reveal delay={70}>
              <h1 className="display-hero mt-4 text-[38px] text-canopy-950 sm:text-[48px] lg:text-[52px] xl:text-[58px]">
                Lush indoor plants that{' '}
                <span className="italic text-canopy-600">water themselves.</span>
              </h1>
            </Reveal>

            <Reveal delay={130}>
              <p className="mt-3.5 max-w-[50ch] text-[14.5px] leading-[1.65] text-stone-600 sm:text-[15px]">
                Shade-hardened in Pune for low-light corners &amp; AC rooms — potted in 14-day capillary
                self-watering planters. Cleaner air, zero spills, zero guesswork.
              </p>
            </Reveal>

            {/* Highlighted Signature Bundle Strip */}
            <Reveal delay={190}>
              <div
                onClick={onOpenBundle}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onOpenBundle?.()}
                className="group mt-5 flex cursor-pointer flex-wrap items-center justify-between gap-3 rounded-[22px] border border-canopy-600/20 bg-white p-3.5 pr-4 shadow-card transition-all duration-300 hover:border-canopy-600/45 hover:shadow-soft-lg sm:flex-nowrap"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-canopy-950 text-white shadow-sm">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-300">Box</span>
                    <span className="font-serif text-[20px] font-semibold leading-none">{comboSize}×</span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[13px] font-extrabold text-canopy-950">
                        Pick Any {comboSize} Self-Watering Plants
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-canopy-800">
                        Save 30%
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11.5px] text-stone-500">
                      Only ₹{perPlantPrice}/plant · 4 hydro-wick pots + free shipping included
                    </p>
                  </div>
                </div>

                <div className="flex items-baseline gap-1.5 pl-1 sm:text-right">
                  <span className="font-serif text-[28px] font-semibold leading-none tracking-tight text-canopy-950 num">
                    ₹{comboPrice}
                  </span>
                  <span className="text-[12px] text-stone-400 line-through num">₹{regularBundlePrice}</span>
                </div>
              </div>
            </Reveal>

            {/* Primary CTAs + Direct WhatsApp CTA — 100% visible above the fold! */}
            <Reveal delay={250}>
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <button
                  onClick={onOpenBundle}
                  className="btn btn-dark h-[50px] pl-6 pr-2 text-[13.5px] group/btn"
                >
                  <Layers className="h-4 w-4 text-emerald-300" />
                  Curate {comboSize}-Plant Box
                  <span className="btn-disc ml-1 h-9 w-9 bg-emerald-400 text-canopy-950">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </button>

                <a href="#shop" className="btn btn-outline h-[50px] px-5 text-[13.5px] group/btn">
                  Explore Plants
                  <ArrowUpRight className="h-4 w-4 text-canopy-700 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                </a>

                <a
                  href={whatsappHeroUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-whatsapp h-[50px] px-5 text-[13.5px]"
                >
                  <WhatsAppIcon className="h-[18px] w-[18px]" />
                  <span>WhatsApp Order</span>
                </a>
              </div>
            </Reveal>

            {/* Trust Micro-Pills + 30-Sec Plant Quiz Link */}
            <Reveal delay={310}>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {[
                  '14-Day Reservoir',
                  'AC & Low-Light Ready',
                  'Pet-Safe Options',
                  'WhatsApp Live Photo Proof'
                ].map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1.5 rounded-full border border-canopy-950/10 bg-white/90 px-3 py-1 text-[11px] font-semibold text-stone-700 shadow-sm"
                  >
                    <Check className="h-3 w-3 text-canopy-600 stroke-[2.75]" /> {b}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => onOpenQuiz?.()}
                className="mt-3.5 inline-flex items-center gap-2 text-[12px] font-extrabold text-canopy-700 transition hover:text-canopy-950"
              >
                <Sparkles className="h-3.5 w-3.5 text-brass-500" />
                <span className="underline decoration-canopy-600/40 underline-offset-4">
                  Not sure which plants suit your room? Take our 30-sec Plant Finder Quiz →
                </span>
              </button>
            </Reveal>
          </div>

          {/* ——— Right Column: Architectural Video Stage + Shoppable Hotspot ——— */}
          <div className="lg:col-span-6">
            <Reveal dir="scale" delay={100} className="flex flex-col gap-3">
              <div className="group relative overflow-hidden rounded-[26px] border border-canopy-950/12 bg-canopy-950 shadow-elevated">
                <div className="relative aspect-[16/10.4]">
                  <video
                    key={currentReel.videoUrl}
                    ref={videoRef}
                    src={currentReel.videoUrl}
                    poster={currentReel.posterUrl}
                    muted
                    playsInline
                    autoPlay
                    loop={safeReels.length === 1}
                    preload="metadata"
                    onEnded={handleVideoEnded}
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canopy-950/85 via-canopy-950/10 to-canopy-950/30" />

                  {/* Top overlay bar */}
                  <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold text-white glass-dark">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                      {currentReel.badge}
                      <span className="h-3 w-px bg-white/25" />
                      <span className="num text-emerald-200">Reel {currentReel.indexLabel}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-[10.5px] font-semibold text-white glass-dark sm:inline-flex">
                        <Camera className="h-3 w-3 text-emerald-300" /> Photo before dispatch
                      </span>
                      <button
                        onClick={() => setIsPlaying((p) => !p)}
                        aria-label={isPlaying ? 'Pause reel' : 'Play reel'}
                        className="grid h-9 w-9 place-items-center rounded-full bg-white/95 text-canopy-950 shadow-md transition hover:scale-105 hover:bg-white"
                      >
                        {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="ml-0.5 h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Bottom row: Caption + Shoppable Hotspot */}
                  <div className="absolute inset-x-4 bottom-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                    <div className="min-w-0 text-white">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-300">
                        {currentReel.subtitle}
                      </p>
                      <p className="truncate font-serif text-[21px] font-medium leading-tight sm:text-[23px]">
                        {currentReel.title}
                      </p>
                    </div>

                    {hotspotProduct && (
                      <div className="flex shrink-0 items-center gap-2.5 rounded-[18px] p-2 pr-2.5 shadow-card glass-panel sm:max-w-[285px]">
                        <button
                          onClick={() => onSelectProduct(hotspotProduct)}
                          className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-linen-100 img-zoom"
                        >
                          <img
                            src={hotspotProduct.imageUrl}
                            alt={hotspotProduct.name}
                            className="h-full w-full object-cover"
                          />
                        </button>
                        <button
                          onClick={() => onSelectProduct(hotspotProduct)}
                          className="min-w-0 flex-1 text-left"
                        >
                          <span className="block text-[8.5px] font-extrabold uppercase tracking-[0.18em] text-canopy-700">
                            In Frame · Tap to view
                          </span>
                          <span className="block truncate text-[12px] font-bold leading-tight text-canopy-950">
                            {hotspotProduct.name}
                          </span>
                          <span className="block text-[11px] text-stone-600">
                            <span className="font-extrabold text-canopy-950 num">₹{hotspotProduct.price}</span>{' '}
                            <span className="line-through text-stone-400 num">₹{hotspotProduct.originalPrice}</span>
                          </span>
                        </button>
                        <button
                          onClick={() => onQuickAddProduct(hotspotProduct)}
                          aria-label="Quick add to bag"
                          title="Add to bag"
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-canopy-950 text-white transition hover:bg-canopy-600 active:scale-95"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 3-Reel Selector Pills */}
              <div className="grid grid-cols-3 gap-2.5">
                {safeReels.map((reel, idx) => {
                  const active = idx === activeIndex;
                  return (
                    <button
                      key={reel.id}
                      onClick={() => {
                        setActiveIndex(idx);
                        setIsPlaying(true);
                      }}
                      className={`group relative overflow-hidden rounded-[16px] border text-left transition-all duration-300 ${
                        active
                          ? 'border-canopy-600/50 bg-white shadow-card'
                          : 'border-canopy-950/10 bg-white/75 hover:border-canopy-600/30 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 p-2">
                        <span
                          className={`relative h-9 w-9 shrink-0 overflow-hidden rounded-lg ${
                            active ? 'ring-2 ring-canopy-600/50' : ''
                          }`}
                        >
                          <img
                            src={reel.posterUrl}
                            alt=""
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className={`block text-[8.5px] font-extrabold uppercase tracking-[0.14em] ${
                              active ? 'text-canopy-700' : 'text-stone-400'
                            }`}
                          >
                            {reel.indexLabel} {active ? '· Playing' : '· Watch'}
                          </span>
                          <span className="block truncate text-[11.5px] font-bold text-canopy-950">
                            {reel.title}
                          </span>
                        </span>
                      </div>
                      {active && isPlaying && (
                        <span className="absolute inset-x-0 bottom-0 h-[2.5px] bg-canopy-950/10">
                          <span key={reel.id} className="reel-progress-bar block h-full bg-canopy-600" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-stone-600">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5 text-canopy-600" /> 7-day healthy plant replacement guarantee
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-canopy-800">
                  <Sparkles className="h-3 w-3 text-brass-500" /> Free shipping ₹499+ · UPI &amp; COD
                </span>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Live Coupon Pills */}
        {bannerOffers.length > 0 && (
          <Reveal
            delay={80}
            className="mt-6 overflow-hidden rounded-[18px] border border-canopy-600/20 bg-white/90 px-4 py-2.5 shadow-soft backdrop-blur"
          >
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
              <span className="inline-flex shrink-0 items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-canopy-700">
                <Tag className="h-3.5 w-3.5 text-canopy-600" /> Active Coupons
              </span>
              <span className="hidden h-4 w-px shrink-0 bg-canopy-950/10 sm:block" />
              <div className="flex items-center gap-2">
                {bannerOffers.map((offer) => (
                  <button
                    key={offer.code}
                    onClick={() => copy(offer.code)}
                    className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-canopy-950/10 bg-linen-50 py-1 pl-3 pr-1.5 text-[11.5px] font-semibold text-stone-700 transition hover:border-canopy-600/40 hover:bg-canopy-50"
                  >
                    <span>{offer.label}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-canopy-950 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-300 transition group-hover:bg-canopy-600 group-hover:text-white">
                      {offer.code} <Copy className="h-2.5 w-2.5 opacity-80" />
                    </span>
                  </button>
                ))}
              </div>
              <span className="ml-auto hidden shrink-0 items-center gap-1 text-[10.5px] font-medium text-stone-400 lg:flex">
                <Droplets className="h-3 w-3 text-canopy-500" /> Tap any coupon to copy
              </span>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
