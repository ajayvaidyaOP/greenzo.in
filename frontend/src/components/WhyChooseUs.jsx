import React, { useState } from 'react';
import { Sprout, Layers, MessageSquareHeart, Headphones, X, ArrowUpRight } from 'lucide-react';

const PILLARS = [
  {
    icon: Sprout,
    title: 'Sustainable Practices',
    desc: 'Grown in organic coco-peat, neem cake & perlite mixes with zero synthetic foliar sprays.'
  },
  {
    icon: Layers,
    title: 'Curated Indoor Varieties',
    desc: 'Every cultivar is tested for Indian apartment light, ceiling fans, and AC humidity.'
  },
  {
    icon: MessageSquareHeart,
    title: 'Free Botanist Consultation',
    desc: 'Share a photo of your corner on WhatsApp or video—our horticulturists guide you free.'
  },
  {
    icon: Headphones,
    title: '24/7 Lifetime Plant Support',
    desc: 'Yellowing leaf six months later? Message our Pune plant doctors anytime for care help.'
  }
];

const DEFAULT_GALLERY = [
  {
    src: '/images/hero-1.jpg',
    caption: 'Travertine Living Console • 4-Plant Sanctuary Combo',
    span: 'lg:col-span-2 lg:row-span-2'
  },
  {
    src: '/images/zamia-green.jpg',
    caption: 'Zamia Green in Matte Ivory Self-Watering Planter',
    span: ''
  },
  {
    src: '/images/peace-lily.jpg',
    caption: 'Peace Lily Sensation with Bottom Reservoir Notch',
    span: ''
  },
  {
    src: '/images/hero-2.jpg',
    caption: 'Morning Mist at Empire Agro Conservatory, Pune',
    span: ''
  },
  {
    src: '/images/syngonium-pink.jpg',
    caption: 'Blush Syngonium Pink Neon for Warm Interiors',
    span: ''
  },
  {
    src: '/images/hero-3.jpg',
    caption: 'Calm Biophilic Home Studio Setup',
    span: 'lg:col-span-2'
  }
];

export default function WhyChooseUs({ galleryPhotos = [] }) {
  const [lightboxImg, setLightboxImg] = useState(null);
  const items = galleryPhotos.length ? galleryPhotos : DEFAULT_GALLERY;

  return (
    <>
      <section id="about" className="bg-canopy-900 text-white overflow-hidden">
        <div className="max-w-[1320px] mx-auto grid lg:grid-cols-12">
          <div className="lg:col-span-5 relative min-h-[360px] lg:min-h-[560px]">
            <img
              src="/images/hero-2.jpg"
              alt="Greenzo Pune Greenhouse Care"
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-canopy-950/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 sm:right-auto bg-white text-canopy-950 rounded-2xl p-4 shadow-xl flex items-center gap-3.5 max-w-[300px]">
              <div className="w-11 h-11 rounded-xl bg-canopy-100 text-canopy-800 flex items-center justify-center shrink-0">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold">10,000+ Happy Homes</p>
                <p className="text-xs text-canopy-700/75">Across Pune, Mumbai & Pan-India</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 px-6 sm:px-10 lg:px-14 py-14 lg:py-20 flex flex-col justify-center">
            <span className="text-emerald-300 text-[11px] font-bold tracking-[0.28em] uppercase">
              Why Choose Greenzo
            </span>
            <h2 className="font-serif text-[34px] lg:text-[44px] leading-tight font-medium mt-2">
              Gardening Grows a Spirit
            </h2>
            <p className="text-linen-200/80 text-[15px] leading-relaxed mt-3 max-w-xl">
              At Greenzo, we believe living greenery nurtures quiet joy, cleaner air, and
              restorative balance in modern urban homes. From our greenhouse in Theur, Pune straight
              to your tabletop—every plant is crafted to thrive effortlessly.
            </p>

            <div className="grid sm:grid-cols-2 gap-7 mt-10">
              {PILLARS.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-emerald-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-xl font-medium text-white">{item.title}</h3>
                    <p className="text-[13px] text-linen-200/75 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="text-canopy-600 text-[11px] font-bold tracking-[0.28em] uppercase">
              Our Green Journey
            </span>
            <h2 className="font-serif text-[32px] lg:text-[42px] text-canopy-950 font-semibold leading-tight mt-2">
              Begin Your Life in a Living Sanctuary
            </h2>
            <p className="text-[14.5px] text-canopy-800/75 leading-relaxed mt-3">
              Every Greenzo order ships in 100% plastic-free honeycomb kraft pods from our Pune
              nursery—combining horticultural expertise with timeless architectural pots.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[210px] gap-4">
            {items.map((g, idx) => (
              <div
                key={g.id || idx}
                onClick={() => setLightboxImg(g)}
                className={`group relative rounded-2xl overflow-hidden bg-linen-100 cursor-pointer ${
                  g.span || ''
                }`}
              >
                <img
                  src={g.src}
                  alt={g.caption}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                  <p className="text-white text-xs font-medium">{g.caption}</p>
                  <span className="w-7 h-7 rounded-full bg-white/90 text-canopy-950 flex items-center justify-center shrink-0">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
          >
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxImg.src}
              alt={lightboxImg.caption}
              className="w-full max-h-[75vh] object-cover"
            />
            <div className="p-4 bg-white text-sm font-medium text-canopy-950">
              {lightboxImg.caption}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
