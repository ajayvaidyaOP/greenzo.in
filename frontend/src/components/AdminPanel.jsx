import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  Sprout,
  Tag,
  Images,
  ShoppingBag,
  Settings,
  ArrowLeft,
  Plus,
  Upload,
  Trash2,
  Edit3,
  Star,
  Check,
  RefreshCw,
  IndianRupee,
  CreditCard,
  Save,
  X,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { api } from '../lib/api.js';

const EMPTY_PRODUCT = {
  name: '',
  botanicalName: '',
  categorySlug: 'indoor-plants',
  price: 249,
  maxPrice: 299,
  originalPrice: 349,
  badge: 'New Arrival',
  imageUrl: '/images/zamia-green.jpg',
  gallery: [],
  shortDescription: '',
  description: '',
  lightLevel: 'Medium Indirect Light',
  waterSchedule: 'Refill reservoir every 10 days',
  petFriendly: false,
  airPurifying: true,
  stockQty: 50,
  bundleEligible: true,
  isFeaturedDeal: false
};

export default function AdminPanel({
  currentUser,
  onBackToStore,
  onLogout,
  onCatalogMutated,
  onNotify
}) {
  const [activeTab, setActiveTab] = useState('overview'); // overview | products | offers | gallery | orders | settings
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inline quick price/stock edits state: { [id]: { price, originalPrice, stockQty, badge } }
  const [inlineEdits, setInlineEdits] = useState({});

  // Product Create / Edit Modal
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // New Category Quick Input
  const [newCatName, setNewCatName] = useState('');

  // Coupon Form
  const [couponForm, setCouponForm] = useState({
    code: '',
    type: 'percent',
    value: 15,
    minSubtotal: 499,
    label: '',
    description: '',
    showInBanner: true
  });

  // Gallery Upload Form
  const [galleryForm, setGalleryForm] = useState({
    imageUrl: '',
    caption: '',
    spanClass: ''
  });

  // Store & Razorpay Settings Form
  const [settingsForm, setSettingsForm] = useState(null);
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.admin.getDashboard();
      setDashboard(data);
      setSettingsForm(data.settings);
      const map = {};
      (data.products || []).forEach((p) => {
        map[p.id] = {
          price: p.price,
          originalPrice: p.originalPrice,
          stockQty: p.stockQty,
          badge: p.badge || ''
        };
      });
      setInlineEdits(map);
    } catch (err) {
      onNotify(err.message);
    } finally {
      setLoading(false);
    }
  }, [onNotify]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const syncAll = async (toastText) => {
    await fetchDashboard();
    await onCatalogMutated();
    if (toastText) onNotify(toastText);
  };

  // Upload Photo Helper
  const handleFileUpload = async (file, onUploaded) => {
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const res = await api.admin.uploadPhoto(file);
      onUploaded(res.url);
      onNotify('Photo uploaded to server! 📸');
    } catch (err) {
      onNotify(err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Open Product Modal for Create or Edit
  const openCreateProduct = () => {
    setEditingProductId(null);
    setProductForm({
      ...EMPTY_PRODUCT,
      categorySlug: dashboard?.categories?.[0]?.slug || 'indoor-plants'
    });
    setProductModalOpen(true);
  };

  const openEditProduct = (prod) => {
    setEditingProductId(prod.id);
    setProductForm({
      name: prod.name,
      botanicalName: prod.botanicalName,
      categorySlug: prod.categorySlug,
      price: prod.price,
      maxPrice: prod.maxPrice,
      originalPrice: prod.originalPrice,
      badge: prod.badge || '',
      imageUrl: prod.imageUrl,
      gallery: prod.gallery || [prod.imageUrl],
      shortDescription: prod.shortDescription,
      description: prod.description,
      lightLevel: prod.lightLevel,
      waterSchedule: prod.waterSchedule,
      petFriendly: prod.petFriendly,
      airPurifying: prod.airPurifying,
      stockQty: prod.stockQty,
      bundleEligible: prod.bundleEligible,
      isFeaturedDeal: prod.isFeaturedDeal
    });
    setProductModalOpen(true);
  };

  const handleSaveProductModal = async (e) => {
    e.preventDefault();
    try {
      if (editingProductId) {
        await api.admin.updateProduct(editingProductId, productForm);
        setProductModalOpen(false);
        await syncAll('Plant details, photos & pricing updated! 🌿');
      } else {
        await api.admin.createProduct(productForm);
        setProductModalOpen(false);
        await syncAll('New plant published to storefront! 🌿');
      }
    } catch (err) {
      onNotify(err.message);
    }
  };

  const handleQuickSaveRow = async (productId) => {
    const rowPatch = inlineEdits[productId];
    if (!rowPatch) return;
    try {
      await api.admin.quickUpdateProduct(productId, {
        price: Number(rowPatch.price),
        maxPrice: Number(rowPatch.price) + 50,
        originalPrice: Number(rowPatch.originalPrice),
        stockQty: Number(rowPatch.stockQty),
        badge: rowPatch.badge
      });
      await syncAll('Price & stock updated live! ✓');
    } catch (err) {
      onNotify(err.message);
    }
  };

  const handleSetFeaturedDeal = async (productId) => {
    try {
      await api.admin.quickUpdateProduct(productId, { isFeaturedDeal: true });
      await syncAll('Updated Deal of the Week spotlight! ★');
    } catch (err) {
      onNotify(err.message);
    }
  };

  const handleDeleteProduct = async (productId, name) => {
    if (!window.confirm(`Remove "${name}" from catalog?`)) return;
    try {
      await api.admin.deleteProduct(productId);
      await syncAll(`Removed ${name}`);
    } catch (err) {
      onNotify(err.message);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await api.admin.createCategory({ name: newCatName.trim() });
      setNewCatName('');
      await syncAll('New plant category added!');
    } catch (err) {
      onNotify(err.message);
    }
  };

  // Offers / Coupons Handlers
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await api.admin.createCoupon(couponForm);
      setCouponForm({
        code: '',
        type: 'percent',
        value: 15,
        minSubtotal: 499,
        label: '',
        description: '',
        showInBanner: true
      });
      await syncAll('New offer code published! 🎁');
    } catch (err) {
      onNotify(err.message);
    }
  };

  const handleToggleCoupon = async (coupon, field) => {
    try {
      await api.admin.updateCoupon(coupon.id, { [field]: !coupon[field] });
      await syncAll('Offer updated!');
    } catch (err) {
      onNotify(err.message);
    }
  };

  const handleDeleteCoupon = async (id) => {
    try {
      await api.admin.deleteCoupon(id);
      await syncAll('Offer deleted');
    } catch (err) {
      onNotify(err.message);
    }
  };

  // Gallery Handlers
  const handleAddGalleryPhoto = async (e) => {
    e.preventDefault();
    if (!galleryForm.imageUrl) {
      onNotify('Upload a photo from your device or paste an image URL first.');
      return;
    }
    try {
      await api.admin.addGalleryPhoto({
        imageUrl: galleryForm.imageUrl,
        caption: galleryForm.caption || 'Greenzo Pune Sanctuary',
        spanClass: galleryForm.spanClass
      });
      setGalleryForm({ imageUrl: '', caption: '', spanClass: '' });
      await syncAll('New photo added to Sanctuary Gallery! 📸');
    } catch (err) {
      onNotify(err.message);
    }
  };

  // Settings Save Handler
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await api.admin.saveSettings(settingsForm);
      await syncAll('Storefront & Razorpay settings saved live! ⚡');
    } catch (err) {
      onNotify(err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Plants, Photos & Prices', icon: Sprout },
    { id: 'offers', label: 'Offers & Coupons', icon: Tag },
    { id: 'gallery', label: 'Gallery Photos', icon: Images },
    { id: 'orders', label: 'Orders & Payments', icon: ShoppingBag },
    { id: 'settings', label: 'Store & Razorpay Setup', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-linen-100/80 text-canopy-950 flex flex-col lg:flex-row">
      {/* Left Admin Sidebar */}
      <aside className="lg:w-[270px] bg-canopy-950 text-white p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-canopy-950 font-serif italic text-xl font-bold flex items-center justify-center">
                g
              </div>
              <div>
                <p className="font-serif text-xl font-bold leading-none">Greenzo Admin</p>
                <p className="text-[10px] uppercase tracking-widest text-emerald-300 mt-0.5">
                  Nursery Control Studio
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onBackToStore}
            className="w-full py-2.5 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold flex items-center justify-between transition"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-300" />
              View Live Website
            </span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </button>

          {/* Navigation Links */}
          <nav className="flex lg:flex-col gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 shrink-0 transition ${
                    active
                      ? 'bg-emerald-400 text-canopy-950 shadow-sm font-bold'
                      : 'text-linen-100/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="hidden lg:block pt-6 border-t border-white/10 space-y-3">
          <div className="text-xs">
            <p className="font-semibold text-white truncate">{currentUser?.name}</p>
            <p className="text-[11px] text-linen-200/65 truncate">{currentUser?.email}</p>
          </div>
          <button
            onClick={onLogout}
            className="w-full py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-[1160px] mx-auto space-y-6">
          {/* Workspace Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-2xl px-5 py-4 border border-canopy-900/10 shadow-sm">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-canopy-950">
                {NAV_ITEMS.find((n) => n.id === activeTab)?.label}
              </h1>
              <p className="text-xs text-canopy-700/75">
                Every change to prices, photos, offers & banners updates the live storefront
                immediately.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => fetchDashboard()}
                className="h-9 px-3.5 rounded-xl bg-linen-100 hover:bg-linen-200 text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                onClick={openCreateProduct}
                className="h-9 px-4 rounded-xl bg-canopy-900 hover:bg-canopy-950 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4 text-emerald-300" />
                <span>Add New Plant</span>
              </button>
            </div>
          </div>

          {!dashboard ? (
            <div className="p-16 text-center text-sm text-canopy-700">
              Loading Admin Control Studio...
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-canopy-900/10 shadow-sm">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-canopy-700/70">
                        Total Store Revenue
                      </span>
                      <p className="text-2xl sm:text-3xl font-bold text-canopy-950 mt-1 flex items-center">
                        <IndianRupee className="w-5 h-5" />
                        {dashboard.metrics.totalRevenue.toLocaleString('en-IN')}
                      </p>
                      <span className="text-[11px] text-emerald-700 font-semibold">
                        Razorpay Paid: ₹{dashboard.metrics.razorpayRevenue.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-canopy-900/10 shadow-sm">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-canopy-700/70">
                        Orders Received
                      </span>
                      <p className="text-2xl sm:text-3xl font-bold text-canopy-950 mt-1">
                        {dashboard.metrics.totalOrders}
                      </p>
                      <span className="text-[11px] text-canopy-700/75">
                        {dashboard.metrics.totalCustomers} registered buyers
                      </span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-canopy-900/10 shadow-sm">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-canopy-700/70">
                        Live Plant Catalog
                      </span>
                      <p className="text-2xl sm:text-3xl font-bold text-canopy-950 mt-1">
                        {dashboard.metrics.totalProducts} Plants
                      </p>
                      <span className="text-[11px] text-emerald-700 font-semibold">
                        {dashboard.metrics.totalStock} pots in nursery stock
                      </span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-canopy-900/10 shadow-sm">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-canopy-700/70">
                        Active Promo Offers
                      </span>
                      <p className="text-2xl sm:text-3xl font-bold text-terracotta-600 mt-1">
                        {dashboard.metrics.activeCoupons} Live
                      </p>
                      <span className="text-[11px] text-canopy-700/75">
                        {dashboard.metrics.totalConsultations} botanist bookings
                      </span>
                    </div>
                  </div>

                  {/* Quick Shortcuts Grid */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    <button
                      onClick={() => setActiveTab('products')}
                      className="p-5 rounded-2xl bg-white hover:bg-linen-50 border border-canopy-900/10 text-left transition shadow-sm"
                    >
                      <Sprout className="w-6 h-6 text-canopy-800 mb-2" />
                      <h3 className="font-serif text-xl font-semibold">
                        Upload Plant Photos & Edit Prices
                      </h3>
                      <p className="text-xs text-canopy-700/75 mt-1">
                        Add new plants from computer/mobile, adjust ₹ prices, stock & Deal of the
                        Week.
                      </p>
                    </button>

                    <button
                      onClick={() => setActiveTab('offers')}
                      className="p-5 rounded-2xl bg-white hover:bg-linen-50 border border-canopy-900/10 text-left transition shadow-sm"
                    >
                      <Tag className="w-6 h-6 text-terracotta-600 mb-2" />
                      <h3 className="font-serif text-xl font-semibold">
                        Create Festival Offers & Coupons
                      </h3>
                      <p className="text-xs text-canopy-700/75 mt-1">
                        Launch % or flat ₹ promo codes and pin them directly on the storefront
                        banner.
                      </p>
                    </button>

                    <button
                      onClick={() => setActiveTab('settings')}
                      className="p-5 rounded-2xl bg-white hover:bg-linen-50 border border-canopy-900/10 text-left transition shadow-sm"
                    >
                      <CreditCard className="w-6 h-6 text-blue-700 mb-2" />
                      <h3 className="font-serif text-xl font-semibold">
                        Combo ₹999 Price & Razorpay Keys
                      </h3>
                      <p className="text-xs text-canopy-700/75 mt-1">
                        Customize combo bundle pricing, top announcement bar & Razorpay API keys.
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: PRODUCTS, PHOTOS & INLINE PRICES */}
              {activeTab === 'products' && (
                <div className="space-y-5">
                  {/* Add Category Quick Strip */}
                  <form
                    onSubmit={handleCreateCategory}
                    className="bg-white rounded-2xl p-4 border border-canopy-900/10 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold text-canopy-800 uppercase tracking-wider">
                        Categories:
                      </span>
                      {dashboard.categories.map((c) => (
                        <span
                          key={c.slug}
                          className="px-2.5 py-1 rounded-full bg-linen-100 text-canopy-900 font-medium"
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="+ New Category Name"
                        className="h-9 px-3 rounded-xl bg-linen-50 border border-canopy-900/15 text-xs"
                      />
                      <button
                        type="submit"
                        className="h-9 px-3.5 rounded-xl bg-canopy-900 text-white text-xs font-semibold"
                      >
                        Add Category
                      </button>
                    </div>
                  </form>

                  {/* Products Table with Inline Price/Stock/Badge Editor */}
                  <div className="bg-white rounded-2xl border border-canopy-900/10 shadow-sm overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[780px]">
                      <thead>
                        <tr className="bg-linen-100/70 border-b border-canopy-900/10 text-[11px] font-bold uppercase tracking-wider text-canopy-800">
                          <th className="py-3.5 px-4">Plant & Photo</th>
                          <th className="py-3.5 px-3">Price (₹)</th>
                          <th className="py-3.5 px-3">MRP (₹)</th>
                          <th className="py-3.5 px-3">Stock</th>
                          <th className="py-3.5 px-3">Offer Badge</th>
                          <th className="py-3.5 px-3">Weekly Deal</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-canopy-900/10 text-xs">
                        {dashboard.products.map((prod) => {
                          const edit = inlineEdits[prod.id] || {
                            price: prod.price,
                            originalPrice: prod.originalPrice,
                            stockQty: prod.stockQty,
                            badge: prod.badge || ''
                          };
                          return (
                            <tr key={prod.id} className="hover:bg-linen-50/60">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={prod.imageUrl}
                                    alt={prod.name}
                                    className="w-12 h-12 rounded-xl object-cover bg-linen-100 border border-canopy-900/10 shrink-0"
                                  />
                                  <div>
                                    <p className="font-semibold text-canopy-950 text-[13px]">
                                      {prod.name}
                                    </p>
                                    <p className="text-[11px] text-canopy-700/70">
                                      {prod.categorySlug}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                <input
                                  type="number"
                                  value={edit.price}
                                  onChange={(e) =>
                                    setInlineEdits({
                                      ...inlineEdits,
                                      [prod.id]: { ...edit, price: e.target.value }
                                    })
                                  }
                                  className="w-20 h-8 px-2 rounded-lg border border-canopy-900/20 font-bold text-canopy-950"
                                />
                              </td>
                              <td className="py-3 px-3">
                                <input
                                  type="number"
                                  value={edit.originalPrice}
                                  onChange={(e) =>
                                    setInlineEdits({
                                      ...inlineEdits,
                                      [prod.id]: { ...edit, originalPrice: e.target.value }
                                    })
                                  }
                                  className="w-20 h-8 px-2 rounded-lg border border-canopy-900/15 text-canopy-700"
                                />
                              </td>
                              <td className="py-3 px-3">
                                <input
                                  type="number"
                                  value={edit.stockQty}
                                  onChange={(e) =>
                                    setInlineEdits({
                                      ...inlineEdits,
                                      [prod.id]: { ...edit, stockQty: e.target.value }
                                    })
                                  }
                                  className="w-16 h-8 px-2 rounded-lg border border-canopy-900/15"
                                />
                              </td>
                              <td className="py-3 px-3">
                                <input
                                  type="text"
                                  value={edit.badge}
                                  placeholder="e.g. 25% OFF"
                                  onChange={(e) =>
                                    setInlineEdits({
                                      ...inlineEdits,
                                      [prod.id]: { ...edit, badge: e.target.value }
                                    })
                                  }
                                  className="w-28 h-8 px-2 rounded-lg border border-canopy-900/15"
                                />
                              </td>
                              <td className="py-3 px-3">
                                <button
                                  onClick={() => handleSetFeaturedDeal(prod.id)}
                                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 transition ${
                                    prod.isFeaturedDeal
                                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                      : 'bg-linen-100 text-canopy-700 hover:bg-linen-200'
                                  }`}
                                >
                                  <Star
                                    className={`w-3 h-3 ${
                                      prod.isFeaturedDeal ? 'fill-amber-500 text-amber-500' : ''
                                    }`}
                                  />
                                  <span>{prod.isFeaturedDeal ? 'Active Deal' : 'Set Deal'}</span>
                                </button>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="inline-flex items-center gap-1.5">
                                  <button
                                    onClick={() => handleQuickSaveRow(prod.id)}
                                    title="Save quick price & stock"
                                    className="h-8 px-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold inline-flex items-center gap-1"
                                  >
                                    <Save className="w-3.5 h-3.5" />
                                    <span>Save</span>
                                  </button>
                                  <button
                                    onClick={() => openEditProduct(prod)}
                                    title="Edit photos & full details"
                                    className="h-8 w-8 rounded-lg bg-linen-100 hover:bg-linen-200 flex items-center justify-center text-canopy-900"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                    title="Delete plant"
                                    className="h-8 w-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-600"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: OFFERS & COUPONS */}
              {activeTab === 'offers' && (
                <div className="grid lg:grid-cols-12 gap-6">
                  {/* Create New Offer Form */}
                  <form
                    onSubmit={handleCreateCoupon}
                    className="lg:col-span-5 bg-white rounded-2xl p-6 border border-canopy-900/10 shadow-sm space-y-4 self-start"
                  >
                    <h3 className="font-serif text-2xl font-semibold">Create New Promo Offer</h3>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-canopy-800 mb-1">
                          Promo Code *
                        </label>
                        <input
                          required
                          value={couponForm.code}
                          onChange={(e) =>
                            setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })
                          }
                          placeholder="DIWALI20"
                          className="w-full h-10 px-3 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm font-mono uppercase font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-canopy-800 mb-1">
                          Discount Type
                        </label>
                        <select
                          value={couponForm.type}
                          onChange={(e) => setCouponForm({ ...couponForm, type: e.target.value })}
                          className="w-full h-10 px-3 rounded-xl bg-linen-50 border border-canopy-900/15 text-xs font-semibold"
                        >
                          <option value="percent">Percentage (% OFF)</option>
                          <option value="flat">Flat Rupees (₹ OFF)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-canopy-800 mb-1">
                          {couponForm.type === 'percent' ? 'Discount % *' : 'Flat ₹ Amount *'}
                        </label>
                        <input
                          type="number"
                          required
                          min={1}
                          value={couponForm.value}
                          onChange={(e) => setCouponForm({ ...couponForm, value: e.target.value })}
                          className="w-full h-10 px-3 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-canopy-800 mb-1">
                          Min Cart Value (₹)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={couponForm.minSubtotal}
                          onChange={(e) =>
                            setCouponForm({ ...couponForm, minSubtotal: e.target.value })
                          }
                          className="w-full h-10 px-3 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-canopy-800 mb-1">
                        Offer Title / Badge
                      </label>
                      <input
                        value={couponForm.label}
                        onChange={(e) => setCouponForm({ ...couponForm, label: e.target.value })}
                        placeholder="e.g. Festive 20% OFF Sanctuary Sale"
                        className="w-full h-10 px-3.5 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm"
                      />
                    </div>

                    <label className="flex items-center gap-2 text-xs font-semibold text-canopy-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={couponForm.showInBanner}
                        onChange={(e) =>
                          setCouponForm({ ...couponForm, showInBanner: e.target.checked })
                        }
                        className="rounded"
                      />
                      <span>Highlight this offer on Homepage Live Offer Strip & Bag</span>
                    </label>

                    <button
                      type="submit"
                      className="w-full h-11 rounded-full bg-canopy-900 hover:bg-canopy-950 text-white text-xs font-semibold shadow-sm"
                    >
                      Publish Offer Live
                    </button>
                  </form>

                  {/* Existing Offers List */}
                  <div className="lg:col-span-7 space-y-3">
                    {dashboard.coupons.map((c) => (
                      <div
                        key={c.id}
                        className="bg-white rounded-2xl p-4 sm:p-5 border border-canopy-900/10 flex flex-wrap items-center justify-between gap-4 shadow-sm"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-lg bg-canopy-950 text-emerald-300 font-mono text-xs font-bold">
                              {c.code}
                            </span>
                            <span className="font-semibold text-sm text-canopy-950">{c.label}</span>
                          </div>
                          <p className="text-xs text-canopy-700/75 mt-1">
                            {c.type === 'percent' ? `${c.value}% OFF` : `Flat ₹${c.value} OFF`} •
                            Min Cart ₹{c.minSubtotal}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleCoupon(c, 'showInBanner')}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border ${
                              c.showInBanner
                                ? 'bg-amber-50 text-amber-900 border-amber-300'
                                : 'bg-linen-50 text-canopy-700 border-canopy-900/10'
                            }`}
                          >
                            {c.showInBanner ? '★ On Homepage' : 'Pin to Home'}
                          </button>

                          <button
                            onClick={() => handleToggleCoupon(c, 'isActive')}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold ${
                              c.isActive
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {c.isActive ? 'Active' : 'Paused'}
                          </button>

                          <button
                            onClick={() => handleDeleteCoupon(c.id)}
                            className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SANCTUARY GALLERY PHOTOS UPLOAD */}
              {activeTab === 'gallery' && (
                <div className="grid lg:grid-cols-12 gap-6">
                  <form
                    onSubmit={handleAddGalleryPhoto}
                    className="lg:col-span-5 bg-white rounded-2xl p-6 border border-canopy-900/10 shadow-sm space-y-4 self-start"
                  >
                    <h3 className="font-serif text-2xl font-semibold">
                      Upload New Storefront Photo
                    </h3>
                    <p className="text-xs text-canopy-700/75">
                      Upload customer home setups, nursery arrivals, or festive hampers directly
                      into the homepage Sanctuary Gallery.
                    </p>

                    <label className="block border-2 border-dashed border-canopy-900/20 hover:border-canopy-800 rounded-2xl p-5 text-center cursor-pointer bg-linen-50 transition">
                      <Upload className="w-6 h-6 text-canopy-700 mx-auto mb-1.5" />
                      <span className="text-xs font-semibold text-canopy-950 block">
                        {uploadingPhoto
                          ? 'Uploading photo...'
                          : 'Click to Select Photo from Computer / Phone'}
                      </span>
                      <span className="text-[11px] text-canopy-700/65">
                        JPG, PNG or WEBP up to 8 MB
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(e.target.files?.[0], (url) =>
                            setGalleryForm((prev) => ({ ...prev, imageUrl: url }))
                          )
                        }
                      />
                    </label>

                    {galleryForm.imageUrl && (
                      <div className="rounded-xl overflow-hidden border border-canopy-900/10 aspect-video bg-linen-100">
                        <img
                          src={galleryForm.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-canopy-800 mb-1">
                        Or Paste Photo URL
                      </label>
                      <input
                        value={galleryForm.imageUrl}
                        onChange={(e) =>
                          setGalleryForm({ ...galleryForm, imageUrl: e.target.value })
                        }
                        placeholder="/uploads/... or https://..."
                        className="w-full h-10 px-3 rounded-xl bg-linen-50 border border-canopy-900/15 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-canopy-800 mb-1">
                        Photo Caption
                      </label>
                      <input
                        value={galleryForm.caption}
                        onChange={(e) =>
                          setGalleryForm({ ...galleryForm, caption: e.target.value })
                        }
                        placeholder="e.g. Baner Client Balcony Setup • 6 Self-Watering Pots"
                        className="w-full h-10 px-3 rounded-xl bg-linen-50 border border-canopy-900/15 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-canopy-800 mb-1">
                        Grid Tile Size
                      </label>
                      <select
                        value={galleryForm.spanClass}
                        onChange={(e) =>
                          setGalleryForm({ ...galleryForm, spanClass: e.target.value })
                        }
                        className="w-full h-10 px-3 rounded-xl bg-linen-50 border border-canopy-900/15 text-xs font-semibold"
                      >
                        <option value="">Standard Square Tile</option>
                        <option value="lg:col-span-2">Wide Panorama Tile (2 Columns)</option>
                        <option value="lg:col-span-2 lg:row-span-2">
                          Hero Feature Tile (2×2 Large)
                        </option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full h-11 rounded-full bg-canopy-900 hover:bg-canopy-950 text-white text-xs font-semibold"
                    >
                      Add Photo to Homepage Gallery
                    </button>
                  </form>

                  <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4 self-start">
                    {dashboard.galleryPhotos.map((g) => (
                      <div
                        key={g.id}
                        className="bg-white rounded-2xl overflow-hidden border border-canopy-900/10 shadow-sm group relative"
                      >
                        <img
                          src={g.imageUrl}
                          alt={g.caption}
                          className="w-full h-44 object-cover"
                        />
                        <button
                          onClick={async () => {
                            await api.admin.deleteGalleryPhoto(g.id);
                            await syncAll('Gallery photo removed');
                          }}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="p-3.5 text-xs font-medium text-canopy-900">{g.caption}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: ORDERS, PAYMENTS & CONSULTATIONS */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-canopy-900/10 shadow-sm overflow-hidden">
                    <div className="px-5 py-3.5 bg-linen-100/70 border-b border-canopy-900/10 text-xs font-bold uppercase tracking-wider text-canopy-800">
                      Customer Orders & Razorpay Payment Status ({dashboard.orders.length})
                    </div>
                    <div className="divide-y divide-canopy-900/10">
                      {dashboard.orders.map((o) => (
                        <div
                          key={o.id}
                          className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
                        >
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono font-bold text-sm text-canopy-950">
                                {o.orderNumber}
                              </span>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                                  o.paymentStatus === 'PAID'
                                    ? 'bg-emerald-100 text-emerald-900'
                                    : 'bg-amber-100 text-amber-900'
                                }`}
                              >
                                {o.paymentStatus === 'PAID'
                                  ? `✓ PAID • ${o.paymentMethod}`
                                  : `PENDING • ${o.paymentMethod}`}
                              </span>
                              {o.razorpayPaymentId && (
                                <span className="font-mono text-[11px] text-slate-500">
                                  ID: {o.razorpayPaymentId}
                                </span>
                              )}
                            </div>

                            <p className="text-canopy-900 font-semibold">
                              {o.customerName} ({o.customerPhone}) — {o.shippingAddress}, {o.city} -{' '}
                              {o.pincode}
                            </p>

                            <p className="text-canopy-700">
                              {o.items
                                .map(
                                  (i) =>
                                    `${i.quantity}× ${i.productName} [${i.potColor}]${
                                      i.bundleItems ? ` (${i.bundleItems.join(', ')})` : ''
                                    }`
                                )
                                .join(' • ')}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 shrink-0">
                            <span className="text-base font-bold text-canopy-950">
                              ₹{o.totalAmount}
                            </span>

                            <select
                              value={o.status}
                              onChange={async (e) => {
                                await api.admin.updateOrderStatus(o.id, {
                                  status: e.target.value
                                });
                                await fetchDashboard();
                                onNotify(`Order ${o.orderNumber} marked ${e.target.value}`);
                              }}
                              className="h-9 px-3 rounded-xl bg-linen-50 border border-canopy-900/15 text-xs font-bold"
                            >
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="PACKED">PACKED</option>
                              <option value="DISPATCHED">DISPATCHED</option>
                              <option value="DELIVERED">DELIVERED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Consultations */}
                  <div className="bg-white rounded-2xl border border-canopy-900/10 shadow-sm overflow-hidden">
                    <div className="px-5 py-3.5 bg-linen-100/70 border-b border-canopy-900/10 text-xs font-bold uppercase tracking-wider text-canopy-800">
                      Botanist Consultation Requests ({dashboard.consultations.length})
                    </div>
                    <div className="divide-y divide-canopy-900/10">
                      {dashboard.consultations.map((c) => (
                        <div
                          key={c.id}
                          className="p-4 flex flex-wrap items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <strong className="text-canopy-950">{c.name}</strong> ({c.phone}) •{' '}
                            <span className="text-canopy-700">
                              {c.spaceType} | {c.lightCondition} | {c.preferredSlot}
                            </span>
                            {c.message && (
                              <p className="text-canopy-700/75 mt-0.5">“{c.message}”</p>
                            )}
                          </div>
                          <button
                            onClick={async () => {
                              const next = c.status === 'COMPLETED' ? 'SCHEDULED' : 'COMPLETED';
                              await api.admin.updateConsultationStatus(c.id, next);
                              await fetchDashboard();
                            }}
                            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] ${
                              c.status === 'COMPLETED'
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {c.status}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: STORE BANNERS, COMBO PRICE & RAZORPAY SETTINGS */}
              {activeTab === 'settings' && settingsForm && (
                <form
                  onSubmit={handleSaveSettings}
                  className="grid lg:grid-cols-12 gap-6 items-start"
                >
                  {/* Storefront Offer & Pricing Controls */}
                  <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-canopy-900/10 shadow-sm space-y-4">
                    <h3 className="font-serif text-2xl font-semibold">
                      Storefront Banners, Combo Offer & Shipping
                    </h3>

                    <div>
                      <label className="block text-xs font-semibold text-canopy-800 mb-1">
                        Top Announcement Offer Bar Text
                      </label>
                      <input
                        value={settingsForm.announcementText || ''}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, announcementText: e.target.value })
                        }
                        className="w-full h-10 px-3.5 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-canopy-800 mb-1">
                          Combo Box Offer Price (₹)
                        </label>
                        <input
                          type="number"
                          value={settingsForm.comboBundlePrice ?? 999}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              comboBundlePrice: Number(e.target.value)
                            })
                          }
                          className="w-full h-10 px-3.5 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-canopy-800 mb-1">
                          Plants in Combo Box
                        </label>
                        <input
                          type="number"
                          min={2}
                          max={8}
                          value={settingsForm.comboBundleSize ?? 4}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              comboBundleSize: Number(e.target.value)
                            })
                          }
                          className="w-full h-10 px-3.5 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-canopy-800 mb-1">
                          Free Shipping Above (₹)
                        </label>
                        <input
                          type="number"
                          value={settingsForm.freeShippingThreshold ?? 499}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              freeShippingThreshold: Number(e.target.value)
                            })
                          }
                          className="w-full h-10 px-3.5 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-canopy-800 mb-1">
                          Standard Delivery Fee (₹)
                        </label>
                        <input
                          type="number"
                          value={settingsForm.standardShippingFee ?? 69}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              standardShippingFee: Number(e.target.value)
                            })
                          }
                          className="w-full h-10 px-3.5 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-canopy-800 mb-1">
                          Helpline Phone
                        </label>
                        <input
                          value={settingsForm.phone || ''}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, phone: e.target.value })
                          }
                          className="w-full h-10 px-3.5 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-canopy-800 mb-1">
                          WhatsApp Number (digits with 91)
                        </label>
                        <input
                          value={settingsForm.whatsappNumber || ''}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })
                          }
                          className="w-full h-10 px-3.5 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Razorpay Payment Gateway Setup */}
                  <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-canopy-900/10 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-2xl font-semibold">Razorpay Payment Setup</h3>
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 text-[11px] font-bold">
                        {settingsForm.razorpayKeyId ? 'Live Keys Set' : 'Sandbox Active'}
                      </span>
                    </div>

                    <p className="text-xs text-canopy-700/75 leading-relaxed">
                      Out-of-the-box, Greenzo runs an interactive Razorpay Secure Checkout Sandbox
                      for instant testing. Paste your live or test{' '}
                      <code className="font-mono">rzp_...</code> keys anytime to route real
                      settlements!
                    </p>

                    <label className="flex items-center justify-between p-3 rounded-xl bg-linen-50 border border-canopy-900/10 text-xs font-semibold cursor-pointer">
                      <span>Enable Razorpay Online Checkout (UPI / Cards)</span>
                      <input
                        type="checkbox"
                        checked={Boolean(settingsForm.razorpayEnabled)}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, razorpayEnabled: e.target.checked })
                        }
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-xl bg-linen-50 border border-canopy-900/10 text-xs font-semibold cursor-pointer">
                      <span>Allow Cash on Delivery (COD)</span>
                      <input
                        type="checkbox"
                        checked={Boolean(settingsForm.codEnabled)}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, codEnabled: e.target.checked })
                        }
                      />
                    </label>

                    <div>
                      <label className="block text-xs font-semibold text-canopy-800 mb-1">
                        Razorpay Key ID (Optional for Sandbox)
                      </label>
                      <input
                        value={settingsForm.razorpayKeyId || ''}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, razorpayKeyId: e.target.value })
                        }
                        placeholder="rzp_test_... or rzp_live_..."
                        className="w-full h-10 px-3.5 rounded-xl bg-linen-50 border border-canopy-900/15 text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-canopy-800 mb-1">
                        Razorpay Key Secret
                      </label>
                      <input
                        type="password"
                        value={settingsForm.razorpayKeySecret || ''}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, razorpayKeySecret: e.target.value })
                        }
                        placeholder="Enter secret key"
                        className="w-full h-10 px-3.5 rounded-xl bg-linen-50 border border-canopy-900/15 text-xs font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={savingSettings}
                      className="w-full h-12 rounded-full bg-canopy-900 hover:bg-canopy-950 text-white text-sm font-semibold shadow-md transition"
                    >
                      {savingSettings ? 'Saving Configuration...' : 'Save All Store & Payment Settings'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add / Edit Plant Modal with Direct Photo Upload */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          <div
            onClick={() => setProductModalOpen(false)}
            className="absolute inset-0 bg-canopy-950/70 backdrop-blur-sm"
          />
          <form
            onSubmit={handleSaveProductModal}
            className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-elevated overflow-hidden flex flex-col"
          >
            <div className="px-6 py-4 bg-canopy-950 text-white flex items-center justify-between">
              <h3 className="font-serif text-2xl font-medium">
                {editingProductId ? 'Edit Plant, Photos & Pricing' : 'Add New Plant to Storefront'}
              </h3>
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Photo Upload Section */}
              <div className="grid sm:grid-cols-12 gap-4 items-center p-4 rounded-2xl bg-linen-50 border border-canopy-900/10">
                <div className="sm:col-span-4">
                  <img
                    src={productForm.imageUrl}
                    alt="Plant preview"
                    className="w-full aspect-square rounded-xl object-cover bg-white border border-canopy-900/10"
                  />
                </div>
                <div className="sm:col-span-8 space-y-2.5">
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-canopy-900 hover:bg-canopy-950 text-white font-semibold cursor-pointer transition">
                    <Upload className="w-4 h-4 text-emerald-300" />
                    <span>
                      {uploadingPhoto ? 'Uploading...' : 'Upload Plant Photo from Device'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e.target.files?.[0], (url) =>
                          setProductForm((prev) => ({
                            ...prev,
                            imageUrl: url,
                            gallery: [url, ...(prev.gallery || [])]
                          }))
                        )
                      }
                    />
                  </label>

                  <div>
                    <label className="block text-[11px] font-semibold text-canopy-700 mb-1">
                      Or Image URL / Studio Preset
                    </label>
                    <input
                      value={productForm.imageUrl}
                      onChange={(e) =>
                        setProductForm({ ...productForm, imageUrl: e.target.value })
                      }
                      className="w-full h-9 px-3 rounded-lg bg-white border border-canopy-900/15"
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-canopy-800 mb-1">Plant Name *</label>
                  <input
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Jade Mini Bonsai"
                    className="w-full h-10 px-3 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-canopy-800 mb-1">
                    Botanical / Subtitle
                  </label>
                  <input
                    value={productForm.botanicalName}
                    onChange={(e) =>
                      setProductForm({ ...productForm, botanicalName: e.target.value })
                    }
                    placeholder="Crassula ovata"
                    className="w-full h-10 px-3 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-canopy-800 mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        price: Number(e.target.value),
                        maxPrice: Number(e.target.value) + 50
                      })
                    }
                    className="w-full h-10 px-3 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-canopy-800 mb-1">
                    Large Pot (₹)
                  </label>
                  <input
                    type="number"
                    value={productForm.maxPrice}
                    onChange={(e) =>
                      setProductForm({ ...productForm, maxPrice: Number(e.target.value) })
                    }
                    className="w-full h-10 px-3 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-canopy-800 mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) =>
                      setProductForm({ ...productForm, originalPrice: Number(e.target.value) })
                    }
                    className="w-full h-10 px-3 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-canopy-800 mb-1">Stock Qty</label>
                  <input
                    type="number"
                    value={productForm.stockQty}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stockQty: Number(e.target.value) })
                    }
                    className="w-full h-10 px-3 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-canopy-800 mb-1">Category</label>
                  <select
                    value={productForm.categorySlug}
                    onChange={(e) =>
                      setProductForm({ ...productForm, categorySlug: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-xl bg-linen-50 border border-canopy-900/15 font-semibold"
                  >
                    {(dashboard?.categories || []).map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-canopy-800 mb-1">Offer Badge</label>
                  <input
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    placeholder="Bestseller / 20% OFF"
                    className="w-full h-10 px-3 rounded-xl bg-linen-50 border border-canopy-900/15"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-canopy-800 mb-1">Light Need</label>
                  <select
                    value={productForm.lightLevel}
                    onChange={(e) =>
                      setProductForm({ ...productForm, lightLevel: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-xl bg-linen-50 border border-canopy-900/15"
                  >
                    <option>Low to Bright Indirect</option>
                    <option>Low Light to Medium Indirect</option>
                    <option>Medium Indirect Light</option>
                    <option>Bright Indirect Light</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-canopy-800 mb-1">
                  Short Card Description
                </label>
                <input
                  value={productForm.shortDescription}
                  onChange={(e) =>
                    setProductForm({ ...productForm, shortDescription: e.target.value })
                  }
                  placeholder="Glossy air-purifying foliage in a 14-day self-watering pot."
                  className="w-full h-10 px-3 rounded-xl bg-linen-50 border border-canopy-900/15"
                />
              </div>

              <div>
                <label className="block font-semibold text-canopy-800 mb-1">
                  Detailed Plant Story & Care Notes
                </label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({ ...productForm, description: e.target.value })
                  }
                  className="w-full p-3 rounded-xl bg-linen-50 border border-canopy-900/15"
                />
              </div>

              <div className="flex flex-wrap gap-5 pt-1">
                <label className="flex items-center gap-2 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.bundleEligible}
                    onChange={(e) =>
                      setProductForm({ ...productForm, bundleEligible: e.target.checked })
                    }
                  />
                  <span>Include in Combo Box Builder</span>
                </label>
                <label className="flex items-center gap-2 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.petFriendly}
                    onChange={(e) =>
                      setProductForm({ ...productForm, petFriendly: e.target.checked })
                    }
                  />
                  <span>Pet Safe Plant</span>
                </label>
                <label className="flex items-center gap-2 font-semibold text-amber-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isFeaturedDeal}
                    onChange={(e) =>
                      setProductForm({ ...productForm, isFeaturedDeal: e.target.checked })
                    }
                  />
                  <span>★ Feature as Deal of the Week</span>
                </label>
              </div>
            </div>

            <div className="px-6 py-4 bg-linen-50 border-t border-canopy-900/10 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="px-5 h-10 rounded-full border border-canopy-900/15 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 h-10 rounded-full bg-canopy-900 hover:bg-canopy-950 text-white text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 text-emerald-300" />
                <span>{editingProductId ? 'Save Changes' : 'Publish Plant Live'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
