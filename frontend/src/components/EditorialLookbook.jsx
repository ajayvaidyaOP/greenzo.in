import React from 'react';
import { ArrowUpRight, ArrowRight, Sparkles } from 'lucide-react';
import Reveal from './Reveal.jsx';
import { buildWhatsAppUrl, WhatsAppIcon } from '../lib/whatsapp.jsx';

export default function EditorialLookbook({ storeConfig = {}, onOpenBundle }) {
  const comboPrice = storeConfig.comboBundlePrice || 999;
  const comboSize = storeConfig.comboBundleSize || 4;
  const waPhotoAdviceUrl = buildWhatsAppUrl(
    storeConfig,
    'Hi Greenzo Pune! Sending a photo of my room corner — please suggest the best self-watering plants for this space.'
  );

  return (
    <section className="relative overflow-hidden bg-linen-75 py-14 lg:py-20">
      <div className="shell">
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <Reveal className="max-w-[620px]">
            <span className="eyebrow">Styled in real Indian homes</span>
            <h2 className="display-section mt-2 text-canopy-950">
              Quiet corners, <span className="italic text-canopy-600">living</span> greenery.
            </h2>
          </Reveal>
          <Reveal delay={90} className="max-w-sm">
            <p className="text-[13.5px] leading-relaxed text-stone-600">
              Styled across Pune &amp; Mumbai apartments — consoles, work desks, and shaded balconies. Every look is
              shoppable as a curated self-watering set.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          {/* Feature Look */}
          <Reveal
            dir="scale"
            className="group relative col-span-12 overflow-hidden rounded-[26px] border border-canopy-950/10 bg-canopy-950 lg:col-span-7"
          >
            <div className="aspect-[4/3.1] w-full sm:aspect-[16/10.5]">
              <img
                src="/images/hero-1.jpg"
                alt="Living room console styled with four self-watering plants"
                className="h-full w-full object-cover transition-transform duration-1000 ease-silk group-hover:scale-[1.04]"
                loading="lazy"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canopy-950/90 via-canopy-950/20 to-transparent" />
            <div className="absolute inset-x-5 bottom-5 flex flex-wrap items-end justify-between gap-4">
              <div className="min-w-0">
                <span className="tag bg-emerald-400 text-canopy-950">Living Room Set</span>
                <h3 className="mt-2 font-serif text-[26px] leading-[1.05] text-white sm:text-[32px]">
                  The Console <span className="italic text-emerald-200">Quartet</span>
                </h3>
                <p className="mt-1.5 text-[11.5px] text-white/75">
                  Zamia · Snake · Syngonium · Peace Lily — matte ivory &amp; sage self-watering pots
                </p>
              </div>
              <button onClick={onOpenBundle} className="btn btn-gold btn-sm group/btn shrink-0">
                Shop the look{' '}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
              </button>
            </div>
          </Reveal>

          {/* Stacked Looks */}
          <div className="col-span-12 grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {[
              {
                src: '/images/hero-2.jpg',
                title: 'AC Workspaces That Breathe',
                meta: 'Low-light · AC-hardened · air-purifying',
                tag: 'Work Desk'
              },
              {
                src: '/images/hero-3.jpg',
                title: 'Shelf & Bedroom Sanctuary',
                meta: 'Ivory · sage · terracotta · charcoal finishes',
                tag: 'Bedroom'
              }
            ].map((look, i) => (
              <Reveal
                key={look.title}
                dir="right"
                delay={100 + i * 100}
                onClick={onOpenBundle}
                className="group relative cursor-pointer overflow-hidden rounded-[24px] border border-canopy-950/10 bg-canopy-950"
              >
                <div className="aspect-[16/10] h-full w-full">
                  <img
                    src={look.src}
                    alt={look.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-1000 ease-silk group-hover:scale-[1.05]"
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canopy-950/85 via-transparent to-transparent" />
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-emerald-300">
                      {look.tag}
                    </span>
                    <h4 className="mt-1 font-serif text-[19px] leading-tight text-white">{look.title}</h4>
                    <p className="mt-1 text-[11px] text-white/70">{look.meta}</p>
                  </div>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/95 text-canopy-950 transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Signature Bundle + WhatsApp Corner Photo CTA Band */}
        <Reveal
          delay={80}
          className="mt-5 flex flex-col items-start justify-between gap-4 overflow-hidden rounded-[24px] border border-canopy-600/20 bg-white px-6 py-5 shadow-soft sm:flex-row sm:items-center"
        >
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-canopy-950 text-emerald-300">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-canopy-700">
                Not sure which plants suit your light?
              </p>
              <p className="mt-0.5 font-serif text-[19px] font-medium leading-tight text-canopy-950">
                Build your {comboSize}-plant box for <span className="italic text-canopy-600">₹{comboPrice}</span> — or
                send us a corner photo on WhatsApp!
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href={waPhotoAdviceUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp btn-sm"
            >
              <WhatsAppIcon className="h-4 w-4" /> Send Corner Photo
            </a>
            <button onClick={onOpenBundle} className="btn btn-dark btn-sm group/btn">
              Open Box Builder{' '}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
