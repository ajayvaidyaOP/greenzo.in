import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function CategoryStrip({
  categories = [],
  activeCategory,
  onSelectCategory
}) {
  return (
    <section className="py-6 lg:py-8 bg-white">
      <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 lg:gap-4">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => {
                  onSelectCategory(isSelected ? 'all' : cat.slug);
                  document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{ background: cat.accentGradient }}
                className={`group relative overflow-hidden rounded-2xl p-4 flex items-center gap-3.5 text-left transition-transform duration-200 hover:-translate-y-1 ${
                  isSelected
                    ? 'ring-2 ring-canopy-900 shadow-md'
                    : 'border border-canopy-900/5 hover:shadow-soft'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    loading="lazy"
                    className="w-16 h-16 lg:w-[70px] lg:h-[70px] rounded-full object-cover border-2 border-white shadow-sm group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif text-[17px] lg:text-[18px] font-semibold leading-tight text-canopy-950">
                    {cat.name}
                  </h3>
                  <span className="mt-1.5 inline-flex items-center gap-1 text-[11.5px] font-semibold text-canopy-800 group-hover:gap-1.5 transition-all">
                    <span>{isSelected ? 'Showing Now' : 'Shop Now'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
