import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  ShieldCheck,
  Sparkles,
  LogOut,
  Package,
  CreditCard,
  Crown
} from 'lucide-react';
import { api, setStoredToken } from '../lib/api.js';

export default function AuthView({
  currentUser,
  onAuthSuccess,
  onLogout,
  onBackToStore,
  onOpenAdminPanel,
  onNotify
}) {
  const [tab, setTab] = useState('login'); // login | register
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [myOrders, setMyOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    defaultAddress: '',
    defaultCity: 'Pune',
    defaultPincode: '411001'
  });

  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    defaultAddress: currentUser?.defaultAddress || '',
    defaultCity: currentUser?.defaultCity || 'Pune',
    defaultPincode: currentUser?.defaultPincode || '411001'
  });

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        defaultAddress: currentUser.defaultAddress || '',
        defaultCity: currentUser.defaultCity || 'Pune',
        defaultPincode: currentUser.defaultPincode || '411001'
      });
      setOrdersLoading(true);
      api
        .getMe()
        .then((res) => setMyOrders(res.orders || []))
        .catch(() => {})
        .finally(() => setOrdersLoading(false));
    }
  }, [currentUser]);

  const executeLogin = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.login(email, password);
      setStoredToken(res.token);
      onAuthSuccess(res.user);
      onNotify(`Welcome back, ${res.user.name}! 🌿`);
      if (res.user.role === 'ADMIN') {
        onOpenAdminPanel();
      }
    } catch (err) {
      onNotify(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    executeLogin(loginForm.email, loginForm.password);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.register(regForm);
      setStoredToken(res.token);
      onAuthSuccess(res.user);
      onNotify(`Account created! Welcome to Greenzo, ${res.user.name} 🌿`);
    } catch (err) {
      onNotify(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.updateProfile(profileForm);
      onAuthSuccess(res.user);
      onNotify('Saved delivery profile updated!');
    } catch (err) {
      onNotify(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Logged-In Customer / Admin Profile View
  if (currentUser) {
    return (
      <div className="min-h-screen bg-linen-50 py-8 px-4 lg:px-8">
        <div className="max-w-[1120px] mx-auto space-y-6">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={onBackToStore}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-canopy-900/15 text-xs font-semibold text-canopy-950 hover:bg-linen-100 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Greenzo Storefront</span>
            </button>

            <div className="flex items-center gap-3">
              {currentUser.role === 'ADMIN' && (
                <button
                  onClick={onOpenAdminPanel}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-canopy-900 text-white text-xs font-semibold shadow-sm hover:bg-canopy-950 transition"
                >
                  <Crown className="w-4 h-4 text-emerald-300" />
                  <span>Open Full Admin Control Panel</span>
                </button>
              )}
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-semibold hover:bg-red-100 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Account Hero Card */}
          <div className="rounded-3xl bg-canopy-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-elevated">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-400/20 border border-emerald-300/30 flex items-center justify-center font-serif text-2xl font-bold text-emerald-200">
                {currentUser.name?.[0]?.toUpperCase() || 'G'}
              </div>
              <div>
                <div className="inline-flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-widest text-emerald-300 font-bold">
                    {currentUser.role === 'ADMIN' ? 'Store Administrator' : 'Greenzo Member'}
                  </span>
                </div>
                <h1 className="font-serif text-3xl font-semibold mt-0.5">{currentUser.name}</h1>
                <p className="text-xs text-linen-200/80">{currentUser.email}</p>
              </div>
            </div>
            <div className="text-left sm:text-right text-xs text-emerald-200">
              <p className="font-semibold text-white text-lg">{myOrders.length} Orders</p>
              <p>7-Day Healthy Plant Protection Active</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            {/* Saved Address Profile */}
            <form
              onSubmit={handleSaveProfile}
              className="lg:col-span-5 bg-white rounded-3xl p-6 border border-canopy-900/10 shadow-soft space-y-4 self-start"
            >
              <h2 className="font-serif text-2xl font-semibold text-canopy-950">
                Saved Express Checkout Details
              </h2>
              <div>
                <label className="block text-xs font-semibold text-canopy-800 mb-1">Full Name</label>
                <input
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-canopy-800 mb-1">
                  WhatsApp / Phone
                </label>
                <input
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-canopy-800 mb-1">
                  Default Delivery Address
                </label>
                <textarea
                  rows={2}
                  value={profileForm.defaultAddress}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, defaultAddress: e.target.value })
                  }
                  placeholder="Flat, Society, Road..."
                  className="w-full p-3 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-canopy-800 mb-1">City</label>
                  <input
                    value={profileForm.defaultCity}
                    onChange={(e) => setProfileForm({ ...profileForm, defaultCity: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-canopy-800 mb-1">
                    Pincode
                  </label>
                  <input
                    value={profileForm.defaultPincode}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, defaultPincode: e.target.value })
                    }
                    className="w-full h-10 px-3.5 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-full bg-canopy-900 hover:bg-canopy-950 text-white text-xs font-semibold transition"
              >
                {loading ? 'Saving...' : 'Save Delivery Profile'}
              </button>
            </form>

            {/* My Orders List */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-canopy-900/10 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-semibold text-canopy-950 flex items-center gap-2">
                  <Package className="w-5 h-5 text-canopy-700" />
                  <span>My Plant Orders</span>
                </h2>
              </div>

              {ordersLoading ? (
                <p className="text-xs text-canopy-700 py-8 text-center">Loading your orders...</p>
              ) : myOrders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <p className="text-sm text-canopy-800/75">
                    You haven’t placed an order under this account yet.
                  </p>
                  <button
                    onClick={onBackToStore}
                    className="px-5 py-2.5 rounded-full bg-canopy-900 text-white text-xs font-semibold"
                  >
                    Explore Self-Watering Plants
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {myOrders.map((o) => (
                    <div
                      key={o.id}
                      className="rounded-2xl bg-linen-50 border border-canopy-900/10 p-4 space-y-2.5 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-canopy-950">
                            {o.orderNumber}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                              o.paymentStatus === 'PAID'
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {o.paymentStatus === 'PAID' ? '✓ RAZORPAY PAID' : 'COD PENDING'}
                          </span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-canopy-900 text-white text-[10.5px] font-semibold">
                          {o.status}
                        </span>
                      </div>

                      <div className="space-y-1 text-canopy-800">
                        {(o.items || []).map((it) => (
                          <div key={it.id} className="flex justify-between">
                            <span>
                              {it.quantity}× {it.productName} ({it.potColor})
                            </span>
                            <span className="font-semibold">₹{it.unitPrice * it.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-canopy-900/10 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] text-canopy-700/75 flex items-center gap-1">
                          <CreditCard className="w-3.5 h-3.5" />
                          {o.razorpayPaymentId
                            ? `Razorpay ID: ${o.razorpayPaymentId}`
                            : o.paymentMethod}
                        </span>
                        <span className="text-sm font-bold text-canopy-950">
                          Total ₹{o.totalAmount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Aesthetic Split-Screen Login / Register Page
  return (
    <div className="min-h-screen bg-linen-50 flex flex-col lg:flex-row">
      {/* Left Botanical Visual & Quick Demo Access */}
      <div className="lg:w-[50%] relative bg-canopy-950 text-white p-6 sm:p-10 lg:p-14 flex flex-col justify-between overflow-hidden min-h-[340px]">
        <img
          src="/images/hero-1.jpg"
          alt="GreenzoPune Sanctuary"
          className="absolute inset-0 w-full h-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-canopy-950 via-canopy-950/65 to-canopy-950/40" />

        <div className="relative z-10 flex items-center justify-between">
          <button
            onClick={onBackToStore}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/12 hover:bg-white/20 backdrop-blur-md border border-white/15 text-xs font-semibold text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Storefront</span>
          </button>

          <span className="font-serif text-2xl font-bold tracking-tight">
            greenzo<span className="text-emerald-300">.in</span>
          </span>
        </div>

        <div className="relative z-10 my-8 space-y-4 max-w-lg">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-[11px] font-semibold uppercase tracking-widest text-emerald-200">
            <Sparkles className="w-3.5 h-3.5" /> Pune Botanical Studio
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium leading-tight">
            Welcome to Your Living Plant Sanctuary
          </h1>
          <p className="text-sm text-linen-100/80 leading-relaxed">
            Sign in to track your self-watering plant deliveries, enjoy 1-click Razorpay express
            checkout, or manage products, prices & festival offers in the Admin Studio.
          </p>
        </div>

        {/* One-Click Demo Login Cards for Client & Testing */}
        <div className="relative z-10 space-y-2.5">
          <p className="text-[11px] uppercase tracking-wider font-bold text-emerald-300">
            Instant 1-Click Demo Login (For Quick Preview)
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={() => executeLogin('admin@greenzo.in', 'Admin@123')}
              className="p-3.5 rounded-2xl bg-white/95 hover:bg-white text-canopy-950 text-left shadow-lg transition group"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-canopy-900">
                  <Crown className="w-4 h-4 text-terracotta-600" /> Admin Panel Login
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-canopy-900 text-white font-semibold">
                  1-Click
                </span>
              </div>
              <p className="text-[11px] text-canopy-700 mt-1 font-mono">
                admin@greenzo.in • Admin@123
              </p>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => executeLogin('rahul@greenzo.in', 'Customer@123')}
              className="p-3.5 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white text-left transition"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold">
                  <User className="w-4 h-4 text-emerald-300" /> Customer Login
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/20 font-semibold">
                  1-Click
                </span>
              </div>
              <p className="text-[11px] text-linen-200/80 mt-1 font-mono">
                rahul@greenzo.in • Customer@123
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="lg:w-[50%] flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-md space-y-6">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-linen-200/70">
            <button
              type="button"
              onClick={() => setTab('login')}
              className={`py-2.5 rounded-xl text-xs font-bold transition ${
                tab === 'login'
                  ? 'bg-white text-canopy-950 shadow-sm'
                  : 'text-canopy-800/70 hover:text-canopy-950'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setTab('register')}
              className={`py-2.5 rounded-xl text-xs font-bold transition ${
                tab === 'register'
                  ? 'bg-white text-canopy-950 shadow-sm'
                  : 'text-canopy-800/70 hover:text-canopy-950'
              }`}
            >
              Create Account
            </button>
          </div>

          {tab === 'login' ? (
            <form
              onSubmit={handleLoginSubmit}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-canopy-900/10 shadow-soft space-y-4"
            >
              <div>
                <h2 className="font-serif text-3xl font-semibold text-canopy-950">Sign In</h2>
                <p className="text-xs text-canopy-700/75 mt-1">
                  Enter your Greenzo Customer or Admin credentials below.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-canopy-800 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-canopy-700/50 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    placeholder="admin@greenzo.in"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm focus:outline-none focus:border-canopy-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-canopy-800 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-canopy-700/50 absolute left-3.5 top-3.5" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full h-11 pl-10 pr-10 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm focus:outline-none focus:border-canopy-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-3 text-canopy-700/60 hover:text-canopy-950"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-full bg-canopy-900 hover:bg-canopy-950 text-white text-sm font-semibold shadow-md transition active:scale-[0.99]"
              >
                {loading ? 'Signing In...' : 'Sign In to Greenzo'}
              </button>

              <p className="text-[11.5px] text-center text-canopy-700/75 flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Protected with encrypted session authentication
              </p>
            </form>
          ) : (
            <form
              onSubmit={handleRegisterSubmit}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-canopy-900/10 shadow-soft space-y-3.5"
            >
              <div>
                <h2 className="font-serif text-3xl font-semibold text-canopy-950">
                  Join Greenzo Club
                </h2>
                <p className="text-xs text-canopy-700/75 mt-1">
                  Create your account for faster checkout & live order tracking.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-canopy-800 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-canopy-700/50 absolute left-3.5 top-3" />
                  <input
                    required
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    placeholder="Sneha Deshmukh"
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-canopy-800 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    placeholder="sneha@email.com"
                    className="w-full h-10 px-3.5 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-canopy-800 mb-1">
                    WhatsApp / Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-canopy-700/50 absolute left-3 top-3.5" />
                    <input
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      placeholder="+91 98..."
                      className="w-full h-10 pl-8 pr-3 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-canopy-800 mb-1">
                  Password (min 6 chars) *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                  placeholder="Create password"
                  className="w-full h-10 px-3.5 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-canopy-800 mb-1">City</label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-canopy-700/50 absolute left-3 top-3.5" />
                    <input
                      value={regForm.defaultCity}
                      onChange={(e) => setRegForm({ ...regForm, defaultCity: e.target.value })}
                      className="w-full h-10 pl-8 pr-3 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-canopy-800 mb-1">
                    Pincode
                  </label>
                  <input
                    value={regForm.defaultPincode}
                    onChange={(e) => setRegForm({ ...regForm, defaultPincode: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-full bg-canopy-900 hover:bg-canopy-950 text-white text-sm font-semibold shadow-md transition"
              >
                {loading ? 'Creating Account...' : 'Create My Greenzo Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
