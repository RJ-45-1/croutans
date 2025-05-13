import RecipeCard from "@/components/recipe/recipe-card";
import { NewRecipeDialog } from "@/components/ui/new-recipe-dialog";
import { createClient } from "@/utils/supabase/server";
import { ChefHat } from "lucide-react";
import type { RecipeCardInfo } from "./types/recipe";
import { redirect } from "next/navigation";
export default async function Home() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if(!user){
    redirect("/auth/signin");
  }
  const { data } = await supabase
    .from("recipes")
    .select("id, title, author_username, uri, duration, category")
    .order("created_at", { ascending: false })
    .limit(10);
  const recipes: RecipeCardInfo[] = data || [];
  console.log("reipes: ", recipes);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-row justify-between gap-4 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">Latest Recipes</h1>
        <NewRecipeDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {recipes.length > 0 ? (
          recipes.map((recipe: RecipeCardInfo, key) => (
            <RecipeCard recipe={recipe} key={key} />
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <ChefHat className="w-12 h-12 mx-auto text-muted-foreground opacity-20" />
            <h3 className="mt-4 text-xl font-medium">No recipes found</h3>
            <p className="text-muted-foreground">
              Add your first recipe to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
