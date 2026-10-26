import React, { useState } from 'react';
import { Droplets, ShieldCheck, ChevronDown, RefreshCw, Sparkles, Check } from 'lucide-react';
import Reveal from './Reveal.jsx';
import { buildWhatsAppUrl, WhatsAppIcon } from '../lib/whatsapp.jsx';

const LAYERS = [
  {
    id: 'substrate',
    code: '01',
    title: 'Pest-Free Coco-Perlite & Neem Crown',
    desc: 'Zero garden mud — lightweight coco-peat, perlite & organic neem cake keep tables clean and insects away.'
  },
  {
    id: 'aeration',
    code: '02',
    title: 'Inner Root Basket with Oxygen Slots',
    desc: 'Roots stay suspended above standing water so they breathe freely even in 24×7 air-conditioned rooms.'
  },
  {
    id: 'wick',
    code: '03',
    title: 'Braided Cotton Capillary Wick',
    desc: 'Pulls up exact sips of water only as the root zone dries — zero overwatering, zero guesswork.'
  },
  {
    id: 'tank',
    code: '04',
    title: 'Mosquito-Proof 14-Day Sealed Tank',
    desc: 'Completely enclosed outer matte shell holds 2 weeks of water — zero open water, 100% mosquito-safe.'
  }
];

const FAQS = [
  {
    q: 'How often do I need to refill the self-watering pot?',
    a: 'Only once every 10–14 days indoors! Lift the inner pot slightly or pour ~200 ml into the bottom reservoir notch. In AC rooms, a single refill comfortably lasts up to 2 weeks — so weekend trips or vacations are completely stress-free.'
  },
  {
    q: 'Will stored water attract mosquitoes or cause bad smell?',
    a: 'No — 100% mosquito-safe. Unlike open saucers, the water sits inside a fully sealed dual-chamber outer planter where mosquitoes cannot enter or breed. Plus, our soil-free coco-perlite + neem mix stays fresh and odour-free.'
  },
  {
    q: 'Will these plants survive in AC rooms & low-light apartments?',
    a: 'Yes! Every Greenzo plant spends 21 days in our shade-hardening bay at Empire Agro, Pune before shipping, so it is already acclimatised to indoor tube/LED lighting, ceiling fans, and AC humidity.'
  },
  {
    q: 'What if a plant gets damaged during courier transit?',
    a: 'Every order is backed by our 7-Day Healthy Replacement Guarantee. Simply send a photo on WhatsApp within 7 days of delivery and we ship a fresh replacement free of cost — zero hassle.'
  },
  {
    q: 'How do I get a live photo of my exact plant before dispatch?',
    a: 'Before sealing your ventilated honeycomb kraft pod at our Pune nursery, our team clicks a real photo of your potted plants and shares it on your WhatsApp number.'
  },
  {
    q: 'Can I send plants as a gift or place corporate / bulk orders?',
    a: 'Absolutely! Toggle "Send as a Gift" inside your Bag to include a free printed botanical message card & ribbon sleeve (₹0). For 15+ corporate or wedding return gifts with custom branding, message us directly on WhatsApp.'
  }
];

const SIM_DAYS = [
  { day: 1, label: 'Day 1 · Just Filled', levelPct: 88, status: 'Reservoir full · Wick active' },
  { day: 7, label: 'Day 7 · Steady Sip', levelPct: 52, status: 'Roots hydrated · Zero effort' },
  { day: 14, label: 'Day 14 · Refill Time', levelPct: 16, status: 'Ready for a quick 200ml top-up' }
];

export default function HydroWickFaqSection({ storeConfig = {} }) {
  const [activeLayer, setActiveLayer] = useState('wick');
  const [simIdx, setSimIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);

  const currentSim = SIM_DAYS[simIdx];
  const waFaqUrl = buildWhatsAppUrl(
    storeConfig,
    'Hi Greenzo Pune! I have a quick question about your 14-day self-watering indoor plants.'
  );

  return (
    <section id="faq" className="border-t border-canopy-950/[0.08] bg-white py-14 lg:py-20">
      <div className="shell">
        <div className="mb-10 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <Reveal className="max-w-[660px]">
            <span className="eyebrow">Zero-guesswork plant care</span>
            <h2 className="display-section mt-2 text-canopy-950">
              How the 14-day pot <span className="italic text-canopy-600">works</span> &amp; common questions.
            </h2>
          </Reveal>
          <Reveal delay={80} className="max-w-sm">
            <p className="text-[13.5px] leading-relaxed text-stone-600">
              Tap through our dual-chamber hydro-wick anatomy or simulate a 14-day watering cycle below.
            </p>
          </Reveal>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
          {/* ——— Left: Interactive Hydro-Wick Cutaway & 14-Day Simulator ——— */}
          <Reveal className="overflow-hidden rounded-[26px] border border-canopy-950/10 bg-linen-50 p-5 shadow-soft sm:p-6 lg:col-span-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-canopy-950 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-300">
                <Droplets className="h-3 w-3" /> Interactive Cutaway
              </span>
              <button
                type="button"
                onClick={() => setSimIdx(0)}
                className="inline-flex items-center gap-1.5 rounded-full border border-canopy-600/30 bg-white px-3 py-1 text-[11px] font-bold text-canopy-800 shadow-sm transition hover:bg-canopy-50"
              >
                <RefreshCw className="h-3 w-3 text-canopy-600" /> Refill Reservoir
              </button>
            </div>

            {/* Visual SVG Cross-Section + Day Slider */}
            <div className="mt-4 grid items-center gap-5 rounded-2xl border border-canopy-950/10 bg-white p-4 sm:grid-cols-12">
              {/* Animated SVG Planter */}
              <div className="flex justify-center sm:col-span-5">
                <svg viewBox="0 0 200 230" className="h-[195px] w-[170px]" aria-label="Self-watering pot diagram">
                  {/* Lush Leaves */}
                  <path d="M100 72 C72 52 58 24 76 12 C94 20 100 48 100 72 Z" fill="#1F7F58" />
                  <path d="M100 72 C128 50 144 22 124 10 C106 18 100 46 100 72 Z" fill="#279D6C" />
                  <path d="M100 76 C62 68 44 46 56 32 C76 36 92 56 100 76 Z" fill="#154B35" />
                  <path d="M100 76 C138 68 156 46 144 32 C124 36 108 56 100 76 Z" fill="#1A6446" />

                  {/* Outer Sealed Matte Planter */}
                  <path
                    d="M38 78 L162 78 L148 210 C147 216 142 220 136 220 L64 220 C58 220 53 216 52 210 Z"
                    fill={activeLayer === 'tank' ? '#E3F6ED' : '#F3F7F4'}
                    stroke="#071E15"
                    strokeWidth="3"
                  />

                  {/* Dynamic Water Reservoir */}
                  <clipPath id="outerTankClip">
                    <path d="M50 148 L150 148 L146 210 C145 215 141 218 136 218 L64 218 C59 218 55 215 54 210 Z" />
                  </clipPath>
                  <g clipPath="url(#outerTankClip)">
                    <rect
                      x="44"
                      y={218 - Math.round((currentSim.levelPct / 100) * 66)}
                      width="112"
                      height="72"
                      fill="#38BDF8"
                      fillOpacity="0.45"
                      style={{ transition: 'y 0.55s cubic-bezier(0.16,1,0.3,1)' }}
                    />
                    <line
                      x1="46"
                      x2="154"
                      y1={218 - Math.round((currentSim.levelPct / 100) * 66)}
                      y2={218 - Math.round((currentSim.levelPct / 100) * 66)}
                      stroke="#0284C7"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                    />
                  </g>

                  {/* Inner Root Basket + Coco-Perlite Substrate */}
                  <path
                    d="M52 80 L148 80 L138 152 L62 152 Z"
                    fill={activeLayer === 'substrate' ? '#8B5E3C' : '#6D4C3D'}
                    stroke={activeLayer === 'aeration' ? '#279D6C' : '#071E15'}
                    strokeWidth="2.5"
                  />
                  {/* Oxygen vents */}
                  <line x1="68" y1="146" x2="82" y2="146" stroke="#89D7B3" strokeWidth="3" strokeLinecap="round" />
                  <line x1="118" y1="146" x2="132" y2="146" stroke="#89D7B3" strokeWidth="3" strokeLinecap="round" />

                  {/* Braided Capillary Cotton Wick */}
                  <path
                    d="M96 142 C96 172 92 192 95 210 M104 142 C104 172 108 192 105 210"
                    stroke={activeLayer === 'wick' ? '#0284C7' : '#0F3827'}
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Upward moisture dots */}
                  <circle cx="100" cy="166" r="3" fill="#0284C7" />
                  <circle cx="100" cy="184" r="3" fill="#38BDF8" />
                </svg>
              </div>

              {/* 14-Day Cycle Selector */}
              <div className="space-y-2.5 sm:col-span-7">
                <p className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-stone-400">
                  Simulate 14-Day Water Tank
                </p>
                <div className="space-y-1.5">
                  {SIM_DAYS.map((d, idx) => (
                    <button
                      key={d.day}
                      type="button"
                      onClick={() => setSimIdx(idx)}
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-xs transition ${
                        simIdx === idx
                          ? 'border-canopy-700 bg-canopy-950 text-white shadow-sm'
                          : 'border-canopy-950/10 bg-linen-50 text-canopy-950 hover:bg-canopy-50'
                      }`}
                    >
                      <span className="font-bold">{d.label}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 font-mono text-[10.5px] font-bold ${
                          simIdx === idx ? 'bg-sky-400/25 text-sky-200' : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {d.levelPct}% water
                      </span>
                    </button>
                  ))}
                </div>
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-canopy-700">
                  <Check className="h-3.5 w-3.5 stroke-[2.5]" /> {currentSim.status}
                </p>
              </div>
            </div>

            {/* 4 Clickable Anatomy Layers */}
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {LAYERS.map((layer) => {
                const selected = activeLayer === layer.id;
                return (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => setActiveLayer(layer.id)}
                    className={`rounded-2xl border p-3.5 text-left transition ${
                      selected
                        ? 'border-canopy-700 bg-white shadow-soft'
                        : 'border-canopy-950/10 bg-white/60 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-canopy-600">
                        Layer {layer.code}
                      </span>
                      {selected && (
                        <span className="h-2 w-2 rounded-full bg-canopy-600" />
                      )}
                    </div>
                    <p className="mt-1 text-[12.5px] font-extrabold leading-snug text-canopy-950">{layer.title}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-stone-500">{layer.desc}</p>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* ——— Right: Smart Buyer FAQ Accordion ——— */}
          <div className="space-y-3 lg:col-span-6">
            {FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <Reveal
                  key={item.q}
                  delay={idx * 45}
                  className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                    isOpen
                      ? 'border-canopy-600/35 bg-linen-50/70 shadow-soft'
                      : 'border-canopy-950/10 bg-white hover:border-canopy-600/25'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-[14px] font-extrabold leading-snug text-canopy-950">{item.q}</span>
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-transform duration-300 ${
                        isOpen
                          ? 'rotate-180 border-canopy-950 bg-canopy-950 text-emerald-300'
                          : 'border-canopy-950/12 bg-linen-50 text-canopy-800'
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-canopy-950/[0.06] px-5 pb-4 pt-3 text-[13px] leading-relaxed text-stone-600">
                      {item.a}
                    </div>
                  )}
                </Reveal>
              );
            })}

            {/* Direct WhatsApp Question Prompt */}
            <Reveal
              delay={180}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-canopy-600/20 bg-canopy-950 px-5 py-4 text-white"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-emerald-300">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[13px] font-bold">Still have a question about your room?</p>
                  <p className="text-[11px] text-white/70">Chat directly with our Pune nursery team — replies in ~2 mins</p>
                </div>
              </div>
              <a
                href={waFaqUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp btn-sm"
              >
                <WhatsAppIcon className="h-4 w-4" /> Ask on WhatsApp
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
