import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search, ShoppingBag, Heart, Menu, X, Leaf, PackageCheck, Phone, ArrowUpRight,
  User, Crown, ChevronDown, MapPin, Sparkles, ArrowRight, Truck, ShieldCheck, Command
} from 'lucide-react';

const SUGGESTIONS = ['Zamia', 'Snake plant', 'Low light', 'Pet safe', 'Monstera', '₹999 box'];

export default function Navbar({
  storeConfig = {},
  currentUser,
  products = [],
  categories = [],
  cartCount = 0,
  wishlistCount = 0,
  onOpenCart,
  onOpenBundle,
  onSelectProduct,
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
  const announcement =
    storeConfig.announcementText ||
    `${comboSize} Living Sculptures @ ₹${comboPrice} • Hydro-Wick Atelier Pots • Free Delivery ₹499+`;

  const announcements = [
    announcement,
    `Free delivery above ₹499 · Same-day dispatch from Theur, Pune`,
    `7-day healthy plant guarantee · Photo proof before dispatch`,
    `Razorpay secure checkout · UPI, Cards & Cash on Delivery`
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
    const t = setInterval(() => setAnnouncementIdx((i) => (i + 1) % announcements.length), 5200);
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
    { label: 'Collection', href: '#shop' },
    { label: 'Journal', href: '#reels' },
    { label: 'Atelier Deal', href: '#deal' },
    { label: 'Care & Consult', href: '#consult' }
  ];

  return (
    <>
      {/* ——— Announcement ribbon ——— */}
      <div className="relative z-40 overflow-hidden bg-canopy-950 text-linen-100">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_140%_at_0%_0%,rgba(176,138,62,0.22),transparent_55%)]" />
        <div className="shell relative flex h-[38px] items-center justify-between gap-4 text-[11px]">
          <div className="flex min-w-0 items-center gap-3">
            <span className="hidden items-center gap-2 text-[9.5px] font-extrabold uppercase tracking-[0.24em] text-brass-300 sm:inline-flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-brass-300 opacity-60 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brass-300" />
              </span>
              Live · Pune
            </span>
            <span className="hidden h-3 w-px bg-white/15 sm:block" />
            <div className="min-w-0 overflow-hidden">
              <p key={announcementIdx} className="animate-fade-up truncate font-medium tracking-[0.01em] text-linen-100/90">
                {announcements[announcementIdx]}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <div className="hidden items-center gap-1.5 lg:flex">
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] text-linen-100/75 transition hover:bg-white/10 hover:text-white"
              >
                <Phone className="h-3 w-3" /> {phone}
              </a>
              <button
                onClick={() => { onOpenTrackOrder?.(); }}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-medium text-white transition hover:border-white/30 hover:bg-white/10"
              >
                <PackageCheck className="h-3.5 w-3.5 text-brass-300" /> Track order
              </button>
            </div>
            <button
              onClick={() => { onOpenAdmin?.(); }}
              className="inline-flex items-center gap-1.5 rounded-full bg-brass-400 px-3 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-canopy-950 shadow-sm transition hover:bg-brass-300"
            >
              <Crown className="h-3.5 w-3.5" /> Studio
            </button>
          </div>
        </div>
      </div>

      {/* ——— Sticky nav ——— */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ease-silk ${
          scrolled
            ? 'border-b border-canopy-950/[0.09] bg-linen-50/85 shadow-[0_10px_40px_-28px_rgba(10,21,18,0.5)] backdrop-blur-xl'
            : 'border-b border-transparent bg-linen-50/70 backdrop-blur-md'
        }`}
      >
        <div className="shell relative flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="#top" className="group flex shrink-0 items-center gap-3.5 py-3">
            <span className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-[15px] bg-canopy-950 shadow-card transition-all duration-500 ease-silk group-hover:shadow-soft-lg">
              <span className="absolute inset-0 bg-[radial-gradient(120%_120%_at_20%_0%,rgba(176,138,62,0.5),transparent_60%)] opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
              <Leaf className="relative h-[19px] w-[19px] text-brass-300 transition-transform duration-700 ease-silk group-hover:-rotate-12 group-hover:scale-110" />
            </span>
            <span className="leading-none">
              <span className="flex items-baseline font-serif text-[25px] font-medium tracking-[-0.03em] text-canopy-950 sm:text-[27px]">
                greenzo<span className="ml-0.5 font-sans text-[15px] font-light tracking-tight text-brass-600">.in</span>
              </span>
              <span className="mt-1 hidden items-center gap-1.5 text-[8.5px] font-bold uppercase tracking-[0.28em] text-stone-500 sm:flex">
                <span className="h-px w-3 bg-brass-500/60" /> Botanical Atelier · Pune
              </span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 xl:flex">
            <div
              className="relative"
              onMouseEnter={openMega}
              onMouseLeave={scheduleCloseMega}
            >
              <a
                href="#shop"
                className={`group inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-semibold transition ${
                  megaOpen ? 'text-canopy-950' : 'text-stone-600 hover:text-canopy-950'
                }`}
                aria-expanded={megaOpen}
              >
                Collection
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${megaOpen ? 'rotate-180' : ''}`} />
              </a>
              <span
                className={`pointer-events-none absolute bottom-1 left-4 right-4 h-px origin-left bg-canopy-950/40 transition-transform duration-500 ease-silk ${
                  megaOpen ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </div>

            <button
              onClick={() => { onOpenBundle?.(); closeAll(); }}
              className="group mx-2 inline-flex items-center gap-2 rounded-full border border-brass-500/30 bg-brass-50 px-3.5 py-2 text-[12px] font-bold text-brass-700 transition hover:border-brass-500/60 hover:bg-brass-100"
            >
              <Sparkles className="h-3.5 w-3.5 text-brass-500" />
              {comboSize}-Plant Box · ₹{comboPrice}
              <span className="rounded-full bg-canopy-950 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.1em] text-brass-300">Save 30%</span>
            </button>

            {navLinks.slice(1).map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="link-line rounded-full px-4 py-2.5 text-[13px] font-semibold text-stone-600 transition hover:text-canopy-950"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search the collection"
              className="group relative grid h-10 w-10 place-items-center rounded-full border border-canopy-950/10 bg-white/70 text-canopy-900 transition hover:border-canopy-950/25 hover:bg-white"
            >
              <Search className="h-[17px] w-[17px] transition-transform duration-300 group-hover:scale-110" />
            </button>

            <a
              href="#shop"
              aria-label="Wishlist"
              className="relative hidden h-10 w-10 place-items-center rounded-full border border-canopy-950/10 bg-white/70 text-canopy-900 transition hover:border-canopy-950/25 hover:bg-white sm:grid"
            >
              <Heart className={`h-[17px] w-[17px] ${wishlistCount ? 'fill-terracotta-500 text-terracotta-500' : ''}`} />
              {wishlistCount > 0 && (
                <span key={wishlistCount} className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] animate-scale-in place-items-center rounded-full bg-terracotta-500 px-1 text-[10px] font-extrabold text-white">
                  {wishlistCount}
                </span>
              )}
            </a>

            <button
              onClick={onOpenAuth}
              className="hidden h-10 items-center gap-2 rounded-full border border-canopy-950/10 bg-white/70 pl-1.5 pr-4 text-[12.5px] font-semibold text-canopy-900 transition hover:border-canopy-950/25 hover:bg-white md:inline-flex"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-linen-100 text-canopy-800">
                {currentUser ? <span className="text-[10.5px] font-extrabold uppercase">{currentUser.name?.[0] || 'G'}</span> : <User className="h-3.5 w-3.5" />}
              </span>
              <span className="max-w-[76px] truncate">{currentUser ? currentUser.name.split(' ')[0] : 'Account'}</span>
            </button>

            <button
              onClick={() => { setSearchOpen(false); onOpenCart?.(); }}
              className="group inline-flex h-10 items-center gap-2 rounded-full bg-canopy-950 pl-4 pr-2 text-[12.5px] font-semibold text-linen-50 shadow-card transition-all duration-500 hover:bg-canopy-900 hover:shadow-soft-lg"
            >
              <ShoppingBag className="h-4 w-4 text-brass-300" />
              <span className="hidden sm:inline">Bag</span>
              <span key={cartCount} className="grid h-6 min-w-6 animate-scale-in place-items-center rounded-full bg-brass-400 px-1 text-[11px] font-extrabold text-canopy-950">
                {cartCount}
              </span>
            </button>

            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="grid h-10 w-10 place-items-center rounded-full border border-canopy-950/10 bg-white/70 text-canopy-950 transition hover:bg-white xl:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scroll progress */}
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-transparent">
          <div
            className="h-full bg-gradient-to-r from-brass-600 via-brass-400 to-canopy-600 transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%`, opacity: scrolled ? 1 : 0 }}
          />
        </div>

        {/* Mega menu */}
        {megaOpen && (
          <div
            className="absolute inset-x-0 top-full hidden animate-fade-up xl:block"
            onMouseEnter={openMega}
            onMouseLeave={scheduleCloseMega}
          >
            <div className="border-b border-canopy-950/10 bg-linen-50/95 shadow-[0_40px_60px_-40px_rgba(10,21,18,0.45)] backdrop-blur-xl">
              <div className="shell grid grid-cols-12 gap-8 py-8">
                <div className="col-span-7">
                  <div className="flex items-center justify-between">
                    <span className="eyebrow">Browse by sanctuary</span>
                    <a href="#shop" onClick={() => setMegaOpen(false)} className="text-[11px] font-semibold text-stone-500 hover:text-canopy-950">
                      View all plants <ArrowUpRight className="ml-0.5 inline h-3 w-3" />
                    </a>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2.5">
                    {categories.slice(0, 6).map((cat) => (
                      <a
                        key={cat.slug}
                        href="#shop"
                        onClick={() => setMegaOpen(false)}
                        className="group flex items-center gap-3 rounded-2xl border border-transparent p-2 transition hover:border-canopy-950/10 hover:bg-white"
                      >
                        <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-linen-100 img-zoom">
                          <img src={cat.imageUrl} alt={cat.name} className="h-full w-full object-cover" loading="lazy" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-semibold text-canopy-950 group-hover:text-canopy-800">{cat.name}</span>
                          <span className="block truncate text-[11px] text-stone-500">{cat.productCount ?? 0} editions · {cat.subtitle?.split(' ').slice(0, 3).join(' ')}</span>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="col-span-5">
                  <div className="relative h-full overflow-hidden rounded-[22px] bg-canopy-950 text-linen-50">
                    <img src="/images/hero-1.jpg" alt="The 4-plant atelier box" className="absolute inset-0 h-full w-full object-cover opacity-55 transition-transform duration-[1600ms] ease-silk hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-canopy-950 via-canopy-950/60 to-transparent" />
                    <div className="relative flex h-full min-h-[190px] flex-col justify-end p-5">
                      <span className="text-[9.5px] font-extrabold uppercase tracking-[0.24em] text-brass-300">Signature set</span>
                      <p className="mt-1.5 font-serif text-[24px] leading-tight">Four living sculptures, <span className="italic text-brass-200">one calm corner.</span></p>
                      <div className="mt-4 flex items-center gap-3">
                        <button
                          onClick={() => { onOpenBundle?.(); setMegaOpen(false); }}
                          className="btn btn-gold btn-sm group"
                        >
                          Curate box — ₹{comboPrice}
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </button>
                        <a href="#reels" onClick={() => setMegaOpen(false)} className="text-[11.5px] font-semibold text-linen-100/75 underline decoration-brass-400/50 underline-offset-4 hover:text-white">
                          See the nursery
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

      {/* ——— Search overlay (command palette) ——— */}
      {searchOpen && (
        <div className="fixed inset-0 z-[90]">
          <div className="absolute inset-0 animate-fade-in bg-canopy-950/55 backdrop-blur-md" onClick={() => setSearchOpen(false)} />
          <div className="relative mx-auto mt-[8vh] w-[min(760px,calc(100%-1.5rem))] animate-scale-in px-0">
            <div className="overflow-hidden rounded-[26px] border border-white/50 bg-linen-50 shadow-elevated">
              <div className="flex h-16 items-center gap-3 border-b border-canopy-950/[0.08] px-5">
                <Search className="h-[18px] w-[18px] shrink-0 text-brass-600" />
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  placeholder="Search plants, light levels, botanical names…"
                  className="h-full flex-1 bg-transparent text-[15px] text-canopy-950 placeholder:text-stone-400 focus:outline-none"
                />
                {query && (
                  <button onClick={() => onSearchChange?.('')} className="grid h-7 w-7 place-items-center rounded-full bg-white text-stone-500 transition hover:text-canopy-950">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                <button onClick={() => setSearchOpen(false)} className="hidden items-center gap-1 rounded-full border border-canopy-950/10 bg-white/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-500 sm:inline-flex">
                  Esc
                </button>
              </div>

              <div className="max-h-[58vh] overflow-y-auto p-3">
                {!query ? (
                  <div className="px-2 py-2">
                    <p className="px-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-stone-400">Popular right now</p>
                    <div className="mt-3 flex flex-wrap gap-2 px-2">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => onSearchChange?.(s.replace('₹999 box', 'Zamia'))}
                          className="rounded-full border border-canopy-950/10 bg-white/80 px-3.5 py-2 text-[12px] font-medium text-canopy-900 transition hover:border-canopy-950/30 hover:bg-white"
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
                          className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-medium text-stone-600 transition hover:bg-white hover:text-canopy-950"
                        >
                          {l.label}
                          <ArrowUpRight className="h-3.5 w-3.5 opacity-40" />
                        </a>
                      ))}
                    </div>
                  </div>
                ) : matches.length === 0 ? (
                  <div className="px-6 py-14 text-center">
                    <p className="font-serif text-xl text-canopy-950">No match for “{query}”</p>
                    <p className="mt-1 text-[12.5px] text-stone-500">Try “Zamia”, “low light” or “air purifying”.</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {matches.map((item) => (
                      <button
                        key={item.slug}
                        onClick={() => handleResultClick(item)}
                        className="group flex w-full items-center gap-3.5 rounded-2xl px-3 py-2.5 text-left transition hover:bg-white"
                      >
                        <span className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-linen-100">
                          <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13.5px] font-semibold text-canopy-950">{item.name}</span>
                          <span className="block truncate font-serif text-[12px] italic text-stone-500">{item.botanicalName}</span>
                          <span className="mt-0.5 inline-flex items-center gap-1 text-[10.5px] font-medium text-stone-500">
                            <Leaf className="h-2.5 w-2.5 text-canopy-600" /> {item.lightLevel}
                          </span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="block text-[14px] font-bold text-canopy-950 num">₹{item.price}</span>
                          <span className="grid h-7 w-7 place-items-center rounded-full bg-canopy-950 text-white transition group-hover:bg-brass-500 group-hover:text-canopy-950">
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-canopy-950/[0.08] bg-white/50 px-5 py-3 text-[10.5px] text-stone-500">
                <span className="inline-flex items-center gap-1.5">
                  <Command className="h-3 w-3" /> K to search · Esc to close
                </span>
                <a
                  href="#shop"
                  onClick={() => setSearchOpen(false)}
                  className="inline-flex items-center gap-1 font-semibold text-canopy-950 hover:text-brass-600"
                >
                  Browse full collection <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ——— Mobile drawer ——— */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[90] xl:hidden">
          <div className="absolute inset-0 animate-fade-in bg-canopy-950/55 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute right-0 top-0 flex h-full w-[89%] max-w-[400px] animate-slide-in-right flex-col bg-linen-50 shadow-elevated">
            <div className="flex items-center justify-between border-b border-canopy-950/[0.08] px-5 py-4">
              <span className="flex items-baseline font-serif text-[22px] tracking-[-0.03em]">
                greenzo<span className="ml-0.5 font-sans text-[13px] font-light text-brass-600">.in</span>
              </span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="grid h-9 w-9 place-items-center rounded-full border border-canopy-950/10 bg-white text-canopy-950">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <button
                onClick={() => { setMobileOpen(false); setSearchOpen(true); }}
                className="mb-6 flex h-12 w-full items-center gap-3 rounded-full border border-canopy-950/10 bg-white px-4 text-left text-[13px] text-stone-400"
              >
                <Search className="h-4 w-4" /> Search plants…
                <span className="ml-auto rounded-full border border-canopy-950/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em]">⌘K</span>
              </button>

              <nav className="space-y-1">
                {navLinks.map((link, i) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    style={{ animationDelay: `${80 + i * 60}ms` }}
                    className="group flex animate-fade-up items-baseline justify-between border-b border-canopy-950/[0.06] py-3.5"
                  >
                    <span className="font-serif text-[26px] leading-none text-canopy-950 transition group-hover:text-brass-600">{link.label}</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">0{i + 1}</span>
                  </a>
                ))}
              </nav>

              <button
                onClick={() => { setMobileOpen(false); onOpenBundle?.(); }}
                className="mt-6 flex w-full items-center justify-between gap-3 rounded-2xl bg-canopy-950 p-4 text-left text-linen-50"
              >
                <span>
                  <span className="block text-[9.5px] font-extrabold uppercase tracking-[0.22em] text-brass-300">Signature set</span>
                  <span className="mt-1 block font-serif text-[20px] leading-tight">{comboSize} plants · ₹{comboPrice}</span>
                </span>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brass-400 text-canopy-950">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>

              <div className="mt-6 grid grid-cols-2 gap-2.5">
                <button onClick={() => { setMobileOpen(false); onOpenAuth?.(); }} className="flex h-11 items-center gap-2 rounded-full border border-canopy-950/10 bg-white px-4 text-[12px] font-semibold">
                  <User className="h-3.5 w-3.5" /> {currentUser ? currentUser.name.split(' ')[0] : 'Sign in'}
                </button>
                <button onClick={() => { setMobileOpen(false); onOpenTrackOrder?.(); }} className="flex h-11 items-center gap-2 rounded-full border border-canopy-950/10 bg-white px-4 text-[12px] font-semibold">
                  <PackageCheck className="h-3.5 w-3.5" /> Track
                </button>
                <button onClick={() => { setMobileOpen(false); onOpenAdmin?.(); }} className="col-span-2 flex h-11 items-center justify-center gap-2 rounded-full bg-brass-400 px-4 text-[12px] font-extrabold uppercase tracking-[0.1em] text-canopy-950">
                  <Crown className="h-3.5 w-3.5" /> Open studio
                </button>
              </div>
            </div>

            <div className="space-y-2 border-t border-canopy-950/[0.08] px-5 py-4 text-[11px] text-stone-500">
              <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-brass-600" /> Empire Agro, Theur · Pune 412110</p>
              <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-brass-600" /> {phone}</p>
              <p className="flex items-center gap-2 pt-1 text-[10px] uppercase tracking-[0.16em]">
                <ShieldCheck className="h-3.5 w-3.5 text-canopy-600" /> 7-day healthy guarantee
                <Truck className="ml-2 h-3.5 w-3.5 text-canopy-600" /> Free ₹499+
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
