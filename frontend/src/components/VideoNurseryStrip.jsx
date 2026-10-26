import React, { useState, useRef, useEffect } from 'react';
import { Droplets, SunMedium, PackageCheck, Sparkles, ArrowUpRight, Play } from 'lucide-react';
import Reveal from './Reveal.jsx';

const STUDIO_STORIES = [
  {
    id: 'wick',
    tag: '01 — Hydro-wick atelier',
    title: '14-day capillary reservoir',
    description: 'A braided cotton wick feeds roots only when needed — no rot, no dry-outs, no weekly guesswork.',
    videoUrl: '/videos/hero-sanctuary.mp4',
    posterUrl: '/images/hero-1.jpg',
    icon: Droplets
  },
  {
    id: 'nursery',
    tag: '02 — Theur micro-climate',
    title: 'Shade-hardened in Pune',
    description: 'Twenty-one days in our indoor-light bay, so your plant never shocks when it enters your living room.',
    videoUrl: '/videos/hero-mist.mp4',
    posterUrl: '/images/hero-2.jpg',
    icon: SunMedium
  },
  {
    id: 'packaging',
    tag: '03 — Eco transit',
    title: 'Ventilated honeycomb pods',
    description: 'Plastic-free kraft sleeves lock the pot and coco-perlite crown for safe pan-India transit.',
    videoUrl: '/videos/hero-workspace.mp4',
    posterUrl: '/images/hero-3.jpg',
    icon: PackageCheck
  }
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
    <section id="reels" ref={sectionRef} className="border-y border-canopy-950/[0.08] bg-white py-16 lg:py-24">
      <div className="shell">
        <div className="mb-9 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <Reveal className="max-w-[680px]">
            <span className="eyebrow"><span className="h-px w-7 bg-brass-500/70" /> Atelier technology</span>
            <h2 className="display-section mt-3 text-canopy-950">
              Why Greenzo stays lush, <span className="italic text-canopy-700">effortlessly.</span>
            </h2>
          </Reveal>
          <Reveal delay={100} className="max-w-sm">
            <p className="text-[13.5px] leading-relaxed text-stone-600">
              Hover a card to play the reel — from wick engineering to shade-hardening and carbon-neutral packaging.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-4 md:grid-cols-3 lg:gap-5">
          {STUDIO_STORIES.map((story, i) => {
            const Icon = story.icon;
            const isActive = activeCard === story.id;
            return (
              <Reveal
                key={story.id}
                delay={i * 100}
                as="article"
                onMouseEnter={() => setActiveCard(story.id)}
                onClick={() => setActiveCard(story.id)}
                className={`group cursor-pointer overflow-hidden rounded-[24px] border bg-white transition-all duration-500 ease-silk ${
                  isActive
                    ? '-translate-y-1 border-canopy-950/20 shadow-soft-lg'
                    : 'border-canopy-950/[0.09] shadow-soft hover:-translate-y-0.5 hover:shadow-card'
                }`}
              >
                <div className="relative aspect-[16/10.5] overflow-hidden bg-canopy-950">
                  {visible && isActive ? (
                    <video src={story.videoUrl} poster={story.posterUrl} autoPlay muted loop playsInline className="h-full w-full object-cover" />
                  ) : (
                    <img src={story.posterUrl} alt={story.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1500ms] ease-silk group-hover:scale-[1.04]" />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canopy-950/70 via-canopy-950/5 to-canopy-950/20" />

                  <span className="absolute left-3 top-3 rounded-full px-3 py-1 text-[9.5px] font-extrabold uppercase tracking-[0.16em] text-canopy-950 glass-panel">
                    {story.tag}
                  </span>

                  <span className={`absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] backdrop-blur transition ${
                    isActive ? 'bg-brass-400 text-canopy-950' : 'border border-white/25 bg-white/10 text-linen-100'
                  }`}>
                    {isActive ? (
                      <>
                        <span className="flex gap-0.5">
                          <span className="h-2 w-[2px] animate-pulse bg-canopy-950" />
                          <span className="h-2 w-[2px] animate-pulse bg-canopy-950 [animation-delay:150ms]" />
                          <span className="h-2 w-[2px] animate-pulse bg-canopy-950 [animation-delay:300ms]" />
                        </span>
                        Playing
                      </>
                    ) : (
                      <><Play className="h-2.5 w-2.5" /> Hover to play</>
                    )}
                  </span>
                </div>

                <div className="p-5">
                  <span className={`grid h-10 w-10 place-items-center rounded-xl border transition-colors duration-500 ${
                    isActive ? 'border-brass-500/30 bg-brass-50 text-brass-700' : 'border-canopy-950/10 bg-linen-50 text-canopy-800'
                  }`}>
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <h3 className="mt-3 font-serif text-[20px] leading-tight text-canopy-950">{story.title}</h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-stone-600">{story.description}</p>
                  <span className={`mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] transition ${isActive ? 'text-brass-700' : 'text-stone-500 group-hover:text-canopy-900'}`}>
                    Learn more <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Signature banner */}
        <Reveal delay={100} className="relative mt-6 overflow-hidden rounded-[26px] bg-canopy-950 p-7 text-linen-50 sm:p-9 lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_140%_at_100%_0%,rgba(176,138,62,0.24),transparent_60%)]" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-canopy-600/20 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <span className="eyebrow-light"><Sparkles className="h-3.5 w-3.5" /> Atelier favourite · limited bay</span>
              <h3 className="mt-2.5 font-serif text-[26px] leading-[1.08] sm:text-[32px]">
                Curate any four plants with four hydro-wick planters — <span className="italic text-brass-200">₹999.</span>
              </h3>
              <p className="mt-2.5 max-w-xl text-[13px] leading-relaxed text-linen-100/65">
                Mix Zamia, Monstera, Snake, Peace Lily or Syngonium in matte ivory, sage, terracotta or charcoal. Free photo confirmation before dispatch.
              </p>
            </div>
            <button onClick={onOpenBundle} className="btn btn-gold btn-md group/btn shrink-0">
              Open box builder
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
