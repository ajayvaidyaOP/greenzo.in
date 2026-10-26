import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, Leaf, PackageCheck, Phone, ArrowUpRight, User, Crown } from 'lucide-react';

export default function Navbar({ storeConfig = {}, currentUser, products = [], cartCount = 0, wishlistCount = 0, onOpenCart, onOpenBundle, onSelectProduct, onOpenTrackOrder, onOpenAuth, onOpenAdmin, searchQuery, onSearchChange }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const comboPrice = storeConfig.comboBundlePrice || 999;
  const comboSize = storeConfig.comboBundleSize || 4;
  const phone = storeConfig.phone || '+91 8883639639';
  const announcement = storeConfig.announcementText || `DROP 04 — ${comboSize} Living Sculptures @ ₹${comboPrice} • Hydro-Wick Atelier Pots • Free Delivery ₹499+`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    const handler = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setSearchFocused(false); };
    document.addEventListener('mousedown', handler); return () => document.removeEventListener('mousedown', handler);
  }, []);
  const matches = searchQuery.trim() ? products.filter((p) => [p.name, p.botanicalName, p.lightLevel].join(' ').toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5) : [];

  return (
    <>
      {/* Top announcement — tight, premium */}
      <div className="relative bg-canopy-950 text-white border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
        <div className="relative max-w-[1360px] mx-auto px-5 lg:px-8 h-[34px] flex items-center justify-between gap-3 text-[11.5px]">
          <div className="flex items-center gap-3 min-w-0">
            <span className="hidden sm:inline-flex items-center gap-2 text-emerald-300 font-bold tracking-[0.16em] uppercase text-[10px]"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live from Pune</span>
            <span className="hidden sm:block h-3 w-px bg-white/15" />
            <p className="truncate font-medium tracking-[0.01em]">{announcement}</p>
          </div>
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <a href={`tel:${phone.replace(/\s+/g, '')}`} className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-xs"><Phone className="w-3 h-3" /> {phone}</a>
            <button onClick={onOpenTrackOrder} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-[11px] font-medium transition"><PackageCheck className="w-3.5 h-3.5 text-emerald-300" /> Track Order</button>
            <button onClick={onOpenAdmin} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-canopy-950 text-[11px] font-semibold shadow-sm hover:bg-stone-50 transition"><Crown className="w-3.5 h-3.5" /> Studio</button>
          </div>
        </div>
      </div>

      <header className={`sticky top-0 z-40 border-b transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl border-stone-200 shadow-soft' : 'bg-white/80 backdrop-blur-lg border-stone-100'}`}>
        <div className="max-w-[1360px] mx-auto px-5 lg:px-8 h-[68px] lg:h-[76px] flex items-center justify-between gap-6">
          <a href="#top" className="flex items-center gap-3.5 group shrink-0">
            <div className="w-11 h-11 rounded-[14px] bg-canopy-950 flex items-center justify-center shadow-card group-hover:shadow-elevated transition">
              <Leaf className="w-5 h-5 text-emerald-300" />
            </div>
            <div className="leading-none">
              <div className="font-serif text-[24px] lg:text-[26px] font-semibold tracking-[-0.02em] text-canopy-950">greenzo<span className="font-light text-canopy-700">.in</span></div>
              <div className="text-[10px] tracking-[0.22em] uppercase font-semibold text-stone-500 mt-0.5">Botanical Atelier — Pune</div>
            </div>
          </a>

          <nav className="hidden xl:flex items-center gap-6 text-[13px] font-medium">
            <a href="#shop" className="text-stone-700 hover:text-canopy-950 transition">Collection</a>
            <button onClick={onOpenBundle} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terracotta-50 border border-terracotta-500/15 text-terracotta-600 hover:bg-terracotta-100 transition text-xs font-semibold">₹{comboPrice} Curated Box <span className="px-2 py-0.5 rounded-full bg-white border border-terracotta-500/15 text-[10px]">PICK {comboSize}</span></button>
            <a href="#reels" className="text-stone-700 hover:text-canopy-950 transition">Journal</a>
            <a href="#deal" className="text-stone-700 hover:text-canopy-950 transition">Atelier Deal</a>
          </nav>

          <div className="flex items-center gap-2">
            <div ref={searchRef} className="relative hidden md:block">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input value={searchQuery} onFocus={() => setSearchFocused(true)} onChange={(e) => { onSearchChange(e.target.value); setSearchFocused(true); }} placeholder="Search Zamia, Snake, Low-light..." className="w-[220px] lg:w-[280px] h-[42px] pl-10 pr-9 rounded-full bg-stone-50 border border-stone-200 text-[13px] placeholder:text-stone-400 focus:bg-white focus:border-canopy-900/20 focus:ring-4 focus:ring-canopy-900/5 outline-none transition" />
              {searchQuery ? <button onClick={() => onSearchChange('')} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white border border-stone-200 flex items-center justify-center"><X className="w-3.5 h-3.5" /></button> : <span className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex text-[10px] tracking-widest font-medium text-stone-400 border border-stone-200 rounded-full px-2 py-1">⌘ K</span>}
              {searchFocused && searchQuery.trim().length > 0 && (
                <div className="absolute right-0 mt-3 w-[380px] bg-white rounded-[20px] shadow-elevated border border-stone-100 overflow-hidden z-50">
                  <div className="px-5 py-3 bg-stone-50 border-b border-stone-100 text-[11px] font-bold tracking-[0.14em] uppercase text-stone-500">Matches — {matches.length}</div>
                  {matches.length === 0 ? <div className="p-8 text-center text-sm text-stone-500">No match for “{searchQuery}”</div> : <div className="divide-y divide-stone-50">{matches.map((item) => (
                    <button key={item.slug} onClick={() => { setSearchFocused(false); onSelectProduct(item); }} className="w-full px-5 py-4 flex items-center gap-4 hover:bg-stone-50 text-left group">
                      <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-stone-50" />
                      <div className="flex-1 min-w-0"><p className="text-[13.5px] font-semibold text-canopy-950 truncate">{item.name}</p><p className="text-xs text-stone-500 truncate">{item.botanicalName}</p></div>
                      <div className="text-right"><p className="text-sm font-bold text-canopy-950">₹{item.price}</p><span className="inline-flex w-6 h-6 rounded-full bg-canopy-950 text-white items-center justify-center"><ArrowUpRight className="w-3 h-3" /></span></div>
                    </button>))}</div>}
                </div>
              )}
            </div>

            <a href="#shop" className="relative hidden sm:flex w-10 h-10 rounded-full bg-white border border-stone-200 items-center justify-center text-stone-700 hover:border-stone-300 transition"><Heart className={`w-[18px] h-[18px] ${wishlistCount ? 'fill-terracotta-500 text-terracotta-500' : ''}`} />{wishlistCount ? <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-terracotta-500 text-white text-[11px] font-bold flex items-center justify-center">{wishlistCount}</span> : null}</a>
            <button onClick={onOpenAuth} className="hidden sm:inline-flex h-[42px] px-4 rounded-full bg-white border border-stone-200 text-canopy-950 text-[13px] font-medium hover:bg-stone-50 transition items-center gap-2"><span className="w-7 h-7 rounded-full bg-linen-100 flex items-center justify-center"><User className="w-3.5 h-3.5" /></span><span className="hidden lg:inline">{currentUser ? currentUser.name.split(' ')[0] : 'Account'}</span></button>
            <button onClick={onOpenCart} className="h-[42px] pl-4 pr-5 rounded-full bg-canopy-950 hover:bg-black text-white inline-flex items-center gap-2 text-[13px] font-semibold shadow-card transition"><ShoppingBag className="w-4 h-4 text-emerald-300" /><span className="hidden sm:inline">Bag</span><span className="min-w-[22px] h-[22px] px-1 rounded-full bg-white text-canopy-950 text-xs font-bold flex items-center justify-center">{cartCount}</span></button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="xl:hidden w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center"><Menu className={`w-5 h-5 ${mobileOpen ? 'hidden' : 'block'}`} /><X className={`w-5 h-5 ${mobileOpen ? 'block' : 'hidden'}`} /></button>
          </div>
        </div>

        {mobileOpen && (
          <div className="xl:hidden border-t border-stone-100 bg-white px-5 py-5 space-y-4">
            <div className="relative"><Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" /><input value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} placeholder="Search plants..." className="w-full h-11 pl-10 pr-4 rounded-full bg-stone-50 border border-stone-200 text-sm" /></div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { setMobileOpen(false); onOpenAuth(); }} className="h-11 rounded-full bg-white border border-stone-200 text-sm px-5 text-left font-medium">{currentUser ? `Hi, ${currentUser.name.split(' ')[0]}` : 'Sign in / Join'}</button>
              <button onClick={() => { setMobileOpen(false); onOpenAdmin(); }} className="h-11 rounded-full bg-canopy-950 text-white text-sm font-semibold px-5 text-left">Studio</button>
              <a onClick={() => setMobileOpen(false)} href="#shop" className="h-11 rounded-full bg-stone-50 border border-stone-200 flex items-center px-5 text-sm font-medium">Explore Collection</a>
              <button onClick={() => { setMobileOpen(false); onOpenBundle(); }} className="h-11 rounded-full bg-terracotta-500 text-white text-sm font-semibold px-5 text-left">₹{comboPrice} — {comboSize} Plants</button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
