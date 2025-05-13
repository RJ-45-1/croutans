import EditRecipeForm from "@/components/recipe-form/edit-recipe-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// Wrapper component that handles data fetching and authorization
async function EditRecipeContent({ id }: { id: string }) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  // Fetch recipe data
  const { data: recipe, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !recipe) {
    notFound();
  }

  // Check if user is the author
  if (recipe.author !== user.id) {
    notFound();
  }

  return <EditRecipeForm recipe={recipe} />;
}

// Inline skeleton component for loading state
function EditRecipeSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-8 w-48" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Title field skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Category field skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Duration field skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Image upload skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-40 w-full" />
        </div>

        {/* Ingredients section skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="space-y-4">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Steps section skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="space-y-4">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <Skeleton key={index} className="h-24 w-full" />
              ))}
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Submit button skeleton */}
        <div className="flex justify-end space-x-4 pt-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

// Main page component that uses Suspense and the wrapper component
export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Suspense fallback={<EditRecipeSkeleton />}>
        <EditRecipeContent id={id} />
      </Suspense>
    </div>
  );
}
