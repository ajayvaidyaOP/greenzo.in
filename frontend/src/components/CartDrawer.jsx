import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Tag,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Truck,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Banknote
} from 'lucide-react';
import { api } from '../lib/api.js';
import RazorpayGatewayModal, { loadRazorpaySdk } from './RazorpayGatewayModal.jsx';

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
  onNotify
}) {
  const [step, setStep] = useState('cart'); // cart | checkout | success
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
    notes: ''
  });

  // Pre-fill customer profile when logged in
  useEffect(() => {
    if (currentUser) {
      setCustomer((prev) => ({
        ...prev,
        customerName: prev.customerName || currentUser.name || '',
        customerPhone: prev.customerPhone || currentUser.phone || '',
        customerEmail: prev.customerEmail || currentUser.email || '',
        shippingAddress: prev.shippingAddress || currentUser.defaultAddress || '',
        city: currentUser.defaultCity || prev.city || 'Pune',
        pincode: currentUser.defaultPincode || prev.pincode || '411001'
      }));
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
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
      onNotify(`Offer ${res.code} applied! Saved ₹${res.discount}`);
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

  const finalizeRazorpayVerification = async (verificationPayload) => {
    try {
      const { order } = await api.verifyRazorpayAndPlace({
        ...verificationPayload,
        ...customer,
        couponCode: appliedCoupon?.code || '',
        items: cart
      });
      setRzpSession(null);
      setPlacedOrder(order);
      setStep('success');
      onClearCart();
      setAppliedCoupon(null);
      onNotify(`Razorpay Payment Successful! Order ${order.orderNumber} confirmed 🌿`);
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
              name: 'Greenzo.in',
              description: 'Self-Watering Indoor Plants',
              order_id: orderSession.razorpayOrderId,
              prefill: {
                name: customer.customerName,
                email: customer.customerEmail,
                contact: customer.customerPhone
              },
              theme: { color: '#152A1E' },
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

        // Open built-in Razorpay Secure Checkout Modal
        setRzpSession(orderSession);
        setSubmitting(false);
        return;
      }

      // Cash on Delivery Flow
      const { order } = await api.createOrder({
        ...customer,
        paymentMethod: 'COD',
        couponCode: appliedCoupon?.code || '',
        items: cart
      });
      setPlacedOrder(order);
      setStep('success');
      onClearCart();
      setAppliedCoupon(null);
      onNotify(`Order ${order.orderNumber} confirmed! 🌿`);
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
      <div className="fixed inset-0 z-50 flex justify-end">
        <div
          onClick={resetAndClose}
          className="absolute inset-0 bg-canopy-950/60 backdrop-blur-sm"
        />

        <div className="relative w-full max-w-[465px] h-full bg-linen-50 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="px-6 py-4 bg-white border-b border-canopy-900/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {step === 'checkout' && (
                <button
                  onClick={() => setStep('cart')}
                  className="w-8 h-8 rounded-full bg-linen-100 flex items-center justify-center mr-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <h3 className="font-serif text-2xl font-semibold text-canopy-950">
                {step === 'cart'
                  ? `Your Plant Bag (${cart.reduce((a, b) => a + b.quantity, 0)})`
                  : step === 'checkout'
                  ? 'Delivery & Razorpay Payment'
                  : 'Order Confirmed'}
              </h3>
            </div>
            <button
              onClick={resetAndClose}
              className="w-9 h-9 rounded-full bg-linen-100 hover:bg-linen-200 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress Strip */}
          {step === 'cart' && cart.length > 0 && (
            <div className="px-6 py-2.5 bg-emerald-950 text-emerald-100 text-xs flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 font-medium">
                <Truck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                {freeShipRemaining === 0
                  ? '🎉 You unlocked FREE Eco-Safe Express Shipping!'
                  : `Add ₹${freeShipRemaining} more for FREE Shipping`}
              </span>
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {step === 'success' && placedOrder ? (
              <div className="bg-white rounded-3xl p-6 border border-canopy-900/10 shadow-sm text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700">
                    {placedOrder.paymentStatus === 'PAID'
                      ? '✓ Razorpay Verified Payment'
                      : 'Confirmed • Cash on Delivery'}
                  </span>
                  <h4 className="font-serif text-3xl font-semibold text-canopy-950 mt-1">
                    Thank You, {placedOrder.customerName}!
                  </h4>
                  <p className="text-xs text-canopy-700 mt-1">
                    Order ID:{' '}
                    <strong className="font-mono text-canopy-950 bg-linen-100 px-2 py-0.5 rounded">
                      {placedOrder.orderNumber}
                    </strong>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-linen-50 text-left text-xs space-y-2 border border-canopy-900/8">
                  <div className="flex justify-between">
                    <span className="text-canopy-700">Dispatch Estimate</span>
                    <span className="font-semibold text-canopy-950">
                      {placedOrder.estimatedDelivery}
                    </span>
                  </div>
                  {placedOrder.razorpayPaymentId && (
                    <div className="flex justify-between">
                      <span className="text-canopy-700">Razorpay Payment ID</span>
                      <span className="font-mono font-semibold text-emerald-800">
                        {placedOrder.razorpayPaymentId}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-canopy-700">Delivery City</span>
                    <span className="font-semibold text-canopy-950">
                      {placedOrder.city} ({placedOrder.pincode})
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-canopy-900/10">
                    <span className="text-canopy-700">
                      {placedOrder.paymentStatus === 'PAID' ? 'Amount Paid' : 'Amount Payable'}
                    </span>
                    <span className="font-bold text-canopy-950 text-sm">
                      ₹{placedOrder.totalAmount}
                    </span>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${
                    storeConfig.whatsappNumber || '918883639639'
                  }?text=${encodeURIComponent(
                    `Hi Greenzo! Sharing my order confirmation ${placedOrder.orderNumber} (₹${placedOrder.totalAmount}) for ${placedOrder.city}.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full h-11 rounded-full bg-[#1FAF54] text-white text-xs font-semibold flex items-center justify-center gap-2"
                >
                  Share Order on WhatsApp for Live Photo Before Dispatch
                </a>

                <button
                  onClick={resetAndClose}
                  className="w-full h-11 rounded-full bg-canopy-900 text-white text-xs font-semibold"
                >
                  Continue Exploring Sanctuary
                </button>
              </div>
            ) : step === 'checkout' ? (
              <form id="checkoutForm" onSubmit={handlePlaceOrder} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-canopy-800 mb-1">
                    Full Name *
                  </label>
                  <input
                    required
                    value={customer.customerName}
                    onChange={(e) => setCustomer({ ...customer, customerName: e.target.value })}
                    placeholder="Priya Kulkarni"
                    className="w-full h-10 px-3.5 rounded-xl bg-white border border-canopy-900/15 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-canopy-800 mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      required
                      value={customer.customerPhone}
                      onChange={(e) => setCustomer({ ...customer, customerPhone: e.target.value })}
                      placeholder="+91 98XXXXXXXX"
                      className="w-full h-10 px-3.5 rounded-xl bg-white border border-canopy-900/15 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-canopy-800 mb-1">Email</label>
                    <input
                      type="email"
                      value={customer.customerEmail}
                      onChange={(e) => setCustomer({ ...customer, customerEmail: e.target.value })}
                      placeholder="priya@email.com"
                      className="w-full h-10 px-3.5 rounded-xl bg-white border border-canopy-900/15 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-canopy-800 mb-1">
                    Complete Delivery Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={customer.shippingAddress}
                    onChange={(e) => setCustomer({ ...customer, shippingAddress: e.target.value })}
                    placeholder="Flat / Society, Landmark, Road..."
                    className="w-full p-3 rounded-xl bg-white border border-canopy-900/15 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-canopy-800 mb-1">
                      City *
                    </label>
                    <input
                      required
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      className="w-full h-10 px-3.5 rounded-xl bg-white border border-canopy-900/15 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-canopy-800 mb-1">
                      Pincode *
                    </label>
                    <input
                      required
                      value={customer.pincode}
                      onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
                      className="w-full h-10 px-3.5 rounded-xl bg-white border border-canopy-900/15 text-sm"
                    />
                  </div>
                </div>

                {/* Payment Method Selector: Razorpay Online vs COD */}
                <div>
                  <label className="block text-xs font-semibold text-canopy-800 mb-2">
                    Select Payment Method
                  </label>
                  <div className="space-y-2.5">
                    {razorpayEnabled && (
                      <button
                        type="button"
                        onClick={() => setCustomer({ ...customer, paymentMethod: 'RAZORPAY' })}
                        className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition ${
                          customer.paymentMethod === 'RAZORPAY'
                            ? 'bg-blue-50/70 border-[#1967D2] ring-1 ring-[#1967D2]'
                            : 'bg-white border-canopy-900/15'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#0B2239] text-white flex items-center justify-center shrink-0">
                            <CreditCard className="w-4 h-4 text-blue-300" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-canopy-950 flex items-center gap-1.5">
                              <span>Pay Online via Razorpay</span>
                              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px]">
                                Instant
                              </span>
                            </p>
                            <p className="text-[11px] text-canopy-700/75">
                              UPI (GPay, PhonePe, Paytm), Cards, Netbanking & Wallets
                            </p>
                          </div>
                        </div>
                        <ShieldCheck className="w-4 h-4 text-[#1967D2] shrink-0" />
                      </button>
                    )}

                    {codEnabled && (
                      <button
                        type="button"
                        onClick={() => setCustomer({ ...customer, paymentMethod: 'COD' })}
                        className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition ${
                          customer.paymentMethod === 'COD'
                            ? 'bg-linen-100 border-canopy-900 ring-1 ring-canopy-900'
                            : 'bg-white border-canopy-900/15'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-linen-200 text-canopy-900 flex items-center justify-center shrink-0">
                            <Banknote className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-canopy-950">
                              Cash on Delivery (COD)
                            </p>
                            <p className="text-[11px] text-canopy-700/75">
                              Pay by cash or doorstep UPI scan when plants arrive
                            </p>
                          </div>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </form>
            ) : cart.length === 0 ? (
              <div className="text-center py-14 space-y-4">
                <div className="w-16 h-16 rounded-full bg-white border border-canopy-900/10 flex items-center justify-center mx-auto text-canopy-700">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div>
                  <p className="font-serif text-2xl font-semibold text-canopy-950">
                    Your plant bag is empty
                  </p>
                  <p className="text-xs text-canopy-700/75 mt-1">
                    Start with our signature Self-Watering Box @ ₹{comboPrice}
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenBundle();
                  }}
                  className="px-6 py-3 rounded-full bg-canopy-900 text-white text-xs font-semibold inline-flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Build Combo Box @ ₹{comboPrice}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.key}
                    className="bg-white rounded-2xl p-3.5 border border-canopy-900/8 flex gap-3.5 shadow-sm"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-linen-100"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-canopy-950 leading-snug">
                          {item.productName}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.key)}
                          className="text-canopy-700/50 hover:text-red-600 transition shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[11px] text-canopy-700/75 mt-0.5">
                        {item.potColor} • {item.potSize}
                      </p>
                      {item.isBundle && item.bundleItems?.length > 0 && (
                        <p className="text-[10.5px] text-emerald-800 bg-emerald-50 rounded px-2 py-0.5 mt-1 line-clamp-2">
                          Includes: {item.bundleItems.join(', ')}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-2.5">
                        <div className="inline-flex items-center border border-canopy-900/15 rounded-lg h-7">
                          <button
                            onClick={() => onUpdateQty(item.key, item.quantity - 1)}
                            className="w-6 text-xs font-bold"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-xs font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQty(item.key, item.quantity + 1)}
                            className="w-6 text-xs font-bold"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-bold text-canopy-950">
                          ₹{item.unitPrice * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Promo Code Input + 1-Click Available Offers */}
                <form
                  onSubmit={handleApplyCoupon}
                  className="bg-white rounded-2xl p-3.5 border border-canopy-900/8 space-y-2.5"
                >
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-canopy-700/60 absolute left-3 top-3" />
                      <input
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Enter Promo Code"
                        className="w-full h-9 pl-8 pr-3 rounded-lg bg-linen-50 border border-canopy-900/10 text-xs uppercase font-semibold"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 h-9 rounded-lg bg-canopy-900 text-white text-xs font-semibold"
                    >
                      Apply
                    </button>
                  </div>

                  {activeOffers.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {activeOffers.slice(0, 3).map((off) => (
                        <button
                          type="button"
                          key={off.code}
                          onClick={() => applyCodeDirectly(off.code)}
                          className="px-2.5 py-1 rounded-lg bg-linen-50 hover:bg-emerald-50 border border-canopy-900/10 text-[10.5px] font-semibold text-canopy-900 transition"
                        >
                          Tap: <strong className="font-mono">{off.code}</strong> ({off.label})
                        </button>
                      ))}
                    </div>
                  )}

                  {appliedCoupon && (
                    <p className="text-[11px] text-emerald-700 font-semibold">
                      ✓ {appliedCoupon.code} applied (Saved ₹{appliedCoupon.discount})
                    </p>
                  )}
                  {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
                </form>
              </div>
            )}
          </div>

          {/* Sticky Checkout Summary Footer */}
          {cart.length > 0 && step !== 'success' && (
            <div className="p-6 bg-white border-t border-canopy-900/10 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-canopy-800/80">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Promo Discount</span>
                    <span>−₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-canopy-800/80">
                  <span>Eco-Safe Shipping</span>
                  <span className={shippingFee === 0 ? 'text-emerald-700 font-semibold' : ''}>
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-canopy-950 pt-2 border-t border-canopy-900/10">
                  <span>Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              {step === 'cart' ? (
                <button
                  onClick={() => setStep('checkout')}
                  className="w-full h-12 rounded-full bg-canopy-900 hover:bg-canopy-950 text-white text-sm font-semibold flex items-center justify-center gap-2 transition active:scale-95"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  form="checkoutForm"
                  disabled={submitting}
                  className={`w-full h-12 rounded-full text-white text-sm font-semibold flex items-center justify-center gap-2 transition active:scale-95 ${
                    customer.paymentMethod === 'RAZORPAY'
                      ? 'bg-[#1967D2] hover:bg-[#1353AB]'
                      : 'bg-canopy-900 hover:bg-canopy-950'
                  }`}
                >
                  <span>
                    {submitting
                      ? 'Initializing...'
                      : customer.paymentMethod === 'RAZORPAY'
                      ? `Pay ₹${grandTotal} with Razorpay`
                      : `Place COD Order • ₹${grandTotal}`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Razorpay Checkout Gateway Modal */}
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
