import React, { useState, useRef, useEffect } from 'react';
import { Droplets, SunMedium, PackageCheck, Sparkles } from 'lucide-react';

const STUDIO_STORIES = [
  {
    id: 'wick',
    tag: '01 • Hydro-Wick Engineering',
    title: '14-Day Self-Watering Reservoir',
    description:
      'A braided natural cotton wick draws exact moisture from the lower chamber only when roots need it—preventing root rot and weekend dry-out.',
    videoUrl: '/videos/hero-sanctuary.mp4',
    posterUrl: '/images/hero-1.jpg',
    icon: Droplets
  },
  {
    id: 'nursery',
    tag: '02 • Empire Agro, Theur Pune',
    title: 'Shade-Hardened Before Dispatch',
    description:
      'Every plant spends 21 days in our indoor-light acclimatization bay in Pune so it never suffers shock when placed in your living room.',
    videoUrl: '/videos/hero-mist.mp4',
    posterUrl: '/images/hero-2.jpg',
    icon: SunMedium
  },
  {
    id: 'packaging',
    tag: '03 • Zero-Spill Transit',
    title: 'Breathable Honeycomb Eco-Pods',
    description:
      'Recyclable ventilated sleeves lock the self-watering pot and coco-perlite crown firmly in place across Pune, Mumbai & pan-India.',
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
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="reels" ref={sectionRef} className="py-16 lg:py-20 bg-linen-100/70">
      <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-canopy-600 text-[11px] font-bold tracking-[0.28em] uppercase">
              Behind The Leaves • Video Showcase
            </span>
            <h2 className="font-serif text-[32px] lg:text-[42px] text-canopy-950 font-semibold leading-tight mt-2">
              Why Greenzo Plants Stay Lush Effortlessly
            </h2>
          </div>
          <p className="text-[14px] text-canopy-800/75 max-w-md">
            Hover or tap any studio reel below to inspect our self-watering planter system & Pune
            greenhouse craft.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {STUDIO_STORIES.map((story) => {
            const Icon = story.icon;
            const isActive = activeCard === story.id;
            return (
              <div
                key={story.id}
                onMouseEnter={() => setActiveCard(story.id)}
                onClick={() => setActiveCard(story.id)}
                className={`group rounded-3xl overflow-hidden bg-white border transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'border-canopy-800 shadow-elevated -translate-y-1'
                    : 'border-canopy-900/10 shadow-soft'
                }`}
              >
                <div className="relative aspect-[16/10] bg-canopy-950 overflow-hidden">
                  {visible && isActive ? (
                    <video
                      src={story.videoUrl}
                      poster={story.posterUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={story.posterUrl}
                      alt={story.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10.5px] font-semibold">
                    {story.tag}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full bg-emerald-500 text-canopy-950 text-[10px] font-bold">
                      ● Live Reel
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <div className="w-10 h-10 rounded-xl bg-canopy-50 text-canopy-800 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-[22px] font-semibold text-canopy-950">
                    {story.title}
                  </h3>
                  <p className="text-[13.5px] text-canopy-800/75 leading-relaxed mt-2">
                    {story.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Luxury Inline ₹999 Combo Banner */}
        <div className="mt-12 rounded-3xl bg-canopy-950 text-white p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-elevated">
          <div className="space-y-2 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 text-emerald-300 text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" /> Client Favourite Bundle
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium">
              Curate Any 4 Indoor Plants + 4 Self-Watering Pots for Just ₹999
            </h3>
            <p className="text-sm text-linen-200/75 max-w-2xl">
              Mix & match Zamia Green, Raven ZZ, Snake Plant, Peace Lily or Pink Syngonium in your
              preferred matte pot colour with free doorstep delivery.
            </p>
          </div>
          <button
            onClick={onOpenBundle}
            className="h-12 px-7 rounded-full bg-white hover:bg-linen-100 text-canopy-950 font-semibold text-sm shrink-0 transition active:scale-95"
          >
            Launch 4-Plant Box Builder →
          </button>
        </div>
      </div>
    </section>
  );
}
