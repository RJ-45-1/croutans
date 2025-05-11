"use client";

import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { Recipe, RecipeCategory } from './types/recipe';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ChefHat, User } from 'lucide-react';
import Image from 'next/image';
import { RecipeFilters } from '@/components/ui/recipe-filters';
import { NewRecipeDialog } from '@/components/ui/new-recipe-dialog';
import { useEffect, useState } from 'react';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filters, setFilters] = useState({
    ownership: "all" as "all" | "mine" | "others",
    category: "all" as RecipeCategory | "all"
  });
  const supabase = createClient();

  useEffect(() => {
    const fetchRecipes = async () => {
      let query = supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply ownership filter
      if (filters.ownership !== "all") {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          if (filters.ownership === "mine") {
            query = query.eq('author', user.id);
          } else {
            query = query.neq('author', user.id);
          }
        }
      }

      // Apply category filter
      if (filters.category !== "all") {
        query = query.eq('category', filters.category);
      }

      const { data } = await query;
      setRecipes(data || []);
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
      title += filters.category.charAt(0).toUpperCase() + filters.category.slice(1);
    } else {
      title += "Latest";
    }

    title += " Recipes";
    return title;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">{getTitle()}</h1>
        <NewRecipeDialog />
      </div>
      
      <RecipeFilters onFilterChange={setFilters} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {recipes.map((recipe) => (
          <Link 
            href={`/recipe/${recipe.id}`} 
            key={recipe.id}
            className="group h-full"
          >
            <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col">
              {recipe.uri && (
                <div className="relative aspect-[4/3]">
                  <Image
                    src={recipe.uri}
                    alt={recipe.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-col flex-grow">
                <CardHeader>
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                    {recipe.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {recipe.author_username && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {recipe.author_username}
                      </Badge>
                    )}
                    {recipe.category && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <ChefHat className="w-3 h-3" />
                        {recipe.category}
                      </Badge>
                    )}
                    {recipe.duration && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {recipe.duration} min
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
