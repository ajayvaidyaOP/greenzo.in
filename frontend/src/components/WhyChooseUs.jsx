import React, { useState } from 'react';
import { Sprout, Layers, MessageSquareHeart, Headphones, X, ArrowUpRight, Camera } from 'lucide-react';
import Reveal from './Reveal.jsx';

const PILLARS = [
  { icon: Sprout, title: 'Sustainable substrates', desc: 'Coco-peat, neem cake and perlite — no synthetic sprays, built for longevity.' },
  { icon: Layers, title: 'Light-calibrated', desc: 'Tested against apartment light, ceiling fans and AC humidity across India.' },
  { icon: MessageSquareHeart, title: 'Free atelier consult', desc: 'Share a photo of your corner — our Pune horticulturists guide you free.' },
  { icon: Headphones, title: 'Lifetime support', desc: 'A yellowing leaf months later? Message our plant doctors anytime.' }
];

const DEFAULT_GALLERY = [
  { src: '/images/hero-1.jpg', caption: 'Travertine console · the four-plant sanctuary set', span: 'sm:col-span-2 sm:row-span-2' },
  { src: '/images/zamia-green.jpg', caption: 'Zamia Green · matte ivory atelier planter', span: '' },
  { src: '/images/peace-lily.jpg', caption: 'Peace lily · reservoir notch detail', span: '' },
  { src: '/images/hero-2.jpg', caption: 'Morning mist · Empire Agro, Theur', span: '' },
  { src: '/images/syngonium-pink.jpg', caption: 'Syngonium pink neon · warm interiors', span: '' },
  { src: '/images/hero-3.jpg', caption: 'Biophilic home studio · north light', span: 'sm:col-span-2' }
];

export default function WhyChooseUs({ galleryPhotos = [] }) {
  const [lightboxImg, setLightboxImg] = useState(null);
  const raw = galleryPhotos.length ? galleryPhotos : DEFAULT_GALLERY;
  const items = raw.map((g) => ({ src: g.imageUrl || g.src, caption: g.caption, span: g.spanClass || g.span, id: g.id }));

  return (
    <>
      {/* ——— Dark editorial split ——— */}
      <section id="about" className="relative overflow-hidden bg-canopy-950 text-linen-50">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_120%_at_0%_0%,rgba(176,138,62,0.14),transparent_55%)]" />
        <div className="relative grid lg:grid-cols-12">
          <Reveal dir="left" className="relative min-h-[380px] lg:col-span-5 lg:min-h-[600px]">
            <img src="/images/hero-2.jpg" alt="Greenzo glasshouse in Theur, Pune" loading="lazy" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-canopy-950 via-canopy-950/20 to-transparent" />
            <div className="absolute inset-x-6 bottom-6 flex max-w-[340px] items-center gap-3.5 rounded-[18px] p-4 glass-dark sm:right-auto">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brass-400 text-canopy-950 shadow-soft">
                <Sprout className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[13px] font-semibold">10,000+ living rooms</p>
                <p className="text-[11px] text-linen-100/65">Pune · Mumbai · pan-India</p>
              </div>
              <span className="relative ml-auto flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-brass-300 opacity-70 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brass-300" />
              </span>
            </div>
          </Reveal>

          <div className="px-6 py-14 sm:px-10 lg:col-span-7 lg:px-14 lg:py-20">
            <Reveal>
              <span className="eyebrow-light"><span className="h-px w-7 bg-brass-400/60" /> Why collectors choose Greenzo</span>
              <h2 className="display-section mt-4 text-linen-50">
                Gardening <span className="italic text-brass-200">grows</span>
                <br /> a quieter spirit.
              </h2>
              <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-linen-100/65">
                From our glasshouse in Theur straight to your tabletop — every plant is acclimatised, balanced and
                designed to thrive with minimal care.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {PILLARS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <Reveal
                    key={item.title}
                    delay={i * 80}
                    className="group rounded-[18px] border border-white/10 bg-white/[0.04] p-5 transition-all duration-500 ease-silk hover:-translate-y-1 hover:border-brass-400/30 hover:bg-white/[0.07]"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-brass-400 text-canopy-950 transition-transform duration-500 group-hover:-rotate-6">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="mt-3 font-serif text-[18px] leading-tight text-linen-50">{item.title}</h3>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-linen-100/60">{item.desc}</p>
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={120} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-linen-100/50">
              <span>Est. 2018</span>
              <span className="h-3 w-px bg-white/15" />
              <span>50,000+ plants delivered</span>
              <span className="h-3 w-px bg-white/15" />
              <span>Theur · Pune 412110</span>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ——— Gallery ——— */}
      <section className="bg-white py-16 lg:py-24">
        <div className="shell">
          <Reveal className="mx-auto mb-10 max-w-2xl text-center">
            <span className="eyebrow justify-center"><span className="h-px w-7 bg-brass-500/70" /> Our green journey</span>
            <h2 className="display-section mt-3 text-canopy-950">
              Begin life in a <span className="italic text-canopy-700">living</span> sanctuary
            </h2>
            <p className="lede mt-3">
              Honeycomb kraft pods, architectural planters and horticultural craft — from the Pune nursery to your home.
            </p>
          </Reveal>

          <div className="grid auto-rows-[190px] grid-cols-2 gap-3 sm:auto-rows-[210px] sm:grid-cols-4 sm:gap-4">
            {items.map((g, idx) => (
              <Reveal
                key={g.id || idx}
                delay={Math.min(idx * 60, 300)}
                onClick={() => setLightboxImg(g)}
                className={`group relative cursor-pointer overflow-hidden rounded-[18px] border border-canopy-950/[0.08] bg-linen-100 ${g.span || ''} ${
                  idx === 0 ? 'col-span-2' : ''
                }`}
              >
                <img src={g.src} alt={g.caption} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1400ms] ease-silk group-hover:scale-[1.05]" />
                <div className="absolute inset-0 bg-gradient-to-t from-canopy-950/75 via-canopy-950/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-x-4 bottom-4 flex translate-y-2 items-end justify-between gap-3 opacity-0 transition-all duration-500 ease-silk group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="pr-2 text-[11px] font-medium leading-snug text-linen-50">{g.caption}</p>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-linen-50 text-canopy-950">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
                <span className="absolute left-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-linen-50/85 text-canopy-900 opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                  <Camera className="h-3.5 w-3.5" />
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Lightbox ——— */}
      {lightboxImg && (
        <div onClick={() => setLightboxImg(null)} className="fixed inset-0 z-[85] flex animate-fade-in items-center justify-center bg-canopy-950/85 p-4 backdrop-blur">
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-4xl animate-scale-in overflow-hidden rounded-[24px] bg-linen-50 shadow-elevated">
            <button onClick={() => setLightboxImg(null)} aria-label="Close image" className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-canopy-950/60 text-white backdrop-blur transition hover:bg-canopy-950">
              <X className="h-4 w-4" />
            </button>
            <img src={lightboxImg.src} alt={lightboxImg.caption} className="max-h-[75vh] w-full object-cover" />
            <div className="flex items-center justify-between gap-4 border-t border-canopy-950/10 px-5 py-4">
              <p className="text-[12.5px] font-medium text-canopy-950">{lightboxImg.caption}</p>
              <span className="text-[9.5px] font-extrabold uppercase tracking-[0.18em] text-brass-600">Greenzo atelier</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
