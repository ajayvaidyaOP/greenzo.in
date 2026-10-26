import React, { useRef } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function CategoryStrip({ categories = [], activeCategory, onSelectCategory }) {
  const scrollerRef = useRef(null);
  if (!categories.length) return null;
  const scroll = (dir) => {
    const el = scrollerRef.current; if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  return (
    <section className="py-6 lg:py-8 bg-white border-y border-stone-100">
      <div className="max-w-[1360px] mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex w-7 h-px bg-stone-300" />
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-canopy-700">Browse by Sanctuary</span>
            <span className="px-2.5 py-1 rounded-full bg-linen-100 border border-stone-100 text-[11px] font-semibold text-canopy-800">{categories.length} Collections</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button onClick={() => scroll('left')} className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-50"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => scroll('right')} className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-50"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

        <div ref={scrollerRef} className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-1">
          {/* All pill */}
          <button
            onClick={() => onSelectCategory('all')}
            className={`snap-start shrink-0 group relative overflow-hidden rounded-[20px] p-[1.5px] transition ${activeCategory === 'all' ? 'shadow-card' : 'hover:shadow-card'}`}
            style={{ background: activeCategory === 'all' ? '#0A1A12' : 'linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.03))' }}
          >
            <div className={`rounded-[19px] px-5 py-4 flex items-center gap-3 min-w-[180px] h-[88px] ${activeCategory === 'all' ? 'bg-canopy-950 text-white' : 'bg-white'}`}>
              <div className="w-[56px] h-[56px] rounded-full bg-linen-50 border border-stone-100 flex items-center justify-center"><Sparkles className="w-5 h-5 text-canopy-700" /></div>
              <div className="text-left"><p className={`font-serif text-[16px] font-semibold leading-none ${activeCategory === 'all' ? 'text-white' : 'text-canopy-950'}`}>All Plants</p><p className={`text-xs mt-1 flex items-center gap-1 ${activeCategory === 'all' ? 'text-white/70' : 'text-stone-500'}`}>View everything <ArrowUpRight className="w-3 h-3" /></p></div>
            </div>
          </button>

          {categories.map((cat) => {
            const selected = activeCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => { onSelectCategory(selected ? 'all' : cat.slug); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }}
                className={`snap-start shrink-0 group relative overflow-hidden rounded-[20px] p-[1.5px] transition ${selected ? 'shadow-card' : 'hover:shadow-card'}`}
                style={{ background: selected ? '#0A1A12' : 'linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.03))' }}
              >
                <div className={`rounded-[19px] px-4 py-3 flex items-center gap-3 min-w-[240px] h-[88px] ${selected ? 'bg-canopy-950 text-white' : 'bg-white'}`}>
                  <img src={cat.imageUrl} alt={cat.name} loading="lazy" className="w-[64px] h-[64px] rounded-full object-cover border border-white shadow-sm" />
                  <div className="text-left min-w-0 flex-1">
                    <h3 className={`font-serif text-[16px] font-semibold leading-tight truncate ${selected ? 'text-white' : 'text-canopy-950'}`}>{cat.name}</h3>
                    <p className={`text-xs truncate ${selected ? 'text-white/70' : 'text-stone-500'}`}>{cat.subtitle || 'Shop Now'}</p>
                    <span className={`mt-1 inline-flex items-center gap-1 text-[11px] font-semibold ${selected ? 'text-emerald-300' : 'text-canopy-700'}`}>{selected ? 'Viewing' : 'Explore'} <ArrowUpRight className="w-3 h-3" /></span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-center text-[11px] text-stone-400 hidden lg:block">Drag to explore • Tap to filter • Tap again to clear</p>
      </div>
    </section>
  );
}
