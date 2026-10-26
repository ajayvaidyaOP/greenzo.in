import React, { useRef } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import Reveal from './Reveal.jsx';

export default function CategoryStrip({ categories = [], activeCategory, onSelectCategory }) {
  const scrollerRef = useRef(null);
  if (!categories.length) return null;

  const scroll = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' });
  };

  return (
    <section className="border-b border-canopy-950/[0.08] bg-linen-50 py-10 lg:py-12">
      <div className="shell">
        <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow"><span className="h-px w-7 bg-brass-500/70" /> Browse by sanctuary</span>
            <h2 className="mt-2 font-serif text-[24px] leading-tight text-canopy-950 sm:text-[28px]">
              Find the plant that fits <span className="italic text-canopy-700">your corner.</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-canopy-950/10 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-stone-500 sm:inline-flex">
              {categories.length} collections
            </span>
            <button onClick={() => scroll('left')} aria-label="Scroll collections left" className="grid h-9 w-9 place-items-center rounded-full border border-canopy-950/10 bg-white text-canopy-900 transition hover:border-canopy-950/30 hover:bg-white">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => scroll('right')} aria-label="Scroll collections right" className="grid h-9 w-9 place-items-center rounded-full border border-canopy-950/10 bg-white text-canopy-900 transition hover:border-canopy-950/30 hover:bg-white">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </Reveal>

        <div ref={scrollerRef} className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 lg:mx-0 lg:px-0">
          {/* All */}
          <button
            onClick={() => onSelectCategory('all')}
            className={`group relative flex h-[104px] w-[196px] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[20px] border p-4 text-left transition-all duration-500 ease-silk ${
              activeCategory === 'all'
                ? 'border-canopy-950 bg-canopy-950 text-linen-50 shadow-card'
                : 'border-canopy-950/10 bg-white text-canopy-950 hover:-translate-y-1 hover:border-canopy-950/25 hover:shadow-card'
            }`}
          >
            <span className={`grid h-9 w-9 place-items-center rounded-full ${activeCategory === 'all' ? 'bg-brass-400 text-canopy-950' : 'bg-linen-100 text-canopy-800'}`}>
              <Sparkles className="h-4 w-4" />
            </span>
            <span>
              <span className="block font-serif text-[17px] leading-none">All plants</span>
              <span className={`mt-1.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] ${activeCategory === 'all' ? 'text-brass-300' : 'text-stone-500'}`}>
                {activeCategory === 'all' ? 'Viewing all' : 'Everything'} <ArrowUpRight className="h-3 w-3" />
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
                className={`group relative flex h-[104px] w-[250px] shrink-0 snap-start items-center gap-3.5 overflow-hidden rounded-[20px] border p-3 text-left transition-all duration-500 ease-silk ${
                  selected
                    ? 'border-canopy-950 bg-canopy-950 text-linen-50 shadow-card'
                    : 'border-canopy-950/10 bg-white text-canopy-950 hover:-translate-y-1 hover:border-canopy-950/25 hover:shadow-card'
                }`}
              >
                <span className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-full ring-1 ring-inset ring-canopy-950/10">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-silk group-hover:scale-110"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-[8.5px] font-extrabold uppercase tracking-[0.18em] ${selected ? 'text-brass-300' : 'text-stone-400'}`}>
                    {cat.productCount ?? 0} editions
                  </span>
                  <span className="mt-0.5 block truncate font-serif text-[16.5px] leading-tight">{cat.name}</span>
                  <span className={`mt-1 block truncate text-[11px] ${selected ? 'text-linen-100/60' : 'text-stone-500'}`}>
                    {cat.subtitle || 'Shop the collection'}
                  </span>
                  <span className={`mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em] ${selected ? 'text-brass-300' : 'text-canopy-700'}`}>
                    {selected ? 'Viewing' : 'Explore'} <ArrowUpRight className="h-2.5 w-2.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
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
