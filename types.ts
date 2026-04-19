export interface Recipe {
  name: string
  tier: number
  image: string | null
  farmable: boolean
  has_recipe: boolean
  ingredients: string[]
}

export interface IngredientNode {
  name: string
  qty: number
  tier: number
  image: string | null
  farmable: boolean
  has_recipe: boolean
  ingredients: IngredientNode[]
}

export interface FlatIngredient {
  name: string
  qty: number
  tier: number
  image: string | null
  farmable: boolean
}
