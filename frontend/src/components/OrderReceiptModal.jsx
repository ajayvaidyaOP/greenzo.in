import React from 'react';
import { X, Printer, Gift, Leaf, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { buildWhatsAppUrl, WhatsAppIcon } from '../lib/whatsapp.jsx';

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function printOrderInvoice(order, storeConfig = {}) {
  if (!order) return;
  const phone = storeConfig.phone || '+91 8883639639';
  const dateStr = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const rowsHtml = (order.items || [])
    .map(
      (it, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>
          <strong>${esc(it.productName)}</strong><br/>
          <span style="color:#55635c;font-size:11px;">${esc(it.potColor)} · ${esc(it.potSize)}</span>
          ${
            it.bundleItems?.length
              ? `<br/><span style="color:#1a6446;font-size:11px;">Includes: ${esc(it.bundleItems.join(', '))}</span>`
              : ''
          }
        </td>
        <td>0602</td>
        <td style="text-align:center;">${Number(it.quantity || 1)}</td>
        <td style="text-align:right;">₹${Number(it.unitPrice || 0)}</td>
        <td style="text-align:right;font-weight:700;">₹${Number(it.unitPrice || 0) * Number(it.quantity || 1)}</td>
      </tr>`
    )
    .join('');

  const giftHtml = order.isGift
    ? `<div style="margin-top:16px;padding:12px 14px;border:1px dashed #1a6446;border-radius:10px;background:#f1faf5;">
        <strong style="font-size:12px;color:#071e15;">🎁 Personalized Gift Card Included (Complimentary)</strong>
        <div style="font-size:12px;margin-top:4px;color:#232b27;">
          ${order.giftOccasion ? `<strong>Occasion:</strong> ${esc(order.giftOccasion)} · ` : ''}
          ${order.giftRecipient ? `<strong>To:</strong> ${esc(order.giftRecipient)} · ` : ''}
          ${order.giftSender ? `<strong>From:</strong> ${esc(order.giftSender)}` : ''}
        </div>
        ${order.giftMessage ? `<div style="font-style:italic;margin-top:4px;font-size:12px;">“${esc(order.giftMessage)}”</div>` : ''}
      </div>`
    : '';

  const win = window.open('', '_blank', 'width=840,height=920');
  if (!win) {
    window.print();
    return;
  }

  win.document.write(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Greenzo Invoice — ${esc(order.orderNumber)}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; color: #071e15; padding: 32px; max-width: 780px; margin: 0 auto; }
    .hdr { display: flex; justify-content: space-between; border-bottom: 2px solid #071e15; padding-bottom: 16px; }
    .brand { font-size: 26px; font-weight: 800; letter-spacing: -0.03em; }
    .sub { font-size: 11px; color: #4c5952; margin-top: 4px; line-height: 1.5; }
    .meta { text-align: right; font-size: 12px; line-height: 1.6; }
    .badge { display: inline-block; padding: 3px 9px; border-radius: 99px; background: #e3f6ed; color: #0b2b1e; font-weight: 700; font-size: 11px; }
    .addr { margin-top: 18px; padding: 14px; background: #f8fbf9; border: 1px solid #dce3df; border-radius: 10px; font-size: 12.5px; line-height: 1.55; }
    table { width: 100%; border-collapse: collapse; margin-top: 18px; font-size: 12.5px; }
    th { text-align: left; background: #071e15; color: #fff; padding: 9px 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; }
    td { padding: 10px; border-bottom: 1px solid #e6f0ea; vertical-align: top; }
    .totals { margin-top: 16px; margin-left: auto; width: 280px; font-size: 13px; }
    .totals div { display: flex; justify-content: space-between; padding: 4px 0; }
    .grand { border-top: 2px solid #071e15; font-size: 16px; font-weight: 800; padding-top: 8px !important; margin-top: 4px; }
    .care { margin-top: 22px; padding-top: 14px; border-top: 1px solid #dce3df; font-size: 11.5px; color: #4c5952; line-height: 1.6; }
    @media print { body { padding: 12px; } }
  </style>
</head>
<body>
  <div class="hdr">
    <div>
      <div class="brand">greenzo.in</div>
      <div class="sub">
        Empire Agro Nursery, Tar Mala Road, Theur, Haveli, Pune 412110<br/>
        GSTIN: 27AAECG4821M1Z5 · Helpline: ${esc(phone)} · Greenzo.pune@gmail.com
      </div>
    </div>
    <div class="meta">
      <div><strong>TAX INVOICE / ORDER RECEIPT</strong></div>
      <div>Order No: <strong>${esc(order.orderNumber)}</strong></div>
      <div>Date: ${esc(dateStr)}</div>
      <div style="margin-top:4px;"><span class="badge">${esc(order.paymentStatus || 'PENDING')} · ${esc(order.paymentMethod || 'COD')}</span></div>
      ${order.razorpayPaymentId ? `<div style="font-family:monospace;font-size:11px;">Txn: ${esc(order.razorpayPaymentId)}</div>` : ''}
    </div>
  </div>

  <div class="addr">
    <strong>Deliver To:</strong> ${esc(order.customerName)} ${order.customerPhone ? `(${esc(order.customerPhone)})` : ''}<br/>
    ${order.shippingAddress ? `${esc(order.shippingAddress)}, ` : ''}${esc(order.city)} — ${esc(order.pincode)}
  </div>

  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Plant &amp; Self-Watering Planter</th>
        <th>HSN</th>
        <th style="text-align:center;">Qty</th>
        <th style="text-align:right;">Rate</th>
        <th style="text-align:right;">Amount</th>
      </tr>
    </thead>
    <tbody>${rowsHtml}</tbody>
  </table>

  <div class="totals">
    <div><span>Subtotal</span><span>₹${Number(order.subtotal ?? order.totalAmount)}</span></div>
    ${Number(order.discountAmount || 0) > 0 ? `<div style="color:#1a6446;"><span>Promo Discount ${order.couponCode ? `(${esc(order.couponCode)})` : ''}</span><span>−₹${Number(order.discountAmount)}</span></div>` : ''}
    <div><span>Pod Packaging &amp; Shipping</span><span>${Number(order.shippingFee || 0) === 0 ? 'FREE' : `₹${Number(order.shippingFee)}`}</span></div>
    <div class="grand"><span>Grand Total (Incl. Taxes)</span><span>₹${Number(order.totalAmount)}</span></div>
  </div>

  ${giftHtml}

  <div class="care">
    <strong>First-Day Hydro-Wick Care Guide:</strong> Unbox gently, place in bright/medium indoor light (avoid harsh afternoon sun for 48 hrs), and fill 200 ml clean water into the outer reservoir. Refill once every 10–14 days. Backed by Greenzo's 7-Day Healthy Replacement Guarantee.
  </div>
  <script>window.onload = () => { window.print(); };</script>
</body>
</html>`);
  win.document.close();
}

export default function OrderReceiptModal({ order, storeConfig = {}, onClose }) {
  if (!order) return null;

  const dateStr = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const waReceiptUrl = buildWhatsAppUrl(
    storeConfig,
    `Hi Greenzo Pune! Sharing my order ${order.orderNumber} (₹${order.totalAmount}) for ${order.city} (${order.pincode}).${
      order.isGift ? ` [Gift Order for ${order.giftRecipient || 'loved one'}]` : ''
    } Please share live plant photos before dispatch!`
  );

  return (
    <div className="fixed inset-0 z-[92] flex items-center justify-center p-3 sm:p-6">
      <div onClick={onClose} className="absolute inset-0 animate-fade-in bg-canopy-950/65 backdrop-blur-md" />

      <div className="relative flex max-h-[92vh] w-full max-w-2xl animate-scale-in flex-col overflow-hidden rounded-[28px] border border-canopy-950/15 bg-white shadow-elevated">
        {/* Top Bar */}
        <div className="flex items-center justify-between bg-canopy-950 px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-400 text-canopy-950">
              <Leaf className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-300">
                Official Order Receipt &amp; Care Card
              </p>
              <h3 className="font-mono text-base font-bold">{order.orderNumber}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close receipt"
            className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Invoice Content */}
        <div className="flex-1 space-y-4 overflow-y-auto p-6 text-xs">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-canopy-950/10 pb-4">
            <div>
              <p className="font-serif text-xl font-bold text-canopy-950">greenzo.in</p>
              <p className="mt-0.5 text-[11px] text-stone-500">
                Empire Agro Nursery, Theur, Pune 412110 · GSTIN: 27AAECG4821M1Z5
              </p>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                  order.paymentStatus === 'PAID'
                    ? 'bg-emerald-100 text-canopy-900'
                    : 'bg-brass-100 text-brass-700'
                }`}
              >
                <CheckCircle2 className="h-3 w-3" /> {order.paymentStatus || 'CONFIRMED'} · {order.paymentMethod}
              </span>
              <p className="mt-1 text-[11px] text-stone-500">Date: {dateStr}</p>
              {order.razorpayPaymentId && (
                <p className="font-mono text-[10.5px] text-canopy-700">Txn: {order.razorpayPaymentId}</p>
              )}
            </div>
          </div>

          {/* Customer Address */}
          <div className="rounded-2xl border border-canopy-950/10 bg-linen-50 p-3.5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-stone-400">Deliver To</p>
            <p className="mt-1 text-[13px] font-bold text-canopy-950">
              {order.customerName} {order.customerPhone ? `· ${order.customerPhone}` : ''}
            </p>
            <p className="mt-0.5 text-[11.5px] text-stone-600">
              {order.shippingAddress ? `${order.shippingAddress}, ` : ''}
              {order.city} — {order.pincode}
            </p>
          </div>

          {/* Items */}
          <div className="overflow-hidden rounded-2xl border border-canopy-950/10">
            <div className="grid grid-cols-12 bg-canopy-950 px-4 py-2.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
              <span className="col-span-7">Plant &amp; Planter</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-3 text-right">Amount</span>
            </div>
            <div className="divide-y divide-canopy-950/10 bg-white">
              {(order.items || []).map((it, idx) => (
                <div key={idx} className="grid grid-cols-12 items-center px-4 py-3">
                  <div className="col-span-7 pr-2">
                    <p className="font-bold text-canopy-950">{it.productName}</p>
                    <p className="text-[11px] text-stone-500">
                      {it.potColor} · {it.potSize} · HSN 0602
                    </p>
                    {it.bundleItems?.length > 0 && (
                      <p className="mt-0.5 text-[10.5px] font-semibold text-canopy-700">
                        Includes: {it.bundleItems.join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="col-span-2 text-center font-bold num">{it.quantity}×</span>
                  <span className="col-span-3 text-right font-extrabold text-canopy-950 num">
                    ₹{it.unitPrice * it.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Gift Card Preview */}
          {order.isGift && (
            <div className="rounded-2xl border border-dashed border-canopy-600/45 bg-canopy-50/70 p-4">
              <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-canopy-800">
                <Gift className="h-3.5 w-3.5 text-canopy-600" /> Free Printed Gift Card Included
              </p>
              <p className="mt-1 text-xs font-semibold text-canopy-950">
                {order.giftOccasion ? `${order.giftOccasion} · ` : ''}
                {order.giftRecipient ? `To: ${order.giftRecipient}` : ''}{' '}
                {order.giftSender ? `· From: ${order.giftSender}` : ''}
              </p>
              {order.giftMessage && (
                <p className="mt-1 font-serif text-[13px] italic text-stone-700">“{order.giftMessage}”</p>
              )}
            </div>
          )}

          {/* Totals */}
          <div className="space-y-1.5 rounded-2xl border border-canopy-950/10 bg-linen-50 p-4">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span className="font-semibold num">₹{order.subtotal ?? order.totalAmount}</span>
            </div>
            {Number(order.discountAmount || 0) > 0 && (
              <div className="flex justify-between font-bold text-canopy-700">
                <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                <span className="num">−₹{order.discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>Honeycomb Pod Shipping</span>
              <span className="font-bold text-canopy-700">
                {Number(order.shippingFee || 0) === 0 ? 'FREE' : `₹${order.shippingFee}`}
              </span>
            </div>
            <div className="flex justify-between border-t border-canopy-950/10 pt-2 text-[15px] font-extrabold text-canopy-950">
              <span>Grand Total (Incl. Taxes)</span>
              <span className="num">₹{order.totalAmount}</span>
            </div>
          </div>

          <p className="flex items-center gap-1.5 text-[11px] text-stone-500">
            <ShieldCheck className="h-3.5 w-3.5 text-canopy-600" /> Covered by Greenzo 7-Day Healthy Replacement
            Guarantee
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-canopy-950/10 bg-linen-50 px-6 py-4">
          <a
            href={waReceiptUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-whatsapp btn-sm"
          >
            <WhatsAppIcon className="h-4 w-4" /> Share on WhatsApp
          </a>
          <button
            type="button"
            onClick={() => printOrderInvoice(order, storeConfig)}
            className="btn btn-dark btn-sm"
          >
            <Printer className="h-4 w-4 text-emerald-300" /> Print / Save PDF Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
