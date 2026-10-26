import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User, Phone, MapPin, ShieldCheck, Sparkles, LogOut, Package, CreditCard, Crown, Leaf } from 'lucide-react';
import { api, setStoredToken } from '../lib/api.js';

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
      setStoredToken(res.token); onAuthSuccess(res.user);
      onNotify(`Welcome, ${res.user.name}`);
      if (res.user.role === 'ADMIN') onOpenAdminPanel();
    } catch (err) { onNotify(err.message); } finally { setLoading(false); }
  };
  const handleLoginSubmit = (e) => { e.preventDefault(); executeLogin(loginForm.email, loginForm.password); };
  const handleRegisterSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { const res = await api.register(regForm); setStoredToken(res.token); onAuthSuccess(res.user); onNotify(`Welcome to Greenzo, ${res.user.name}`); }
    catch (err) { onNotify(err.message); } finally { setLoading(false); }
  };
  const handleSaveProfile = async (e) => {
    e.preventDefault(); setLoading(true);
    try { const res = await api.updateProfile(profileForm); onAuthSuccess(res.user); onNotify('Delivery profile saved'); } catch (err) { onNotify(err.message); } finally { setLoading(false); }
  };

  if (currentUser) {
    return (
      <div className="min-h-screen bg-linen-50 py-8 px-5 lg:px-8">
        <div className="max-w-[1120px] mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button onClick={onBackToStore} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-stone-200 text-sm font-medium hover:bg-stone-50 transition">
              <ArrowLeft className="w-4 h-4" /> Back to Atelier
            </button>
            <div className="flex items-center gap-3">
              {currentUser.role === 'ADMIN' && <button onClick={onOpenAdminPanel} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-canopy-950 text-white text-xs font-semibold shadow-soft hover:bg-black transition"><Crown className="w-4 h-4 text-emerald-300" /> Open Studio</button>}
              <button onClick={onLogout} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-stone-200 text-xs font-semibold hover:bg-stone-50 transition"><LogOut className="w-3.5 h-3.5" /> Sign Out</button>
            </div>
          </div>

          <div className="rounded-[24px] bg-canopy-950 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-elevated overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent pointer-events-none" />
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white text-canopy-950 flex items-center justify-center font-serif text-xl font-bold">{currentUser.name?.[0]?.toUpperCase() || 'G'}</div>
              <div>
                <span className="text-[11px] tracking-[0.16em] uppercase font-bold text-emerald-300">{currentUser.role === 'ADMIN' ? 'Atelier Administrator' : 'Atelier Member'}</span>
                <h1 className="font-serif text-3xl font-semibold">{currentUser.name}</h1>
                <p className="text-xs text-white/70">{currentUser.email}</p>
              </div>
            </div>
            <div className="relative text-left sm:text-right">
              <p className="font-serif text-2xl font-semibold">{myOrders.length} Orders</p>
              <p className="text-xs text-white/60">7-Day healthy replacement active</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            <form onSubmit={handleSaveProfile} className="lg:col-span-5 bg-white rounded-[20px] p-6 border border-stone-100 shadow-soft space-y-4 self-start">
              <h2 className="font-serif text-xl font-semibold text-canopy-950">Saved Checkout Profile</h2>
              <div><label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label><input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="w-full h-10 px-3.5 rounded-xl bg-stone-50 border border-stone-100 text-sm focus:bg-white focus:border-canopy-900/20 outline-none" /></div>
              <div><label className="block text-xs font-semibold text-stone-700 mb-1">Phone</label><input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} className="w-full h-10 px-3.5 rounded-xl bg-stone-50 border border-stone-100 text-sm focus:bg-white focus:border-canopy-900/20 outline-none" /></div>
              <div><label className="block text-xs font-semibold text-stone-700 mb-1">Delivery Address</label><textarea rows={2} value={profileForm.defaultAddress} onChange={(e) => setProfileForm({ ...profileForm, defaultAddress: e.target.value })} placeholder="Flat, Society, Road…" className="w-full p-3 rounded-xl bg-stone-50 border border-stone-100 text-sm focus:bg-white focus:border-canopy-900/20 outline-none" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold text-stone-700 mb-1">City</label><input value={profileForm.defaultCity} onChange={(e) => setProfileForm({ ...profileForm, defaultCity: e.target.value })} className="w-full h-10 px-3.5 rounded-xl bg-stone-50 border border-stone-100 text-sm focus:bg-white outline-none" /></div>
                <div><label className="block text-xs font-semibold text-stone-700 mb-1">Pincode</label><input value={profileForm.defaultPincode} onChange={(e) => setProfileForm({ ...profileForm, defaultPincode: e.target.value })} className="w-full h-10 px-3.5 rounded-xl bg-stone-50 border border-stone-100 text-sm focus:bg-white outline-none" /></div>
              </div>
              <button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-canopy-950 hover:bg-black text-white text-sm font-semibold transition">{loading ? 'Saving…' : 'Save Profile'}</button>
            </form>

            <div className="lg:col-span-7 bg-white rounded-[20px] p-6 border border-stone-100 shadow-soft space-y-4">
              <h2 className="font-serif text-xl font-semibold text-canopy-950 flex items-center gap-2"><Package className="w-5 h-5 text-stone-500" /> My Orders</h2>
              {ordersLoading ? <p className="text-xs text-stone-500 py-8 text-center">Loading…</p> : myOrders.length === 0 ? (
                <div className="text-center py-12 space-y-3"><p className="text-sm text-stone-500">No orders yet under this account.</p><button onClick={onBackToStore} className="px-5 py-2.5 rounded-full bg-canopy-950 text-white text-xs font-semibold">Explore Collection</button></div>
              ) : (
                <div className="space-y-3">
                  {myOrders.map((o) => (
                    <div key={o.id} className="rounded-2xl bg-stone-50 border border-stone-100 p-4 space-y-2.5 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2"><span className="font-mono font-bold text-sm text-canopy-950">{o.orderNumber}</span><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${o.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-amber-50 text-amber-800 border border-amber-100'}`}>{o.paymentStatus === 'PAID' ? '✓ PAID' : 'PENDING'}</span></div>
                        <span className="px-2.5 py-1 rounded-full bg-canopy-950 text-white text-[11px] font-semibold">{o.status}</span>
                      </div>
                      <div className="space-y-1 text-stone-700">{(o.items || []).map((it) => <div key={it.id} className="flex justify-between"><span>{it.quantity}× {it.productName} ({it.potColor})</span><span className="font-semibold">₹{it.unitPrice * it.quantity}</span></div>)}</div>
                      <div className="pt-2 border-t border-stone-200 flex justify-between items-center"><span className="text-stone-500 flex items-center gap-1"><CreditCard className="w-3.5 h-3.5" /> {o.razorpayPaymentId || o.paymentMethod}</span><span className="text-sm font-bold text-canopy-950">₹{o.totalAmount}</span></div>
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

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      <div className="lg:w-[52%] relative bg-canopy-950 text-white p-8 sm:p-10 lg:p-14 flex flex-col justify-between overflow-hidden min-h-[420px]">
        <img src="/images/hero-1.jpg" alt="Greenzo Sanctuary" className="absolute inset-0 w-full h-full object-cover opacity-[0.45]" />
        <div className="absolute inset-0 bg-gradient-to-t from-canopy-950 via-canopy-950/70 to-canopy-950/40" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative z-10 flex items-center justify-between">
          <button onClick={onBackToStore} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur border border-white/15 text-xs font-semibold text-white transition">
            <ArrowLeft className="w-4 h-4" /> Back to Atelier
          </button>
          <span className="flex items-center gap-2 font-serif text-2xl font-semibold tracking-tight"> <span className="w-8 h-8 rounded-xl bg-white text-canopy-950 flex items-center justify-center"><Leaf className="w-4 h-4" /></span> greenzo<span className="font-light text-emerald-300">.in</span></span>
        </div>
        <div className="relative z-10 my-8 space-y-4 max-w-lg">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur text-[11px] font-semibold tracking-[0.12em] uppercase text-emerald-200"><Sparkles className="w-3.5 h-3.5" /> Pune Botanical Atelier</span>
          <h1 className="font-serif text-4xl sm:text-[46px] font-medium leading-[0.95] tracking-[-0.02em]">Your living<br /><span className="italic font-normal text-emerald-200">sanctuary,</span> curated.</h1>
          <p className="text-sm leading-relaxed text-white/70 max-w-[44ch]">Sign in for 1-click Razorpay checkout, order tracking, and studio access — or create an account in seconds.</p>
        </div>
        <div className="relative z-10 space-y-3">
          <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-emerald-300">Instant Demo Access</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <button type="button" disabled={loading} onClick={() => executeLogin('admin@greenzo.in', 'Admin@123')} className="p-4 rounded-[18px] bg-white text-canopy-950 text-left shadow-elevated hover:shadow-soft-lg transition group">
              <div className="flex items-center justify-between"><span className="inline-flex items-center gap-1.5 text-xs font-bold"><Crown className="w-4 h-4 text-terracotta-600" /> Atelier Studio</span><span className="text-[10px] px-2 py-1 rounded-full bg-canopy-950 text-white font-semibold">1-Click</span></div>
              <p className="text-[11px] text-stone-600 mt-1.5 font-mono">admin@greenzo.in • Admin@123</p>
            </button>
            <button type="button" disabled={loading} onClick={() => executeLogin('rahul@greenzo.in', 'Customer@123')} className="p-4 rounded-[18px] bg-white/10 hover:bg-white/15 backdrop-blur border border-white/15 text-white text-left transition">
              <div className="flex items-center justify-between"><span className="inline-flex items-center gap-1.5 text-xs font-bold"><User className="w-4 h-4 text-emerald-300" /> Member</span><span className="text-[10px] px-2 py-1 rounded-full bg-white/15 border border-white/20 font-semibold">1-Click</span></div>
              <p className="text-[11px] text-white/70 mt-1.5 font-mono">rahul@greenzo.in • Customer@123</p>
            </button>
          </div>
        </div>
      </div>

      <div className="lg:w-[48%] flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-linen-50">
        <div className="w-full max-w-md space-y-6">
          <div className="grid grid-cols-2 p-1 rounded-full bg-white border border-stone-100 shadow-soft">
            <button onClick={() => setTab('login')} className={`py-2.5 rounded-full text-xs font-bold transition ${tab === 'login' ? 'bg-canopy-950 text-white shadow-sm' : 'text-stone-600 hover:text-canopy-950'}`}>Sign In</button>
            <button onClick={() => setTab('register')} className={`py-2.5 rounded-full text-xs font-bold transition ${tab === 'register' ? 'bg-canopy-950 text-white shadow-sm' : 'text-stone-600 hover:text-canopy-950'}`}>Create Account</button>
          </div>

          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="bg-white rounded-[24px] p-7 sm:p-8 border border-stone-100 shadow-soft space-y-5">
              <div><h2 className="font-serif text-[28px] font-semibold tracking-tight text-canopy-950">Welcome back</h2><p className="text-xs text-stone-500 mt-1">Enter your credentials to continue.</p></div>
              <div><label className="block text-xs font-semibold text-stone-700 mb-1.5">Email</label><div className="relative"><Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" /><input type="email" required value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} placeholder="you@email.com" className="w-full h-11 pl-10 pr-4 rounded-xl bg-stone-50 border border-stone-100 text-sm focus:bg-white focus:border-canopy-900/20 focus:ring-4 focus:ring-canopy-900/5 outline-none transition" /></div></div>
              <div><label className="block text-xs font-semibold text-stone-700 mb-1.5">Password</label><div className="relative"><Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" /><input type={showPass ? 'text' : 'password'} required value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} placeholder="••••••••" className="w-full h-11 pl-10 pr-10 rounded-xl bg-stone-50 border border-stone-100 text-sm focus:bg-white focus:border-canopy-900/20 focus:ring-4 focus:ring-canopy-900/5 outline-none transition" /><button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-stone-400 hover:text-canopy-950">{showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div></div>
              <button type="submit" disabled={loading} className="w-full h-12 rounded-full bg-canopy-950 hover:bg-black text-white text-sm font-semibold shadow-soft transition active:scale-95">{loading ? 'Signing in…' : 'Sign In'}</button>
              <p className="text-[11px] text-center text-stone-500 flex items-center justify-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Encrypted session • Secure by Greenzo</p>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="bg-white rounded-[24px] p-7 sm:p-8 border border-stone-100 shadow-soft space-y-4">
              <div><h2 className="font-serif text-[28px] font-semibold tracking-tight text-canopy-950">Join the Atelier</h2><p className="text-xs text-stone-500 mt-1">Create an account for faster checkout & tracking.</p></div>
              <div><label className="block text-xs font-semibold text-stone-700 mb-1">Full Name *</label><div className="relative"><User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" /><input required value={regForm.name} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })} placeholder="Sneha Deshmukh" className="w-full h-10 pl-10 pr-4 rounded-xl bg-stone-50 border border-stone-100 text-sm focus:bg-white outline-none" /></div></div>
              <div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-semibold text-stone-700 mb-1">Email *</label><input type="email" required value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} placeholder="sneha@email.com" className="w-full h-10 px-3.5 rounded-xl bg-stone-50 border border-stone-100 text-sm focus:bg-white outline-none" /></div><div><label className="block text-xs font-semibold text-stone-700 mb-1">Phone</label><div className="relative"><Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3.5" /><input value={regForm.phone} onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })} placeholder="+91 98…" className="w-full h-10 pl-8 pr-3 rounded-xl bg-stone-50 border border-stone-100 text-sm focus:bg-white outline-none" /></div></div></div>
              <div><label className="block text-xs font-semibold text-stone-700 mb-1">Password (min 6) *</label><input type="password" required minLength={6} value={regForm.password} onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} placeholder="Create password" className="w-full h-10 px-3.5 rounded-xl bg-stone-50 border border-stone-100 text-sm focus:bg-white outline-none" /></div>
              <div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-semibold text-stone-700 mb-1">City</label><div className="relative"><MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3.5" /><input value={regForm.defaultCity} onChange={(e) => setRegForm({ ...regForm, defaultCity: e.target.value })} className="w-full h-10 pl-8 pr-3 rounded-xl bg-stone-50 border border-stone-100 text-sm focus:bg-white outline-none" /></div></div><div><label className="block text-xs font-semibold text-stone-700 mb-1">Pincode</label><input value={regForm.defaultPincode} onChange={(e) => setRegForm({ ...regForm, defaultPincode: e.target.value })} className="w-full h-10 px-3.5 rounded-xl bg-stone-50 border border-stone-100 text-sm focus:bg-white outline-none" /></div></div>
              <button type="submit" disabled={loading} className="w-full h-12 rounded-full bg-canopy-950 hover:bg-black text-white text-sm font-semibold shadow-soft transition">{loading ? 'Creating…' : 'Create Account'}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
