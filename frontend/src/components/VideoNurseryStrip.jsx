import React, { useState, useRef, useEffect } from 'react';
import { Droplets, SunMedium, PackageCheck, Sparkles, ArrowUpRight } from 'lucide-react';

const STUDIO_STORIES = [
  {
    id: 'wick',
    tag: '01 — Hydro-Wick Atelier',
    title: '14-Day Capillary Reservoir',
    description: 'Braided cotton wick feeds roots only when needed — no rot, no dry-outs, no weekly guesswork.',
    videoUrl: '/videos/hero-sanctuary.mp4',
    posterUrl: '/images/hero-1.jpg',
    icon: Droplets,
  },
  {
    id: 'nursery',
    tag: '02 — Theur Micro-Climate',
    title: 'Shade-Hardened in Pune',
    description: '21 days in our indoor-light bay so your plant never shocks when it enters your living room.',
    videoUrl: '/videos/hero-mist.mp4',
    posterUrl: '/images/hero-2.jpg',
    icon: SunMedium,
  },
  {
    id: 'packaging',
    tag: '03 — Eco Transit',
    title: 'Ventilated Honeycomb Pods',
    description: 'Plastic-free kraft sleeves lock the pot & coco-perlite crown for pan-India transit.',
    videoUrl: '/videos/hero-workspace.mp4',
    posterUrl: '/images/hero-3.jpg',
    icon: PackageCheck,
  },
];

export default function VideoNurseryStrip({ onOpenBundle }) {
  const [activeCard, setActiveCard] = useState('wick');
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="reels" ref={sectionRef} className="py-16 lg:py-20 bg-linen-75 border-y border-stone-100">
      <div className="max-w-[1360px] mx-auto px-5 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-[680px]">
            <div className="inline-flex items-center gap-2">
              <span className="w-7 h-px bg-canopy-900/20" />
              <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-canopy-700">Atelier Technology</span>
              <span className="hidden sm:inline text-stone-300">—</span>
              <span className="hidden sm:inline text-xs text-stone-500">Hydro-Wick • Acclimatization • Eco Pods</span>
            </div>
            <h2 className="mt-3 font-serif text-[32px] lg:text-[44px] leading-[0.95] tracking-[-0.02em] font-semibold text-canopy-950 text-balance">
              Why Greenzo stays lush <span className="italic font-normal text-canopy-700">effortlessly.</span>
            </h2>
          </div>
          <p className="text-[14px] leading-relaxed text-stone-600 max-w-md">
            Hover to play each atelier reel — from wick engineering to shade-hardening and carbon-neutral packaging.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
          {STUDIO_STORIES.map((story) => {
            const Icon = story.icon;
            const isActive = activeCard === story.id;
            return (
              <div
                key={story.id}
                onMouseEnter={() => setActiveCard(story.id)}
                onClick={() => setActiveCard(story.id)}
                className={`group relative overflow-hidden rounded-[22px] bg-white border transition-all duration-300 cursor-pointer ${
                  isActive ? 'border-canopy-900 shadow-elevated -translate-y-1' : 'border-stone-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5'
                }`}
              >
                <div className="relative aspect-[16/10.5] bg-canopy-950 overflow-hidden">
                  {visible && isActive ? (
                    <video src={story.videoUrl} poster={story.posterUrl} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                  ) : (
                    <img src={story.posterUrl} alt={story.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-700" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur text-canopy-950 text-[11px] font-semibold border border-white/60">
                    {story.tag}
                  </span>
                  <span className={`absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1.5 transition ${isActive ? 'bg-emerald-500 text-white' : 'bg-black/45 backdrop-blur text-white border border-white/20'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white animate-pulse' : 'bg-emerald-400'}`} /> {isActive ? 'PLAYING' : 'HOVER TO PLAY'}
                  </span>
                  <div className="absolute inset-0 rounded-[22px] ring-1 ring-white/10 pointer-events-none" />
                </div>

                <div className="p-6">
                  <div className="w-10 h-10 rounded-xl bg-canopy-50 border border-canopy-900/5 text-canopy-800 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="mt-3 font-serif text-[20px] font-semibold leading-tight text-canopy-950">{story.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-stone-600">{story.description}</p>
                  <span className={`mt-4 inline-flex items-center gap-1 text-xs font-semibold ${isActive ? 'text-canopy-900' : 'text-stone-500 group-hover:text-canopy-900'} transition`}>
                    Learn more <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ——— Atelier Bundle Banner — luxury, calm ——— */}
        <div className="mt-10 rounded-[24px] bg-canopy-950 text-white p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-elevated overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent pointer-events-none" />
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="relative space-y-3 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 text-emerald-300 text-[11px] font-bold tracking-[0.16em] uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Atelier Favourite — Limited Bay
            </span>
            <h3 className="font-serif text-2xl sm:text-[30px] font-medium leading-tight">
              Curate any 4 plants + 4 hydro-wick pots — <span className="italic text-emerald-200">just ₹999</span>
            </h3>
            <p className="text-sm text-white/70 max-w-2xl leading-relaxed">
              Mix Zamia, Monstera, Snake, Peace Lily or Syngonium in matte ivory / sage / terracotta / charcoal — free photo confirmation before dispatch.
            </p>
          </div>
          <button
            onClick={onOpenBundle}
            className="relative h-12 px-7 rounded-full bg-white hover:bg-linen-50 text-canopy-950 font-semibold text-sm shrink-0 inline-flex items-center gap-2 transition active:scale-95 shadow-soft"
          >
            Launch Box Builder <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
