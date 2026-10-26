import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Truck, CheckCircle2, AlertCircle, Camera } from 'lucide-react';
import { api } from '../lib/api.js';

const PIN_KEY = 'greenzo_pincode_v1';

export function getSavedPincode() {
  try {
    return localStorage.getItem(PIN_KEY) || '';
  } catch {
    return '';
  }
}

export function setSavedPincode(pin) {
  try {
    if (pin) localStorage.setItem(PIN_KEY, pin);
    window.dispatchEvent(new CustomEvent('greenzo:pincode', { detail: pin }));
  } catch {
    // ignore storage errors
  }
}

function localEvaluatePincode(rawPin) {
  const pin = String(rawPin || '').replace(/\D/g, '');
  if (!/^[1-8][0-9]{5}$/.test(pin)) return null;
  const fmt = (days) =>
    new Date(Date.now() + days * 86400000).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  const p3 = pin.slice(0, 3);
  const p2 = Number(pin.slice(0, 2));

  if (p3 === '411' || p3 === '412') {
    return {
      serviceable: true,
      pincode: pin,
      city: 'Pune / PCMC',
      zone: 'Pune Nursery Direct',
      dispatchBadge: 'Same-Day Dispatch from Theur',
      etaLabel: `Tomorrow (${fmt(1)})`,
      codAvailable: true,
      livePhotoProof: true
    };
  }
  if (['400', '401', '410'].includes(p3)) {
    return {
      serviceable: true,
      pincode: pin,
      city: 'Mumbai / Thane / Navi Mumbai',
      zone: 'Western Express Corridor',
      dispatchBadge: 'Next-Day Express Transit',
      etaLabel: `1–2 Days (${fmt(1)} – ${fmt(2)})`,
      codAvailable: true,
      livePhotoProof: true
    };
  }
  if (p2 >= 41 && p2 <= 44) {
    return {
      serviceable: true,
      pincode: pin,
      city: 'Maharashtra',
      zone: 'Maharashtra Priority',
      dispatchBadge: 'Direct Road-Pod Transit',
      etaLabel: `2–3 Days (${fmt(2)} – ${fmt(3)})`,
      codAvailable: true,
      livePhotoProof: true
    };
  }
  return {
    serviceable: true,
    pincode: pin,
    city: 'Pan-India',
    zone: 'Safe Honeycomb Pod',
    dispatchBadge: 'Ventilated Kraft Pod',
    etaLabel: `3–5 Days (${fmt(3)} – ${fmt(5)})`,
    codAvailable: true,
    livePhotoProof: true
  };
}

export default function PincodeChecker({ compact = false, onPincodeResolved }) {
  const [pinInput, setPinInput] = useState(() => getSavedPincode() || '411001');
  const [info, setInfo] = useState(() => localEvaluatePincode(getSavedPincode() || '411001'));
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const runCheck = useCallback(
    async (rawPin, persist = true) => {
      const cleaned = String(rawPin || '').replace(/\D/g, '').slice(0, 6);
      if (cleaned.length !== 6 || !/^[1-8][0-9]{5}$/.test(cleaned)) {
        setError('Enter a valid 6-digit Indian pincode');
        setInfo(null);
        return;
      }
      setError('');
      setChecking(true);
      try {
        const res = await api.checkServiceability(cleaned);
        setInfo(res);
        if (persist) setSavedPincode(cleaned);
        onPincodeResolved?.(res);
      } catch {
        const fallback = localEvaluatePincode(cleaned);
        if (fallback) {
          setInfo(fallback);
          if (persist) setSavedPincode(cleaned);
          onPincodeResolved?.(fallback);
        } else {
          setError('Enter a valid 6-digit Indian pincode');
        }
      } finally {
        setChecking(false);
      }
    },
    [onPincodeResolved]
  );

  useEffect(() => {
    const saved = getSavedPincode();
    if (saved) {
      setPinInput(saved);
      runCheck(saved, false);
    }
    const onSync = (e) => {
      if (e.detail && e.detail !== pinInput) {
        setPinInput(e.detail);
        const evaluated = localEvaluatePincode(e.detail);
        if (evaluated) setInfo(evaluated);
      }
    };
    window.addEventListener('greenzo:pincode', onSync);
    return () => window.removeEventListener('greenzo:pincode', onSync);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    runCheck(pinInput, true);
  };

  const quickPins = [
    { label: 'Pune', pin: '411001' },
    { label: 'Mumbai', pin: '400050' },
    { label: 'Bengaluru', pin: '560038' },
    { label: 'Delhi', pin: '110001' }
  ];

  return (
    <div className={`rounded-2xl border border-canopy-950/10 bg-linen-50 ${compact ? 'p-3' : 'p-3.5'}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-canopy-800">
          <MapPin className="h-3.5 w-3.5 text-canopy-600" /> Check Delivery &amp; COD
        </span>
        {!compact && (
          <div className="flex items-center gap-1">
            {quickPins.map((q) => (
              <button
                key={q.pin}
                type="button"
                onClick={() => {
                  setPinInput(q.pin);
                  runCheck(q.pin, true);
                }}
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition ${
                  pinInput === q.pin
                    ? 'bg-canopy-950 text-emerald-300'
                    : 'bg-white text-stone-600 hover:bg-canopy-100 hover:text-canopy-950'
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-2 flex items-center gap-2">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={pinInput}
          onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="Enter 6-digit pincode"
          className="h-9 flex-1 rounded-xl border border-canopy-950/12 bg-white px-3 font-mono text-[12.5px] font-bold text-canopy-950 placeholder:font-sans placeholder:font-normal placeholder:text-stone-400 focus:border-canopy-600 focus:outline-none"
        />
        <button
          type="submit"
          disabled={checking}
          className="h-9 rounded-xl bg-canopy-950 px-3.5 text-[11.5px] font-bold text-white transition hover:bg-canopy-800"
        >
          {checking ? 'Checking…' : 'Check'}
        </button>
      </form>

      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
        </p>
      )}

      {info && !error && (
        <div className="mt-2.5 space-y-1.5 rounded-xl border border-canopy-600/20 bg-white px-3 py-2.5 text-[11.5px]">
          <div className="flex flex-wrap items-center justify-between gap-1">
            <span className="inline-flex items-center gap-1.5 font-extrabold text-canopy-950">
              <Truck className="h-3.5 w-3.5 text-canopy-600" /> {info.etaLabel}
            </span>
            <span className="rounded-full bg-canopy-50 px-2 py-0.5 text-[10px] font-extrabold text-canopy-800">
              {info.city}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] font-semibold text-stone-600">
            <span className="inline-flex items-center gap-1 text-canopy-700">
              <CheckCircle2 className="h-3 w-3" /> COD Available
            </span>
            <span className="inline-flex items-center gap-1">
              <Camera className="h-3 w-3 text-canopy-600" /> WhatsApp Photo Proof
            </span>
            <span>• {info.dispatchBadge}</span>
          </div>
        </div>
      )}
    </div>
  );
}
