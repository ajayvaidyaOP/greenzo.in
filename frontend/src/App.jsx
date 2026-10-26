import React, { useState, useEffect, useCallback } from 'react';
import { Check, ArrowUp } from 'lucide-react';
import { api, getStoredToken, setStoredToken } from './lib/api.js';
import Navbar from './components/Navbar.jsx';
import PromoMarquee from './components/PromoMarquee.jsx';
import HeroVideoStage from './components/HeroVideoStage.jsx';
import USPBar from './components/USPBar.jsx';
import CategoryStrip from './components/CategoryStrip.jsx';
import ProductSection from './components/ProductSection.jsx';
import EditorialLookbook from './components/EditorialLookbook.jsx';
import BundleBuilderModal from './components/BundleBuilderModal.jsx';
import VideoNurseryStrip from './components/VideoNurseryStrip.jsx';
import DealOfTheWeek from './components/DealOfTheWeek.jsx';
import WhyChooseUs from './components/WhyChooseUs.jsx';
import TestimonialsSection from './components/TestimonialsSection.jsx';
import BlogSection from './components/BlogSection.jsx';
import ConsultationSection from './components/ConsultationSection.jsx';
import Footer from './components/Footer.jsx';
import ProductQuickView from './components/ProductQuickView.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import { TrackOrderModal } from './components/LiveStoreDashboard.jsx';
import AuthView from './components/AuthView.jsx';
import AdminPanel from './components/AdminPanel.jsx';

export default function App() {
  const [activeView, setActiveView] = useState('store');
  const [currentUser, setCurrentUser] = useState(null);
  const [catalog, setCatalog] = useState({ storeConfig: {}, heroReels: [], activeOffers: [], galleryPhotos: [], categories: [], products: [], featuredDeal: null, blogs: [], reviews: [] });
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState(() => { try { return JSON.parse(localStorage.getItem('greenzo_cart_v2') || '[]'); } catch { return []; } });
  const [wishlist, setWishlist] = useState(() => { try { return JSON.parse(localStorage.getItem('greenzo_wishlist_v2') || '[]'); } catch { return []; } });
  const [cartOpen, setCartOpen] = useState(false);
  const [bundleOpen, setBundleOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [trackOrderOpen, setTrackOrderOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [showTop, setShowTop] = useState(false);

  const notify = useCallback((msg) => setToastMsg(msg), []);
  useEffect(() => { if (!toastMsg) return; const t = setTimeout(() => setToastMsg(null), 3200); return () => clearTimeout(t); }, [toastMsg]);
  useEffect(() => { localStorage.setItem('greenzo_cart_v2', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('greenzo_wishlist_v2', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const reloadCatalog = useCallback(async () => { try { const data = await api.getCatalog(); setCatalog(data); } catch {} finally { setLoading(false); } }, []);
  useEffect(() => { reloadCatalog(); if (getStoredToken()) api.getMe().then((res) => setCurrentUser(res.user)).catch(() => setStoredToken('')); }, [reloadCatalog]);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const handleOpenAdmin = () => { if (currentUser?.role === 'ADMIN') { setActiveView('admin'); scrollTop(); } else { notify('Admin login: admin@greenzo.in / Admin@123'); setActiveView('auth'); scrollTop(); } };
  const handleLogout = () => { setStoredToken(''); setCurrentUser(null); setActiveView('store'); notify('Signed out'); };
  const handleAddToCart = useCallback((newItem) => {
    setCart((prev) => {
      const key = newItem.isBundle ? `${newItem.slug}-${newItem.potColor}` : `${newItem.slug}-${newItem.potColor}-${newItem.potSize}`;
      const existing = prev.find((i) => i.key === key);
      if (existing) return prev.map((i) => i.key === key ? { ...i, quantity: i.quantity + (newItem.quantity || 1) } : i);
      return [...prev, { ...newItem, key, quantity: newItem.quantity || 1 }];
    });
    notify(`${newItem.productName} — added to bag`);
  }, [notify]);
  const handleUpdateQty = useCallback((key, nextQty) => { if (nextQty <= 0) setCart((p) => p.filter((i) => i.key !== key)); else setCart((p) => p.map((i) => i.key === key ? { ...i, quantity: nextQty } : i)); }, []);
  const handleRemoveItem = useCallback((key) => setCart((p) => p.filter((i) => i.key !== key)), []);
  const handleToggleWishlist = useCallback((slug) => { setWishlist((prev) => { const exists = prev.includes(slug); notify(exists ? 'Removed from wishlist' : 'Saved to wishlist'); return exists ? prev.filter((s) => s !== slug) : [...prev, slug]; }); }, [notify]);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const openBundle = () => setBundleOpen(true);

  return (
    <div className="flex min-h-screen flex-col bg-linen-50 text-canopy-950">
      {activeView === 'admin' && currentUser?.role === 'ADMIN' ? (
        <div key="admin" className="view-enter">
          <AdminPanel currentUser={currentUser} onBackToStore={() => setActiveView('store')} onLogout={handleLogout} onCatalogMutated={reloadCatalog} onNotify={notify} />
        </div>
      ) : activeView === 'auth' ? (
        <div key="auth" className="view-enter">
          <AuthView currentUser={currentUser} onAuthSuccess={(u) => { setCurrentUser(u); if (u.role !== 'ADMIN') setActiveView('auth'); }} onLogout={handleLogout} onBackToStore={() => setActiveView('store')} onOpenAdminPanel={() => setActiveView('admin')} onNotify={notify} />
        </div>
      ) : (
        <div key="store" className="view-enter flex min-h-screen flex-col">
          <Navbar storeConfig={catalog.storeConfig} currentUser={currentUser} products={catalog.products} categories={catalog.categories} cartCount={cartCount} wishlistCount={wishlist.length} onOpenCart={() => setCartOpen(true)} onOpenBundle={openBundle} onSelectProduct={(p) => setQuickViewProduct(p)} onOpenTrackOrder={() => setTrackOrderOpen(true)} onOpenAuth={() => { setActiveView('auth'); scrollTop(); }} onOpenAdmin={handleOpenAdmin} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <PromoMarquee />
          <main className="flex-1">
            <HeroVideoStage storeConfig={catalog.storeConfig} activeOffers={catalog.activeOffers} reels={catalog.heroReels} products={catalog.products} onOpenBundle={openBundle} onQuickAddProduct={(p) => handleAddToCart({ slug: p.slug, productName: p.name, imageUrl: p.imageUrl, potColor: p.potColors?.[0] || 'Matte Ivory', potSize: 'Medium (5 inch Self-Watering)', unitPrice: p.price, quantity: 1, isBundle: false })} onSelectProduct={(p) => setQuickViewProduct(p)} onNotify={notify} />
            <USPBar />
            <CategoryStrip categories={catalog.categories} activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
            {loading ? (
              <div className="bg-linen-50 py-24 text-center">
                <span className="inline-flex items-center gap-3 rounded-full border border-canopy-950/10 bg-white px-5 py-2.5 text-[12px] font-medium text-stone-600 shadow-soft">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brass-500" /> Loading the atelier collection…
                </span>
              </div>
            ) : (
              <ProductSection products={catalog.products} categories={catalog.categories} activeCategory={activeCategory} onSelectCategory={setActiveCategory} searchQuery={searchQuery} onClearSearch={() => setSearchQuery('')} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} onAddToCart={handleAddToCart} onQuickView={(p) => setQuickViewProduct(p)} onOpenBundle={openBundle} />
            )}
            <EditorialLookbook onOpenBundle={openBundle} />
            <VideoNurseryStrip onOpenBundle={openBundle} />
            <DealOfTheWeek dealProduct={catalog.featuredDeal} isWishlisted={catalog.featuredDeal ? wishlist.includes(catalog.featuredDeal.slug) : false} onToggleWishlist={handleToggleWishlist} onAddToCart={handleAddToCart} />
            <WhyChooseUs galleryPhotos={catalog.galleryPhotos} />
            <TestimonialsSection reviews={catalog.reviews} products={catalog.products} onReviewAdded={(r) => setCatalog((p) => ({ ...p, reviews: [r, ...p.reviews] }))} onNotify={notify} />
            <BlogSection blogs={catalog.blogs} />
            <ConsultationSection onNotify={notify} />
          </main>
          <Footer onNotify={notify} onOpenTrackOrder={() => setTrackOrderOpen(true)} onOpenBundle={openBundle} />
        </div>
      )}

      <BundleBuilderModal isOpen={bundleOpen} onClose={() => setBundleOpen(false)} storeConfig={catalog.storeConfig} products={catalog.products} onAddBundleToCart={handleAddToCart} />
      <ProductQuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} onAddToCart={handleAddToCart} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} storeConfig={catalog.storeConfig} activeOffers={catalog.activeOffers} currentUser={currentUser} cart={cart} onUpdateQty={handleUpdateQty} onRemoveItem={handleRemoveItem} onClearCart={() => setCart([])} onOpenBundle={openBundle} onNotify={notify} />
      <TrackOrderModal isOpen={trackOrderOpen} onClose={() => setTrackOrderOpen(false)} />

      {/* Back to top */}
      <button
        onClick={scrollTop}
        aria-label="Back to top"
        className={`fixed bottom-[86px] left-5 z-40 grid h-11 w-11 place-items-center rounded-full border border-canopy-950/10 bg-linen-50/90 text-canopy-950 shadow-soft backdrop-blur transition-all duration-500 ease-silk hover:bg-white hover:shadow-soft-lg ${
          showTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <ArrowUp className="h-4 w-4" />
      </button>

      {/* Toast */}
      <div className={`pointer-events-none fixed bottom-6 right-6 z-[95] transition-all duration-500 ease-silk ${toastMsg ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}>
        {toastMsg && (
          <div className="flex animate-scale-in items-center gap-3 rounded-full border border-white/10 bg-canopy-950 py-2 pl-2 pr-5 text-[12.5px] font-medium text-linen-50 shadow-elevated">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-brass-400 text-canopy-950">
              <Check className="h-3.5 w-3.5 stroke-[3]" />
            </span>
            <span className="max-w-[300px] truncate">{toastMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
}
