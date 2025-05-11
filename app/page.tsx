"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewRecipeDialog } from "@/components/ui/new-recipe-dialog";
import { RecipeFilters } from "@/components/ui/recipe-filters";
import { createClient } from "@/utils/supabase/client";
import { ChefHat, Clock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Recipe, RecipeCategory } from "./types/recipe";

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filters, setFilters] = useState({
    ownership: "all" as "all" | "mine" | "others",
    category: "all" as RecipeCategory | "all",
    search: "",
    maxDuration: 120,
  });
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const handleFilterChange = (newFilters: { ownership: "all" | "mine" | "others"; category: RecipeCategory | "all" }) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);

      let query = supabase
        .from("recipes")
        .select("*")
        .order("created_at", { ascending: false });

      // Apply ownership filter
      if (filters.ownership !== "all") {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          if (filters.ownership === "mine") {
            query = query.eq("author", user.id);
          } else {
            query = query.neq("author", user.id);
          }
        }
      }

      // Apply category filter
      if (filters.category !== "all") {
        query = query.eq("category", filters.category);
      }

      // Apply duration filter
      if (filters.maxDuration < 120) {
        query = query.lte("duration", filters.maxDuration);
      }

      const { data } = await query;

      // Apply search filter (client-side since Supabase doesn't support full-text search without extensions)
      let filteredData = data || [];
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredData = filteredData.filter((recipe) =>
          recipe.title.toLowerCase().includes(searchTerm),
        );
      }

      setRecipes(filteredData);
      setIsLoading(false);
    };

    fetchRecipes();
  }, [filters, supabase]);

  const getTitle = () => {
    let title = "";

    if (filters.ownership === "mine") {
      title += "My ";
    } else if (filters.ownership === "others") {
      title += "Others' ";
    }

    if (filters.category !== "all") {
      title +=
        filters.category.charAt(0).toUpperCase() + filters.category.slice(1);
    } else {
      title += "Latest";
    }

    title += " Recipes";
    return title;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-row justify-between gap-4 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">{getTitle()}</h1>
        <NewRecipeDialog />
      </div>

      <RecipeFilters onFilterChange={handleFilterChange} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="h-full overflow-hidden animate-pulse">
              <div className="bg-muted aspect-[4/3]"></div>
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="h-5 bg-muted rounded w-20"></div>
                  <div className="h-5 bg-muted rounded w-20"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : recipes.length > 0 ? (
          recipes.map((recipe) => (
            <Link
              href={`/recipe/${recipe.id}`}
              key={recipe.id}
              className="group h-full"
            >
              <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col">
                {recipe.uri ? (
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={recipe.uri || "/placeholder.svg"}
                      alt={recipe.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="bg-muted aspect-[4/3] flex items-center justify-center text-muted-foreground">
                    <ChefHat className="w-12 h-12 opacity-20" />
                  </div>
                )}
                <div className="flex flex-col flex-grow">
                  <CardHeader>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                      {recipe.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                      {recipe.author_username && (
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <User className="w-3 h-3" />
                          {recipe.author_username}
                        </Badge>
                      )}
                      {recipe.category && (
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <ChefHat className="w-3 h-3" />
                          {recipe.category}
                        </Badge>
                      )}
                      {recipe.duration && (
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <Clock className="w-3 h-3" />
                          {recipe.duration} min
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <ChefHat className="w-12 h-12 mx-auto text-muted-foreground opacity-20" />
            <h3 className="mt-4 text-xl font-medium">No recipes found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or add a new recipe
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
