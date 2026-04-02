import React, { useState, useRef, useMemo } from 'react';
import { toJpeg } from 'html-to-image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Settings,
  LayoutGrid,
  Info,
  ChevronRight,
  Clock,
  Briefcase,
  Utensils,
  Bath,
  Car,
  CheckSquare,
  Smartphone,
  Eye,
  Menu,
  X
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility for class merging */
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --------------------------------------------------------------------------
// UI-UX PRO MAX: DESIGN SYSTEM CONSTANTS
// --------------------------------------------------------------------------
const TOTAL_LIFE_EXPECTANCY = 90;
const MONTHS_PER_YEAR = 12;
const TOTAL_CELLS = TOTAL_LIFE_EXPECTANCY * MONTHS_PER_YEAR; // 1,080
const GRID_COLUMNS = 36; // 1 row = 36 months = 3 years

const PALETTE = [
  { id: 'sleep', title: 'Sleep Cycle', color: '#0EA5E9', defaultH: 8, icon: Clock },
  { id: 'work', title: 'Work + School', color: '#64748B', defaultH: 6, icon: Briefcase },
  { id: 'cooking', title: 'Food + Cooking', color: '#94A3B8', defaultH: 2, icon: Utensils },
  { id: 'bathroom', title: 'Hygiene', color: '#F472B6', defaultH: 1, icon: Bath },
  { id: 'driving', title: 'Commute', color: '#EAB308', defaultH: 1, icon: Car },
  { id: 'chores', title: 'Chores', color: '#10B981', defaultH: 1, icon: CheckSquare },
  { id: 'screen', title: 'Screen Time', color: '#4F46E5', defaultH: 5, icon: Smartphone },
];

const AGE_COLOR = '#E2E8F0';
const FREE_TIME_COLOR = 'transparent';

/** 
 * UI-UX PRO MAX: SHARED COMPONENTS
 */
function ControlGroup({ label, children, icon: Icon }) {
  return (
    <div className="py-4 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon className="w-3.5 h-3.5 text-slate-400 whitespace-nowrap" />}
        <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 whitespace-nowrap">{label}</div>
      </div>
      {children}
    </div>
  );
}

export default function App() {
  const [age, setAge] = useState(25);
  const [allocations, setAllocations] = useState(() =>
    PALETTE.reduce((acc, cat) => ({ ...acc, [cat.id]: cat.defaultH }), {})
  );
  const [isCapturing, setIsCapturing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const chartRef = useRef(null);

  const stats = useMemo(() => {
    const livedMonths = age * MONTHS_PER_YEAR;
    const remainingMonths = TOTAL_CELLS - livedMonths;

    let currentOccupied = livedMonths;
    const segments = [
      { id: 'lived', label: 'Lived Time', count: livedMonths, color: AGE_COLOR },
      ...PALETTE.map(cat => {
        const ratio = allocations[cat.id] / 24;
        const count = Math.floor(remainingMonths * ratio);
        currentOccupied += count;
        return {
          id: cat.id,
          label: cat.title,
          count: count,
          color: cat.color
        };
      })
    ];

    const freeMonths = Math.max(0, TOTAL_CELLS - currentOccupied);
    segments.push({
      id: 'free',
      label: 'PURPOSE & FREEDOM',
      count: freeMonths,
      color: FREE_TIME_COLOR
    });

    return segments;
  }, [age, allocations]);

  const handleDownload = async () => {
    if (!chartRef.current) return;
    setIsCapturing(true);
    try {
      const dataUrl = await toJpeg(chartRef.current, { backgroundColor: '#F8FAFC', quality: 0.98 });
      const link = document.createElement('a');
      link.download = `memento_${age}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-sky-100">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-sky-500 rounded-lg shadow-sm">
            <LayoutGrid className="w-5 h-5 text-white" />
          </div>
          <span className="font-mono font-bold tracking-tighter text-xl">MEMENTO</span>
        </div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="relative flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto min-h-screen">

        {/* Sidebar / Controls */}
        <aside className={cn(
          "fixed inset-0 z-40 bg-white lg:relative lg:inset-auto lg:block lg:w-[360px] lg:shrink-0 lg:border-r lg:border-slate-200 p-8 pt-24 lg:pt-8 transition-transform duration-300 ease-in-out overflow-y-auto",
          isMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <div className="hidden lg:flex items-center gap-3 mb-10">
            <div className="p-2 bg-sky-500 rounded-xl shadow-lg shadow-sky-200">
              <LayoutGrid className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-mono font-bold tracking-tighter uppercase">MEMENTO</h1>
          </div>

          <div className="space-y-2">
            <ControlGroup label="Subject Profile" icon={Settings}>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium text-slate-600">Active Biological Age</span>
                  <span className="font-mono font-bold text-xl text-sky-600 leading-none">{age}</span>
                </div>
                <input
                  type="range" min="0" max="89" value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                />
              </div>
            </ControlGroup>

            <ControlGroup label="Biological Maintenance (Daily)" icon={Clock}>
              <div className="space-y-6 mt-4">
                {PALETTE.map((cat) => (
                  <div key={cat.id} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full ring-2 ring-slate-50 shrink-0" style={{ backgroundColor: cat.color }} />
                        <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors uppercase tracking-tight">
                          {cat.title}
                        </span>
                      </div>
                      <span className="font-mono text-sm font-bold text-slate-400 tabular-nums">{allocations[cat.id]}h</span>
                    </div>
                    <input
                      type="range" min="0" max="12" step="0.5"
                      value={allocations[cat.id]}
                      onChange={(e) => setAllocations({ ...allocations, [cat.id]: Number(e.target.value) })}
                    />
                  </div>
                ))}
              </div>
            </ControlGroup>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 sm:sticky sm:bottom-0 bg-white pb-4">
            <button
              onClick={handleDownload}
              disabled={isCapturing}
              className="group relative flex items-center justify-center gap-3 w-full py-4 bg-slate-900 hover:bg-black text-white px-6 rounded-2xl font-bold transition-all shadow-xl shadow-slate-200 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-5 h-5 transition-transform group-hover:translate-y-px" />
              <span>Generate Forensic Artifact</span>
            </button>
            <div className="flex items-center gap-2 mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest px-2">
              <Info className="w-3 h-3" />
              <span>Localized Privacy: No external data transit</span>
            </div>
          </div>
        </aside>

        {/* Main Rendering Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-8 lg:pt-4 lg:pb-12 lg:px-8 xl:pt-6 xl:pb-16 xl:px-12 flex flex-col items-center">
          <div
            ref={chartRef}
            className="w-full bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 lg:pt-10 lg:pb-16 lg:px-16 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-slate-50 relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <header className="relative w-full text-center mb-12 sm:mb-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Temporal Projection</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl text-slate-900 font-light tracking-tight leading-[1.1] mb-6">
                Projected <span className="font-bold underline decoration-sky-500 decoration-4 underline-offset-8">Remaining Capacity</span> for age {age}
              </h2>
              <p className="text-slate-400 text-base sm:text-xl font-medium tracking-wide">
                Normalized Dataset: 1,080 Months (90 Year Horizon)
              </p>
            </header>

            {/* Matrix Section */}
            <div className="relative w-full grid grid-cols-1 xl:grid-cols-[minmax(160px,auto)_minmax(160px,auto)_1fr] gap-8 xl:gap-16 items-start">

              {/* Stats - Left Col */}
              <div className="order-2 xl:order-1 flex flex-col gap-8">
                <div className="grid grid-cols-2 xl:grid-cols-1 gap-6">
                  {stats.slice(1, 5).map((seg) => {
                    return (
                      <div key={seg.id} className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-3.5 h-3.5 rounded-full shadow-sm ring-2 ring-slate-50 shrink-0" style={{ backgroundColor: seg.color }} />
                          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">{seg.label}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-mono font-bold tabular-nums text-slate-700">{seg.count}</span>
                          <span className="text-[10px] font-bold text-slate-300">MO.</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Central Grid - Now Right-Aligned */}
              <div className="order-1 xl:order-3 flex flex-col items-center xl:items-end w-full">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-b from-slate-100 to-transparent rounded-[2.5rem] blur-xl opacity-25" />
                  <div
                    className="relative grid gap-[4px] sm:gap-[6px] p-6 sm:p-10 bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm transform-gpu transition-transform duration-500 hover:scale-[1.01]"
                    style={{
                      gridTemplateColumns: `repeat(${GRID_COLUMNS}, minmax(8px, 16px))`,
                    }}
                  >
                    {Array.from({ length: TOTAL_CELLS }).map((_, i) => {
                      let cellColor = '#F1F5F9';
                      let border = 'none';
                      let cumulative = 0;
                      let opacity = 1;

                      for (let s of stats) {
                        cumulative += s.count;
                        if (i < cumulative) {
                          if (s.id === 'lived') {
                            cellColor = AGE_COLOR;
                            opacity = 0.5;
                          } else if (s.id === 'free') {
                            cellColor = 'transparent';
                            border = '1px solid #CBD5E1';
                          } else {
                            cellColor = s.color;
                          }
                          break;
                        }
                      }

                      return (
                        <div
                          key={i}
                          className="aspect-square rounded-full shrink-0 transition-colors duration-500"
                          style={{ backgroundColor: cellColor, border, opacity }}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="mt-8 flex items-center gap-4 bg-slate-50 px-5 py-2.5 rounded-full">
                  <div className="flex -space-x-1.5 font-mono text-[9px] font-bold text-slate-400 whitespace-nowrap">
                    <span>LEGEND:</span>
                  </div>
                  <div className="w-px h-3 bg-slate-200" />
                  <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    1 UNIT = 1 MONTH
                  </span>
                  <div className="w-px h-3 bg-slate-200" />
                  <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    1 ROW = 3 YEARS
                  </span>
                </div>
              </div>

              {/* Stats - Right Col - Now Center-Aligned */}
              <div className="order-3 xl:order-2 flex flex-col gap-10">
                <div className="grid grid-cols-2 xl:grid-cols-1 gap-6">
                  {stats.slice(5, 8).map((seg) => {
                    return (
                      <div key={seg.id} className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-3.5 h-3.5 rounded-full shadow-sm ring-2 ring-slate-50 shrink-0" style={{ backgroundColor: seg.color }} />
                          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">{seg.label}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-mono font-bold tabular-nums text-slate-700">{seg.count}</span>
                          <span className="text-[10px] font-bold text-slate-300">MO.</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Freedom Rectangle - Spanning Col 1 and 2 */}
              <div className="order-4 xl:col-span-2 p-5 bg-sky-500 rounded-[1.5rem] text-white shadow-2xl shadow-sky-100 flex items-center justify-between group mt-2">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-4xl font-mono font-bold tracking-tighter tabular-nums leading-none">
                      {stats.find(s => s.id === 'free')?.count}
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-70">Months Remaining</span>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest italic opacity-90">The Freedom Variable</span>
                    <span className="text-[8px] font-bold opacity-70 uppercase tracking-tighter">Liquid capacity after biological debt</span>
                  </div>
                </div>
                <Eye className="w-5 h-5 opacity-20 group-hover:opacity-100 transition-opacity" />
              </div>

            </div>

            {/* Footer Tag */}
            <footer className="mt-20 pt-10 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="font-mono text-[9px] font-bold tracking-widest uppercase text-slate-500">
                Data Precision: 1.000 (Exact) | Artifact: CRV-2026
              </div>
              <div className="flex items-center gap-6">
                <span className="font-mono text-[9px] font-bold tracking-widest uppercase">MEMENTO™</span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <span className="font-mono text-[9px] font-bold tracking-widest uppercase">System Operational</span>
              </div>
            </footer>
          </div>
        </main>
      </div>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="lg:hidden fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
