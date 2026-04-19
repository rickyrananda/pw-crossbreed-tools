import { Recipe, IngredientNode, FlatIngredient } from '@/types'

export function buildTree(
  name: string,
  qty: number,
  recipeMap: Map<string, Recipe>,
  visited: Set<string> = new Set()
): IngredientNode {
  const recipe = recipeMap.get(name)
  const node: IngredientNode = {
    name,
    qty,
    tier: recipe?.tier ?? 1,
    image: recipe?.image ?? null,
    farmable: recipe?.farmable ?? false,
    has_recipe: recipe?.has_recipe ?? false,
    ingredients: [],
  }

  if (!recipe || !recipe.has_recipe || recipe.ingredients.length === 0) return node
  if (visited.has(name)) return node

  const newVisited = new Set(visited)
  newVisited.add(name)

  node.ingredients = recipe.ingredients.map((ing) =>
    buildTree(ing, qty, recipeMap, newVisited)
  )

  return node
}

export function flattenIngredients(
  node: IngredientNode,
  qty: number,
  recipeMap: Map<string, Recipe>,
  acc: Map<string, FlatIngredient> = new Map(),
  isRoot: boolean = true
): Map<string, FlatIngredient> {
  const totalQty = node.qty * qty

  // Always recurse into the root regardless of farmable status
  if (!isRoot) {
    // Stop here if farmable or has no further ingredients
    if (node.farmable || node.ingredients.length === 0) {
      const existing = acc.get(node.name)
      if (existing) {
        existing.qty += totalQty
      } else {
        acc.set(node.name, {
          name: node.name,
          qty: totalQty,
          tier: node.tier,
          image: node.image,
          farmable: node.farmable,
        })
      }
      return acc
    }
  }

  for (const child of node.ingredients) {
    flattenIngredients(child, totalQty, recipeMap, acc, false)
  }

  return acc
}

export function flattenToBottom(
  node: IngredientNode,
  qty: number,
  acc: Map<string, FlatIngredient> = new Map()
): Map<string, FlatIngredient> {
  const totalQty = node.qty * qty

  if (node.ingredients.length === 0) {
    const existing = acc.get(node.name)
    if (existing) {
      existing.qty += totalQty
    } else {
      acc.set(node.name, {
        name: node.name,
        qty: totalQty,
        tier: node.tier,
        image: node.image,
        farmable: node.farmable,
      })
    }
    return acc
  }

  for (const child of node.ingredients) {
    flattenToBottom(child, totalQty, acc)
  }

  return acc
}

export function calcAllIngredients(
  name: string,
  qty: number,
  recipeMap: Map<string, Recipe>
): FlatIngredient[] {
  const tree = buildTree(name, 1, recipeMap)
  const flat = flattenIngredients(tree, qty, recipeMap)
  return Array.from(flat.values()).sort((a, b) => a.tier - b.tier)
}

export function getTreeDepth(node: IngredientNode): number {
  if (node.ingredients.length === 0) return 0
  return 1 + Math.max(...node.ingredients.map(getTreeDepth))
}
