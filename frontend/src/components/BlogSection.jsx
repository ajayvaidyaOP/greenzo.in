import React, { useState } from 'react';
import { ArrowUpRight, X, BookOpen, Clock } from 'lucide-react';
import Reveal from './Reveal.jsx';

export default function BlogSection({ blogs = [] }) {
  const [activeArticle, setActiveArticle] = useState(null);

  return (
    <section id="journal" className="border-t border-canopy-950/[0.08] bg-white py-16 lg:py-24">
      <div className="shell">
        <div className="mb-9 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <Reveal className="max-w-[640px]">
            <span className="eyebrow"><span className="h-px w-7 bg-brass-500/70" /> Botanical journal</span>
            <h2 className="display-section mt-3 text-canopy-950">
              Field notes from the <span className="italic text-canopy-700">Pune glasshouse</span>
            </h2>
          </Reveal>
          <Reveal delay={100} className="max-w-sm">
            <p className="text-[13px] leading-relaxed text-stone-600">
              Written by our horticulture and biophilic design team — practical, seasonal, zero jargon.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-5 md:grid-cols-3 lg:gap-6">
          {blogs.map((post, i) => (
            <Reveal
              key={post.slug}
              delay={i * 90}
              as="article"
              onClick={() => setActiveArticle(post)}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-[22px] border border-canopy-950/[0.09] bg-white shadow-soft transition-all duration-500 ease-silk hover:-translate-y-1.5 hover:shadow-soft-lg"
            >
              <div className="relative aspect-[16/10.5] overflow-hidden bg-linen-100">
                <img src={post.imageUrl} alt={post.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1300ms] ease-silk group-hover:scale-[1.05]" />
                <span className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-canopy-950 glass-panel">
                  {post.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-500">
                  <Clock className="h-3 w-3 text-brass-600" /> {post.readTime}
                  <span className="h-2.5 w-px bg-canopy-950/15" />
                  <span className="truncate">{post.author}</span>
                </div>
                <h3 className="mt-2.5 line-clamp-2 font-serif text-[19px] leading-snug text-canopy-950 transition-colors group-hover:text-canopy-700">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-stone-600">{post.excerpt}</p>
                <span className="mt-auto flex items-center gap-2 pt-4 text-[11px] font-bold uppercase tracking-[0.1em] text-canopy-950">
                  Read guide
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-canopy-950 text-linen-50 transition-all duration-500 group-hover:bg-brass-500 group-hover:text-canopy-950">
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {activeArticle && (
        <div className="fixed inset-0 z-[85] flex items-center justify-center p-4">
          <div onClick={() => setActiveArticle(null)} className="absolute inset-0 animate-fade-in bg-canopy-950/70 backdrop-blur-sm" />
          <div className="relative flex max-h-[88vh] w-full max-w-2xl animate-scale-in flex-col overflow-hidden rounded-[26px] border border-canopy-950/10 bg-linen-50 shadow-elevated">
            <div className="relative h-56 shrink-0 sm:h-64">
              <img src={activeArticle.imageUrl} alt={activeArticle.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-canopy-950/90 via-canopy-950/25 to-transparent" />
              <button onClick={() => setActiveArticle(null)} aria-label="Close article" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-canopy-950/50 text-white backdrop-blur transition hover:bg-canopy-950">
                <X className="h-4 w-4" />
              </button>
              <div className="absolute inset-x-6 bottom-5 text-linen-50">
                <span className="inline-flex items-center gap-1.5 text-[9.5px] font-extrabold uppercase tracking-[0.2em] text-brass-300">
                  <BookOpen className="h-3.5 w-3.5" /> {activeArticle.category} · {activeArticle.readTime}
                </span>
                <h3 className="mt-1.5 font-serif text-[24px] leading-tight sm:text-[28px]">{activeArticle.title}</h3>
              </div>
            </div>
            <div className="space-y-4 overflow-y-auto p-6 text-[14px] leading-relaxed text-stone-700 sm:p-8">
              <p className="border-b border-canopy-950/10 pb-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-stone-400">By {activeArticle.author}</p>
              {(activeArticle.content || []).map((para, idx) => <p key={idx}>{para}</p>)}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
