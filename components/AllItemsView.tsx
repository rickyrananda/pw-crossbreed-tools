'use client'

import { Recipe } from '@/types'
import ItemImage from './ItemImage'

interface Props {
  recipes: Recipe[]
  sortDir: 'asc' | 'desc'
  setSortDir: (v: 'asc' | 'desc') => void
  onSelectItem: (r: Recipe) => void
  selected: Recipe | null
}

const TIER_COLORS: Record<number, string> = {
  1: '#6b7280', 2: '#10b981', 3: '#3b82f6', 4: '#8b5cf6',
  5: '#ec4899', 6: '#f97316', 7: '#eab308', 8: '#ef4444',
  9: '#14b8a6', 10: '#6366f1', 11: '#f43f5e',
}

const TIER_NAMES: Record<number, string> = {
  1: 'Base Materials', 2: 'Tier 2', 3: 'Tier 3', 4: 'Tier 4',
  5: 'Tier 5', 6: 'Tier 6', 7: 'Tier 7', 8: 'Tier 8',
  9: 'Tier 9', 10: 'Tier 10', 11: 'Tier 11',
}

export default function AllItemsView({ recipes, sortDir, setSortDir, onSelectItem, selected }: Props) {
  const grouped = recipes.reduce<Record<number, Recipe[]>>((acc, r) => {
    if (!acc[r.tier]) acc[r.tier] = []
    acc[r.tier].push(r)
    return acc
  }, {})

  const tierKeys = Object.keys(grouped).map(Number).sort((a, b) =>
    sortDir === 'asc' ? a - b : b - a
  )

  if (recipes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-white/20 font-mono text-sm">no items match your filters</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-xl font-semibold tracking-tight">All Items</h1>
          <p className="text-white/30 text-sm font-mono mt-0.5">{recipes.length} items across {tierKeys.length} tiers</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/30 text-xs font-mono">SORT</span>
          <button
            onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 rounded-md text-xs font-mono text-white/50 hover:border-white/30 hover:text-white/80 transition-all"
          >
            {sortDir === 'asc' ? (
              <>T1 → T11 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg></>
            ) : (
              <>T11 → T1 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></>
            )}
          </button>
        </div>
      </div>

      {/* Tiers */}
      <div className="space-y-10">
        {tierKeys.map((tier) => (
          <section key={tier}>
            {/* Tier header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: TIER_COLORS[tier] }} />
              <h2 className="text-white/80 text-sm font-mono font-medium tracking-widest uppercase">
                {TIER_NAMES[tier] || `Tier ${tier}`}
              </h2>
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-white/20 text-xs font-mono">{grouped[tier].length}</span>
            </div>

            {/* Items grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
              {grouped[tier].map((r) => (
                <button
                  key={r.name}
                  onClick={() => onSelectItem(r)}
                  className={`group relative flex flex-col items-center gap-2 p-3 rounded-lg border transition-all text-left ${selected?.name === r.name
                    ? 'bg-white/10 border-white/40'
                    : 'bg-white/[0.02] border-white/8 hover:bg-white/5 hover:border-white/20'
                    }`}
                >
                  {/* Farmable dot */}
                  {r.farmable && (
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-400/60" title="Farmable" />
                  )}

                  {/* Image */}
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    {r.image ? (
                      <ItemImage
                        src={r.image}
                        alt={r.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center">
                        <span className="text-white/20 text-xs font-mono">?</span>
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <p className={`text-xs text-center leading-tight transition-colors line-clamp-2 ${selected?.name === r.name ? 'text-white' : 'text-white/50 group-hover:text-white/70'
                    }`}>
                    {r.name}
                  </p>

                  {/* Recipe badge */}
                  {r.has_recipe && (
                    <div className="flex items-center gap-1">
                      <svg className="w-2.5 h-2.5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
