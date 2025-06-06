import type { Ingredient, Step } from "@/app/types/recipe";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecipeActions } from "@/components/ui/recipe-actions";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/utils/supabase/server";
import { ChefHat, Clock, ListChecks, User, Utensils } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// Wrapper component that handles data fetching
async function RecipeContent({ id }: { id: string }) {
  const supabase = await createClient();

  const { data: recipe, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !recipe) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthor = user?.id === recipe.author;

  return (
    <>
      <div className="flex justify-end mb-6">
        {isAuthor && (
          <RecipeActions recipeId={recipe.id} recipeImageUrl={recipe.uri} />
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Image and Info */}
        <div className="lg:col-span-5 space-y-6">
          {recipe.uri && (
            <Card className="overflow-hidden top-8">
              <div className="relative aspect-[4/3]">
                <Image
                  src={recipe.uri || "/placeholder.svg"}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                  unoptimized={true}
                  priority={false}
                />
              </div>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">
                {recipe.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-muted-foreground">
                {recipe.author_username && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <User className="w-4 h-4" />
                    {recipe.author_username}
                  </Badge>
                )}
                {recipe.category && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <ChefHat className="w-4 h-4" />
                    {recipe.category}
                  </Badge>
                )}
                {recipe.duration && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Clock className="w-4 h-4" />
                    {recipe.duration} min
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Ingredients and Steps */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="w-5 h-5" />
                Ingredients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recipe.ingredients?.map(
                  (ingredient: Ingredient, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 rounded-lg bg-muted/50"
                    >
                      <span className="font-medium">{ingredient.name}</span>
                      <Badge variant="outline">{ingredient.quantity}</Badge>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="w-5 h-5" />
                Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-6">
                {recipe.steps?.map((step: Step) => (
                  <li key={step.step} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {step.step}
                    </div>
                    <div className="pt-1">
                      <p className="text-lg">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

// Skeleton loading component that matches the layout of the actual content
function RecipeSkeleton() {
  return (
    <>
      <div className="flex justify-end mb-6">
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Image and Info Skeleton */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="overflow-hidden top-8">
            <Skeleton className="aspect-[4/3] w-full" />
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-10 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Ingredients and Steps Skeleton */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-32" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <Skeleton key={index} className="h-12 w-full" />
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="flex gap-4">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

// Main page component that uses Suspense and the wrapper component
export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Suspense fallback={<RecipeSkeleton />}>
        <RecipeContent id={id} />
      </Suspense>
    </div>
  );
}
