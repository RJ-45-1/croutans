export type RecipeCategory = "entree" | "plat" | "dessert";

export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Step {
  step: number;
  description: string;
}

export interface Recipe {
  id: number;
  title: string;
  uri: string | null;
  ingredients: Ingredient[] | null;
  steps: Step[] | null;
  author: string | null; // UUID is represented as string
  author_username: string | null;
  category: RecipeCategory | null;
  duration: number | null;
  created_at: string | null; // Timestamp as string
} 