import React, { useState } from 'react';
import { ArrowUpRight, X, BookOpen } from 'lucide-react';

export default function BlogSection({ blogs = [] }) {
  const [activeArticle, setActiveArticle] = useState(null);

  return (
    <section id="journal" className="py-16 lg:py-20 bg-white border-t border-stone-100">
      <div className="max-w-[1360px] mx-auto px-5 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-[640px]">
            <div className="inline-flex items-center gap-2">
              <span className="w-7 h-px bg-canopy-900/20" />
              <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-canopy-700">Botanical Journal</span>
            </div>
            <h2 className="mt-3 font-serif text-[32px] lg:text-[42px] leading-[0.95] tracking-[-0.02em] font-semibold text-canopy-950">
              Field notes from the <span className="italic font-normal">Pune glasshouse</span>
            </h2>
          </div>
          <p className="text-xs font-medium text-stone-500 max-w-md">Written by our horticulture & biophilic design team — practical, seasonal, zero jargon.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {blogs.map((post) => (
            <article
              key={post.slug}
              onClick={() => setActiveArticle(post)}
              className="group cursor-pointer flex flex-col rounded-[18px] overflow-hidden bg-white border border-stone-100 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="overflow-hidden aspect-[16/10.5] bg-stone-50">
                <img src={post.imageUrl} alt={post.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.05] transition duration-700" />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.08em] uppercase text-canopy-700">
                  <span className="px-2 py-1 rounded-full bg-linen-100">{post.category}</span>
                  <span className="text-stone-300">•</span>
                  <span className="text-stone-500 tracking-normal font-medium normal-case">{post.readTime}</span>
                </div>
                <h3 className="font-serif text-[20px] font-semibold leading-snug text-canopy-950 mt-3 group-hover:text-canopy-800 transition line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-stone-600 mt-2 line-clamp-2">{post.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-canopy-950 group-hover:gap-2 transition-all">
                  Read guide <span className="w-6 h-6 rounded-full bg-canopy-950 text-white flex items-center justify-center group-hover:bg-black transition"><ArrowUpRight className="w-3 h-3" /></span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setActiveArticle(null)} className="absolute inset-0 bg-canopy-950/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-2xl max-h-[88vh] bg-white rounded-[24px] shadow-elevated overflow-hidden flex flex-col border border-stone-100">
            <div className="relative h-56 sm:h-64 shrink-0">
              <img src={activeArticle.imageUrl} alt={activeArticle.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-canopy-950/85 via-canopy-950/20 to-transparent" />
              <button onClick={() => setActiveArticle(null)} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur text-white flex items-center justify-center hover:bg-black/70">
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-5 left-6 right-6 text-white">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase text-emerald-300">
                  <BookOpen className="w-3.5 h-3.5" /> {activeArticle.category} • {activeArticle.readTime}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium mt-1 leading-tight">{activeArticle.title}</h3>
              </div>
            </div>
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-[14.5px] leading-relaxed text-stone-700">
              <p className="text-xs font-semibold text-stone-500 border-b border-stone-100 pb-3">By {activeArticle.author}</p>
              {(activeArticle.content || []).map((para, idx) => <p key={idx}>{para}</p>)}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
