import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Eye, EyeOff, Lock, Mail, User, Phone, MapPin, ShieldCheck, Sparkles,
  LogOut, Package, CreditCard, Crown, Leaf, ArrowRight, CheckCircle2
} from 'lucide-react';
import { api, setStoredToken } from '../lib/api.js';

const FIELD =
  'w-full rounded-xl border border-canopy-950/10 bg-linen-50 text-[13px] text-canopy-950 placeholder:text-stone-400 transition focus:border-canopy-950/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brass-500/10';
const LABEL = 'mb-1.5 block text-[10px] font-extrabold uppercase tracking-[0.14em] text-stone-500';

export default function AuthView({ currentUser, onAuthSuccess, onLogout, onBackToStore, onOpenAdminPanel, onNotify }) {
  const [tab, setTab] = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [myOrders, setMyOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({ name: '', email: '', phone: '', password: '', defaultAddress: '', defaultCity: 'Pune', defaultPincode: '411001' });
  const [profileForm, setProfileForm] = useState({ name: currentUser?.name || '', phone: currentUser?.phone || '', defaultAddress: currentUser?.defaultAddress || '', defaultCity: currentUser?.defaultCity || 'Pune', defaultPincode: currentUser?.defaultPincode || '411001' });

  useEffect(() => {
    if (currentUser) {
      setProfileForm({ name: currentUser.name || '', phone: currentUser.phone || '', defaultAddress: currentUser.defaultAddress || '', defaultCity: currentUser.defaultCity || 'Pune', defaultPincode: currentUser.defaultPincode || '411001' });
      setOrdersLoading(true);
      api.getMe().then((res) => setMyOrders(res.orders || [])).catch(() => {}).finally(() => setOrdersLoading(false));
    }
  }, [currentUser]);

  const executeLogin = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.login(email, password);
      setStoredToken(res.token);
      onAuthSuccess(res.user);
      onNotify(`Welcome, ${res.user.name}`);
      if (res.user.role === 'ADMIN') onOpenAdminPanel();
    } catch (err) { onNotify(err.message); } finally { setLoading(false); }
  };
  const handleLoginSubmit = (e) => { e.preventDefault(); executeLogin(loginForm.email, loginForm.password); };
  const handleRegisterSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await api.register(regForm);
      setStoredToken(res.token);
      onAuthSuccess(res.user);
      onNotify(`Welcome to Greenzo, ${res.user.name}`);
    } catch (err) { onNotify(err.message); } finally { setLoading(false); }
  };
  const handleSaveProfile = async (e) => {
    e.preventDefault(); setLoading(true);
    try { const res = await api.updateProfile(profileForm); onAuthSuccess(res.user); onNotify('Delivery profile saved'); }
    catch (err) { onNotify(err.message); } finally { setLoading(false); }
  };

  /* ————————— Signed in ————————— */
  if (currentUser) {
    return (
      <div className="min-h-screen bg-linen-100/60 px-5 py-8 lg:px-8">
        <div className="mx-auto max-w-[1120px] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button onClick={onBackToStore} className="btn btn-outline btn-sm">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to atelier
            </button>
            <div className="flex items-center gap-2">
              {currentUser.role === 'ADMIN' && (
                <button onClick={onOpenAdminPanel} className="btn btn-dark btn-sm">
                  <Crown className="h-3.5 w-3.5 text-brass-300" /> Open studio
                </button>
              )}
              <button onClick={onLogout} className="btn btn-outline btn-sm">
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </div>
          </div>

          {/* Profile hero */}
          <div className="relative overflow-hidden rounded-[26px] bg-canopy-950 p-6 text-linen-50 shadow-elevated sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(85%_130%_at_100%_0%,rgba(176,138,62,0.26),transparent_58%)]" />
            <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-brass-400 font-serif text-[24px] font-semibold text-canopy-950 ring-1 ring-white/20">
                  {currentUser.name?.[0]?.toUpperCase() || 'G'}
                </span>
                <div>
                  <span className="eyebrow-light">{currentUser.role === 'ADMIN' ? 'Atelier administrator' : 'Atelier member'}</span>
                  <h1 className="mt-1 font-serif text-[28px] leading-tight sm:text-[32px]">{currentUser.name}</h1>
                  <p className="text-[12px] text-linen-100/60">{currentUser.email}</p>
                </div>
              </div>
              <div className="flex gap-6 sm:text-right">
                <div>
                  <p className="font-serif text-[26px] leading-none num">{myOrders.length}</p>
                  <p className="mt-1 text-[9.5px] font-bold uppercase tracking-[0.16em] text-linen-100/50">Orders</p>
                </div>
                <div className="h-10 w-px bg-white/15" />
                <div>
                  <p className="font-serif text-[26px] leading-none">7-day</p>
                  <p className="mt-1 text-[9.5px] font-bold uppercase tracking-[0.16em] text-linen-100/50">Guarantee live</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-12">
            {/* Profile */}
            <form onSubmit={handleSaveProfile} className="space-y-4 self-start rounded-[22px] border border-canopy-950/10 bg-white p-6 shadow-soft lg:col-span-5">
              <div>
                <span className="eyebrow">Saved checkout profile</span>
                <h2 className="mt-1.5 font-serif text-[21px] leading-tight text-canopy-950">Delivery details</h2>
              </div>
              <label className="block"><span className={LABEL}>Full name</span><input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className={`${FIELD} h-10 px-3.5`} /></label>
              <label className="block"><span className={LABEL}>Phone</span><input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} className={`${FIELD} h-10 px-3.5`} /></label>
              <label className="block"><span className={LABEL}>Delivery address</span><textarea rows={2} value={profileForm.defaultAddress} onChange={(e) => setProfileForm({ ...profileForm, defaultAddress: e.target.value })} placeholder="Flat, society, road…" className={`${FIELD} p-3`} /></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block"><span className={LABEL}>City</span><input value={profileForm.defaultCity} onChange={(e) => setProfileForm({ ...profileForm, defaultCity: e.target.value })} className={`${FIELD} h-10 px-3.5`} /></label>
                <label className="block"><span className={LABEL}>Pincode</span><input value={profileForm.defaultPincode} onChange={(e) => setProfileForm({ ...profileForm, defaultPincode: e.target.value })} className={`${FIELD} h-10 px-3.5`} /></label>
              </div>
              <button type="submit" disabled={loading} className="btn btn-dark btn-md w-full">
                {loading ? 'Saving…' : 'Save profile'} <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>

            {/* Orders */}
            <div className="space-y-4 rounded-[22px] border border-canopy-950/10 bg-white p-6 shadow-soft lg:col-span-7">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="eyebrow">Order history</span>
                  <h2 className="mt-1.5 flex items-center gap-2 font-serif text-[21px] leading-tight text-canopy-950">
                    <Package className="h-4 w-4 text-brass-600" /> My plant orders
                  </h2>
                </div>
                <span className="rounded-full border border-canopy-950/10 bg-linen-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-stone-500 num">{myOrders.length}</span>
              </div>

              {ordersLoading ? (
                <div className="space-y-2 pt-2">
                  {[0, 1].map((i) => <div key={i} className="h-20 rounded-2xl shimmer-bg" />)}
                </div>
              ) : myOrders.length === 0 ? (
                <div className="space-y-3 py-10 text-center">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-canopy-950/10 bg-linen-50 text-stone-400"><Package className="h-5 w-5" /></span>
                  <p className="text-[13px] text-stone-500">No orders yet under this account.</p>
                  <button onClick={onBackToStore} className="btn btn-dark btn-sm">Explore the collection</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myOrders.map((o) => (
                    <div key={o.id} className="space-y-2.5 rounded-2xl border border-canopy-950/10 bg-linen-50 p-4 text-[11.5px]">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[12px] font-bold text-canopy-950">{o.orderNumber}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.08em] ${o.paymentStatus === 'PAID' ? 'bg-canopy-700/10 text-canopy-800' : 'bg-terracotta-500/10 text-terracotta-600'}`}>
                            {o.paymentStatus === 'PAID' ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                        <span className="rounded-full bg-canopy-950 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.08em] text-brass-300">{o.status}</span>
                      </div>
                      <div className="space-y-1 text-stone-600">
                        {(o.items || []).map((it) => (
                          <div key={it.id} className="flex justify-between gap-3">
                            <span className="truncate">{it.quantity}× {it.productName} <span className="text-stone-400">({it.potColor})</span></span>
                            <span className="shrink-0 font-semibold text-canopy-950 num">₹{it.unitPrice * it.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between border-t border-canopy-950/10 pt-2">
                        <span className="flex items-center gap-1.5 text-[10px] text-stone-500"><CreditCard className="h-3 w-3" /> {o.razorpayPaymentId || o.paymentMethod}</span>
                        <span className="text-[13px] font-bold text-canopy-950 num">₹{o.totalAmount}</span>
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

  /* ————————— Signed out ————————— */
  return (
    <div className="flex min-h-screen flex-col bg-linen-50 lg:flex-row">
      {/* Editorial side */}
      <div className="relative flex min-h-[440px] flex-col justify-between overflow-hidden bg-canopy-950 p-7 text-linen-50 sm:p-10 lg:w-[52%] lg:p-14">
        <img src="/images/hero-1.jpg" alt="Greenzo sanctuary styling" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-canopy-950 via-canopy-950/75 to-canopy-950/45" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brass-500/20 blur-3xl" />

        <div className="relative z-10 flex items-center justify-between gap-3">
          <button onClick={onBackToStore} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11.5px] font-semibold text-linen-50 backdrop-blur transition hover:bg-white/15">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to atelier
          </button>
          <span className="flex items-baseline font-serif text-[22px] tracking-[-0.03em]">
            greenzo<span className="ml-0.5 font-sans text-[13px] font-light text-brass-300">.in</span>
          </span>
        </div>

        <div className="relative z-10 my-9 max-w-lg space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-brass-400/30 bg-brass-400/10 px-3 py-1 text-[9.5px] font-extrabold uppercase tracking-[0.2em] text-brass-200 backdrop-blur">
            <Sparkles className="h-3 w-3" /> Pune botanical atelier
          </span>
          <h1 className="font-serif text-[38px] leading-[0.95] tracking-[-0.03em] sm:text-[46px]">
            Your living<br /><span className="italic text-brass-200">sanctuary,</span> curated.
          </h1>
          <p className="max-w-[44ch] text-[13px] leading-relaxed text-linen-100/65">
            Sign in for one-click Razorpay checkout, saved delivery details, order tracking and studio access — or
            create an account in seconds.
          </p>
        </div>

        <div className="relative z-10 space-y-3">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.24em] text-brass-300">Instant demo access</p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <button type="button" disabled={loading} onClick={() => executeLogin('admin@greenzo.in', 'Admin@123')} className="group rounded-2xl bg-brass-400 p-4 text-left text-canopy-950 shadow-elevated transition hover:bg-brass-300">
              <span className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.1em]"><Crown className="h-3.5 w-3.5" /> Studio</span>
                <span className="rounded-full bg-canopy-950 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-brass-300">1-click</span>
              </span>
              <span className="mt-2 block font-mono text-[10px] text-canopy-900/70">admin@greenzo.in · Admin@123</span>
            </button>
            <button type="button" disabled={loading} onClick={() => executeLogin('rahul@greenzo.in', 'Customer@123')} className="group rounded-2xl border border-white/20 bg-white/10 p-4 text-left text-linen-50 backdrop-blur transition hover:bg-white/15">
              <span className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.1em]"><User className="h-3.5 w-3.5 text-brass-300" /> Member</span>
                <span className="rounded-full border border-white/25 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em]">1-click</span>
              </span>
              <span className="mt-2 block font-mono text-[10px] text-linen-100/60">rahul@greenzo.in · Customer@123</span>
            </button>
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="flex flex-1 items-center justify-center bg-linen-50 p-6 sm:p-10 lg:w-[48%] lg:p-16">
        <div className="w-full max-w-md space-y-5">
          <div className="grid grid-cols-2 gap-1 rounded-full border border-canopy-950/10 bg-white p-1 shadow-soft">
            {['login', 'register'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full py-2.5 text-[11.5px] font-bold uppercase tracking-[0.1em] transition-all duration-500 ease-silk ${
                  tab === t ? 'bg-canopy-950 text-brass-300 shadow-sm' : 'text-stone-500 hover:text-canopy-950'
                }`}
              >
                {t === 'login' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="animate-fade-up space-y-4 rounded-[26px] border border-canopy-950/10 bg-white p-7 shadow-soft sm:p-8">
              <div>
                <span className="eyebrow">Welcome back</span>
                <h2 className="mt-1.5 font-serif text-[28px] leading-tight text-canopy-950">Sign in to your atelier</h2>
                <p className="mt-1 text-[11.5px] text-stone-500">Enter your credentials to continue.</p>
              </div>

              <label className="block">
                <span className={LABEL}>Email</span>
                <span className="relative block">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-stone-400" />
                  <input type="email" required value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} placeholder="you@email.com" className={`${FIELD} h-11 pl-10 pr-4`} />
                </span>
              </label>

              <label className="block">
                <span className={LABEL}>Password</span>
                <span className="relative block">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-stone-400" />
                  <input type={showPass ? 'text' : 'password'} required value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} placeholder="••••••••" className={`${FIELD} h-11 pl-10 pr-11`} />
                  <button type="button" onClick={() => setShowPass(!showPass)} aria-label="Toggle password" className="absolute right-3 top-3 text-stone-400 transition hover:text-canopy-950">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
              </label>

              <button type="submit" disabled={loading} className="btn btn-dark btn-md w-full">
                {loading ? 'Signing in…' : 'Sign in'} <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <p className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400">
                <ShieldCheck className="h-3.5 w-3.5 text-canopy-600" /> Encrypted session · secure by Greenzo
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="animate-fade-up space-y-3.5 rounded-[26px] border border-canopy-950/10 bg-white p-7 shadow-soft sm:p-8">
              <div>
                <span className="eyebrow">Join the atelier</span>
                <h2 className="mt-1.5 font-serif text-[28px] leading-tight text-canopy-950">Create your account</h2>
                <p className="mt-1 text-[11.5px] text-stone-500">Faster checkout, saved address and order tracking.</p>
              </div>

              <label className="block">
                <span className={LABEL}>Full name *</span>
                <span className="relative block">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                  <input required value={regForm.name} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })} placeholder="Sneha Deshmukh" className={`${FIELD} h-10 pl-10 pr-4`} />
                </span>
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                <label className="block">
                  <span className={LABEL}>Email *</span>
                  <input type="email" required value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} placeholder="sneha@email.com" className={`${FIELD} h-10 px-3`} />
                </label>
                <label className="block">
                  <span className={LABEL}>Phone</span>
                  <input value={regForm.phone} onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })} placeholder="+91 98…" className={`${FIELD} h-10 px-3`} />
                </label>
              </div>

              <label className="block">
                <span className={LABEL}>Password (min 6) *</span>
                <input type="password" required minLength={6} value={regForm.password} onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} placeholder="Create a password" className={`${FIELD} h-10 px-3`} />
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                <label className="block">
                  <span className={LABEL}>City</span>
                  <span className="relative block">
                    <MapPin className="absolute left-3 top-3 h-3.5 w-3.5 text-stone-400" />
                    <input value={regForm.defaultCity} onChange={(e) => setRegForm({ ...regForm, defaultCity: e.target.value })} className={`${FIELD} h-10 pl-8 pr-3`} />
                  </span>
                </label>
                <label className="block">
                  <span className={LABEL}>Pincode</span>
                  <input value={regForm.defaultPincode} onChange={(e) => setRegForm({ ...regForm, defaultPincode: e.target.value })} className={`${FIELD} h-10 px-3`} />
                </label>
              </div>

              <button type="submit" disabled={loading} className="btn btn-dark btn-md w-full">
                {loading ? 'Creating…' : 'Create account'} <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <p className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400">
                <Leaf className="h-3 w-3 text-canopy-600" /> Join 50,000+ plant parents across India
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
