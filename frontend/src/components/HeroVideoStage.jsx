import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, ArrowRight, ArrowUpRight, ShieldCheck, Sparkles, Layers, Truck, Star, Droplets, Plus, Copy, Tag, Check, Leaf } from 'lucide-react';

export default function HeroVideoStage({ storeConfig = {}, activeOffers = [], reels = [], products = [], onOpenBundle, onQuickAddProduct, onSelectProduct, onNotify }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [inView, setInView] = useState(true);
  const stageRef = useRef(null);
  const videoRef = useRef(null);
  const comboPrice = storeConfig.comboBundlePrice || 999;
  const comboSize = storeConfig.comboBundleSize || 4;

  const safeReels = reels.length ? reels : [
    { id: 'reel-sanctuary', indexLabel: '01', title: `${comboSize}-Plant Atelier Set`, subtitle: `Capillary Pots • ₹${comboPrice}`, videoUrl: '/videos/hero-sanctuary.mp4', posterUrl: '/images/hero-1.jpg', badge: 'Atelier Signature', hotspot: { productSlug: 'zamia-green' } },
    { id: 'reel-mist', indexLabel: '02', title: 'Morning Mist Nursery', subtitle: 'Pune Greenhouse', videoUrl: '/videos/hero-mist.mp4', posterUrl: '/images/hero-2.jpg', badge: 'Glasshouse', hotspot: { productSlug: 'monstera-deliciosa' } },
    { id: 'reel-work', indexLabel: '03', title: 'Workspace Sanctuary', subtitle: 'Air-Purifying Focus', videoUrl: '/videos/hero-workspace.mp4', posterUrl: '/images/hero-3.jpg', badge: 'Editorial', hotspot: { productSlug: 'snake-plant' } },
  ];
  const currentReel = safeReels[activeIndex] || safeReels[0];
  const hotspotProduct = products.find((p) => p.slug === currentReel.hotspot?.productSlug) || products[0];
  const bannerOffers = activeOffers.filter((o) => o.showInBanner);

  useEffect(() => {
    const el = stageRef.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  useEffect(() => { const v = videoRef.current; if (!v) return; if (isPlaying && inView) v.play().catch(() => {}); else v.pause(); }, [activeIndex, isPlaying, inView]);
  const handleVideoEnded = () => setActiveIndex((p) => (p + 1) % safeReels.length);
  const copy = (code) => { navigator.clipboard?.writeText(code); onNotify?.(`Copied ${code}`); };

  return (
    <section ref={stageRef} id="top" className="relative overflow-hidden bg-[#FCFBF8]">
      {/* Mesh gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-32 w-[720px] h-[520px] bg-gradient-to-br from-emerald-100/40 via-lime-50/30 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-20 left-0 w-[560px] h-[420px] bg-gradient-to-tr from-amber-50/40 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-[1360px] mx-auto px-5 lg:px-8">
        <div className="hidden lg:flex items-center justify-between py-3 border-b border-stone-200/60 text-[11px]">
          <div className="flex items-center gap-5 text-stone-500"><span className="font-bold tracking-[0.16em] uppercase text-canopy-950">No. 04 — Botanical Atelier</span><span className="w-px h-3 bg-stone-200" />Empire Agro, Theur — Pune 412110<span className="w-px h-3 bg-stone-200" /><span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-600" /> Est. 2018 • 50K+ sanctuaries</span></div>
          <div className="flex items-center gap-3"><span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-700"><Star className="w-3 h-3 fill-brass-500 text-brass-500" /> 4.9 — 2,847 verified</span><span className="text-stone-400">Mon–Sat 9AM–8PM IST</span></div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 pt-8 lg:pt-10 pb-8 items-stretch">
          {/* LEFT — editorial */}
          <div className="lg:col-span-5 flex flex-col justify-center py-2">
            <div className="inline-flex items-center gap-2.5">
              <span className="w-7 h-px bg-canopy-950/20" />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-canopy-700">Self-Watering Atelier</span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-[10px] font-bold">New Drop Live</span>
            </div>

            <h1 className="mt-4 font-serif font-semibold tracking-[-0.03em] leading-[0.92] text-canopy-950">
              <span className="block text-[38px] sm:text-[46px] lg:text-[56px] font-light italic text-canopy-700">Living</span>
              <span className="block text-[44px] sm:text-[54px] lg:text-[64px]">Forms for</span>
              <span className="block text-[44px] sm:text-[54px] lg:text-[64px] flex flex-wrap items-baseline gap-3">Quiet <span className="inline-flex font-serif italic font-normal text-terracotta-600 text-[34px] sm:text-[40px] lg:text-[46px] translate-y-1">Interiors</span></span>
            </h1>

            <div className="mt-6 flex flex-wrap items-stretch gap-3">
              <div className="inline-flex items-stretch rounded-2xl bg-white border border-stone-200 shadow-card overflow-hidden">
                <div className="px-4 py-3 bg-canopy-950 text-white flex flex-col justify-center"><span className="text-[10px] font-bold tracking-[0.14em] uppercase text-emerald-300 leading-none">Atelier Set</span><span className="font-serif text-xl font-semibold leading-none mt-1">{comboSize} Plants</span></div>
                <div className="px-4 py-3 flex items-center gap-3"><div><div className="text-[11px] font-semibold tracking-widest uppercase text-stone-500 leading-none">Hydro-Wick Pots</div><div className="font-serif text-[28px] font-bold tracking-tight leading-none mt-1 text-canopy-950">₹{comboPrice}<span className="text-sm font-medium text-stone-400">.00</span></div></div><div className="hidden sm:block w-px h-10 bg-stone-100" /><div className="hidden sm:block text-xs text-stone-600 max-w-[110px] leading-relaxed">14-day reservoir • no spills</div></div>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 rounded-full bg-white border border-stone-200 shadow-sm text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> In stock • Ships today
              </div>
            </div>

            <p className="mt-5 text-[14.5px] leading-[1.7] text-stone-600 max-w-[42ch] text-balance">Pune-grown, low-light ready foliage in dual-chamber hydro-wick pots — less watering, cleaner air, zero guesswork.</p>

            {/* Benefit pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              {['AC-friendly', 'Pet-safe options', 'Air-purifying', 'Pest-free coco-perlite'].map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-stone-200 text-xs font-medium text-stone-700"><Check className="w-3.5 h-3.5 text-emerald-600" /> {b}</span>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button onClick={onOpenBundle} className="group h-[48px] pl-6 pr-2 rounded-full bg-canopy-950 hover:bg-black text-white text-[14px] font-semibold inline-flex items-center gap-3 shadow-elevated transition active:scale-[0.98]">
                <Layers className="w-4 h-4 text-emerald-300" /> Curate Box — ₹{comboPrice}
                <span className="w-8 h-8 rounded-full bg-white text-canopy-950 flex items-center justify-center group-hover:translate-x-0.5 transition"><ArrowRight className="w-4 h-4" /></span>
              </button>
              <a href="#shop" className="h-[48px] px-6 rounded-full bg-white border border-stone-200 text-canopy-950 text-[14px] font-semibold inline-flex items-center gap-2 hover:bg-stone-50 transition">Explore Collection <ArrowUpRight className="w-4 h-4 text-stone-500" /></a>
            </div>

            {/* Social proof — avatar stack */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => <img key={i} src={`/images/hero-${i}.jpg`} alt="buyer" className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" />)}
                <span className="w-8 h-8 rounded-full bg-canopy-950 text-white text-[11px] font-bold flex items-center justify-center border-2 border-white">+2k</span>
              </div>
              <div className="text-xs leading-tight">
                <div className="flex items-center gap-1 font-semibold text-canopy-950"><Star className="w-3.5 h-3.5 fill-brass-500 text-brass-500" /> 4.9/5 from 2,847 homes</div>
                <p className="text-stone-500">Trusted across Pune, Mumbai & India</p>
              </div>
            </div>

            <div className="mt-7 grid grid-cols-3 gap-4 pt-5 border-t border-stone-200">
              <div><p className="font-serif text-[22px] font-semibold leading-none">50K<span className="text-brass-500">+</span></p><p className="text-[11px] tracking-wide uppercase text-stone-500 flex items-center gap-1"><Truck className="w-3 h-3" /> Delivered</p></div>
              <div className="border-l border-stone-100 pl-4"><p className="font-serif text-[22px] font-semibold leading-none flex items-center gap-1">4.9 <Star className="w-4 h-4 fill-brass-500 text-brass-500" /></p><p className="text-[11px] uppercase text-stone-500">Verified</p></div>
              <div className="border-l border-stone-100 pl-4"><p className="text-[16px] font-bold tracking-tight leading-none">Razorpay Secure</p><p className="text-[11px] uppercase text-stone-500 flex items-center gap-1"><Droplets className="w-3 h-3" /> UPI • Cards • COD</p></div>
            </div>
          </div>

          {/* RIGHT — video stage */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="relative rounded-[28px] overflow-hidden bg-canopy-950 shadow-elevated border border-white/10 aspect-[16/11] lg:aspect-[16/10.2] group">
              <video key={currentReel.videoUrl} ref={videoRef} src={currentReel.videoUrl} poster={currentReel.posterUrl} muted playsInline autoPlay preload="metadata" onEnded={handleVideoEnded} className="w-full h-full object-cover" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full glass-dark text-white text-[11px] font-semibold"><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" /></span>{currentReel.badge} <span className="w-px h-3 bg-white/20" /> Reel {currentReel.indexLabel} • HD</div>
                <button onClick={() => setIsPlaying((p) => !p)} className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-canopy-950 flex items-center justify-center shadow-soft transition">{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}</button>
              </div>

              {hotspotProduct && (
                <div className="absolute left-4 right-4 bottom-[92px] sm:bottom-[86px] sm:left-auto sm:right-4 sm:max-w-[320px] glass-panel rounded-[18px] p-3 flex items-center gap-3 shadow-card">
                  <img src={hotspotProduct.imageUrl} alt={hotspotProduct.name} onClick={() => onSelectProduct(hotspotProduct)} className="w-14 h-14 rounded-xl object-cover cursor-pointer border border-stone-100" />
                  <div className="min-w-0 flex-1 cursor-pointer" onClick={() => onSelectProduct(hotspotProduct)}><span className="text-[10px] font-bold tracking-[0.14em] uppercase text-canopy-700">In Frame</span><p className="text-[13px] font-semibold text-canopy-950 truncate leading-tight">{hotspotProduct.name}</p><p className="text-xs text-stone-600"><span className="font-bold text-canopy-950">₹{hotspotProduct.price}</span> <span className="line-through text-stone-400">₹{hotspotProduct.originalPrice}</span></p></div>
                  <button onClick={() => onQuickAddProduct(hotspotProduct)} className="w-9 h-9 rounded-full bg-canopy-950 hover:bg-black text-white flex items-center justify-center transition active:scale-95"><Plus className="w-4 h-4" /></button>
                </div>
              )}

              <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4">
                <div className="rounded-[20px] bg-black/40 backdrop-blur-xl border border-white/10 p-2 flex gap-2">
                  {safeReels.map((reel, idx) => {
                    const active = idx === activeIndex;
                    return (
                      <button key={reel.id} onClick={() => { setActiveIndex(idx); setIsPlaying(true); }} className={`relative flex-1 text-left rounded-[14px] px-3 py-2.5 transition overflow-hidden ${active ? 'bg-white text-canopy-950 shadow-card' : 'text-white hover:bg-white/10'}`}>
                        <div className="flex items-center justify-between"><span className={`text-[10px] font-bold tracking-[0.14em] uppercase ${active ? 'text-canopy-700' : 'text-white/70'}`}>{reel.indexLabel} — {active ? 'Now Playing' : 'View'}</span>{active && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}</div>
                        <p className="text-[13px] font-semibold truncate mt-1">{reel.title}</p><p className={`hidden sm:block text-[11px] truncate ${active ? 'text-stone-600' : 'text-white/70'}`}>{reel.subtitle}</p>
                        {active && isPlaying && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-canopy-900/10"><div key={reel.id} className="h-full bg-canopy-900 reel-progress-bar" /></div>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[11.5px] text-stone-500"><span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-canopy-700" /> 7-Day Transit Guarantee • Photo proof before dispatch</span><span className="font-medium text-stone-700">Razorpay Secure • UPI, Cards & COD</span></div>
          </div>
        </div>

        {bannerOffers.length > 0 && (
          <div className="mt-2 mb-6 rounded-[18px] bg-white border border-stone-100 shadow-card px-4 py-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.14em] uppercase text-terracotta-600 shrink-0"><Tag className="w-3.5 h-3.5" /> Live Offers</span>
            <span className="w-px h-4 bg-stone-200 hidden sm:block shrink-0" />
            <div className="flex items-center gap-2">{bannerOffers.map((offer) => (
              <button key={offer.code} onClick={() => copy(offer.code)} className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-linen-50 hover:bg-canopy-950 hover:text-white border border-stone-200 text-xs font-medium transition group shrink-0"><span>{offer.label}</span><span className="px-2.5 py-1 rounded-full bg-white group-hover:bg-emerald-400 text-canopy-950 font-mono text-[11px] font-bold flex items-center gap-1 border border-stone-200">{offer.code} <Copy className="w-3 h-3 opacity-60" /></span></button>
            ))}</div>
          </div>
        )}
      </div>
    </section>
  );
}
