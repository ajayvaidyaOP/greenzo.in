import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Trash2, Tag, ArrowRight, ArrowLeft, CheckCircle2, Truck, Sparkles, ShieldCheck, CreditCard, Banknote, Leaf } from 'lucide-react';
import { api } from '../lib/api.js';
import RazorpayGatewayModal, { loadRazorpaySdk } from './RazorpayGatewayModal.jsx';

export default function CartDrawer({ isOpen, onClose, storeConfig = {}, activeOffers = [], currentUser, cart = [], onUpdateQty, onRemoveItem, onClearCart, onOpenBundle, onNotify }) {
  const [step, setStep] = useState('cart');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [rzpSession, setRzpSession] = useState(null);

  const razorpayEnabled = storeConfig.razorpayEnabled !== false;
  const codEnabled = storeConfig.codEnabled !== false;
  const freeShipThreshold = Number(storeConfig.freeShippingThreshold || 499);
  const stdShipFee = Number(storeConfig.standardShippingFee || 69);
  const comboPrice = Number(storeConfig.comboBundlePrice || 999);

  const [customer, setCustomer] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    shippingAddress: '',
    city: 'Pune',
    pincode: '411001',
    paymentMethod: razorpayEnabled ? 'RAZORPAY' : 'COD',
    notes: '',
  });

  useEffect(() => {
    if (currentUser) {
      setCustomer((prev) => ({
        ...prev,
        customerName: prev.customerName || currentUser.name || '',
        customerPhone: prev.customerPhone || currentUser.phone || '',
        customerEmail: prev.customerEmail || currentUser.email || '',
        shippingAddress: prev.shippingAddress || currentUser.defaultAddress || '',
        city: currentUser.defaultCity || prev.city || 'Pune',
        pincode: currentUser.defaultPincode || prev.pincode || '411001',
      }));
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const subtotal = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const afterDiscount = Math.max(0, subtotal - discount);
  const shippingFee = afterDiscount >= freeShipThreshold || subtotal === 0 ? 0 : stdShipFee;
  const grandTotal = afterDiscount + shippingFee;
  const freeShipRemaining = Math.max(0, freeShipThreshold - afterDiscount);

  const applyCodeDirectly = async (codeStr) => {
    setCouponError('');
    setCouponInput(codeStr);
    try {
      const res = await api.validateCoupon(codeStr, subtotal);
      setAppliedCoupon(res);
      onNotify(`Code ${res.code} — saved ₹${res.discount} 🎁`);
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError(err.message);
    }
  };
  const handleApplyCoupon = (e) => { e.preventDefault(); if (!couponInput.trim()) return; applyCodeDirectly(couponInput.trim()); };

  const finalizeRazorpayVerification = async (verificationPayload) => {
    try {
      const { order } = await api.verifyRazorpayAndPlace({ ...verificationPayload, ...customer, couponCode: appliedCoupon?.code || '', items: cart });
      setRzpSession(null); setPlacedOrder(order); setStep('success'); onClearCart(); setAppliedCoupon(null);
      onNotify(`Payment verified — Order ${order.orderNumber} confirmed 🌿`);
    } catch (err) { setRzpSession(null); onNotify(err.message); }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      if (customer.paymentMethod === 'RAZORPAY') {
        const orderSession = await api.createRazorpayOrder(cart, appliedCoupon?.code || '');
        if (orderSession.mode === 'live') {
          const loaded = await loadRazorpaySdk();
          if (loaded && window.Razorpay) {
            const rzp = new window.Razorpay({
              key: orderSession.keyId,
              amount: orderSession.amountPaise,
              currency: orderSession.currency || 'INR',
              name: 'Greenzo.in — Botanical Atelier',
              description: 'Atelier Indoor Plants',
              order_id: orderSession.razorpayOrderId,
              prefill: { name: customer.customerName, email: customer.customerEmail, contact: customer.customerPhone },
              theme: { color: '#0A1A12' },
              handler: async (response) => {
                await finalizeRazorpayVerification({ mode: 'live', razorpayOrderId: response.razorpay_order_id, razorpayPaymentId: response.razorpay_payment_id, razorpaySignature: response.razorpay_signature, sandboxMethod: 'Online' });
              },
            });
            rzp.open(); setSubmitting(false); return;
          }
        }
        setRzpSession(orderSession); setSubmitting(false); return;
      }
      const { order } = await api.createOrder({ ...customer, paymentMethod: 'COD', couponCode: appliedCoupon?.code || '', items: cart });
      setPlacedOrder(order); setStep('success'); onClearCart(); setAppliedCoupon(null);
      onNotify(`Order ${order.orderNumber} confirmed 🌿`);
    } catch (err) { onNotify(err.message); } finally { setSubmitting(false); }
  };

  const resetAndClose = () => { if (step === 'success') setStep('cart'); onClose(); };

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end">
        <div onClick={resetAndClose} className="absolute inset-0 animate-fade-in bg-canopy-950/55 backdrop-blur-sm" />
        <div className="relative flex h-full w-full max-w-[480px] animate-slide-in-right flex-col border-l border-canopy-950/10 bg-linen-50 shadow-elevated">
          {/* Header — minimal */}
          <div className="flex items-center justify-between border-b border-canopy-950/10 bg-linen-50 px-6 py-5">
            <div className="flex items-center gap-3">
              {step === 'checkout' && (
                <button onClick={() => setStep('cart')} className="w-8 h-8 rounded-full bg-linen-50 border border-canopy-950/10 flex items-center justify-center hover:bg-white transition">
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <h3 className="font-serif text-[22px] font-semibold tracking-tight text-canopy-950">
                {step === 'cart' ? `Bag — ${cart.reduce((a, b) => a + b.quantity, 0)} items` : step === 'checkout' ? 'Delivery Details' : 'Order Confirmed'}
              </h3>
            </div>
            <button onClick={resetAndClose} className="w-9 h-9 rounded-full bg-linen-50 hover:bg-white border border-canopy-950/10 flex items-center justify-center text-stone-600 transition">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-2.5 border-b border-canopy-950/10 bg-linen-50 px-6 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.14em]">
            {['Bag', 'Delivery', 'Confirm'].map((label, i) => {
              const activeIdx = step === 'cart' ? 0 : step === 'checkout' ? 1 : 2;
              const done = i < activeIdx;
              const active = i === activeIdx;
              return (
                <React.Fragment key={label}>
                  <span className={`inline-flex items-center gap-1.5 ${active ? 'text-canopy-950' : done ? 'text-canopy-600' : 'text-stone-400'}`}>
                    <span className={`grid h-4 w-4 place-items-center rounded-full text-[8px] font-bold ${active ? 'bg-canopy-950 text-brass-300' : done ? 'bg-canopy-600 text-white' : 'border border-canopy-950/20'}`}>
                      {done ? '✓' : i + 1}
                    </span>
                    {label}
                  </span>
                  {i < 2 && <span className={`h-px flex-1 ${done ? 'bg-canopy-600/40' : 'bg-canopy-950/10'}`} />}
                </React.Fragment>
              );
            })}
          </div>

          {/* Free shipping progress */}
          {step === 'cart' && cart.length > 0 && (
            <div className="bg-canopy-950 px-6 py-3 text-[11px] text-linen-50">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2">
                  <Truck className="h-3.5 w-3.5 text-brass-300" />
                  {freeShipRemaining === 0 ? 'Free eco-safe shipping unlocked' : `Add ₹${freeShipRemaining} for free shipping`}
                </span>
                <span className="text-[10px] text-linen-100/50 num">{afterDiscount >= freeShipThreshold ? '100' : Math.round((afterDiscount / freeShipThreshold) * 100)}%</span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brass-600 to-brass-300 transition-all duration-700 ease-silk"
                  style={{ width: `${afterDiscount >= freeShipThreshold ? 100 : Math.round((afterDiscount / freeShipThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-6 bg-linen-50">
            {step === 'success' && placedOrder ? (
              <div className="bg-white rounded-[24px] p-6 border border-canopy-950/10 shadow-soft text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-emerald-700">
                    {placedOrder.paymentStatus === 'PAID' ? '✓ Verified Payment' : 'Confirmed — Cash on Delivery'}
                  </span>
                  <h4 className="font-serif text-[28px] font-semibold text-canopy-950 mt-1">Thank you, {placedOrder.customerName}</h4>
                  <p className="text-xs text-stone-500 mt-1">Order <strong className="font-mono text-canopy-950 bg-linen-50 border border-canopy-950/10 px-2 py-1 rounded-full">{placedOrder.orderNumber}</strong></p>
                </div>
                <div className="p-4 rounded-2xl bg-linen-50 border border-canopy-950/10 text-left text-xs space-y-2">
                  <div className="flex justify-between"><span className="text-stone-500">Delivery Estimate</span><span className="font-semibold text-canopy-950">{placedOrder.estimatedDelivery}</span></div>
                  {placedOrder.razorpayPaymentId && <div className="flex justify-between"><span className="text-stone-500">Payment ID</span><span className="font-mono font-semibold text-emerald-700">{placedOrder.razorpayPaymentId}</span></div>}
                  <div className="flex justify-between"><span className="text-stone-500">City</span><span className="font-semibold text-canopy-950">{placedOrder.city} ({placedOrder.pincode})</span></div>
                  <div className="flex justify-between pt-2 border-t border-canopy-950/10"><span className="text-stone-500">{placedOrder.paymentStatus === 'PAID' ? 'Paid' : 'Payable'}</span><span className="font-bold text-canopy-950">₹{placedOrder.totalAmount}</span></div>
                </div>
                <a href={`https://wa.me/${storeConfig.whatsappNumber || '918883639639'}?text=${encodeURIComponent(`Hi Greenzo! Order ${placedOrder.orderNumber} (₹${placedOrder.totalAmount}) for ${placedOrder.city}.`)}`} target="_blank" rel="noreferrer" className="w-full h-11 rounded-full bg-[#1FAF54] hover:bg-[#199947] text-white text-xs font-semibold flex items-center justify-center gap-2">
                  Share on WhatsApp for Live Photo Before Dispatch
                </a>
                <button onClick={resetAndClose} className="w-full h-11 rounded-full bg-canopy-950 text-white text-xs font-semibold">Continue Exploring</button>
              </div>
            ) : step === 'checkout' ? (
              <form id="checkoutForm" onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="rounded-[18px] bg-white border border-canopy-950/10 p-5 space-y-4 shadow-soft">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">Full Name *</label>
                    <input required value={customer.customerName} onChange={(e) => setCustomer({ ...customer, customerName: e.target.value })} placeholder="Priya Kulkarni" className="w-full h-11 px-3.5 rounded-xl bg-linen-50 border border-canopy-950/10 text-sm focus:bg-white focus:border-canopy-900/20 focus:ring-4 focus:ring-canopy-900/5 outline-none transition" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">Phone *</label>
                      <input required value={customer.customerPhone} onChange={(e) => setCustomer({ ...customer, customerPhone: e.target.value })} placeholder="+91 98XXXXXXXX" className="w-full h-11 px-3.5 rounded-xl bg-linen-50 border border-canopy-950/10 text-sm focus:bg-white focus:border-canopy-900/20 focus:ring-4 focus:ring-canopy-900/5 outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">Email</label>
                      <input type="email" value={customer.customerEmail} onChange={(e) => setCustomer({ ...customer, customerEmail: e.target.value })} placeholder="you@email.com" className="w-full h-11 px-3.5 rounded-xl bg-linen-50 border border-canopy-950/10 text-sm focus:bg-white focus:border-canopy-900/20 focus:ring-4 focus:ring-canopy-900/5 outline-none transition" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">Delivery Address *</label>
                    <textarea required rows={2} value={customer.shippingAddress} onChange={(e) => setCustomer({ ...customer, shippingAddress: e.target.value })} placeholder="Flat / Society, Landmark, Road…" className="w-full p-3.5 rounded-xl bg-linen-50 border border-canopy-950/10 text-sm focus:bg-white focus:border-canopy-900/20 focus:ring-4 focus:ring-canopy-900/5 outline-none transition" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">City *</label>
                      <input required value={customer.city} onChange={(e) => setCustomer({ ...customer, city: e.target.value })} className="w-full h-11 px-3.5 rounded-xl bg-linen-50 border border-canopy-950/10 text-sm focus:bg-white focus:border-canopy-900/20 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">Pincode *</label>
                      <input required value={customer.pincode} onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })} className="w-full h-11 px-3.5 rounded-xl bg-linen-50 border border-canopy-950/10 text-sm focus:bg-white focus:border-canopy-900/20 outline-none" />
                    </div>
                  </div>
                </div>

                <div className="rounded-[18px] bg-white border border-canopy-950/10 p-5 space-y-3 shadow-soft">
                  <label className="block text-[11px] font-bold tracking-[0.12em] uppercase text-stone-600">Payment Method</label>
                  <div className="space-y-2.5">
                    {razorpayEnabled && (
                      <button type="button" onClick={() => setCustomer({ ...customer, paymentMethod: 'RAZORPAY' })} className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition ${customer.paymentMethod === 'RAZORPAY' ? 'bg-blue-50/60 border-[#1967D2] ring-1 ring-[#1967D2]' : 'bg-white border-canopy-950/10 hover:border-canopy-950/10'}`}>
                        <div className="flex items-center gap-3">
                          <span className="w-10 h-10 rounded-xl bg-[#0B2239] text-white flex items-center justify-center"><CreditCard className="w-4 h-4 text-blue-300" /></span>
                          <div>
                            <p className="text-sm font-semibold text-canopy-950">Pay Online — Razorpay <span className="ml-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px]">Instant</span></p>
                            <p className="text-[11px] text-stone-500">UPI • Cards • Netbanking • Wallets</p>
                          </div>
                        </div>
                        <ShieldCheck className="w-4 h-4 text-[#1967D2]" />
                      </button>
                    )}
                    {codEnabled && (
                      <button type="button" onClick={() => setCustomer({ ...customer, paymentMethod: 'COD' })} className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition ${customer.paymentMethod === 'COD' ? 'bg-linen-50 border-canopy-950 ring-1 ring-canopy-950' : 'bg-white border-canopy-950/10 hover:border-canopy-950/10'}`}>
                        <div className="flex items-center gap-3">
                          <span className="w-10 h-10 rounded-xl bg-linen-100 text-canopy-900 flex items-center justify-center"><Banknote className="w-4 h-4" /></span>
                          <div>
                            <p className="text-sm font-semibold text-canopy-950">Cash on Delivery</p>
                            <p className="text-[11px] text-stone-500">Pay on delivery — cash or UPI scan</p>
                          </div>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </form>
            ) : cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-white border border-canopy-950/10 flex items-center justify-center mx-auto shadow-soft"><ShoppingBag className="w-7 h-7 text-stone-500" /></div>
                <p className="font-serif text-2xl font-semibold text-canopy-950">Your bag is empty</p>
                <p className="text-xs text-stone-500">Begin with the atelier signature — 4 plants @ ₹{comboPrice}</p>
                <button onClick={() => { onClose(); onOpenBundle(); }} className="h-11 px-6 rounded-full bg-canopy-950 text-white text-xs font-semibold inline-flex items-center gap-2 shadow-soft"><Sparkles className="w-3.5 h-3.5 text-emerald-300" /> Build Box — ₹{comboPrice}</button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.key} className="bg-white rounded-[16px] p-4 border border-canopy-950/10 flex gap-4 shadow-soft">
                    <img src={item.imageUrl} alt={item.productName} className="w-16 h-16 rounded-xl object-cover shrink-0 bg-linen-50 border border-canopy-950/10" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-canopy-950 leading-snug line-clamp-2">{item.productName}</h4>
                        <button onClick={() => onRemoveItem(item.key)} className="text-stone-400 hover:text-red-600 transition"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">{item.potColor} • {item.potSize}</p>
                      {item.isBundle && item.bundleItems?.length > 0 && <p className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1 mt-1.5 inline-block">Includes: {item.bundleItems.join(', ')}</p>}
                      <div className="flex items-center justify-between mt-3">
                        <div className="inline-flex items-center border border-canopy-950/10 rounded-full h-8 bg-linen-50">
                          <button onClick={() => onUpdateQty(item.key, item.quantity - 1)} className="w-7 h-7 rounded-full hover:bg-white flex items-center justify-center text-xs font-bold">−</button>
                          <span className="w-7 text-center text-xs font-semibold">{item.quantity}</span>
                          <button onClick={() => onUpdateQty(item.key, item.quantity + 1)} className="w-7 h-7 rounded-full hover:bg-white flex items-center justify-center text-xs font-bold">+</button>
                        </div>
                        <span className="text-sm font-bold text-canopy-950">₹{item.unitPrice * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <form onSubmit={handleApplyCoupon} className="bg-white rounded-[16px] p-4 border border-canopy-950/10 shadow-soft space-y-3">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3.5" />
                      <input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="Promo code" className="w-full h-10 pl-9 pr-3 rounded-full bg-linen-50 border border-canopy-950/10 text-xs font-semibold uppercase focus:bg-white focus:border-canopy-900/20 outline-none" />
                    </div>
                    <button type="submit" className="px-5 h-10 rounded-full bg-canopy-950 text-white text-xs font-semibold hover:bg-black transition">Apply</button>
                  </div>
                  {activeOffers.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {activeOffers.slice(0, 3).map((off) => (
                        <button type="button" key={off.code} onClick={() => applyCodeDirectly(off.code)} className="px-3 py-1.5 rounded-full bg-linen-50 hover:bg-emerald-50 border border-canopy-950/10 text-[11px] font-semibold text-canopy-900">
                          Tap: <strong className="font-mono">{off.code}</strong> • {off.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {appliedCoupon && <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1"><Leaf className="w-3 h-3" /> {appliedCoupon.code} — saved ₹{appliedCoupon.discount}</p>}
                  {couponError && <p className="text-xs text-red-600">{couponError}</p>}
                </form>
              </div>
            )}
          </div>

          {cart.length > 0 && step !== 'success' && (
            <div className="p-6 bg-white border-t border-canopy-950/10 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-stone-600"><span>Subtotal</span><span>₹{subtotal}</span></div>
                {discount > 0 && <div className="flex justify-between text-emerald-700 font-semibold"><span>Promo</span><span>−₹{discount}</span></div>}
                <div className="flex justify-between text-stone-600"><span>Shipping</span><span className={shippingFee === 0 ? 'text-emerald-700 font-semibold' : ''}>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span></div>
                <div className="flex justify-between text-[16px] font-bold text-canopy-950 pt-3 border-t border-canopy-950/10"><span>Total</span><span>₹{grandTotal}</span></div>
              </div>
              {step === 'cart' ? (
                <button onClick={() => setStep('checkout')} className="w-full h-12 rounded-full bg-canopy-950 hover:bg-black text-white text-sm font-semibold flex items-center justify-center gap-2 transition shadow-soft active:scale-95">
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="submit" form="checkoutForm" disabled={submitting} className={`w-full h-12 rounded-full text-white text-sm font-semibold flex items-center justify-center gap-2 transition shadow-soft active:scale-95 ${customer.paymentMethod === 'RAZORPAY' ? 'bg-[#1967D2] hover:bg-[#1353AB]' : 'bg-canopy-950 hover:bg-black'}`}>
                  {submitting ? 'Processing…' : customer.paymentMethod === 'RAZORPAY' ? `Pay ₹${grandTotal} via Razorpay` : `Place COD Order • ₹${grandTotal}`} <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <p className="text-[11px] text-center text-stone-500 flex items-center justify-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Secure checkout • 7-Day replacement • WhatsApp support</p>
            </div>
          )}
        </div>
      </div>
      {rzpSession && <RazorpayGatewayModal session={rzpSession} customer={customer} onSuccess={finalizeRazorpayVerification} onCancel={() => setRzpSession(null)} />}
    </>
  );
}
