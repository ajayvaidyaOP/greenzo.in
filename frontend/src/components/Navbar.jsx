import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  Sparkles,
  PackageCheck,
  Phone,
  ArrowUpRight,
  User,
  Crown
} from 'lucide-react';

export default function Navbar({
  storeConfig = {},
  currentUser,
  products = [],
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
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef(null);

  const comboPrice = storeConfig.comboBundlePrice || 999;
  const comboSize = storeConfig.comboBundleSize || 4;
  const freeShip = storeConfig.freeShippingThreshold || 499;
  const phone = storeConfig.phone || '+91 8883639639';
  const announcement =
    storeConfig.announcementText ||
    `Signature Offer: Buy ${comboSize} Plants with Self-Watering Pots @ ₹${comboPrice}`;

  useEffect(() => {
    function handleOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const searchMatches = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.botanicalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.lightLevel.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  return (
    <>
      {/* Top Luxury Announcement Strip */}
      <div className="bg-canopy-950 text-linen-100 text-[12px] border-b border-white/10">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            <span className="font-medium text-emerald-100">{announcement}</span>
            <span className="text-white/25 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-linen-200/80">
              Free Shipping ₹{freeShip}+
            </span>
            <span className="text-white/25 hidden md:inline">•</span>
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="hidden md:inline-flex items-center gap-1 text-linen-200 hover:text-white transition"
            >
              <Phone className="w-3 h-3 text-emerald-400" /> {phone}
            </a>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenTrackOrder}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 text-[11px] font-medium text-linen-100 transition"
            >
              <PackageCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden sm:inline">Track Order</span>
            </button>

            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-300/35 hover:bg-emerald-400/30 text-[11px] font-semibold text-emerald-200 transition"
            >
              <Crown className="w-3 h-3 text-emerald-300" />
              <span>Admin Panel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Architectural Header */}
      <header className="sticky top-0 z-40 bg-linen-50/92 backdrop-blur-md border-b border-canopy-900/10">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8 h-[72px] flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <a href="#top" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-canopy-900 flex items-center justify-center shadow-sm group-hover:bg-canopy-800 transition">
              <span className="font-serif italic text-xl font-bold text-emerald-300">g</span>
            </div>
            <div className="leading-none">
              <div className="font-serif text-[26px] font-bold tracking-tight text-canopy-950">
                greenzo<span className="text-canopy-600">.in</span>
              </div>
              <div className="text-[9.5px] uppercase tracking-[0.22em] text-canopy-700/75 font-medium mt-0.5">
                Pune Botanical Studio
              </div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-6 text-[13.5px] font-medium text-canopy-900/80">
            <a href="#top" className="hover:text-canopy-950 transition">
              Sanctuary
            </a>
            <a href="#shop" className="hover:text-canopy-950 transition">
              Shop Plants
            </a>
            <button
              onClick={onOpenBundle}
              className="inline-flex items-center gap-1.5 text-terracotta-600 font-semibold hover:text-terracotta-500 transition"
            >
              <span>₹{comboPrice} Combo Box</span>
              <span className="px-1.5 py-0.5 text-[10px] rounded bg-terracotta-50 border border-terracotta-500/20">
                Pick {comboSize}
              </span>
            </button>
            <a href="#reels" className="hover:text-canopy-950 transition">
              Hydro-Wick Tech
            </a>
            <a href="#deal" className="hover:text-canopy-950 transition">
              Weekly Deal
            </a>
            <a href="#journal" className="hover:text-canopy-950 transition">
              Journal
            </a>
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Instant Search */}
            <div ref={searchRef} className="relative hidden md:block">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-canopy-700/60 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setSearchFocused(true)}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    setSearchFocused(true);
                  }}
                  placeholder="Search Zamia, Snake..."
                  className="w-[190px] lg:w-[240px] h-10 pl-9 pr-8 rounded-full bg-white border border-canopy-900/15 text-[13px] text-canopy-950 placeholder:text-canopy-800/45 focus:outline-none focus:border-canopy-700 focus:ring-2 focus:ring-canopy-700/15 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-2.5 text-canopy-700/60 hover:text-canopy-950"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {searchFocused && searchQuery.trim().length > 0 && (
                <div className="absolute right-0 mt-2 w-[340px] bg-white rounded-2xl shadow-elevated border border-canopy-900/10 overflow-hidden z-50">
                  <div className="px-4 py-2.5 bg-linen-100/70 border-b border-canopy-900/5 text-[11px] font-semibold uppercase tracking-wider text-canopy-700">
                    Nursery Matches ({searchMatches.length})
                  </div>
                  {searchMatches.length === 0 ? (
                    <div className="p-5 text-center text-xs text-canopy-800/60">
                      No exact match for “{searchQuery}”.
                    </div>
                  ) : (
                    <div className="divide-y divide-canopy-900/5">
                      {searchMatches.map((item) => (
                        <button
                          key={item.slug}
                          onClick={() => {
                            setSearchFocused(false);
                            onSelectProduct(item);
                          }}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-linen-50 text-left transition"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-11 h-11 rounded-lg object-cover bg-linen-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-canopy-950 truncate">
                              {item.name}
                            </p>
                            <p className="text-[11px] text-canopy-700/70 truncate">
                              {item.lightLevel}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[13px] font-bold text-canopy-800">
                              ₹{item.price}
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-canopy-600 ml-auto mt-0.5" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <a
              href="#shop"
              className="relative w-10 h-10 rounded-full bg-white border border-canopy-900/15 hidden sm:flex items-center justify-center text-canopy-900 hover:border-canopy-800 transition"
              title="Saved Wishlist"
            >
              <Heart
                className={`w-4 h-4 ${
                  wishlistCount > 0 ? 'fill-terracotta-500 text-terracotta-500' : ''
                }`}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-canopy-900 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </a>

            {/* Sign In / Account Button */}
            <button
              onClick={onOpenAuth}
              className="h-10 px-3.5 rounded-full bg-white hover:bg-linen-100 border border-canopy-900/15 text-canopy-950 flex items-center gap-2 text-[12.5px] font-semibold transition"
            >
              <User className="w-4 h-4 text-canopy-700" />
              <span className="hidden sm:inline max-w-[96px] truncate">
                {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
              </span>
            </button>

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative h-10 px-4 rounded-full bg-canopy-900 hover:bg-canopy-950 text-white flex items-center gap-2 text-[13px] font-semibold shadow-sm transition active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-300" />
              <span className="hidden sm:inline">Bag</span>
              <span className="px-1.5 py-0.5 rounded-full bg-white/15 text-[11px] font-bold leading-none">
                {cartCount}
              </span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="xl:hidden w-10 h-10 rounded-full bg-white border border-canopy-900/15 flex items-center justify-center text-canopy-950"
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="xl:hidden bg-linen-50 border-t border-canopy-900/10 px-4 pt-3 pb-5 space-y-3">
            <div className="relative md:hidden">
              <Search className="w-4 h-4 text-canopy-700/60 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search indoor plants..."
                className="w-full h-10 pl-9 pr-4 rounded-xl bg-white border border-canopy-900/15 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm font-medium">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenAuth();
                }}
                className="p-2.5 rounded-xl bg-white border border-canopy-900/10 text-left font-semibold"
              >
                {currentUser ? `Account (${currentUser.name.split(' ')[0]})` : 'Login / Sign Up'}
              </button>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenAdmin();
                }}
                className="p-2.5 rounded-xl bg-canopy-900 text-emerald-200 font-semibold text-left"
              >
                Admin Control Panel
              </button>
              <a
                href="#shop"
                onClick={() => setMobileOpen(false)}
                className="p-2.5 rounded-xl bg-white border border-canopy-900/10"
              >
                Shop Collection
              </a>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenBundle();
                }}
                className="p-2.5 rounded-xl bg-terracotta-50 text-terracotta-600 font-semibold border border-terracotta-500/20 text-left"
              >
                ₹{comboPrice} {comboSize}-Plant Box
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
