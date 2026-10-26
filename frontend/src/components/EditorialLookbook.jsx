import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function EditorialLookbook({ onOpenBundle }) {
  return (
    <section className="py-10 lg:py-14 bg-white border-y border-stone-100">
      <div className="max-w-[1360px] mx-auto px-5 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left large look */}
          <div className="lg:col-span-7 relative overflow-hidden rounded-[24px] bg-stone-50 border border-stone-100 aspect-[4/3] lg:aspect-[16/11] group">
            <img src="/images/hero-1.jpg" alt="Lookbook" className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
              <div>
                <span className="inline-flex px-2.5 py-1 rounded-full bg-white text-canopy-950 text-[11px] font-bold tracking-[0.12em] uppercase">Lookbook 04</span>
                <h3 className="mt-2 font-serif text-2xl lg:text-3xl font-semibold text-white leading-tight">Quiet Corners,<br />Living Sculptures</h3>
              </div>
              <button onClick={onOpenBundle} className="hidden sm:inline-flex h-10 px-5 rounded-full bg-white text-canopy-950 text-xs font-semibold items-center gap-1 hover:bg-stone-50 transition">
                Shop the Look <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right stacked looks */}
          <div className="lg:col-span-5 grid grid-rows-2 gap-6">
            <div className="relative overflow-hidden rounded-[24px] bg-linen-50 border border-stone-100 aspect-[16/9] group">
              <img src="/images/hero-2.jpg" alt="Workspace" className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h4 className="font-serif text-xl font-semibold text-white">Workspaces that breathe</h4>
                <p className="text-xs text-white/80 mt-1">Low-light • AC-ready • air-purifying</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[24px] bg-stone-50 border border-stone-100 aspect-[16/9] group">
              <img src="/images/hero-3.jpg" alt="Shelf" className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h4 className="font-serif text-xl font-semibold text-white">Shelf styling, zero guesswork</h4>
                <p className="text-xs text-white/80 mt-1">Matte ivory, sage, terracotta, charcoal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
