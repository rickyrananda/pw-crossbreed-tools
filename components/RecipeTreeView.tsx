'use client'

import { IngredientNode, FlatIngredient, Recipe } from '@/types'
import ItemImage from './ItemImage'

interface Props {
  tree: IngredientNode
  qty: number
  flatIngredients: FlatIngredient[]
  selected: Recipe
}

const TIER_COLORS: Record<number, string> = {
  1: '#6b7280', 2: '#10b981', 3: '#3b82f6', 4: '#8b5cf6',
  5: '#ec4899', 6: '#f97316', 7: '#eab308', 8: '#ef4444',
  9: '#14b8a6', 10: '#6366f1', 11: '#f43f5e',
}

function TreeNode({ node, qty, depth = 0, isLast = true }: {
  node: IngredientNode
  qty: number
  depth?: number
  isLast?: boolean
}) {
  const isBase = node.ingredients.length === 0
  const totalQty = node.qty * qty
  const color = TIER_COLORS[node.tier] ?? '#6b7280'
  const isRoot = depth === 0

  return (
    <div className="flex flex-col items-center">
      {/* Node card */}
      <div className={`relative flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border transition-all ${isRoot
        ? 'bg-white text-black border-white shadow-lg shadow-white/10 min-w-[160px]'
        : isBase
          ? 'bg-white/5 border-white/10 min-w-[120px]'
          : 'bg-white/[0.04] border-white/15 min-w-[130px]'
        }`}>
        {/* Image */}
        {node.image && (
          <div className="w-9 h-9 flex items-center justify-center">
            <ItemImage
              src={node.image}
              alt={node.name}
              className="w-full h-full object-contain"
            />
          </div>
        )}
        {/* Name */}
        <p className={`text-xs font-medium text-center leading-tight ${isRoot ? 'text-black' : 'text-white/80'}`}>
          {node.name}
        </p>
        {/* Meta row */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold" style={{ color: isRoot ? '#000' : color }}>
            T{node.tier}
          </span>
          {!isRoot && (
            <span className={`text-xs font-mono ${isBase ? 'text-emerald-400/70' : 'text-white/30'}`}>
              ×{totalQty}
            </span>
          )}
          {isRoot && qty > 1 && (
            <span className="text-xs font-mono text-black/50">×{qty}</span>
          )}
        </div>
        {/* Base indicator */}
        {isBase && !isRoot && (
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-emerald-400/80" />
          </div>
        )}
      </div>

      {/* Children */}
      {node.ingredients.length > 0 && (
        <>
          {/* Vertical connector down */}
          <div className="w-px h-6 bg-white/10" />

          {/* Horizontal bar + children */}
          <div className="flex items-start gap-0 relative">
            {node.ingredients.map((child, i) => {
              const isFirst = i === 0
              const isLastChild = i === node.ingredients.length - 1
              const isOnly = node.ingredients.length === 1

              return (
                <div key={`${child.name}-${i}`} className="flex flex-col items-center">
                  {/* Top connector (horizontal + vertical) */}
                  {!isOnly && (
                    <div className="flex items-center justify-center w-full h-4 relative">
                      {/* horizontal line spans half to center */}
                      <div
                        className="absolute top-0 h-px bg-white/10"
                        style={{
                          left: isFirst ? '50%' : 0,
                          right: isLastChild ? '50%' : 0,
                        }}
                      />
                      {/* vertical drop */}
                      <div className="w-px h-full bg-white/10" />
                    </div>
                  )}
                  {isOnly && <div className="w-px h-4 bg-white/10" />}

                  {/* Padding between siblings */}
                  <div className={node.ingredients.length > 1 ? 'px-3' : ''}>
                    <TreeNode node={child} qty={qty} depth={depth + 1} isLast={isLastChild} />
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default function RecipeTreeView({ tree, qty, flatIngredients, selected }: Props) {

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-1">Recipe Tree</p>
          <h1 className="text-white text-xl font-semibold tracking-tight">{selected.name}</h1>
          <p className="text-white/30 text-sm font-mono mt-1">
            crafting <span className="text-white/60">×{qty}</span> — {flatIngredients.length} base ingredient types
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono text-white/30">
            <div className="w-2 h-2 rounded-full bg-emerald-400/60" />
            base material
          </div>
        </div>
      </div>

      {/* Tree pyramid */}
      <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-8 overflow-x-auto">
        <div className="flex justify-center min-w-max mx-auto">
          <TreeNode node={tree} qty={qty} depth={0} />
        </div>
      </div>

      {/* Ingredients summary */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-white/70 text-sm font-mono font-medium tracking-widest uppercase">Materials Needed (Seeds)</h2>
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-white/20 text-xs font-mono">for ×{qty} {selected.name}</span>
        </div>

        {(() => {
          const tier1 = flatIngredients.filter(i => i.tier === 1)
          const farmableUpper = flatIngredients.filter(i => i.tier > 1 && i.farmable)

          console.log('flatIngredients:', JSON.stringify(flatIngredients.map(i => ({
            name: i.name,
            tier: i.tier,
            farmable: i.farmable
          })), null, 2))

          return (
            <div className="space-y-6">
              {/* Best start from - farmable upper tier items */}
              {farmableUpper.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-emerald-400/70 text-xs font-mono uppercase tracking-widest">Best Start From (Upper Tier Farmable)</span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {farmableUpper.sort((a, b) => a.tier - b.tier).map((ing) => (
                      <div key={ing.name} className="flex items-center gap-3 bg-emerald-400/5 border border-emerald-400/20 rounded-lg px-3 py-2.5">
                        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                          {ing.image ? (
                            <img src={`/api/img?url=${encodeURIComponent(ing.image)}`} alt={ing.name} className="w-full h-full object-contain" style={{ imageRendering: 'pixelated' }} onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0' }} />
                          ) : (
                            <div className="w-6 h-6 rounded bg-white/5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white/70 text-xs leading-tight truncate">{ing.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-white font-mono text-sm font-semibold">×{ing.qty}</span>
                            <span className="text-xs font-mono" style={{ color: TIER_COLORS[ing.tier] }}>T{ing.tier}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tier 1 base materials */}
              {tier1.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: TIER_COLORS[1] }} />
                    <span className="text-white/30 text-xs font-mono uppercase tracking-widest">Base Materials — Tier 1</span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {tier1.sort((a, b) => b.qty - a.qty).map((ing) => (
                      <div key={ing.name} className="flex items-center gap-3 bg-white/[0.03] border border-white/8 rounded-lg px-3 py-2.5">
                        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                          {ing.image ? (
                            <img src={`/api/img?url=${encodeURIComponent(ing.image)}`} alt={ing.name} className="w-full h-full object-contain" style={{ imageRendering: 'pixelated' }} onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0' }} />
                          ) : (
                            <div className="w-6 h-6 rounded bg-white/5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white/70 text-xs leading-tight truncate">{ing.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-white font-mono text-sm font-semibold">×{ing.qty}</span>
                            {ing.farmable && <span className="text-emerald-400/50 text-xs font-mono">farm</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })()}
      </div>

      {/* Total summary box */}
      <div className="border border-white/10 rounded-xl p-5">
        <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-4">Summary</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-white font-mono">{flatIngredients.reduce((s, i) => s + i.qty, 0)}</p>
            <p className="text-white/30 text-xs font-mono mt-1">total items</p>
          </div>
          <div className="text-center border-x border-white/8">
            <p className="text-2xl font-semibold text-white font-mono">{flatIngredients.length}</p>
            <p className="text-white/30 text-xs font-mono mt-1">unique types</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-white font-mono">{flatIngredients.filter(i => i.farmable).length}</p>
            <p className="text-white/30 text-xs font-mono mt-1">farmable</p>
          </div>
        </div>
      </div>
    </div>
  )
}
