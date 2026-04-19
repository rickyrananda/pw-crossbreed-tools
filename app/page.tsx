import recipes from '@/data/recipes.json'
import { Recipe } from '@/types'
import AppShell from '@/components/AppShell'

export default function Home() {
  return <AppShell recipes={recipes as Recipe[]} />
}
