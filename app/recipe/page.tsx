import { RecipeFilterClient } from "@/components/recipe/recipe-client-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";

// Skeleton component for loading state
function RecipesPageSkeleton() {
  return (
    <div>
      {/* Filter skeleton */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Filter by Category</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>

        <h2 className="text-xl font-semibold mb-3">Filter by Author</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Recipe cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-16 rounded-full" />
                <Skeleton className="h-8 w-16 rounded-full" />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

// Wrapper component for data fetching
async function RecipesWrapper() {
  const supabase = await createClient();

  // Fetch recipes on the server
  const { data: recipes, error } = await supabase.from("recipes").select("*");

  if (error) {
    console.error("Error fetching recipes:", error);
    return <div>Error loading recipes</div>;
  }

  // Extract unique authors
  const uniqueAuthors = Array.from(
    new Set(
      recipes
        .filter((recipe) => recipe.author_username)
        .map((recipe) => recipe.author_username),
    ),
  ) as string[];

  return (
    <RecipeFilterClient
      initialRecipes={recipes || []}
      authors={uniqueAuthors}
    />
  );
}

// Main page component with Suspense
export default function RecipesPage() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">All Recipes</h1>

      <Suspense fallback={<RecipesPageSkeleton />}>
        <RecipesWrapper />
      </Suspense>
    </main>
  );
}
