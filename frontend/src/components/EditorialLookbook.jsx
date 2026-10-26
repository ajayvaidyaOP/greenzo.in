import React from 'react';
import { ArrowUpRight, ArrowRight, Sparkles } from 'lucide-react';
import Reveal from './Reveal.jsx';

export default function EditorialLookbook({ onOpenBundle }) {
  return (
    <section className="relative overflow-hidden bg-linen-75 py-16 lg:py-24">
      <div className="shell">
        <div className="mb-9 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <Reveal className="max-w-[620px]">
            <span className="eyebrow"><span className="h-px w-7 bg-brass-500/70" /> Lookbook № 04</span>
            <h2 className="display-section mt-3 text-canopy-950">
              Quiet corners, <span className="italic text-canopy-700">living</span> sculptures.
            </h2>
          </Reveal>
          <Reveal delay={100} className="max-w-sm">
            <p className="text-[13.5px] leading-relaxed text-stone-600">
              Styled in real Pune homes — travertine consoles, warm oak shelves, north-facing studio desks.
              Every look is shoppable as a curated set.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          {/* Feature */}
          <Reveal dir="scale" className="group relative col-span-12 overflow-hidden rounded-[26px] border border-canopy-950/10 bg-canopy-950 lg:col-span-7">
            <div className="aspect-[4/3.2] w-full sm:aspect-[16/10.5]">
              <img
                src="/images/hero-1.jpg"
                alt="Travertine console styled with four self-watering plants"
                className="h-full w-full object-cover transition-transform duration-[1600ms] ease-silk group-hover:scale-[1.04]"
                loading="lazy"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canopy-950/90 via-canopy-950/15 to-transparent" />
            <div className="absolute inset-x-5 bottom-5 flex flex-wrap items-end justify-between gap-4">
              <div className="min-w-0">
                <span className="tag bg-brass-400 text-canopy-950">Lookbook 04</span>
                <h3 className="mt-2.5 font-serif text-[26px] leading-[1.05] text-linen-50 sm:text-[32px]">
                  The travertine <span className="italic text-brass-200">console</span>
                </h3>
                <p className="mt-1.5 text-[11.5px] text-linen-100/70">Zamia · Snake · Syngonium · Peace Lily — matte ivory & sage planters</p>
              </div>
              <button onClick={onOpenBundle} className="btn btn-gold btn-sm group/btn shrink-0">
                Shop the look <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
              </button>
            </div>
          </Reveal>

          {/* Stacked */}
          <div className="col-span-12 grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {[
              { src: '/images/hero-2.jpg', title: 'Workspaces that breathe', meta: 'Low-light · AC-ready · air-purifying', tag: 'Studio' },
              { src: '/images/hero-3.jpg', title: 'Shelf styling, zero guesswork', meta: 'Ivory · sage · terracotta · charcoal', tag: 'Living' }
            ].map((look, i) => (
              <Reveal key={look.title} dir="right" delay={120 + i * 110} className="group relative overflow-hidden rounded-[24px] border border-canopy-950/10 bg-canopy-950">
                <div className="aspect-[16/10] h-full w-full">
                  <img
                    src={look.src}
                    alt={look.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1600ms] ease-silk group-hover:scale-[1.05]"
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canopy-950/85 via-transparent to-transparent" />
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                  <div>
                    <span className="text-[8.5px] font-extrabold uppercase tracking-[0.22em] text-brass-300">{look.tag}</span>
                    <h4 className="mt-1 font-serif text-[19px] leading-tight text-linen-50">{look.title}</h4>
                    <p className="mt-1 text-[10.5px] text-linen-100/65">{look.meta}</p>
                  </div>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-linen-50/95 text-canopy-950 transition-transform duration-500 ease-silk group-hover:rotate-45">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Signature band */}
        <Reveal delay={80} className="mt-4 flex flex-col items-center justify-between gap-4 overflow-hidden rounded-[24px] border border-brass-500/25 bg-brass-50 px-6 py-5 sm:flex-row">
          <div className="flex items-center gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-canopy-950 text-brass-300">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[9.5px] font-extrabold uppercase tracking-[0.22em] text-brass-700">Complete the set</p>
              <p className="mt-0.5 font-serif text-[19px] leading-tight text-canopy-950">
                Any four plants, four hydro-wick planters — <span className="italic">₹999</span>
              </p>
            </div>
          </div>
          <button onClick={onOpenBundle} className="btn btn-dark btn-sm group/btn shrink-0">
            Open box builder <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
