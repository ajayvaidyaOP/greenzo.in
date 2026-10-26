import React, { useState, useEffect } from 'react';
import { X, Send, Sparkles, Camera, PackageCheck, Layers, ArrowUpRight } from 'lucide-react';
import { buildWhatsAppUrl, WhatsAppIcon } from '../lib/whatsapp.jsx';

export default function WhatsAppConcierge({ storeConfig = {}, cartCount = 0 }) {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const comboPrice = storeConfig.comboBundlePrice || 999;
  const comboSize = storeConfig.comboBundleSize || 4;
  const phoneDisplay = storeConfig.phone || '+91 8883639639';

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const quickActions = [
    {
      icon: Layers,
      title: `Order ${comboSize}-Plant Box @ ₹${comboPrice}`,
      subtitle: 'Save 30% · 4 self-watering pots included',
      badge: 'Popular',
      message: `Hi Greenzo Pune! I want to order the ${comboSize}-Plant Self-Watering Box @ ₹${comboPrice}. Please share available plants!`
    },
    {
      icon: Camera,
      title: 'Send Corner Photo for Advice',
      subtitle: 'Free low-light & AC room plant matching',
      message: 'Hi Greenzo! I want to share a photo of my room corner — please suggest the best indoor plants for my light.'
    },
    {
      icon: Sparkles,
      title: 'See Live Nursery Plant Photos',
      subtitle: 'Real photo proof before we dispatch',
      message: 'Hi Greenzo Pune! Can you share live nursery photos of your bestselling self-watering indoor plants?'
    },
    {
      icon: PackageCheck,
      title: 'Order Tracking & Plant Care',
      subtitle: 'Instant support from our Theur nursery',
      message: 'Hi Greenzo! I need help with my plant order / plant care instructions.'
    }
  ];

  const handleToggle = () => {
    setOpen((prev) => !prev);
    setHasOpened(true);
  };

  const handleCustomSend = (e) => {
    e.preventDefault();
    const text = customMsg.trim() || 'Hi Greenzo Pune! Help me pick indoor plants for my home.';
    window.open(buildWhatsAppUrl(storeConfig, text), '_blank', 'noopener,noreferrer');
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col items-end">
      {/* Popover Concierge Card */}
      {open && (
        <div className="mb-3 w-[min(360px,calc(100vw-2rem))] animate-scale-in overflow-hidden rounded-[26px] border border-canopy-950/15 bg-white shadow-elevated">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#07261A] via-[#0C3B28] to-[#128C7E] px-5 py-4 text-white">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-whatsapp text-white shadow-md">
                  <WhatsAppIcon className="h-6 w-6" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#092E20] bg-emerald-300" />
                </div>
                <div>
                  <p className="text-[14px] font-bold leading-tight">Greenzo WhatsApp Desk</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-emerald-100/90">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
                    Online · Empire Agro, Pune
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close WhatsApp concierge"
                className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/85 transition hover:bg-white/20 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Greeting bubble */}
          <div className="bg-[#EEF7F1] px-4 pt-3.5 pb-3">
            <div className="rounded-2xl rounded-tl-sm border border-canopy-950/[0.06] bg-white px-3.5 py-2.5 text-[12px] leading-relaxed text-stone-700 shadow-sm">
              <span className="font-bold text-canopy-950">Namaste! 🌿</span> Chat directly with our Pune plant specialists — order on WhatsApp, ask for live plant photos, or get free room styling advice.
            </div>
          </div>

          {/* Quick 1-click options */}
          <div className="max-h-[250px] space-y-1.5 overflow-y-auto px-3.5 py-3">
            {quickActions.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.title}
                  href={buildWhatsAppUrl(storeConfig, item.message)}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 rounded-2xl border border-canopy-950/[0.08] bg-linen-50/70 p-2.5 transition hover:border-whatsapp/50 hover:bg-whatsapp-soft/60"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-canopy-700 shadow-sm transition group-hover:bg-whatsapp group-hover:text-white">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-[12px] font-bold text-canopy-950">{item.title}</span>
                      {item.badge && (
                        <span className=" shrink-0 rounded-full bg-canopy-950 px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase tracking-wider text-brass-300">
                          {item.badge}
                        </span>
                      )}
                    </span>
                    <span className="block truncate text-[10.5px] text-stone-500">{item.subtitle}</span>
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-stone-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-whatsapp-deep" />
                </a>
              );
            })}
          </div>

          {/* Custom message input */}
          <form onSubmit={handleCustomSend} className="border-t border-canopy-950/[0.08] bg-white p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Write a message on WhatsApp…"
                className="h-10 flex-1 rounded-full border border-canopy-950/15 bg-linen-50 px-4 text-[12px] text-canopy-950 placeholder:text-stone-400 focus:border-whatsapp-deep focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Send on WhatsApp"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-whatsapp text-white shadow-sm transition hover:bg-whatsapp-dark active:scale-95"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between px-1 text-[10px] text-stone-400">
              <span>Helpline: {phoneDisplay}</span>
              <a
                href={buildWhatsAppUrl(
                  storeConfig,
                  cartCount > 0
                    ? `Hi Greenzo Pune! I have ${cartCount} item(s) in my bag and have a quick question before ordering.`
                    : 'Hi Greenzo Pune! Help me choose indoor plants.'
                )}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-whatsapp-deep hover:underline"
              >
                Direct WhatsApp Chat ↗
              </a>
            </div>
          </form>
        </div>
      )}

      {/* Floating Trigger Pill */}
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={open}
        aria-label="Chat on WhatsApp with Greenzo Nursery"
        className="group relative inline-flex h-[52px] items-center gap-2.5 rounded-full bg-whatsapp pl-3.5 pr-4 text-white shadow-whatsapp ring-4 ring-white/85 transition-all duration-300 ease-silk hover:-translate-y-0.5 hover:bg-whatsapp-dark active:scale-95"
      >
        <span className="relative grid h-8 w-8 place-items-center rounded-full bg-white/20">
          <WhatsAppIcon className="h-5 w-5 text-white" />
          <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full border border-whatsapp bg-emerald-100" />
          </span>
        </span>
        <span className="text-left leading-tight">
          <span className="hidden text-[9px] font-extrabold uppercase tracking-[0.14em] text-white/85 sm:block">
            Online · Pune
          </span>
          <span className="block text-[12.5px] font-extrabold tracking-tight">
            {open ? 'Close Chat' : 'WhatsApp Us'}
          </span>
        </span>
        {!hasOpened && !open && (
          <span className="absolute -left-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-canopy-950 px-1 text-[10px] font-extrabold text-brass-300 shadow">
            1
          </span>
        )}
      </button>
    </div>
  );
}
