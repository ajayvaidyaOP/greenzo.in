import React, { useState, useEffect } from 'react';
import { X, Search, PackageCheck, Database, RefreshCw, IndianRupee } from 'lucide-react';
import { api } from '../lib/api.js';

export function TrackOrderModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('GRZ-2610-4821');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      const { order } = await api.trackOrder(query.trim());
      setResult(order);
    } catch (err) {
      setResult(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-canopy-950/65 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-elevated space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-canopy-700" />
            <h3 className="font-serif text-2xl font-semibold text-canopy-950">
              Track Your Plant Delivery
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-linen-100 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleTrack} className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Order ID (e.g. GRZ-2610-4821) or Phone"
            className="flex-1 h-11 px-4 rounded-xl bg-linen-50 border border-canopy-900/15 text-sm font-medium"
          />
          <button
            type="submit"
            disabled={loading}
            className="h-11 px-5 rounded-xl bg-canopy-900 text-white text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{loading ? '...' : 'Track'}</span>
          </button>
        </form>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs font-medium">{error}</div>
        )}

        {result && (
          <div className="rounded-2xl bg-linen-50 p-4 border border-canopy-900/10 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-canopy-950">
                {result.orderNumber}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[11px]">
                ● {result.status}
              </span>
            </div>
            <p className="text-canopy-800">
              Customer: <strong>{result.customerName}</strong> • {result.city} ({result.pincode})
            </p>
            <div className="border-t border-canopy-900/10 pt-2 space-y-1.5">
              {(result.items || []).map((it) => (
                <div key={it.id} className="flex justify-between text-canopy-900">
                  <span>
                    {it.quantity}× {it.productName} ({it.potColor})
                  </span>
                  <span className="font-semibold">₹{it.unitPrice * it.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-canopy-900/10 pt-2 flex justify-between font-bold text-sm text-canopy-950">
              <span>Total ({result.paymentMethod})</span>
              <span>₹{result.totalAmount}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function LiveStoreDashboard({ isOpen, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadOverview = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminOverview();
      setData(res);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) loadOverview();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-canopy-950/70 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-4xl max-h-[88vh] bg-linen-50 rounded-3xl shadow-elevated overflow-hidden flex flex-col">
        <div className="px-6 py-4 bg-canopy-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-serif text-2xl font-medium">
                Greenzo Live Backend Ledger (SQLite WAL)
              </h3>
              <p className="text-[11px] text-emerald-300/80">
                Real-time orders, consultations & nursery stock persisted via Express REST API
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadOverview}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
              title="Refresh live data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {data && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="bg-white p-4 rounded-2xl border border-canopy-900/10">
                  <span className="text-[11px] font-bold uppercase text-canopy-700/70">
                    Total Revenue
                  </span>
                  <p className="text-2xl font-bold text-canopy-950 mt-1 flex items-center">
                    <IndianRupee className="w-5 h-5" />
                    {data.metrics.totalRevenue.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-canopy-900/10">
                  <span className="text-[11px] font-bold uppercase text-canopy-700/70">
                    Orders Persisted
                  </span>
                  <p className="text-2xl font-bold text-canopy-950 mt-1">
                    {data.metrics.totalOrders}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-canopy-900/10">
                  <span className="text-[11px] font-bold uppercase text-canopy-700/70">
                    Nursery Stock
                  </span>
                  <p className="text-2xl font-bold text-emerald-800 mt-1">
                    {data.metrics.totalNurseryStock} Pots
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-canopy-900/10">
                  <span className="text-[11px] font-bold uppercase text-canopy-700/70">
                    Botanist Bookings
                  </span>
                  <p className="text-2xl font-bold text-canopy-950 mt-1">
                    {data.metrics.totalConsultations}
                  </p>
                </div>
              </div>

              {/* Recent Orders Table */}
              <div className="bg-white rounded-2xl border border-canopy-900/10 overflow-hidden">
                <div className="px-5 py-3 bg-linen-100/60 border-b border-canopy-900/10 text-xs font-bold uppercase tracking-wider text-canopy-800">
                  Recent Live Orders
                </div>
                <div className="divide-y divide-canopy-900/10">
                  {data.recentOrders.map((o) => (
                    <div
                      key={o.id}
                      className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-canopy-950 mr-2">
                          {o.orderNumber}
                        </span>
                        <span className="font-semibold text-canopy-900">{o.customerName}</span>
                        <span className="text-canopy-700/70"> • {o.city}</span>
                        <p className="text-[11px] text-canopy-700/75 mt-0.5">
                          {o.items.map((i) => `${i.quantity}× ${i.productName}`).join(', ')}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[10.5px]">
                          {o.status}
                        </span>
                        <span className="font-bold text-sm text-canopy-950">₹{o.totalAmount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consultations */}
              <div className="bg-white rounded-2xl border border-canopy-900/10 overflow-hidden">
                <div className="px-5 py-3 bg-linen-100/60 border-b border-canopy-900/10 text-xs font-bold uppercase tracking-wider text-canopy-800">
                  Scheduled Plant Consultations
                </div>
                <div className="divide-y divide-canopy-900/10">
                  {data.recentConsultations.map((c) => (
                    <div
                      key={c.id}
                      className="px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <strong className="text-canopy-950">{c.name}</strong> ({c.phone}) —{' '}
                        <span className="text-canopy-700">
                          {c.spaceType} • {c.lightCondition}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-800">
                        {c.preferredSlot}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
