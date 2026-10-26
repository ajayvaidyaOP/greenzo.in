import React, { useRef } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import Reveal from './Reveal.jsx';

export default function CategoryStrip({ categories = [], activeCategory, onSelectCategory, onOpenQuiz }) {
  const scrollerRef = useRef(null);
  if (!categories.length) return null;

  const scroll = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' });
  };

  return (
    <section className="border-b border-canopy-950/[0.08] bg-linen-50 py-11 lg:py-14">
      <div className="shell">
        <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Shop by room &amp; benefit</span>
            <h2 className="mt-1.5 font-serif text-[25px] font-medium leading-tight text-canopy-950 sm:text-[30px]">
              Find the right plant for <span className="italic text-canopy-600">every corner.</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenQuiz?.()}
              className="inline-flex items-center gap-1.5 rounded-full border border-canopy-600/30 bg-white px-3.5 py-1.5 text-[11px] font-extrabold text-canopy-800 shadow-sm transition hover:bg-canopy-50"
            >
              <Sparkles className="h-3.5 w-3.5 text-canopy-600" /> 30-Sec Plant Quiz
            </button>
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll collections left"
              className="grid h-9 w-9 place-items-center rounded-full border border-canopy-950/12 bg-white text-canopy-900 shadow-sm transition hover:border-canopy-600/40 hover:bg-canopy-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll collections right"
              className="grid h-9 w-9 place-items-center rounded-full border border-canopy-950/12 bg-white text-canopy-900 shadow-sm transition hover:border-canopy-600/40 hover:bg-canopy-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </Reveal>

        <div
          ref={scrollerRef}
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
        >
          {/* All Plants */}
          <button
            onClick={() => onSelectCategory('all')}
            className={`group relative flex h-[108px] w-[196px] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[22px] border p-4 text-left transition-all duration-300 ${
              activeCategory === 'all'
                ? 'border-canopy-950 bg-canopy-950 text-white shadow-card'
                : 'border-canopy-950/10 bg-white text-canopy-950 hover:-translate-y-1 hover:border-canopy-600/40 hover:shadow-card'
            }`}
          >
            <span
              className={`grid h-9 w-9 place-items-center rounded-xl ${
                activeCategory === 'all' ? 'bg-emerald-400 text-canopy-950' : 'bg-canopy-50 text-canopy-700'
              }`}
            >
              <Sparkles className="h-4 w-4" />
            </span>
            <span>
              <span className="block font-serif text-[18px] font-medium leading-none">All Plants</span>
              <span
                className={`mt-1.5 flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-[0.14em] ${
                  activeCategory === 'all' ? 'text-emerald-300' : 'text-canopy-700'
                }`}
              >
                {activeCategory === 'all' ? 'Viewing All' : 'Shop All'} <ArrowUpRight className="h-3 w-3" />
              </span>
            </span>
          </button>

          {categories.map((cat) => {
            const selected = activeCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => {
                  onSelectCategory(selected ? 'all' : cat.slug);
                  document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group relative flex h-[108px] w-[260px] shrink-0 snap-start items-center gap-3.5 overflow-hidden rounded-[22px] border p-3 text-left transition-all duration-300 ${
                  selected
                    ? 'border-canopy-950 bg-canopy-950 text-white shadow-card'
                    : 'border-canopy-950/10 bg-white text-canopy-950 hover:-translate-y-1 hover:border-canopy-600/40 hover:shadow-card'
                }`}
              >
                <span className="relative h-[82px] w-[82px] shrink-0 overflow-hidden rounded-2xl ring-1 ring-inset ring-canopy-950/10">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-silk group-hover:scale-110"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-[9px] font-extrabold uppercase tracking-[0.16em] ${
                      selected ? 'text-emerald-300' : 'text-canopy-600'
                    }`}
                  >
                    {cat.productCount ?? 0} Plants
                  </span>
                  <span className="mt-0.5 block truncate font-serif text-[17px] font-medium leading-tight">
                    {cat.name}
                  </span>
                  <span
                    className={`mt-1 block truncate text-[11px] ${
                      selected ? 'text-white/70' : 'text-stone-500'
                    }`}
                  >
                    {cat.subtitle || 'Self-watering indoor'}
                  </span>
                  <span
                    className={`mt-1.5 inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-[0.12em] ${
                      selected ? 'text-emerald-300' : 'text-canopy-700'
                    }`}
                  >
                    {selected ? 'Active' : 'Explore'}
                    <ArrowUpRight className="h-2.5 w-2.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
