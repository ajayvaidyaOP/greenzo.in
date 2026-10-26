import React from 'react';
import { Truck, ShieldCheck, Droplets, Leaf, RefreshCw, Award } from 'lucide-react';

const USPS = [
  { icon: Truck, title: 'Free Fast Delivery', desc: '₹499+ • Next-day in Pune' },
  { icon: Droplets, title: 'Hydro-Wick Atelier', desc: '14-day reservoir, no spills' },
  { icon: ShieldCheck, title: '7-Day Guarantee', desc: 'Healthy replacement' },
  { icon: Leaf, title: 'Pune Acclimatized', desc: '50K+ homes • 4.9★' },
];

export default function USPBar() {
  return (
    <div className="bg-white border-b border-stone-100">
      <div className="max-w-[1360px] mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-stone-100">
          {USPS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3 py-4 px-2">
              <div className="w-10 h-10 rounded-full bg-linen-50 border border-stone-100 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-canopy-800" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-canopy-950 leading-tight truncate">{title}</p>
                <p className="text-[11.5px] text-stone-500 leading-tight truncate">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
