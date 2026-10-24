import React, { useState } from 'react';
import { ArrowRight, X, BookOpen } from 'lucide-react';

export default function BlogSection({ blogs = [] }) {
  const [activeArticle, setActiveArticle] = useState(null);

  return (
    <section id="journal" className="py-16 lg:py-20 bg-white border-t border-canopy-900/5">
      <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-canopy-600 text-[11px] font-bold tracking-[0.28em] uppercase">
              Botanical Journal
            </span>
            <h2 className="font-serif text-[32px] lg:text-[42px] text-canopy-950 font-semibold leading-tight mt-2">
              Articles & Care Guides From Greenzo
            </h2>
          </div>
          <p className="text-xs font-medium text-canopy-700/75">
            Written by our Pune horticulture & biophilic design team
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-7">
          {blogs.map((post) => (
            <article
              key={post.slug}
              onClick={() => setActiveArticle(post)}
              className="group cursor-pointer flex flex-col"
            >
              <div className="overflow-hidden rounded-2xl aspect-[16/10] bg-linen-100">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="pt-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-canopy-600">
                  <span>{post.category}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="font-serif text-[22px] font-semibold text-canopy-950 mt-2 leading-snug group-hover:text-canopy-700 transition">
                  {post.title}
                </h3>

                <p className="text-[13.5px] text-canopy-800/70 mt-2 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>

                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-canopy-900 group-hover:gap-2.5 transition-all">
                  <span>Read Full Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Editorial Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setActiveArticle(null)}
            className="absolute inset-0 bg-canopy-950/65 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-2xl max-h-[88vh] bg-linen-50 rounded-3xl shadow-elevated overflow-hidden flex flex-col">
            <div className="relative h-56 sm:h-64 shrink-0">
              <img
                src={activeArticle.imageUrl}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-canopy-950/85 via-canopy-950/25 to-transparent" />
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/75"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-5 left-6 right-6 text-white">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-emerald-300">
                  <BookOpen className="w-3.5 h-3.5" /> {activeArticle.category} •{' '}
                  {activeArticle.readTime}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium mt-1 leading-tight">
                  {activeArticle.title}
                </h3>
              </div>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-[15px] leading-relaxed text-canopy-900">
              <p className="text-xs font-semibold text-canopy-700 border-b border-canopy-900/10 pb-3">
                By {activeArticle.author}
              </p>
              {(activeArticle.content || []).map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
