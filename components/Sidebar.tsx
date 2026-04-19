'use client'

import { Recipe } from '@/types'
import ItemImage from './ItemImage'

interface Props {
  search: string
  setSearch: (v: string) => void
  tierFilter: number | null
  setTierFilter: (v: number | null) => void
  farmableFilter: boolean | null
  setFarmableFilter: (v: boolean | null) => void
  qty: number
  setQty: (v: number) => void
  tiers: number[]
  filtered: Recipe[]
  selected: Recipe | null
  onSelectItem: (r: Recipe) => void
  onCalculate: () => void
  onReset: () => void
  showTree: boolean
}

const TIER_COLORS: Record<number, string> = {
  1: '#6b7280', 2: '#10b981', 3: '#3b82f6', 4: '#8b5cf6',
  5: '#ec4899', 6: '#f97316', 7: '#eab308', 8: '#ef4444',
  9: '#14b8a6', 10: '#6366f1', 11: '#f43f5e',
}

export default function Sidebar({
  search, setSearch, tierFilter, setTierFilter,
  farmableFilter, setFarmableFilter, qty, setQty,
  tiers, filtered, selected, onSelectItem, onCalculate, onReset, showTree
}: Props) {
  return (
    <aside className="w-72 flex-shrink-0 border-r border-white/10 flex flex-col h-full bg-[#0d0d0d]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white font-semibold tracking-tight text-base font-mono">PW</span>
          <span className="text-white/30 text-xs font-mono">RECIPE EXPLORER</span>
        </div>
        <p className="text-white/30 text-xs font-mono">{filtered.length} items</p>
      </div>

      {/* Filters */}
      <div className="px-4 py-4 border-b border-white/10 space-y-3">
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-md pl-8 pr-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/30 font-mono transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Tier dropdown */}
        <select
          value={tierFilter ?? ''}
          onChange={(e) => setTierFilter(e.target.value === '' ? null : Number(e.target.value))}
          className="w-full border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-white/30 font-mono cursor-pointer transition-colors appearance-none"
          style={{ backgroundColor: '#1a1a1a', color: '#fafafa' }}
        >
          <option value="" style={{ backgroundColor: '#1a1a1a', color: '#fafafa' }}>All Tiers</option>
          {tiers.map((t) => (
            <option key={t} value={t} style={{ backgroundColor: '#1a1a1a', color: '#fafafa' }}>Tier {t}</option>
          ))}
        </select>

        {/* Farmable toggle */}
        <div className="flex gap-2">
          {[null, true, false].map((v) => (
            <button
              key={String(v)}
              onClick={() => setFarmableFilter(v)}
              className={`flex-1 py-1.5 rounded-md text-xs font-mono border transition-all ${farmableFilter === v
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-white/40 border-white/10 hover:border-white/30 hover:text-white/60'
                }`}
            >
              {v === null ? 'ALL' : v ? 'FARM' : 'NON'}
            </button>
          ))}
        </div>
      </div>

      {/* Selected item + qty + calculate */}
      <div className="px-4 py-4 border-b border-white/10 space-y-3">
        <p className="text-white/30 text-xs font-mono uppercase tracking-widest">Selected Item</p>

        {selected ? (
          <div className="bg-white/5 border border-white/15 rounded-md p-3 flex items-center gap-3">
            {selected.image && (
              <ItemImage src={selected.image} alt={selected.name} className="w-8 h-8 object-contain pixelated flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{selected.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-mono" style={{ color: TIER_COLORS[selected.tier] }}>T{selected.tier}</span>
                {selected.farmable && <span className="text-xs font-mono text-emerald-400/60">farmable</span>}
              </div>
            </div>
            <button onClick={onReset} className="text-white/20 hover:text-white/50 transition-colors flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="border border-dashed border-white/10 rounded-md p-3 text-center">
            <p className="text-white/20 text-xs font-mono">click an item to select</p>
          </div>
        )}

        {/* Quantity */}
        <div className="flex items-center gap-3 ">
          <label className="text-white/40 text-xs font-mono uppercase tracking-widest whitespace-nowrap">QTY</label>
          <div className="flex items-center gap-2 flex-1">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-7 h-7 rounded border border-white/10 text-white/50 hover:border-white/30 hover:text-white flex items-center justify-center text-sm transition-all"
            >−</button>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="flex-1 bg-white/5 border border-white/10 rounded text-center text-sm font-mono text-white focus:outline-none focus:border-white/30 py-1"
              style={{ MozAppearance: 'textfield' } as React.CSSProperties}
              onWheel={(e) => e.currentTarget.blur()}
            />
            <button
              onClick={() => setQty(qty + 1)}
              className="w-7 h-7 rounded border border-white/10 text-white/50 hover:border-white/30 hover:text-white flex items-center justify-center text-sm transition-all"
            >+</button>
          </div>
        </div>

        {/* Calculate button */}
        <button
          onClick={onCalculate}
          disabled={!selected}
          className={`w-full py-2.5 rounded-md text-sm font-mono font-medium tracking-widest uppercase transition-all ${selected
            ? 'bg-white text-black hover:bg-white/90 active:scale-95'
            : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/10'
            }`}
        >
          Calculate
        </button>
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-white/20 text-xs font-mono">no items found</p>
          </div>
        ) : (
          <div className="py-2">
            {filtered.map((r) => (
              <button
                key={r.name}
                onClick={() => onSelectItem(r)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all group ${selected?.name === r.name
                  ? 'bg-white/10 border-r-2 border-white'
                  : 'hover:bg-white/5 border-r-2 border-transparent'
                  }`}
              >
                {r.image && (
                  <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center">
                    <ItemImage src={r.image} alt={r.name} className="w-full h-full object-contain" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate transition-colors ${selected?.name === r.name ? 'text-white' : 'text-white/60 group-hover:text-white/80'}`}>
                    {r.name}
                  </p>
                </div>
                <span className="text-xs font-mono flex-shrink-0" style={{ color: TIER_COLORS[r.tier] + '99' }}>
                  T{r.tier}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
