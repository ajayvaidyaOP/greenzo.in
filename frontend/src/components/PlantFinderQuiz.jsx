import React, { useState, useMemo } from 'react';
import {
  X, Sparkles, Sun, Wind, Shield, Droplets, ArrowRight, ArrowLeft,
  ShoppingBag, Check, RotateCcw, Layers
} from 'lucide-react';
import { getPotSwatchClass } from '../lib/api.js';
import { buildWhatsAppUrl, WhatsAppIcon } from '../lib/whatsapp.jsx';

const QUESTIONS = [
  {
    id: 'light',
    step: '01 / 03',
    title: 'How much natural light does your spot get?',
    subtitle: 'Pick the closest match — our Pune plants are shade-hardened for apartments.',
    options: [
      {
        value: 'low',
        label: 'Low Light / Shaded Corner',
        desc: 'Away from windows, north-facing room, or hallway desk',
        icon: Droplets
      },
      {
        value: 'medium',
        label: 'Medium Indirect Light',
        desc: 'Bright room with curtains or 4–8 ft from a window',
        icon: Sun
      },
      {
        value: 'bright',
        label: 'Bright Sunny Window / Balcony',
        desc: 'Near an east/west window or covered balcony',
        icon: Sparkles
      }
    ]
  },
  {
    id: 'routine',
    step: '02 / 03',
    title: 'How is the room climate & your schedule?',
    subtitle: 'Every plant comes in a 14-day self-watering hydro-wick planter.',
    options: [
      {
        value: 'ac',
        label: 'Daily AC Room (6–10 hrs/day)',
        desc: 'Work-from-home desk, corporate cabin, or AC bedroom',
        icon: Wind
      },
      {
        value: 'normal',
        label: 'Ceiling Fan / Open Breeze',
        desc: 'Living room console, dining corner, or airy flat',
        icon: Sun
      },
      {
        value: 'busy',
        label: 'Super Busy / Frequent Traveller',
        desc: 'Give me the toughest, most forgiving plants possible',
        icon: Shield
      }
    ]
  },
  {
    id: 'focus',
    step: '03 / 03',
    title: 'What matters most for your home?',
    subtitle: 'We’ll rank your top 4 plants & build an instant ₹999 box.',
    options: [
      {
        value: 'air',
        label: 'Maximum Air Purification',
        desc: 'Fresh oxygen & cleaner indoor air for sleep and focus',
        icon: Wind
      },
      {
        value: 'vastu',
        label: 'Vastu, Prosperity & Statement Look',
        desc: 'Auspicious, sculptural foliage for entryways & gifting',
        icon: Sparkles
      },
      {
        value: 'pet',
        label: 'Pet-Friendly Priority (Cats & Dogs)',
        desc: 'Prioritise gentle, pet-safe foliage first',
        icon: Shield
      }
    ]
  }
];

const POT_PALETTE = ['Matte Ivory', 'Forest Sage', 'Terracotta Sand', 'Charcoal Matte'];

export default function PlantFinderQuiz({
  isOpen,
  onClose,
  storeConfig = {},
  products = [],
  onAddToCart,
  onSelectProduct
}) {
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState({ light: 'low', routine: 'ac', focus: 'air' });
  const [showResults, setShowResults] = useState(false);
  const [potColor, setPotColor] = useState('Matte Ivory');

  const comboPrice = Number(storeConfig.comboBundlePrice || 999);
  const comboSize = Math.max(2, Math.min(8, Number(storeConfig.comboBundleSize || 4)));

  const matchedPlants = useMemo(() => {
    if (!products.length) return [];

    const scored = products.map((p) => {
      let score = 50;
      const lightStr = `${p.lightLevel} ${p.description} ${p.shortDescription}`.toLowerCase();
      const nameStr = `${p.name} ${p.categorySlug} ${p.badge || ''}`.toLowerCase();

      if (answers.light === 'low' && lightStr.includes('low')) score += 30;
      if (answers.light === 'medium' && (lightStr.includes('medium') || lightStr.includes('indirect'))) score += 28;
      if (answers.light === 'bright' && (lightStr.includes('bright') || lightStr.includes('indirect'))) score += 25;

      if (answers.routine === 'ac' && (lightStr.includes('ac') || lightStr.includes('low') || p.slug.includes('zamia') || p.slug.includes('snake'))) {
        score += 22;
      }
      if (answers.routine === 'busy' && (p.slug.includes('zamia') || p.slug.includes('snake') || p.slug.includes('money'))) {
        score += 26;
      }

      if (answers.focus === 'pet') {
        score += p.petFriendly ? 60 : -15;
      } else if (answers.focus === 'air' && p.airPurifying) {
        score += 24;
      } else if (answers.focus === 'vastu' && (nameStr.includes('money') || nameStr.includes('vastu') || nameStr.includes('zamia') || nameStr.includes('peace'))) {
        score += 26;
      }

      score += (p.rating || 4.8) * 3;
      return { plant: p, matchPct: Math.min(99, Math.max(86, Math.round(score))) };
    });

    scored.sort((a, b) => b.matchPct - a.matchPct);
    return scored.slice(0, comboSize);
  }, [products, answers, comboSize]);

  if (!isOpen) return null;

  const currentQuestion = QUESTIONS[stepIdx];

  const handlePickOption = (val) => {
    const updated = { ...answers, [currentQuestion.id]: val };
    setAnswers(updated);
    if (stepIdx < QUESTIONS.length - 1) {
      setStepIdx(stepIdx + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setStepIdx(0);
    setShowResults(false);
  };

  const handleAddMatchedBundle = () => {
    if (!matchedPlants.length) return;
    const chosen = matchedPlants.map((m) => m.plant);
    onAddToCart({
      slug: `quiz-bundle-${comboPrice}-${Date.now()}`,
      productName: `Quiz-Matched ${chosen.length}-Plant Box`,
      imageUrl: chosen[0]?.imageUrl || '/images/hero-1.jpg',
      potColor,
      potSize: `Set of ${chosen.length} Hydro-Wick Pots`,
      unitPrice: comboPrice,
      quantity: 1,
      isBundle: true,
      bundleItems: chosen.map((c) => c.name)
    });
    onClose();
  };

  const individualTotal = matchedPlants.reduce((s, m) => s + (m.plant.price || 269), 0);
  const savings = Math.max(0, individualTotal - comboPrice);

  const quizWaUrl = buildWhatsAppUrl(
    storeConfig,
    `Hi Greenzo Pune! I took the 30-sec Plant Quiz (${answers.light} light, ${answers.routine} room, ${answers.focus} focus). My top matches are: ${matchedPlants
      .map((m) => m.plant.name)
      .join(', ')} in ${potColor} pots (@ ₹${comboPrice}). Please share live photos!`
  );

  return (
    <div className="fixed inset-0 z-[88] flex items-center justify-center p-3 sm:p-6">
      <div onClick={onClose} className="absolute inset-0 animate-fade-in bg-canopy-950/65 backdrop-blur-md" />

      <div className="relative flex max-h-[92vh] w-full max-w-3xl animate-scale-in flex-col overflow-hidden rounded-[28px] border border-canopy-950/15 bg-white shadow-elevated">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 bg-canopy-950 px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-400 text-canopy-950">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-300">
                30-Second Horticulturist Match
              </p>
              <h3 className="font-serif text-[20px] font-medium leading-tight">
                {showResults ? 'Your Custom Pune Nursery Match' : 'Find Your Ideal Self-Watering Plants'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close plant quiz"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-linen-100">
          <div
            className="h-full bg-gradient-to-r from-canopy-600 to-emerald-400 transition-all duration-300"
            style={{ width: showResults ? '100%' : `${((stepIdx + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          {!showResults ? (
            <div className="space-y-5">
              <div>
                <span className="inline-flex rounded-full bg-canopy-50 px-3 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-canopy-700">
                  Question {currentQuestion.step}
                </span>
                <h4 className="mt-2.5 font-serif text-[25px] font-medium leading-tight text-canopy-950 sm:text-[28px]">
                  {currentQuestion.title}
                </h4>
                <p className="mt-1 text-[13px] text-stone-500">{currentQuestion.subtitle}</p>
              </div>

              <div className="grid gap-3">
                {currentQuestion.options.map((opt) => {
                  const Icon = opt.icon;
                  const selected = answers[currentQuestion.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handlePickOption(opt.value)}
                      className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200 ${
                        selected
                          ? 'border-canopy-700 bg-canopy-50/70 shadow-soft'
                          : 'border-canopy-950/12 bg-linen-50/60 hover:border-canopy-600/45 hover:bg-white hover:shadow-soft'
                      }`}
                    >
                      <span
                        className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition ${
                          selected
                            ? 'bg-canopy-950 text-emerald-300'
                            : 'bg-white text-canopy-700 shadow-sm group-hover:bg-canopy-950 group-hover:text-emerald-300'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[14.5px] font-extrabold text-canopy-950">{opt.label}</span>
                        <span className="mt-0.5 block text-[12px] text-stone-500">{opt.desc}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-stone-400 transition group-hover:translate-x-1 group-hover:text-canopy-800" />
                    </button>
                  );
                })}
              </div>

              {stepIdx > 0 && (
                <button
                  type="button"
                  onClick={() => setStepIdx(stepIdx - 1)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-canopy-950"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Previous question
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-canopy-600/20 bg-canopy-50/80 p-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-canopy-700">
                    <Check className="h-3.5 w-3.5 stroke-[3]" /> Calibrated for your room
                  </span>
                  <h4 className="mt-0.5 font-serif text-[22px] font-medium text-canopy-950">
                    Your Top {matchedPlants.length} Self-Watering Matches
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={resetQuiz}
                  className="inline-flex items-center gap-1.5 rounded-full border border-canopy-950/12 bg-white px-3.5 py-1.5 text-[11.5px] font-bold text-canopy-900 hover:bg-linen-50"
                >
                  <RotateCcw className="h-3 w-3" /> Retake Quiz
                </button>
              </div>

              {/* Pot Finish Picker */}
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-canopy-950/10 bg-linen-50 px-4 py-3">
                <span className="text-xs font-bold text-canopy-950">
                  Choose Pot Finish: <span className="text-canopy-700">{potColor}</span>
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {POT_PALETTE.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setPotColor(color)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold transition ${
                        potColor === color
                          ? 'border-canopy-950 bg-canopy-950 text-white'
                          : 'border-canopy-950/10 bg-white text-stone-600'
                      }`}
                    >
                      <span className={`h-3 w-3 rounded-full border border-black/10 ${getPotSwatchClass(color)}`} />
                      {color.split(' ')[1] || color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Matched 4 Plants Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {matchedPlants.map(({ plant, matchPct }) => (
                  <div
                    key={plant.slug}
                    className="flex flex-col overflow-hidden rounded-2xl border border-canopy-950/10 bg-white p-2.5 shadow-soft"
                  >
                    <div
                      onClick={() => {
                        onClose();
                        onSelectProduct?.(plant);
                      }}
                      className="relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-linen-75"
                    >
                      <img src={plant.imageUrl} alt={plant.name} className="h-full w-full object-cover" />
                      <span className="absolute left-2 top-2 rounded-full bg-canopy-950/90 px-2 py-0.5 text-[9.5px] font-extrabold text-emerald-300">
                        {matchPct}% Match
                      </span>
                    </div>
                    <h5 className="mt-2 truncate font-serif text-[14.5px] font-medium text-canopy-950">{plant.name}</h5>
                    <p className="truncate text-[10.5px] text-stone-500">{plant.lightLevel}</p>
                    <div className="mt-2 flex items-center justify-between pt-1">
                      <span className="text-xs font-extrabold text-canopy-950 num">₹{plant.price}</span>
                      <button
                        type="button"
                        onClick={() =>
                          onAddToCart({
                            slug: plant.slug,
                            productName: plant.name,
                            imageUrl: plant.imageUrl,
                            potColor,
                            potSize: 'Medium (5 inch Self-Watering)',
                            unitPrice: plant.price,
                            quantity: 1,
                            isBundle: false
                          })
                        }
                        className="rounded-full bg-linen-100 px-2.5 py-1 text-[10.5px] font-bold text-canopy-900 hover:bg-canopy-950 hover:text-white transition"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA when Results Shown */}
        {showResults && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-canopy-950/10 bg-linen-50 px-6 py-4 sm:flex-row">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl font-bold text-canopy-950 num">₹{comboPrice}</span>
                {individualTotal > comboPrice && (
                  <span className="text-sm text-stone-400 line-through num">₹{individualTotal}</span>
                )}
                {savings > 0 && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10.5px] font-extrabold text-canopy-800">
                    Save ₹{savings}
                  </span>
                )}
              </div>
              <p className="text-[11px] font-medium text-stone-500">
                All {matchedPlants.length} matched plants + {potColor} self-watering pots
              </p>
            </div>

            <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
              <a
                href={quizWaUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp h-11 px-4 text-xs"
              >
                <WhatsAppIcon className="h-4 w-4" /> Share on WhatsApp
              </a>
              <button
                type="button"
                onClick={handleAddMatchedBundle}
                className="btn btn-dark h-11 px-5 text-xs sm:text-[13px]"
              >
                <Layers className="h-4 w-4 text-emerald-300" /> Add Matched Box — ₹{comboPrice}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
