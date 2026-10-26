import React, { useState, useEffect } from 'react';
import { Star, Check, Clock, ShoppingBag, Heart, Truck, Leaf, Sparkles } from 'lucide-react';
import { getPotSwatchClass } from '../lib/api.js';

export default function DealOfTheWeek({ dealProduct, isWishlisted, onToggleWishlist, onAddToCart }) {
  const product = dealProduct || {
    slug: 'zamia-green', name: 'Zamia Green (ZZ Plant)', botanicalName: 'Zamioculcas zamiifolia', price: 269, maxPrice: 319, originalPrice: 349, rating: 4.9, reviewCount: 312, imageUrl: '/images/zamia-green.jpg',
    description: 'Sculptural emerald foliage in our signature hydro-wick atelier pot — thrives in low light & AC workspaces, purifying air.', potColors: ['Matte Ivory', 'Forest Sage', 'Terracotta Sand', 'Charcoal Matte'], features: ['14-day reservoir', 'AC office ready', 'Air-purifying', '7-day guarantee']
  };
  const [potSize, setPotSize] = useState('Medium (5 inch Self-Watering)');
  const [potColor, setPotColor] = useState(product.potColors?.[0] || 'Matte Ivory');
  const [timeLeft, setTimeLeft] = useState({ d: '02', h: '14', m: '36', s: '49' });
  useEffect(() => {
    const end = Date.now() + (2 * 86400 + 14 * 3600 + 36 * 60 + 49) * 1000;
    const t = setInterval(() => { const diff = Math.max(0, end - Date.now()); const d = Math.floor(diff / 86400000); const h = Math.floor((diff % 86400000) / 3600000); const m = Math.floor((diff % 3600000) / 60000); const s = Math.floor((diff % 60000) / 1000); setTimeLeft({ d: String(d).padStart(2,'0'), h: String(h).padStart(2,'0'), m: String(m).padStart(2,'0'), s: String(s).padStart(2,'0') }); }, 1000); return () => clearInterval(t);
  }, []);
  const activePrice = potSize === 'Large (6.5 inch Self-Watering)' ? product.maxPrice : product.price;

  return (
    <section id="deal" className="py-14 lg:py-16 bg-stone-50 border-y border-stone-100">
      <div className="max-w-[1360px] mx-auto px-5 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
          <div><div className="inline-flex items-center gap-2"><span className="w-7 h-px bg-stone-300" /><span className="text-[11px] font-bold tracking-[0.18em] uppercase text-terracotta-600">Atelier Batch • Limited</span><span className="px-2 py-1 rounded-full bg-white border border-stone-200 text-[11px] font-semibold">Only 48 left</span></div><h2 className="mt-3 font-serif text-[30px] lg:text-[42px] leading-[0.94] font-semibold tracking-[-0.02em] text-canopy-950">This week&apos;s <span className="italic font-normal">most collected</span> edition</h2></div>
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full bg-white border border-stone-200 shadow-card"><span className="w-8 h-8 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center"><Clock className="w-4 h-4 text-terracotta-600" /></span><span className="text-xs font-semibold text-stone-600 hidden sm:inline">Ends in</span><div className="flex items-center gap-1 font-mono text-sm font-bold text-canopy-950"><span className="px-2.5 py-1 rounded-lg bg-stone-50 border border-stone-200">{timeLeft.d}d</span>:<span className="px-2.5 py-1 rounded-lg bg-stone-50 border border-stone-200">{timeLeft.h}h</span>:<span className="px-2.5 py-1 rounded-lg bg-stone-50 border border-stone-200">{timeLeft.m}m</span>:<span className="px-2.5 py-1 rounded-lg bg-canopy-950 text-white">{timeLeft.s}s</span></div></div>
        </div>

        <div className="rounded-[24px] bg-white border border-stone-200 shadow-card overflow-hidden grid lg:grid-cols-12">
          <div className="lg:col-span-5 p-5 sm:p-6 bg-linen-50 border-b lg:border-b-0 lg:border-r border-stone-100">
            <div className="rounded-[16px] overflow-hidden bg-white p-2 border border-stone-200"><img src={product.imageUrl} alt={product.name} className="w-full aspect-[4/3.8] object-cover rounded-[12px]" /></div>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-terracotta-600 text-white font-bold">FLAT 23% OFF</span><span className="px-2.5 py-1 rounded-full bg-white border border-stone-200 font-medium flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Free delivery</span><span className="ml-auto text-stone-500 hidden sm:inline">Photo proof before dispatch</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="px-3 py-2 rounded-xl bg-white border border-stone-200 flex items-center gap-2"><Leaf className="w-4 h-4 text-emerald-600" /> 14-day reservoir</div>
              <div className="px-3 py-2 rounded-xl bg-white border border-stone-200 flex items-center gap-2"><Sparkles className="w-4 h-4 text-brass-500" /> Collector&apos;s pick</div>
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2"><span className="flex text-brass-500">{[...Array(5)].map((_,i)=><Star key={i} className="w-4 h-4 fill-brass-500" />)}</span><span className="text-xs font-semibold text-stone-700">{product.rating} • {product.reviewCount} verified</span><span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] font-semibold">Hydro-Wick Indicator</span></div>
            <div><p className="italic font-serif text-sm text-stone-500">{product.botanicalName}</p><h3 className="font-serif text-2xl lg:text-[30px] font-semibold tracking-tight text-canopy-950">{product.name}</h3></div>
            <p className="text-[13.5px] leading-relaxed text-stone-600">{product.description}</p>
            <div className="grid grid-cols-2 gap-2">{(product.features||[]).map((f)=><div key={f} className="flex items-center gap-2 text-xs font-medium text-canopy-950 bg-stone-50 border border-stone-100 rounded-full px-3 py-2"><span className="w-5 h-5 rounded-full bg-white border border-stone-200 flex items-center justify-center"><Check className="w-3 h-3 text-emerald-700" /></span>{f}</div>)}</div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div><p className="text-[11px] font-bold tracking-[0.12em] uppercase text-stone-500 mb-2">Planter Size</p><div className="grid grid-cols-2 gap-2">{[{label:'Medium 5″', full:'Medium (5 inch Self-Watering)', price:product.price},{label:'Large 6.5″', full:'Large (6.5 inch Self-Watering)', price:product.maxPrice}].map((opt)=><button key={opt.full} onClick={()=>setPotSize(opt.full)} className={`p-3 rounded-2xl border text-left transition ${potSize===opt.full?'bg-canopy-950 text-white border-canopy-950 shadow-card':'bg-white border-stone-200 hover:border-stone-300'}`}><p className="text-xs font-semibold">{opt.label}</p><p className="text-[11px] opacity-70">₹{opt.price}</p></button>)}</div></div>
              <div><p className="text-[11px] font-bold tracking-[0.12em] uppercase text-stone-500 mb-2">Pot Finish — <span className="text-canopy-950 normal-case tracking-normal font-semibold">{potColor}</span></p><div className="flex items-center gap-2 h-[56px] px-4 rounded-2xl bg-stone-50 border border-stone-200">{(product.potColors||[]).map((c)=><button key={c} title={c} onClick={()=>setPotColor(c)} className={`w-7 h-7 rounded-full border-2 ${getPotSwatchClass(c)} ${potColor===c?'ring-2 ring-offset-2 ring-canopy-950 border-white scale-110':'border-white shadow-sm'}`} />)}</div></div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div><div className="flex items-baseline gap-2"><span className="text-[28px] font-bold tracking-tight text-canopy-950">₹{activePrice}</span><span className="text-sm line-through text-stone-400">₹{product.originalPrice}</span></div><p className="text-xs font-medium text-emerald-700">Inclusive of hydro-wick pot & soil</p></div>
              <div className="ml-auto flex items-center gap-2"><button onClick={()=>onAddToCart({ slug:product.slug, productName:product.name, imageUrl:product.imageUrl, potColor, potSize, unitPrice:activePrice, quantity:1, isBundle:false })} className="h-11 px-6 rounded-full bg-canopy-950 hover:bg-black text-white text-sm font-semibold inline-flex items-center gap-2 shadow-card"><ShoppingBag className="w-4 h-4 text-emerald-300" /> Add to Bag</button><button onClick={()=>onToggleWishlist(product.slug)} className={`w-11 h-11 rounded-full border flex items-center justify-center ${isWishlisted?'bg-terracotta-50 border-terracotta-200 text-terracotta-600':'bg-white border-stone-200 text-stone-600'}`}><Heart className={`w-5 h-5 ${isWishlisted?'fill-terracotta-500 text-terracotta-500':''}`} /></button></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
