'use client'

import { useState, useMemo } from 'react'
import { Recipe } from '@/types'
import { buildTree, calcAllIngredients } from '@/lib/recipeUtils'
import Sidebar from './Sidebar'
import AllItemsView from './AllItemsView'
import RecipeTreeView from './RecipeTreeView'

interface Props {
  recipes: Recipe[]
}

export default function AppShell({ recipes }: Props) {
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState<number | null>(null)
  const [farmableFilter, setFarmableFilter] = useState<boolean | null>(null)
  const [qty, setQty] = useState(1)
  const [selected, setSelected] = useState<Recipe | null>(null)
  const [showTree, setShowTree] = useState(false)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const recipeMap = useMemo(() => {
    const m = new Map<string, Recipe>()
    recipes.forEach((r) => m.set(r.name, r))
    return m
  }, [recipes])

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false
      if (tierFilter !== null && r.tier !== tierFilter) return false
      if (farmableFilter !== null && r.farmable !== farmableFilter) return false
      return true
    })
  }, [recipes, search, tierFilter, farmableFilter])

  const tiers = useMemo(() => {
    return [...new Set(recipes.map((r) => r.tier))].sort((a, b) => a - b)
  }, [recipes])

  const tree = useMemo(() => {
    if (!selected || !showTree) return null
    return buildTree(selected.name, 1, recipeMap)
  }, [selected, showTree, recipeMap])

  const flatIngredients = useMemo(() => {
    if (!selected || !showTree) return []
    return calcAllIngredients(selected.name, qty, recipeMap)
  }, [selected, showTree, qty, recipeMap])

  const handleCalculate = () => {
    if (!selected) return
    setShowTree(true)
  }

  const handleSelectItem = (r: Recipe) => {
    setSelected(r)
    setShowTree(false)
  }

  const handleReset = () => {
    setSelected(null)
    setShowTree(false)
    setQty(1)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a]">
      <Sidebar
        search={search}
        setSearch={setSearch}
        tierFilter={tierFilter}
        setTierFilter={setTierFilter}
        farmableFilter={farmableFilter}
        setFarmableFilter={setFarmableFilter}
        qty={qty}
        setQty={setQty}
        tiers={tiers}
        filtered={filtered}
        selected={selected}
        onSelectItem={handleSelectItem}
        onCalculate={handleCalculate}
        onReset={handleReset}
        showTree={showTree}
      />
      <main className="flex-1 overflow-y-auto">
        {showTree && tree && selected ? (
          <RecipeTreeView
            tree={tree}
            qty={qty}
            flatIngredients={flatIngredients}
            selected={selected}
          />
        ) : (
          <AllItemsView
            recipes={filtered}
            sortDir={sortDir}
            setSortDir={setSortDir}
            onSelectItem={handleSelectItem}
            selected={selected}
          />
        )}
      </main>
    </div>
  )
}
