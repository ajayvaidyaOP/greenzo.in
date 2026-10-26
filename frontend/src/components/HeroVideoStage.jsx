import React, { useState, useRef, useEffect } from 'react';
import {
  Play, Pause, ArrowRight, ArrowUpRight, ShieldCheck, Sparkles, Layers, Star,
  Droplets, Plus, Copy, Tag, Check, Leaf, MapPin
} from 'lucide-react';
import Reveal from './Reveal.jsx';

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

  const safeReels = reels.length ? reels : [
    { id: 'reel-sanctuary', indexLabel: '01', title: `${comboSize}-Plant Atelier Set`, subtitle: `Capillary pots • ₹${comboPrice}`, videoUrl: '/videos/hero-sanctuary.mp4', posterUrl: '/images/hero-1.jpg', badge: 'Atelier Signature', hotspot: { productSlug: 'zamia-green' } },
    { id: 'reel-mist', indexLabel: '02', title: 'Morning Mist Nursery', subtitle: 'Pune greenhouse', videoUrl: '/videos/hero-mist.mp4', posterUrl: '/images/hero-2.jpg', badge: 'Glasshouse', hotspot: { productSlug: 'monstera-deliciosa' } },
    { id: 'reel-work', indexLabel: '03', title: 'Workspace Sanctuary', subtitle: 'Air-purifying focus', videoUrl: '/videos/hero-workspace.mp4', posterUrl: '/images/hero-3.jpg', badge: 'Editorial', hotspot: { productSlug: 'snake-plant' } }
  ];
  const currentReel = safeReels[activeIndex] || safeReels[0];
  const hotspotProduct = products.find((p) => p.slug === currentReel.hotspot?.productSlug) || products[0];
  const bannerOffers = activeOffers.filter((o) => o.showInBanner);

  useEffect(() => {
    const el = stageRef.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  useEffect(() => {
    const v = videoRef.current; if (!v) return;
    if (isPlaying && inView) v.play().catch(() => {}); else v.pause();
  }, [activeIndex, isPlaying, inView]);

  const handleVideoEnded = () => setActiveIndex((p) => (p + 1) % safeReels.length);
  const copy = (code) => { navigator.clipboard?.writeText(code); onNotify?.(`Copied ${code}`); };

  return (
    <section ref={stageRef} id="top" className="relative overflow-hidden bg-linen-50">
      {/* Ambient light */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-48 h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(176,138,62,0.16),transparent_65%)] blur-2xl" />
        <div className="absolute -left-32 top-24 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(38,80,59,0.14),transparent_65%)] blur-2xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-linen-75/70" />
      </div>

      <div className="shell relative">
        {/* Atelier masthead */}
        <Reveal dir="none" className="hidden items-center justify-between gap-6 border-b border-canopy-950/[0.08] py-3.5 text-[10.5px] lg:flex">
          <div className="flex items-center gap-5 text-stone-500">
            <span className="font-bold uppercase tracking-[0.24em] text-canopy-950">Nº 04 — Botanical Atelier</span>
            <span className="h-3 w-px bg-canopy-950/15" />
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-3 w-3 text-brass-600" /> Empire Agro, Theur — Pune 412110</span>
            <span className="h-3 w-px bg-canopy-950/15" />
            <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-canopy-600" /> Est. 2018 · 50K+ sanctuaries</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-canopy-950/10 bg-white/70 px-3 py-1 font-semibold text-canopy-900">
              <Star className="h-3 w-3 fill-brass-500 text-brass-500" /> 4.9 — 2,847 verified
            </span>
            <span className="text-stone-400">Mon–Sat · 9am–8pm IST</span>
          </div>
        </Reveal>

        <div className="grid items-center gap-12 pt-10 pb-14 lg:grid-cols-12 lg:gap-14 lg:pt-14 lg:pb-20">
          {/* ——— Left: editorial copy ——— */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="flex flex-wrap items-center gap-3">
                <span className="eyebrow"><span className="h-px w-7 bg-brass-500/70" /> Self-watering atelier</span>
                <span className="tag border border-canopy-700/20 bg-canopy-700/[0.07] text-canopy-800">
                  <span className="h-1 w-1 rounded-full bg-canopy-600" /> New drop live
                </span>
              </div>
            </Reveal>

            <Reveal delay={90}>
              <h1 className="display-hero mt-6 text-[46px] text-canopy-950 sm:text-[58px] lg:text-[62px] xl:text-[70px]">
                <span className="block italic text-canopy-700">Living forms</span>
                <span className="block">for quiet</span>
                <span className="block">
                  interiors<span className="ml-1 text-brass-500">.</span>
                </span>
              </h1>
            </Reveal>

            <Reveal delay={170}>
              <p className="lede mt-6 max-w-[40ch]">
                Pune-grown foliage, acclimatised for low light and air-conditioned rooms — set into dual-chamber
                hydro-wick planters. Less watering, cleaner air, zero guesswork.
              </p>
            </Reveal>

            {/* Price plate */}
            <Reveal delay={240}>
              <div className="mt-7 inline-flex max-w-full items-stretch overflow-hidden rounded-[20px] border border-canopy-950/10 bg-white shadow-soft">
                <div className="flex flex-col justify-center bg-canopy-950 px-4 py-3.5 text-linen-50">
                  <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-brass-300">Atelier set</span>
                  <span className="mt-1 font-serif text-[19px] leading-none">{comboSize} plants</span>
                </div>
                <div className="flex items-center gap-4 px-4 py-3">
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-stone-500">Hydro-wick planters</span>
                    <span className="mt-1 flex items-baseline gap-1 font-serif text-[27px] font-medium leading-none tracking-tight text-canopy-950">
                      ₹{comboPrice}<span className="text-[12px] font-sans font-medium text-stone-400">.00</span>
                    </span>
                  </div>
                  <span className="hidden h-9 w-px bg-canopy-950/10 sm:block" />
                  <span className="hidden max-w-[104px] text-[11px] leading-snug text-stone-500 sm:block">14-day reservoir · no spills</span>
                </div>
              </div>
              <div className="mt-3 inline-flex items-center gap-2 text-[11.5px] font-medium text-stone-600 sm:ml-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-canopy-500 opacity-70 animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-canopy-600" />
                </span>
                In stock · dispatched today from Pune
              </div>
            </Reveal>

            <Reveal delay={310}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button onClick={onOpenBundle} className="btn btn-dark btn-lg group/btn !h-[54px] !pl-7 !pr-2.5">
                  <Layers className="h-4 w-4 text-brass-300" />
                  Curate your box — ₹{comboPrice}
                  <span className="btn-disc ml-1 h-9 w-9 bg-brass-400 text-canopy-950">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
                <a href="#shop" className="btn btn-outline btn-lg !h-[54px] group/btn">
                  Explore the collection
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-silk group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                </a>
              </div>
            </Reveal>

            <Reveal delay={380}>
              <div className="mt-7 flex flex-wrap gap-1.5">
                {['AC-friendly', 'Pet-safe options', 'Air-purifying', 'Pest-free coco-perlite'].map((b) => (
                  <span key={b} className="chip !text-[11px] !font-medium text-stone-600">
                    <Check className="h-3 w-3 text-canopy-600" /> {b}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={440}>
              <div className="mt-8 flex items-center gap-3.5 border-t border-canopy-950/10 pt-6">
                <div className="flex -space-x-2.5">
                  {[1, 2, 3].map((i) => (
                    <img key={i} src={`/images/hero-${i}.jpg`} alt="Greenzo plant parent" className="h-9 w-9 rounded-full border-2 border-linen-50 object-cover shadow-sm" />
                  ))}
                  <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-linen-50 bg-canopy-950 text-[10px] font-extrabold text-brass-300">+2k</span>
                </div>
                <div className="text-[11.5px] leading-tight">
                  <div className="flex items-center gap-1 font-semibold text-canopy-950">
                    <Star className="h-3.5 w-3.5 fill-brass-500 text-brass-500" /> 4.9/5 from 2,847 homes
                  </div>
                  <p className="text-stone-500">Pune · Mumbai · shipped across India</p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ——— Right: video stage ——— */}
          <div className="lg:col-span-7">
            <Reveal dir="scale" delay={140} className="flex flex-col gap-4">
              <div className="group relative overflow-hidden rounded-[28px] border border-canopy-950/10 bg-canopy-950 shadow-elevated">
                <div className="relative aspect-[16/11] lg:aspect-[16/10]">
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
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canopy-950/75 via-canopy-950/5 to-canopy-950/25" />
                  <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/10" />

                  {/* Top row */}
                  <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2.5 rounded-full px-3.5 py-2 text-[10.5px] font-semibold text-linen-50 glass-dark">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-brass-300 opacity-70 animate-ping" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brass-300" />
                      </span>
                      {currentReel.badge}
                      <span className="h-3 w-px bg-white/20" />
                      <span className="num text-linen-100/70">Reel {currentReel.indexLabel}</span>
                    </div>
                    <button
                      onClick={() => setIsPlaying((p) => !p)}
                      aria-label={isPlaying ? 'Pause reel' : 'Play reel'}
                      className="grid h-9 w-9 place-items-center rounded-full bg-linen-50/95 text-canopy-950 shadow-soft transition hover:scale-105 hover:bg-white"
                    >
                      {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="ml-0.5 h-3.5 w-3.5" />}
                    </button>
                  </div>

                  {/* Hotspot product card */}
                  {hotspotProduct && (
                    <div className="absolute inset-x-4 bottom-20 sm:inset-x-auto sm:right-4 sm:max-w-[310px]">
                      <div className="flex items-center gap-3 rounded-[18px] p-2.5 pr-3 shadow-card glass-panel">
                        <button onClick={() => onSelectProduct(hotspotProduct)} className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-linen-100 img-zoom">
                          <img src={hotspotProduct.imageUrl} alt={hotspotProduct.name} className="h-full w-full object-cover" />
                        </button>
                        <button onClick={() => onSelectProduct(hotspotProduct)} className="min-w-0 flex-1 text-left">
                          <span className="block text-[8.5px] font-extrabold uppercase tracking-[0.2em] text-brass-700">In frame</span>
                          <span className="block truncate text-[12.5px] font-semibold leading-tight text-canopy-950">{hotspotProduct.name}</span>
                          <span className="block text-[11.5px] text-stone-600">
                            <span className="font-bold text-canopy-950 num">₹{hotspotProduct.price}</span>{' '}
                            <span className="line-through text-stone-400 num">₹{hotspotProduct.originalPrice}</span>
                          </span>
                        </button>
                        <button
                          onClick={() => onQuickAddProduct(hotspotProduct)}
                          aria-label="Add to bag"
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-canopy-950 text-linen-50 transition hover:bg-brass-500 hover:text-canopy-950 active:scale-95"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* In-video caption */}
                  <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-linen-50">
                    <div className="min-w-0">
                      <p className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-brass-300">{currentReel.subtitle}</p>
                      <p className="truncate font-serif text-[22px] leading-tight">{currentReel.title}</p>
                    </div>
                    <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-[10px] font-semibold text-linen-100/80 backdrop-blur sm:inline-flex">
                      <Sparkles className="h-3 w-3 text-brass-300" /> HD
                    </span>
                  </div>
                </div>
              </div>

              {/* Reel selector */}
              <div className="grid grid-cols-3 gap-2.5">
                {safeReels.map((reel, idx) => {
                  const active = idx === activeIndex;
                  return (
                    <button
                      key={reel.id}
                      onClick={() => { setActiveIndex(idx); setIsPlaying(true); }}
                      className={`group relative overflow-hidden rounded-[16px] border text-left transition-all duration-500 ease-silk ${
                        active
                          ? 'border-brass-500/50 bg-white shadow-card'
                          : 'border-canopy-950/10 bg-white/50 hover:border-canopy-950/25 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 p-2">
                        <span className={`relative h-9 w-9 shrink-0 overflow-hidden rounded-lg ${active ? 'ring-1 ring-brass-500/50' : ''}`}>
                          <img src={reel.posterUrl} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" loading="lazy" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className={`block text-[8.5px] font-extrabold uppercase tracking-[0.16em] ${active ? 'text-brass-700' : 'text-stone-400'}`}>
                            {reel.indexLabel} {active ? '· Now' : '· View'}
                          </span>
                          <span className="block truncate text-[11px] font-semibold text-canopy-950">{reel.title}</span>
                        </span>
                      </div>
                      {active && isPlaying && (
                        <span className="absolute inset-x-0 bottom-0 h-[2px] bg-canopy-950/10">
                          <span key={reel.id} className="reel-progress-bar block h-full bg-brass-500" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-stone-500">
                <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-canopy-700" /> 7-day transit guarantee · photo proof before dispatch</span>
                <span className="font-medium text-stone-600">Razorpay secure · UPI, cards & COD</span>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Live offers */}
        {bannerOffers.length > 0 && (
          <Reveal delay={80} className="mb-10 overflow-hidden rounded-[18px] border border-canopy-950/10 bg-white/70 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
              <span className="inline-flex shrink-0 items-center gap-1.5 text-[9.5px] font-extrabold uppercase tracking-[0.2em] text-terracotta-600">
                <Tag className="h-3.5 w-3.5" /> Live offers
              </span>
              <span className="hidden h-4 w-px shrink-0 bg-canopy-950/10 sm:block" />
              <div className="flex items-center gap-2">
                {bannerOffers.map((offer) => (
                  <button
                    key={offer.code}
                    onClick={() => copy(offer.code)}
                    className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-canopy-950/10 bg-linen-50 py-1.5 pl-3 pr-1.5 text-[11.5px] font-medium text-stone-700 transition hover:border-canopy-950/30 hover:bg-white"
                  >
                    <span>{offer.label}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-canopy-950 px-2.5 py-1 font-mono text-[10px] font-bold text-brass-300 transition group-hover:bg-brass-400 group-hover:text-canopy-950">
                      {offer.code} <Copy className="h-2.5 w-2.5 opacity-70" />
                    </span>
                  </button>
                ))}
              </div>
              <span className="ml-auto hidden shrink-0 items-center gap-1 text-[10.5px] text-stone-400 lg:flex">
                <Droplets className="h-3 w-3" /> Tap a code to copy
              </span>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
