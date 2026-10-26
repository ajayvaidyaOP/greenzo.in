import React, { useState, useEffect } from 'react';
import {
  X, ShoppingBag, Trash2, Tag, ArrowRight, ArrowLeft, CheckCircle2,
  Truck, Sparkles, ShieldCheck, CreditCard, Banknote, Leaf, Gift, Printer
} from 'lucide-react';
import { api } from '../lib/api.js';
import { buildWhatsAppUrl, WhatsAppIcon } from '../lib/whatsapp.jsx';
import PincodeChecker, { getSavedPincode } from './PincodeChecker.jsx';
import RazorpayGatewayModal, { loadRazorpaySdk } from './RazorpayGatewayModal.jsx';

const GIFT_OCCASIONS = ['Housewarming 🏡', 'Birthday 🎂', 'Anniversary 💛', 'New Desk 💼', 'Thank You ✨'];
const GIFT_TEMPLATES = [
  'May your space bloom with calm, fresh air & good fortune! 🌿',
  'Wishing you a year that grows brighter & greener every day!',
  'A little living sanctuary for your desk — zero watering stress!'
];

export default function CartDrawer({
  isOpen,
  onClose,
  storeConfig = {},
  activeOffers = [],
  currentUser,
  cart = [],
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onOpenBundle,
  onOpenReceipt,
  onNotify
}) {
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
    pincode: getSavedPincode() || '411001',
    paymentMethod: razorpayEnabled ? 'RAZORPAY' : 'COD',
    notes: ''
  });

  const [gift, setGift] = useState({
    isGift: false,
    giftOccasion: 'Housewarming 🏡',
    giftRecipient: '',
    giftSender: '',
    giftMessage: GIFT_TEMPLATES[0]
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
        pincode: currentUser.defaultPincode || getSavedPincode() || prev.pincode || '411001'
      }));
      setGift((prev) => ({
        ...prev,
        giftSender: prev.giftSender || currentUser.name || ''
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

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    applyCodeDirectly(couponInput.trim());
  };

  const giftPayload = gift.isGift
    ? gift
    : { isGift: false, giftOccasion: '', giftRecipient: '', giftSender: '', giftMessage: '' };

  const finalizeRazorpayVerification = async (verificationPayload) => {
    try {
      const { order } = await api.verifyRazorpayAndPlace({
        ...verificationPayload,
        ...customer,
        ...giftPayload,
        couponCode: appliedCoupon?.code || '',
        items: cart
      });
      setRzpSession(null);
      setPlacedOrder(order);
      setStep('success');
      onClearCart();
      setAppliedCoupon(null);
      onNotify(`Payment verified — Order ${order.orderNumber} confirmed 🌿`);
    } catch (err) {
      setRzpSession(null);
      onNotify(err.message);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
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
              name: 'Greenzo.in — Pune Plant Studio',
              description: 'Self-Watering Indoor Plants',
              order_id: orderSession.razorpayOrderId,
              prefill: {
                name: customer.customerName,
                email: customer.customerEmail,
                contact: customer.customerPhone
              },
              theme: { color: '#071E15' },
              handler: async (response) => {
                await finalizeRazorpayVerification({
                  mode: 'live',
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  sandboxMethod: 'Online'
                });
              }
            });
            rzp.open();
            setSubmitting(false);
            return;
          }
        }
        setRzpSession(orderSession);
        setSubmitting(false);
        return;
      }

      const { order } = await api.createOrder({
        ...customer,
        ...giftPayload,
        paymentMethod: 'COD',
        couponCode: appliedCoupon?.code || '',
        items: cart
      });
      setPlacedOrder(order);
      setStep('success');
      onClearCart();
      setAppliedCoupon(null);
      onNotify(`Order ${order.orderNumber} confirmed 🌿`);
    } catch (err) {
      onNotify(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    if (step === 'success') setStep('cart');
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[85] flex justify-end">
        <div onClick={resetAndClose} className="absolute inset-0 animate-fade-in bg-canopy-950/60 backdrop-blur-sm" />
        <div className="relative flex h-full w-full max-w-[490px] animate-slide-in-right flex-col border-l border-canopy-950/10 bg-linen-50 shadow-elevated">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-canopy-950/10 bg-white px-6 py-4">
            <div className="flex items-center gap-3">
              {step === 'checkout' && (
                <button
                  onClick={() => setStep('cart')}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-canopy-950/10 bg-linen-50 transition hover:bg-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              <h3 className="font-serif text-[21px] font-semibold tracking-tight text-canopy-950">
                {step === 'cart'
                  ? `Shopping Bag (${cart.reduce((a, b) => a + b.quantity, 0)})`
                  : step === 'checkout'
                  ? 'Delivery & Payment'
                  : 'Order Confirmed'}
              </h3>
            </div>
            <button
              onClick={resetAndClose}
              aria-label="Close bag"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-canopy-950/10 bg-linen-50 text-stone-600 transition hover:bg-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-2.5 border-b border-canopy-950/10 bg-white px-6 py-2.5 text-[9.5px] font-extrabold uppercase tracking-[0.14em]">
            {['Bag', 'Delivery', 'Confirm'].map((label, i) => {
              const activeIdx = step === 'cart' ? 0 : step === 'checkout' ? 1 : 2;
              const done = i < activeIdx;
              const active = i === activeIdx;
              return (
                <React.Fragment key={label}>
                  <span
                    className={`inline-flex items-center gap-1.5 ${
                      active ? 'text-canopy-950' : done ? 'text-canopy-600' : 'text-stone-400'
                    }`}
                  >
                    <span
                      className={`grid h-4 w-4 place-items-center rounded-full text-[8px] font-bold ${
                        active
                          ? 'bg-canopy-950 text-emerald-300'
                          : done
                          ? 'bg-canopy-600 text-white'
                          : 'border border-canopy-950/20'
                      }`}
                    >
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
            <div className="bg-canopy-950 px-6 py-2.5 text-[11px] text-white">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 font-semibold">
                  <Truck className="h-3.5 w-3.5 text-emerald-300" />
                  {freeShipRemaining === 0
                    ? '✓ Free safe honeycomb shipping unlocked!'
                    : `Add ₹${freeShipRemaining} more for FREE shipping`}
                </span>
                <span className="text-[10px] text-white/60 num">
                  {afterDiscount >= freeShipThreshold ? '100' : Math.round((afterDiscount / freeShipThreshold) * 100)}%
                </span>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-canopy-500 to-emerald-300 transition-all duration-500"
                  style={{
                    width: `${
                      afterDiscount >= freeShipThreshold ? 100 : Math.round((afterDiscount / freeShipThreshold) * 100)
                    }%`
                  }}
                />
              </div>
            </div>
          )}

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto bg-linen-50 p-5 sm:p-6">
            {step === 'success' && placedOrder ? (
              <div className="space-y-4 rounded-[24px] border border-canopy-950/10 bg-white p-6 text-center shadow-soft">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-canopy-600/20 bg-canopy-50 text-canopy-700">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-canopy-700">
                    {placedOrder.paymentStatus === 'PAID' ? '✓ Verified Payment' : 'Confirmed — Cash on Delivery'}
                  </span>
                  <h4 className="mt-1 font-serif text-[26px] font-semibold text-canopy-950">
                    Thank you, {placedOrder.customerName}!
                  </h4>
                  <p className="mt-1 text-xs text-stone-500">
                    Order{' '}
                    <strong className="rounded-full border border-canopy-950/10 bg-linen-50 px-2.5 py-0.5 font-mono text-canopy-950">
                      {placedOrder.orderNumber}
                    </strong>
                  </p>
                </div>

                <div className="space-y-2 rounded-2xl border border-canopy-950/10 bg-linen-50 p-4 text-left text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Delivery Estimate</span>
                    <span className="font-bold text-canopy-950">{placedOrder.estimatedDelivery}</span>
                  </div>
                  {placedOrder.razorpayPaymentId && (
                    <div className="flex justify-between">
                      <span className="text-stone-500">Payment ID</span>
                      <span className="font-mono font-semibold text-canopy-700">{placedOrder.razorpayPaymentId}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-stone-500">City</span>
                    <span className="font-bold text-canopy-950">
                      {placedOrder.city} ({placedOrder.pincode})
                    </span>
                  </div>
                  {placedOrder.isGift && (
                    <div className="flex items-center justify-between pt-1 text-canopy-700">
                      <span>🎁 Gift Card</span>
                      <span className="font-bold">Included for {placedOrder.giftRecipient || 'Recipient'}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-canopy-950/10 pt-2">
                    <span className="text-stone-500">
                      {placedOrder.paymentStatus === 'PAID' ? 'Amount Paid' : 'Payable'}
                    </span>
                    <span className="font-extrabold text-canopy-950 num">₹{placedOrder.totalAmount}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenReceipt?.(placedOrder)}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-canopy-950/15 bg-linen-50 text-xs font-bold text-canopy-950 transition hover:bg-canopy-100"
                >
                  <Printer className="h-4 w-4 text-canopy-700" /> View / Print GST Order Receipt (PDF)
                </button>

                <a
                  href={buildWhatsAppUrl(
                    storeConfig,
                    `Hi Greenzo! Order ${placedOrder.orderNumber} (₹${placedOrder.totalAmount}) for ${placedOrder.city}.${
                      placedOrder.isGift ? ` [Gift Order for ${placedOrder.giftRecipient || 'loved one'}]` : ''
                    } Please share live plant photos before dispatch!`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-whatsapp text-xs font-bold text-white shadow-whatsapp transition hover:bg-whatsapp-dark"
                >
                  <WhatsAppIcon className="h-4 w-4" /> Share on WhatsApp for Live Dispatch Photo
                </a>

                <button
                  onClick={resetAndClose}
                  className="h-11 w-full rounded-full bg-canopy-950 text-xs font-bold text-white"
                >
                  Continue Shopping
                </button>
              </div>
            ) : step === 'checkout' ? (
              <form id="checkoutForm" onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="space-y-3.5 rounded-[18px] border border-canopy-950/10 bg-white p-5 shadow-soft">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-stone-700">Full Name *</label>
                    <input
                      required
                      value={customer.customerName}
                      onChange={(e) => setCustomer({ ...customer, customerName: e.target.value })}
                      placeholder="Priya Kulkarni"
                      className="h-11 w-full rounded-xl border border-canopy-950/12 bg-linen-50 px-3.5 text-sm outline-none transition focus:border-canopy-600 focus:bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-stone-700">WhatsApp / Phone *</label>
                      <input
                        required
                        value={customer.customerPhone}
                        onChange={(e) => setCustomer({ ...customer, customerPhone: e.target.value })}
                        placeholder="+91 98XXXXXXXX"
                        className="h-11 w-full rounded-xl border border-canopy-950/12 bg-linen-50 px-3.5 text-sm outline-none transition focus:border-canopy-600 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-stone-700">Email</label>
                      <input
                        type="email"
                        value={customer.customerEmail}
                        onChange={(e) => setCustomer({ ...customer, customerEmail: e.target.value })}
                        placeholder="you@email.com"
                        className="h-11 w-full rounded-xl border border-canopy-950/12 bg-linen-50 px-3.5 text-sm outline-none transition focus:border-canopy-600 focus:bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-stone-700">Delivery Address *</label>
                    <textarea
                      required
                      rows={2}
                      value={customer.shippingAddress}
                      onChange={(e) => setCustomer({ ...customer, shippingAddress: e.target.value })}
                      placeholder="Flat / Society, Landmark, Road…"
                      className="w-full rounded-xl border border-canopy-950/12 bg-linen-50 p-3.5 text-sm outline-none transition focus:border-canopy-600 focus:bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-stone-700">City *</label>
                      <input
                        required
                        value={customer.city}
                        onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                        className="h-11 w-full rounded-xl border border-canopy-950/12 bg-linen-50 px-3.5 text-sm outline-none focus:border-canopy-600 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-stone-700">Pincode *</label>
                      <input
                        required
                        value={customer.pincode}
                        onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
                        className="h-11 w-full rounded-xl border border-canopy-950/12 bg-linen-50 px-3.5 text-sm outline-none focus:border-canopy-600 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-3 rounded-[18px] border border-canopy-950/10 bg-white p-5 shadow-soft">
                  <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-stone-600">
                    Payment Method
                  </label>
                  <div className="space-y-2.5">
                    {razorpayEnabled && (
                      <button
                        type="button"
                        onClick={() => setCustomer({ ...customer, paymentMethod: 'RAZORPAY' })}
                        className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                          customer.paymentMethod === 'RAZORPAY'
                            ? 'border-[#1967D2] bg-blue-50/60 ring-1 ring-[#1967D2]'
                            : 'border-canopy-950/10 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B2239] text-white">
                            <CreditCard className="h-4 w-4 text-blue-300" />
                          </span>
                          <div>
                            <p className="text-sm font-bold text-canopy-950">
                              Pay Online — Razorpay{' '}
                              <span className="ml-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-800">
                                Instant
                              </span>
                            </p>
                            <p className="text-[11px] text-stone-500">UPI • Cards • Netbanking • Wallets</p>
                          </div>
                        </div>
                        <ShieldCheck className="h-4 w-4 text-[#1967D2]" />
                      </button>
                    )}
                    {codEnabled && (
                      <button
                        type="button"
                        onClick={() => setCustomer({ ...customer, paymentMethod: 'COD' })}
                        className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                          customer.paymentMethod === 'COD'
                            ? 'border-canopy-950 bg-linen-50 ring-1 ring-canopy-950'
                            : 'border-canopy-950/10 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linen-100 text-canopy-900">
                            <Banknote className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="text-sm font-bold text-canopy-950">Cash on Delivery</p>
                            <p className="text-[11px] text-stone-500">Pay on delivery — cash or UPI scan</p>
                          </div>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </form>
            ) : cart.length === 0 ? (
              <div className="space-y-4 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-canopy-950/10 bg-white shadow-soft">
                  <ShoppingBag className="h-7 w-7 text-stone-500" />
                </div>
                <p className="font-serif text-2xl font-semibold text-canopy-950">Your bag is empty</p>
                <p className="text-xs text-stone-500">
                  Start with our bestseller — 4 Self-Watering Plants @ ₹{comboPrice}
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenBundle();
                  }}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-canopy-950 px-6 text-xs font-bold text-white shadow-soft"
                >
                  <Sparkles className="h-3.5 w-3.5 text-emerald-300" /> Build Box — ₹{comboPrice}
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {cart.map((item) => (
                  <div
                    key={item.key}
                    className="flex gap-3.5 rounded-[18px] border border-canopy-950/10 bg-white p-3.5 shadow-soft"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="h-16 w-16 shrink-0 rounded-xl border border-canopy-950/10 bg-linen-50 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="line-clamp-2 text-sm font-bold leading-snug text-canopy-950">
                          {item.productName}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.key)}
                          className="text-stone-400 transition hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-0.5 text-[11px] text-stone-500">
                        {item.potColor} • {item.potSize}
                      </p>
                      {item.isBundle && item.bundleItems?.length > 0 && (
                        <p className="mt-1.5 inline-block rounded-full border border-canopy-600/20 bg-canopy-50 px-2.5 py-0.5 text-[10.5px] font-semibold text-canopy-800">
                          Includes: {item.bundleItems.join(', ')}
                        </p>
                      )}
                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="inline-flex h-8 items-center rounded-full border border-canopy-950/10 bg-linen-50">
                          <button
                            onClick={() => onUpdateQty(item.key, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold hover:bg-white"
                          >
                            −
                          </button>
                          <span className="w-7 text-center text-xs font-bold num">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQty(item.key, item.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold hover:bg-white"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-extrabold text-canopy-950 num">
                          ₹{item.unitPrice * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* 🎁 Gift Mode + Free Personalized Printed Gift Card */}
                <div className="rounded-[18px] border border-canopy-600/25 bg-white p-4 shadow-soft">
                  <label className="flex cursor-pointer items-center justify-between gap-3">
                    <span className="flex items-center gap-2.5">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-canopy-50 text-canopy-700">
                        <Gift className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-xs font-extrabold text-canopy-950">
                          Send as a Gift + Printed Card
                        </span>
                        <span className="block text-[10.5px] text-stone-500">
                          Botanical message card &amp; kraft ribbon sleeve
                        </span>
                      </span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-canopy-800">
                        FREE
                      </span>
                      <input
                        type="checkbox"
                        checked={gift.isGift}
                        onChange={(e) => setGift({ ...gift, isGift: e.target.checked })}
                        className="h-4 w-4 accent-canopy-700"
                      />
                    </span>
                  </label>

                  {gift.isGift && (
                    <div className="mt-3.5 space-y-2.5 border-t border-canopy-950/10 pt-3">
                      <div className="flex flex-wrap gap-1.5">
                        {GIFT_OCCASIONS.map((occ) => (
                          <button
                            key={occ}
                            type="button"
                            onClick={() => setGift({ ...gift, giftOccasion: occ })}
                            className={`rounded-full border px-2.5 py-1 text-[10.5px] font-bold transition ${
                              gift.giftOccasion === occ
                                ? 'border-canopy-950 bg-canopy-950 text-emerald-300'
                                : 'border-canopy-950/10 bg-linen-50 text-stone-600 hover:bg-white'
                            }`}
                          >
                            {occ}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          value={gift.giftRecipient}
                          onChange={(e) => setGift({ ...gift, giftRecipient: e.target.value })}
                          placeholder="Recipient name (To)"
                          className="h-9 rounded-xl border border-canopy-950/12 bg-linen-50 px-3 text-xs font-medium outline-none focus:border-canopy-600 focus:bg-white"
                        />
                        <input
                          value={gift.giftSender}
                          onChange={(e) => setGift({ ...gift, giftSender: e.target.value })}
                          placeholder="Your name (From)"
                          className="h-9 rounded-xl border border-canopy-950/12 bg-linen-50 px-3 text-xs font-medium outline-none focus:border-canopy-600 focus:bg-white"
                        />
                      </div>

                      <textarea
                        rows={2}
                        maxLength={160}
                        value={gift.giftMessage}
                        onChange={(e) => setGift({ ...gift, giftMessage: e.target.value })}
                        placeholder="Write your gift note (printed on botanical card)…"
                        className="w-full rounded-xl border border-canopy-950/12 bg-linen-50 p-2.5 text-xs outline-none focus:border-canopy-600 focus:bg-white"
                      />

                      <div className="flex flex-wrap gap-1">
                        {GIFT_TEMPLATES.map((tpl, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setGift({ ...gift, giftMessage: tpl })}
                            className="rounded-full bg-linen-75 px-2.5 py-0.5 text-[10px] font-semibold text-canopy-800 hover:bg-canopy-100"
                          >
                            Template #{idx + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Live Pincode Delivery Checker */}
                <PincodeChecker
                  compact
                  onPincodeResolved={(res) => {
                    if (res?.pincode) {
                      setCustomer((prev) => ({
                        ...prev,
                        pincode: res.pincode,
                        city: res.city?.includes('Pune')
                          ? 'Pune'
                          : res.city?.includes('Mumbai')
                          ? 'Mumbai'
                          : res.city && res.city !== 'Pan-India'
                          ? res.city
                          : prev.city
                      }));
                    }
                  }}
                />

                {/* Promo Code */}
                <form
                  onSubmit={handleApplyCoupon}
                  className="space-y-3 rounded-[16px] border border-canopy-950/10 bg-white p-4 shadow-soft"
                >
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-3.5 h-3.5 w-3.5 text-stone-400" />
                      <input
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Promo code"
                        className="h-10 w-full rounded-full border border-canopy-950/10 bg-linen-50 pl-9 pr-3 text-xs font-bold uppercase outline-none focus:border-canopy-600 focus:bg-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="h-10 rounded-full bg-canopy-950 px-5 text-xs font-bold text-white transition hover:bg-canopy-800"
                    >
                      Apply
                    </button>
                  </div>
                  {activeOffers.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {activeOffers.slice(0, 3).map((off) => (
                        <button
                          type="button"
                          key={off.code}
                          onClick={() => applyCodeDirectly(off.code)}
                          className="rounded-full border border-canopy-950/10 bg-linen-50 px-3 py-1 text-[11px] font-semibold text-canopy-900 hover:bg-canopy-50"
                        >
                          Tap: <strong className="font-mono">{off.code}</strong> • {off.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {appliedCoupon && (
                    <p className="flex items-center gap-1 text-xs font-bold text-canopy-700">
                      <Leaf className="h-3 w-3" /> {appliedCoupon.code} — saved ₹{appliedCoupon.discount}
                    </p>
                  )}
                  {couponError && <p className="text-xs font-semibold text-red-600">{couponError}</p>}
                </form>
              </div>
            )}
          </div>

          {/* Sticky Summary Footer */}
          {cart.length > 0 && step !== 'success' && (
            <div className="space-y-3 border-t border-canopy-950/10 bg-white p-5">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="num">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between font-bold text-canopy-700">
                    <span>Promo Discount</span>
                    <span className="num">−₹{discount}</span>
                  </div>
                )}
                {gift.isGift && (
                  <div className="flex justify-between font-bold text-canopy-700">
                    <span>🎁 Printed Gift Card &amp; Sleeve</span>
                    <span>FREE</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Shipping</span>
                  <span className={shippingFee === 0 ? 'font-bold text-canopy-700' : 'num'}>
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between border-t border-canopy-950/10 pt-2.5 text-[16px] font-extrabold text-canopy-950">
                  <span>Total</span>
                  <span className="num">₹{grandTotal}</span>
                </div>
              </div>

              {step === 'cart' ? (
                <div className="space-y-2">
                  <button
                    onClick={() => setStep('checkout')}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-canopy-950 text-sm font-bold text-white shadow-soft transition hover:bg-canopy-800 active:scale-95"
                  >
                    Proceed to Checkout <ArrowRight className="h-4 w-4" />
                  </button>
                  <a
                    href={buildWhatsAppUrl(
                      storeConfig,
                      `Hi Greenzo Pune! I want to place an order from my bag:\n${cart
                        .map(
                          (i) =>
                            `• ${i.productName} (${i.potColor}, ${i.potSize}) × ${i.quantity} = ₹${
                              i.unitPrice * i.quantity
                            }`
                        )
                        .join('\n')}${
                        gift.isGift
                          ? `\n🎁 Gift Card (${gift.giftOccasion}) To: ${gift.giftRecipient || 'Recipient'} — "${
                              gift.giftMessage
                            }"`
                          : ''
                      }\nTotal: ₹${grandTotal}`
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-full border border-whatsapp/35 bg-whatsapp-soft text-xs font-bold text-whatsapp-deep transition hover:bg-whatsapp hover:text-white"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> Or Order Directly on WhatsApp
                  </a>
                </div>
              ) : (
                <button
                  type="submit"
                  form="checkoutForm"
                  disabled={submitting}
                  className={`flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-bold text-white shadow-soft transition active:scale-95 ${
                    customer.paymentMethod === 'RAZORPAY'
                      ? 'bg-[#1967D2] hover:bg-[#1353AB]'
                      : 'bg-canopy-950 hover:bg-canopy-800'
                  }`}
                >
                  {submitting
                    ? 'Processing…'
                    : customer.paymentMethod === 'RAZORPAY'
                    ? `Pay ₹${grandTotal} via Razorpay`
                    : `Place COD Order • ₹${grandTotal}`}{' '}
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}

              <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-stone-500">
                <ShieldCheck className="h-3.5 w-3.5 text-canopy-600" /> Secure checkout • 7-Day replacement • WhatsApp
                support
              </p>
            </div>
          )}
        </div>
      </div>

      {rzpSession && (
        <RazorpayGatewayModal
          session={rzpSession}
          customer={customer}
          onSuccess={finalizeRazorpayVerification}
          onCancel={() => setRzpSession(null)}
        />
      )}
    </>
  );
}
