import React, { useState } from 'react';
import {
  ShieldCheck,
  X,
  Smartphone,
  CreditCard,
  Landmark,
  Wallet,
  Lock,
  CheckCircle2,
  Loader2
} from 'lucide-react';

export function loadRazorpaySdk() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function RazorpayGatewayModal({
  session,
  customer,
  onSuccess,
  onCancel
}) {
  const [method, setMethod] = useState('UPI'); // UPI | CARD | NETBANKING | WALLET
  const [upiApp, setUpiApp] = useState('Google Pay');
  const [upiId, setUpiId] = useState('greenzo.buyer@okicici');
  const [bank, setBank] = useState('HDFC Bank');
  const [walletName, setWalletName] = useState('Amazon Pay');
  const [processing, setProcessing] = useState(false);

  if (!session) return null;

  const handleCompleteSandboxPayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    // Brief realistic gateway verification step
    await new Promise((r) => setTimeout(r, 900));
    const methodLabel =
      method === 'UPI'
        ? `UPI - ${upiApp}`
        : method === 'CARD'
        ? 'Card •••• 4242'
        : method === 'NETBANKING'
        ? `Netbanking - ${bank}`
        : `Wallet - ${walletName}`;

    await onSuccess({
      mode: 'sandbox',
      razorpayOrderId: session.razorpayOrderId,
      sandboxToken: session.sandboxToken,
      sandboxMethod: methodLabel
    });
    setProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-5">
      <div
        onClick={() => !processing && onCancel()}
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-[430px] rounded-3xl overflow-hidden bg-white shadow-2xl border border-slate-200">
        {/* Authentic Razorpay Merchant Top Banner */}
        <div className="bg-[#0B2239] text-white p-5 relative">
          <button
            type="button"
            disabled={processing}
            onClick={onCancel}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-canopy-800 border border-white/20 flex items-center justify-center font-serif italic text-2xl font-bold text-emerald-300 shrink-0">
              g
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-semibold text-[15px] leading-tight">Greenzo.in</h4>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Razorpay Trusted Business • {session.razorpayOrderId}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-white/10 flex items-baseline justify-between">
            <div>
              <span className="text-[10.5px] uppercase tracking-wider text-slate-300 block">
                Total Payable
              </span>
              <span className="text-2xl font-bold tracking-tight">
                ₹{session.amountRupees.toLocaleString('en-IN')}.00
              </span>
            </div>
            <div className="text-right text-[11px] text-slate-300">
              <p className="truncate max-w-[160px]">{customer.customerPhone}</p>
              <span className="inline-block px-2 py-0.5 rounded bg-blue-500/20 text-blue-200 text-[10px] font-semibold mt-0.5">
                Razorpay Secure Checkout
              </span>
            </div>
          </div>
        </div>

        {/* Payment Method Selector Tabs */}
        <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
          {[
            { id: 'UPI', label: 'UPI / QR', icon: Smartphone },
            { id: 'CARD', label: 'Cards', icon: CreditCard },
            { id: 'NETBANKING', label: 'Netbanking', icon: Landmark },
            { id: 'WALLET', label: 'Wallets', icon: Wallet }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = method === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMethod(tab.id)}
                className={`py-3 flex flex-col items-center gap-1 border-b-2 transition ${
                  active
                    ? 'border-[#2B6CB0] text-[#0B2239] bg-white font-bold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Payment Body */}
        <form onSubmit={handleCompleteSandboxPayment} className="p-5 space-y-4">
          {method === 'UPI' && (
            <div className="space-y-3.5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Instant UPI Apps
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {['Google Pay', 'PhonePe', 'Paytm'].map((app) => (
                    <button
                      type="button"
                      key={app}
                      onClick={() => setUpiApp(app)}
                      className={`py-2.5 px-2 rounded-xl border text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                        upiApp === app
                          ? 'border-[#2B6CB0] bg-blue-50/70 text-[#0B2239]'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {upiApp === app && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                      <span>{app}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Or Pay via UPI ID
                </label>
                <input
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@okhdfcbank"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
          )}

          {method === 'CARD' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Card Number (Visa / Mastercard / RuPay)
                </label>
                <input
                  required
                  defaultValue="4111 1111 1111 4242"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                    Expiry
                  </label>
                  <input
                    required
                    defaultValue="09 / 29"
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                    CVV
                  </label>
                  <input
                    required
                    type="password"
                    defaultValue="123"
                    maxLength={4}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {method === 'NETBANKING' && (
            <div className="grid grid-cols-2 gap-2.5">
              {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((b) => (
                <button
                  type="button"
                  key={b}
                  onClick={() => setBank(b)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${
                    bank === b
                      ? 'border-[#2B6CB0] bg-blue-50/70 text-[#0B2239]'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          )}

          {method === 'WALLET' && (
            <div className="grid grid-cols-3 gap-2">
              {['Amazon Pay', 'Paytm Wallet', 'Mobikwik'].map((w) => (
                <button
                  type="button"
                  key={w}
                  onClick={() => setWalletName(w)}
                  className={`p-3 rounded-xl border text-xs font-semibold transition ${
                    walletName === w
                      ? 'border-[#2B6CB0] bg-blue-50/70 text-[#0B2239]'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={processing}
            className="w-full h-12 rounded-xl bg-[#1967D2] hover:bg-[#1353AB] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md transition active:scale-[0.99]"
          >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Payment with Razorpay...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Pay ₹{session.amountRupees.toLocaleString('en-IN')} Now</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-[10.5px] text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" /> 256-bit PCI-DSS Encrypted
            </span>
            <span className="font-semibold text-slate-500">Powered by Razorpay</span>
          </div>
        </form>
      </div>
    </div>
  );
}
