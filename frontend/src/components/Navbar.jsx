import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search, ShoppingBag, Heart, Menu, X, Leaf, PackageCheck, Phone, ArrowUpRight,
  User, Crown, ChevronDown, MapPin, Sparkles, ArrowRight, Truck, ShieldCheck, Command
} from 'lucide-react';
import { buildWhatsAppUrl, WhatsAppIcon } from '../lib/whatsapp.jsx';

const SUGGESTIONS = ['Zamia', 'Snake plant', 'Low light', 'Pet safe', 'Monstera', '₹999 box'];

export default function Navbar({
  storeConfig = {},
  currentUser,
  products = [],
  categories = [],
  cartCount = 0,
  wishlistCount = 0,
  onOpenCart,
  onOpenWishlist,
  onOpenQuiz,
  onOpenBundle,
  onSelectProduct,
  onSelectCategory,
  onOpenTrackOrder,
  onOpenAuth,
  onOpenAdmin,
  searchQuery,
  onSearchChange
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const megaTimer = useRef(null);
  const searchInputRef = useRef(null);

  const comboPrice = storeConfig.comboBundlePrice || 999;
  const comboSize = storeConfig.comboBundleSize || 4;
  const phone = storeConfig.phone || '+91 8883639639';
  const whatsappHref = buildWhatsAppUrl(
    storeConfig,
    `Hi Greenzo Pune! Help me choose indoor plants (or the ${comboSize}-Plant Box @ ₹${comboPrice}).`
  );

  const announcement =
    storeConfig.announcementText ||
    `${comboSize} Self-Watering Plants @ ₹${comboPrice} · Free Delivery ₹499+ · Live Photo on WhatsApp`;

  const announcements = [
    announcement,
    'Grown at Empire Agro, Pune · 14-day capillary self-watering planters included',
    '7-day healthy plant guarantee · Live WhatsApp photo shared before dispatch',
    'Razorpay secure checkout · Instant UPI, Cards & Cash on Delivery'
  ];

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      setScrolled(y > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, Math.max(0, (y / max) * 100)) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setAnnouncementIdx((i) => (i + 1) % announcements.length), 5000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeAll = useCallback(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setMegaOpen(false);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeAll();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeAll]);

  useEffect(() => {
    if (mobileOpen || searchOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [mobileOpen, searchOpen]);

  useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [searchOpen]);

  const query = (searchQuery || '').trim();
  const matches = query
    ? products
        .filter((p) =>
          [p.name, p.botanicalName, p.lightLevel, p.shortDescription]
            .join(' ')
            .toLowerCase()
            .includes(query.toLowerCase())
        )
        .slice(0, 6)
    : [];

  const openMega = () => {
    clearTimeout(megaTimer.current);
    setMegaOpen(true);
  };
  const scheduleCloseMega = () => {
    clearTimeout(megaTimer.current);
    megaTimer.current = setTimeout(() => setMegaOpen(false), 140);
  };

  const handleResultClick = (product) => {
    onSelectProduct?.(product);
    closeAll();
  };

  const navLinks = [
    { label: 'Shop Plants', href: '#shop' },
    { label: 'How It Works', href: '#reels' },
    { label: 'Weekly Deal', href: '#deal' },
    { label: 'Free Consult', href: '#consult' }
  ];

  return (
    <>
      {/* ——— Top utility bar ——— */}
      <div className="relative z-40 overflow-hidden bg-canopy-950 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_160%_at_0%_0%,rgba(39,157,108,0.28),transparent_55%)]" />
        <div className="shell relative flex h-[36px] items-center justify-between gap-3 text-[11px]">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="hidden items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-[0.18em] text-emerald-300 sm:inline-flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Pune Nursery
            </span>
            <div className="min-w-0 overflow-hidden">
              <p key={announcementIdx} className="animate-fade-in truncate font-medium text-white/90">
                {announcements[announcementIdx]}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-whatsapp/20 border border-whatsapp/40 px-2.5 py-1 text-[10.5px] font-bold text-emerald-200 transition hover:bg-whatsapp hover:text-white"
            >
              <WhatsAppIcon className="h-3.5 w-3.5 text-whatsapp group-hover:text-white" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            <div className="hidden items-center gap-1.5 lg:flex">
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                <Phone className="h-3 w-3 text-emerald-300" /> {phone}
              </a>
              <button
                onClick={() => onOpenTrackOrder?.()}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1 text-[10.5px] font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
              >
                <PackageCheck className="h-3.5 w-3.5 text-emerald-300" /> Track order
              </button>
            </div>

            <button
              onClick={() => onOpenAdmin?.()}
              className="inline-flex items-center gap-1 rounded-full bg-brass-400 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-canopy-950 transition hover:bg-brass-300"
            >
              <Crown className="h-3 w-3" /> Studio
            </button>
          </div>
        </div>
      </div>

      {/* ——— Sticky glass navbar ——— */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ease-silk ${
          scrolled
            ? 'border-b border-canopy-950/[0.08] bg-white/92 shadow-[0_12px_34px_-24px_rgba(7,30,21,0.38)] backdrop-blur-xl'
            : 'border-b border-canopy-950/[0.06] bg-white/85 backdrop-blur-lg'
        }`}
      >
        <div className="shell relative flex h-[66px] items-center justify-between gap-3">
          {/* Brand Logo */}
          <a href="#top" className="group flex shrink-0 items-center gap-3">
            <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-[14px] bg-gradient-to-br from-canopy-700 via-canopy-850 to-canopy-950 shadow-card transition-transform duration-500 ease-silk group-hover:scale-105">
              <span className="absolute inset-0 bg-[radial-gradient(120%_120%_at_20%_0%,rgba(77,190,141,0.45),transparent_60%)]" />
              <Leaf className="relative h-[19px] w-[19px] text-emerald-300 transition-transform duration-500 ease-silk group-hover:-rotate-12" />
            </span>
            <span className="leading-none">
              <span className="flex items-baseline font-serif text-[24px] font-semibold tracking-[-0.03em] text-canopy-950 sm:text-[26px]">
                greenzo<span className="ml-0.5 font-sans text-[14px] font-semibold tracking-tight text-canopy-600">.in</span>
              </span>
              <span className="mt-0.5 hidden items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-[0.2em] text-stone-500 sm:flex">
                Self-Watering Plants · Pune
              </span>
            </span>
          </a>

          {/* Desktop Center Nav */}
          <nav className="hidden items-center gap-1 xl:flex">
            <div
              className="relative"
              onMouseEnter={openMega}
              onMouseLeave={scheduleCloseMega}
            >
              <a
                href="#shop"
                className={`group inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition ${
                  megaOpen ? 'bg-canopy-50 text-canopy-950' : 'text-stone-700 hover:bg-canopy-50/70 hover:text-canopy-950'
                }`}
                aria-expanded={megaOpen}
              >
                Shop Plants
                <ChevronDown className={`h-3.5 w-3.5 text-canopy-600 transition-transform duration-300 ${megaOpen ? 'rotate-180' : ''}`} />
              </a>
            </div>

            <button
              onClick={() => { onOpenBundle?.(); closeAll(); }}
              className="group mx-1.5 inline-flex items-center gap-2 rounded-full border border-canopy-600/25 bg-canopy-50 px-3.5 py-1.5 text-[12.5px] font-bold text-canopy-800 transition hover:border-canopy-600/50 hover:bg-canopy-100"
            >
              <Sparkles className="h-3.5 w-3.5 text-canopy-600" />
              {comboSize}-Plant Box · ₹{comboPrice}
              <span className="rounded-full bg-canopy-700 px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-[0.08em] text-white">
                Save 30%
              </span>
            </button>

            <button
              onClick={() => { onOpenQuiz?.(); closeAll(); }}
              className="rounded-full px-3.5 py-2 text-[13px] font-semibold text-canopy-700 transition hover:bg-canopy-50 hover:text-canopy-950"
            >
              Plant Quiz
            </button>

            {navLinks.slice(1).map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-full px-3.5 py-2 text-[13px] font-semibold text-stone-700 transition hover:bg-canopy-50/70 hover:text-canopy-950"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search plants"
              className="group inline-flex h-10 items-center gap-2 rounded-full border border-canopy-950/12 bg-linen-50 px-3 text-[12px] font-medium text-stone-500 transition hover:border-canopy-700/35 hover:bg-white hover:text-canopy-950"
            >
              <Search className="h-4 w-4 text-canopy-800 transition-transform duration-300 group-hover:scale-110" />
              <span className="hidden 2xl:inline">Search plants…</span>
              <span className="hidden rounded border border-canopy-950/10 bg-white px-1.5 py-0.5 text-[9.5px] font-bold text-stone-400 2xl:inline">⌘K</span>
            </button>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              title="Chat or order on WhatsApp"
              aria-label="Chat on WhatsApp"
              className="hidden h-10 w-10 place-items-center rounded-full border border-whatsapp/30 bg-whatsapp-soft text-whatsapp-deep transition hover:bg-whatsapp hover:text-white sm:grid"
            >
              <WhatsAppIcon className="h-[18px] w-[18px]" />
            </a>

            <button
              onClick={() => { closeAll(); onOpenWishlist?.(); }}
              aria-label="Saved plants wishlist"
              title="Saved plants"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-canopy-950/12 bg-white text-canopy-900 transition hover:border-canopy-700/35 hover:bg-canopy-50"
            >
              <Heart className={`h-[17px] w-[17px] ${wishlistCount ? 'fill-terracotta-500 text-terracotta-500' : ''}`} />
              {wishlistCount > 0 && (
                <span key={wishlistCount} className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] animate-scale-in place-items-center rounded-full bg-terracotta-500 px-1 text-[10px] font-extrabold text-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenAuth}
              className="hidden h-10 items-center gap-2 rounded-full border border-canopy-950/12 bg-white pl-1.5 pr-3.5 text-[12.5px] font-semibold text-canopy-900 transition hover:border-canopy-700/35 hover:bg-canopy-50 md:inline-flex"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-canopy-50 text-canopy-800">
                {currentUser ? <span className="text-[10.5px] font-extrabold uppercase">{currentUser.name?.[0] || 'G'}</span> : <User className="h-3.5 w-3.5" />}
              </span>
              <span className="max-w-[76px] truncate">{currentUser ? currentUser.name.split(' ')[0] : 'Sign in'}</span>
            </button>

            <button
              onClick={() => { setSearchOpen(false); onOpenCart?.(); }}
              className="group inline-flex h-10 items-center gap-2 rounded-full bg-canopy-950 pl-3.5 pr-1.5 text-[12.5px] font-semibold text-white shadow-card transition-all duration-300 hover:bg-canopy-800"
            >
              <ShoppingBag className="h-4 w-4 text-emerald-300" />
              <span className="hidden sm:inline">Bag</span>
              <span key={cartCount} className="grid h-7 min-w-7 animate-scale-in place-items-center rounded-full bg-emerald-400 px-1.5 text-[11px] font-extrabold text-canopy-950">
                {cartCount}
              </span>
            </button>

            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="grid h-10 w-10 place-items-center rounded-full border border-canopy-950/12 bg-white text-canopy-950 transition hover:bg-canopy-50 xl:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scroll progress bar */}
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-transparent">
          <div
            className="h-full bg-gradient-to-r from-canopy-600 via-emerald-400 to-brass-400 transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%`, opacity: scrolled ? 1 : 0 }}
          />
        </div>

        {/* Mega menu */}
        {megaOpen && (
          <div
            className="absolute inset-x-0 top-full hidden animate-fade-in xl:block"
            onMouseEnter={openMega}
            onMouseLeave={scheduleCloseMega}
          >
            <div className="border-b border-canopy-950/10 bg-white/98 shadow-[0_32px_60px_-32px_rgba(7,30,21,0.42)] backdrop-blur-xl">
              <div className="shell grid grid-cols-12 gap-8 py-7">
                <div className="col-span-7">
                  <div className="flex items-center justify-between">
                    <span className="eyebrow">Shop by space & plant need</span>
                    <a
                      href="#shop"
                      onClick={() => { onSelectCategory?.('all'); setMegaOpen(false); }}
                      className="text-[11.5px] font-bold text-canopy-700 hover:text-canopy-950"
                    >
                      View all plants <ArrowUpRight className="ml-0.5 inline h-3.5 w-3.5" />
                    </a>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2.5">
                    {categories.slice(0, 6).map((cat) => (
                      <a
                        key={cat.slug}
                        href="#shop"
                        onClick={() => { onSelectCategory?.(cat.slug); setMegaOpen(false); }}
                        className="group flex items-center gap-3.5 rounded-2xl border border-canopy-950/[0.06] bg-linen-50/70 p-2.5 transition hover:border-canopy-600/30 hover:bg-canopy-50"
                      >
                        <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white shadow-sm img-zoom">
                          <img src={cat.imageUrl} alt={cat.name} className="h-full w-full object-cover" loading="lazy" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-bold text-canopy-950 group-hover:text-canopy-700">{cat.name}</span>
                          <span className="block truncate text-[11px] text-stone-500">{cat.productCount ?? 0} plants · {cat.subtitle || 'Self-watering'}</span>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="col-span-5">
                  <div className="relative h-full overflow-hidden rounded-[22px] bg-canopy-950 text-white">
                    <img src="/images/hero-1.jpg" alt="The 4-plant self-watering box" className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-1000 ease-silk hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-canopy-950 via-canopy-950/65 to-transparent" />
                    <div className="relative flex h-full min-h-[185px] flex-col justify-end p-5">
                      <span className="inline-flex w-fit items-center gap-1 rounded-full bg-emerald-400/20 border border-emerald-300/30 px-2.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-[0.18em] text-emerald-200">
                        Bestseller Bundle · Save 30%
                      </span>
                      <p className="mt-2 font-serif text-[23px] leading-tight">
                        Pick any {comboSize} indoor plants <span className="italic text-emerald-200">for ₹{comboPrice}.</span>
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-2.5">
                        <button
                          onClick={() => { onOpenBundle?.(); setMegaOpen(false); }}
                          className="btn btn-gold btn-sm group"
                        >
                          Build ₹{comboPrice} Box
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </button>
                        <a
                          href={whatsappHref}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-10 items-center gap-1.5 rounded-full bg-whatsapp px-4 text-[12px] font-bold text-white transition hover:bg-whatsapp-dark"
                        >
                          <WhatsAppIcon className="h-3.5 w-3.5" /> Order on WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ——— Command-palette Search Modal ——— */}
      {searchOpen && (
        <div className="fixed inset-0 z-[90]">
          <div className="absolute inset-0 animate-fade-in bg-canopy-950/60 backdrop-blur-md" onClick={() => setSearchOpen(false)} />
          <div className="relative mx-auto mt-[8vh] w-[min(740px,calc(100%-1.5rem))] animate-scale-in">
            <div className="overflow-hidden rounded-[26px] border border-canopy-950/15 bg-white shadow-elevated">
              <div className="flex h-16 items-center gap-3 border-b border-canopy-950/[0.08] px-5">
                <Search className="h-[18px] w-[18px] shrink-0 text-canopy-600" />
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  placeholder="Search indoor plants, low light, pet-safe, air purifying…"
                  className="h-full flex-1 bg-transparent text-[15px] text-canopy-950 placeholder:text-stone-400 focus:outline-none"
                />
                {query && (
                  <button onClick={() => onSearchChange?.('')} className="grid h-7 w-7 place-items-center rounded-full bg-linen-100 text-stone-500 transition hover:text-canopy-950">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                <button onClick={() => setSearchOpen(false)} className="hidden items-center gap-1 rounded-full border border-canopy-950/10 bg-linen-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-500 sm:inline-flex">
                  Esc
                </button>
              </div>

              <div className="max-h-[58vh] overflow-y-auto p-3">
                {!query ? (
                  <div className="px-2 py-2">
                    <p className="px-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-stone-400">Popular searches</p>
                    <div className="mt-3 flex flex-wrap gap-2 px-2">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => onSearchChange?.(s.replace('₹999 box', 'Zamia'))}
                          className="rounded-full border border-canopy-950/10 bg-linen-50 px-3.5 py-1.5 text-[12px] font-semibold text-canopy-900 transition hover:border-canopy-600/40 hover:bg-canopy-50"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <div className="mt-5 grid gap-1 px-2">
                      {navLinks.map((l) => (
                        <a
                          key={l.label}
                          href={l.href}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-semibold text-stone-600 transition hover:bg-linen-50 hover:text-canopy-950"
                        >
                          {l.label}
                          <ArrowUpRight className="h-3.5 w-3.5 opacity-40" />
                        </a>
                      ))}
                    </div>
                  </div>
                ) : matches.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <p className="font-serif text-xl text-canopy-950">No match for “{query}”</p>
                    <p className="mt-1 text-[12.5px] text-stone-500">Try “Zamia”, “Snake plant”, “low light” or ask us on WhatsApp.</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {matches.map((item) => (
                      <button
                        key={item.slug}
                        onClick={() => handleResultClick(item)}
                        className="group flex w-full items-center gap-3.5 rounded-2xl px-3 py-2.5 text-left transition hover:bg-linen-50"
                      >
                        <span className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-linen-100">
                          <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13.5px] font-bold text-canopy-950">{item.name}</span>
                          <span className="block truncate font-serif text-[12px] italic text-stone-500">{item.botanicalName}</span>
                          <span className="mt-0.5 inline-flex items-center gap-1 text-[10.5px] font-semibold text-canopy-700">
                            <Leaf className="h-2.5 w-2.5" /> {item.lightLevel}
                          </span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="block text-[14px] font-extrabold text-canopy-950 num">₹{item.price}</span>
                          <span className="mt-0.5 inline-grid h-7 w-7 place-items-center rounded-full bg-canopy-950 text-white transition group-hover:bg-canopy-600">
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-canopy-950/[0.08] bg-linen-50 px-5 py-3 text-[11px] text-stone-500">
                <span className="inline-flex items-center gap-1.5">
                  <Command className="h-3 w-3" /> K to search · Esc to close
                </span>
                <a
                  href="#shop"
                  onClick={() => setSearchOpen(false)}
                  className="inline-flex items-center gap-1 font-bold text-canopy-800 hover:text-canopy-950"
                >
                  Browse all plants <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ——— Mobile Drawer ——— */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[90] xl:hidden">
          <div className="absolute inset-0 animate-fade-in bg-canopy-950/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute right-0 top-0 flex h-full w-[89%] max-w-[390px] animate-slide-in-right flex-col bg-white shadow-elevated">
            <div className="flex items-center justify-between border-b border-canopy-950/[0.08] px-5 py-4">
              <span className="flex items-baseline font-serif text-[22px] font-semibold tracking-[-0.03em] text-canopy-950">
                greenzo<span className="ml-0.5 font-sans text-[13px] font-semibold text-canopy-600">.in</span>
              </span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="grid h-9 w-9 place-items-center rounded-full border border-canopy-950/10 bg-linen-50 text-canopy-950">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <button
                onClick={() => { setMobileOpen(false); setSearchOpen(true); }}
                className="mb-5 flex h-11 w-full items-center gap-3 rounded-full border border-canopy-950/12 bg-linen-50 px-4 text-left text-[13px] text-stone-500"
              >
                <Search className="h-4 w-4 text-canopy-700" /> Search indoor plants…
              </button>

              <nav className="space-y-1">
                {navLinks.map((link, i) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="group flex items-baseline justify-between border-b border-canopy-950/[0.06] py-3.5"
                  >
                    <span className="font-serif text-[24px] leading-none text-canopy-950 transition group-hover:text-canopy-600">{link.label}</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">0{i + 1}</span>
                  </a>
                ))}
              </nav>

              <button
                onClick={() => { setMobileOpen(false); onOpenBundle?.(); }}
                className="mt-5 flex w-full items-center justify-between gap-3 rounded-2xl bg-canopy-950 p-4 text-left text-white shadow-card"
              >
                <span>
                  <span className="block text-[9.5px] font-extrabold uppercase tracking-[0.2em] text-emerald-300">Bestseller · Save 30%</span>
                  <span className="mt-1 block font-serif text-[20px] leading-tight">{comboSize} Self-Watering Plants · ₹{comboPrice}</span>
                </span>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-400 text-canopy-950">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMobileOpen(false)}
                className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-5 text-[13px] font-bold text-white shadow-whatsapp"
              >
                <WhatsAppIcon className="h-4 w-4" /> Chat / Order on WhatsApp
              </a>

              <div className="mt-3 grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => { setMobileOpen(false); onOpenQuiz?.(); }}
                  className="flex h-11 items-center justify-center gap-1.5 rounded-full border border-canopy-600/30 bg-canopy-50 px-3 text-[12px] font-bold text-canopy-800"
                >
                  <Sparkles className="h-3.5 w-3.5 text-canopy-600" /> Plant Quiz
                </button>
                <button
                  onClick={() => { setMobileOpen(false); onOpenWishlist?.(); }}
                  className="flex h-11 items-center justify-center gap-1.5 rounded-full border border-canopy-950/12 bg-linen-50 px-3 text-[12px] font-bold text-canopy-950"
                >
                  <Heart className="h-3.5 w-3.5 text-terracotta-500" /> Saved ({wishlistCount})
                </button>
              </div>

              <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                <button onClick={() => { setMobileOpen(false); onOpenAuth?.(); }} className="flex h-11 items-center justify-center gap-2 rounded-full border border-canopy-950/12 bg-linen-50 px-4 text-[12px] font-semibold text-canopy-950">
                  <User className="h-3.5 w-3.5" /> {currentUser ? currentUser.name.split(' ')[0] : 'Sign in'}
                </button>
                <button onClick={() => { setMobileOpen(false); onOpenTrackOrder?.(); }} className="flex h-11 items-center justify-center gap-2 rounded-full border border-canopy-950/12 bg-linen-50 px-4 text-[12px] font-semibold text-canopy-950">
                  <PackageCheck className="h-3.5 w-3.5" /> Track order
                </button>
                <button onClick={() => { setMobileOpen(false); onOpenAdmin?.(); }} className="col-span-2 flex h-11 items-center justify-center gap-2 rounded-full bg-brass-400 px-4 text-[12px] font-extrabold uppercase tracking-[0.1em] text-canopy-950">
                  <Crown className="h-3.5 w-3.5" /> Open Studio
                </button>
              </div>
            </div>

            <div className="space-y-1.5 border-t border-canopy-950/[0.08] bg-linen-50 px-5 py-4 text-[11px] text-stone-600">
              <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-canopy-600" /> Empire Agro, Theur · Pune 412110</p>
              <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-canopy-600" /> {phone}</p>
              <p className="flex items-center gap-2 pt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-canopy-800">
                <ShieldCheck className="h-3.5 w-3.5 text-canopy-600" /> 7-day guarantee
                <Truck className="ml-2 h-3.5 w-3.5 text-canopy-600" /> Free ₹499+
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
