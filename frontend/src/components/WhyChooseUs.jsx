import React, { useState } from 'react';
import { Sprout, Layers, MessageSquareHeart, Headphones, X, ArrowUpRight } from 'lucide-react';

const PILLARS = [
  {
    icon: Sprout,
    title: 'Sustainable Substrates',
    desc: 'Coco-peat, neem cake & perlite — no synthetic sprays. Built for longevity.',
  },
  {
    icon: Layers,
    title: 'Light-Calibrated',
    desc: 'Tested for apartment light, ceiling fans and AC humidity across India.',
  },
  {
    icon: MessageSquareHeart,
    title: 'Free Atelier Consult',
    desc: 'Share a photo of your corner — our Pune horticulturists guide you free.',
  },
  {
    icon: Headphones,
    title: 'Lifetime Support',
    desc: 'Yellowing leaf months later? Message our plant doctors anytime.',
  },
];

const DEFAULT_GALLERY = [
  { src: '/images/hero-1.jpg', caption: 'Travertine Console • Sanctuary Combo', span: 'lg:col-span-2 lg:row-span-2' },
  { src: '/images/zamia-green.jpg', caption: 'Zamia Green — Matte Ivory Atelier Pot', span: '' },
  { src: '/images/peace-lily.jpg', caption: 'Peace Lily • Reservoir Notch Detail', span: '' },
  { src: '/images/hero-2.jpg', caption: 'Morning Mist — Empire Agro, Pune', span: '' },
  { src: '/images/syngonium-pink.jpg', caption: 'Syngonium Pink Neon • Warm Interiors', span: '' },
  { src: '/images/hero-3.jpg', caption: 'Biophilic Home Studio', span: 'lg:col-span-2' },
];

export default function WhyChooseUs({ galleryPhotos = [] }) {
  const [lightboxImg, setLightboxImg] = useState(null);
  const raw = galleryPhotos.length ? galleryPhotos : DEFAULT_GALLERY;
  const items = raw.map((g) => ({ src: g.imageUrl || g.src, caption: g.caption, span: g.spanClass || g.span, id: g.id }));

  return (
    <>
      {/* ——— Split Editorial Dark ——— */}
      <section id="about" className="bg-canopy-950 text-white overflow-hidden">
        <div className="max-w-[1360px] mx-auto grid lg:grid-cols-12">
          <div className="lg:col-span-5 relative min-h-[380px] lg:min-h-[560px]">
            <img src="/images/hero-2.jpg" alt="Pune Greenhouse" loading="lazy" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-canopy-950/80 via-canopy-950/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 sm:right-auto glass-dark rounded-[18px] p-4 flex items-center gap-3.5 max-w-[320px]">
              <div className="w-11 h-11 rounded-xl bg-white text-canopy-950 flex items-center justify-center shrink-0 shadow-soft">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">10,000+ Living Rooms</p>
                <p className="text-xs text-white/70">Pune • Mumbai • Pan-India</p>
              </div>
              <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>

          <div className="lg:col-span-7 px-6 sm:px-10 lg:px-14 py-14 lg:py-20 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2">
              <span className="w-7 h-px bg-emerald-300/60" />
              <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-emerald-300">Why Collectors Choose Greenzo</span>
            </div>
            <h2 className="mt-3 font-serif text-[34px] lg:text-[48px] leading-[0.92] tracking-[-0.02em] font-medium">
              Gardening <span className="italic font-normal text-emerald-200">grows</span> a spirit
            </h2>
            <p className="text-white/70 text-[15px] leading-relaxed mt-4 max-w-xl">
              From our glasshouse in Theur straight to your tabletop — every plant is acclimatized, balanced and designed to thrive with minimal care.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mt-10">
              {PILLARS.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-[16px] bg-white/[0.06] border border-white/10 p-5 hover:bg-white/[0.09] transition">
                    <div className="w-9 h-9 rounded-xl bg-white text-canopy-950 flex items-center justify-center">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <h3 className="mt-3 font-serif text-[18px] font-semibold leading-tight">{item.title}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-white/65">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ——— Gallery — masonry ——— */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-[1360px] mx-auto px-5 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-canopy-700">Our Green Journey</span>
            <h2 className="mt-2 font-serif text-[32px] lg:text-[44px] leading-[0.95] tracking-[-0.02em] font-semibold text-canopy-950">
              Begin life in a living sanctuary
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-stone-600">
              Honeycomb kraft pods, architectural pots, horticultural craft — from Pune nursery to your home.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[220px] gap-4">
            {items.map((g, idx) => (
              <div
                key={g.id || idx}
                onClick={() => setLightboxImg(g)}
                className={`group relative rounded-[18px] overflow-hidden bg-stone-50 cursor-pointer border border-stone-100 hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-0.5 ${g.span || ''}`}
              >
                <img src={g.src} alt={g.caption} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.04] transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end justify-between p-4">
                  <p className="text-white text-xs font-medium pr-4">{g.caption}</p>
                  <span className="w-7 h-7 rounded-full bg-white text-canopy-950 flex items-center justify-center shrink-0">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightboxImg && (
        <div onClick={() => setLightboxImg(null)} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div onClick={(e) => e.stopPropagation()} className="relative max-w-4xl w-full bg-white rounded-[24px] overflow-hidden shadow-elevated">
            <button onClick={() => setLightboxImg(null)} className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur text-white flex items-center justify-center">
              <X className="w-5 h-5" />
            </button>
            <img src={lightboxImg.src} alt={lightboxImg.caption} className="w-full max-h-[75vh] object-cover" />
            <div className="p-4 bg-white text-sm font-medium text-canopy-950">{lightboxImg.caption}</div>
          </div>
        </div>
      )}
    </>
  );
}
