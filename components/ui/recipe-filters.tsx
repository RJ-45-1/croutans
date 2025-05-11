"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { RecipeCategory } from "@/app/types/recipe";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface RecipeFiltersProps {
  onFilterChange: (filters: {
    ownership: "all" | "mine" | "others";
    category: RecipeCategory | "all";
  }) => void;
}

export function RecipeFilters({ onFilterChange }: RecipeFiltersProps) {
  const [ownership, setOwnership] = useState<"all" | "mine" | "others">("all");
  const [category, setCategory] = useState<RecipeCategory | "all">("all");
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, [supabase.auth]);

  useEffect(() => {
    onFilterChange({ ownership, category });
  }, [ownership, category, onFilterChange]);

  return (
    <div className="flex flex-wrap items-center gap-4 mb-8">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Show:</span>
        <Select value={ownership} onValueChange={(value: "all" | "mine" | "others") => setOwnership(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select recipes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Recipes</SelectItem>
            {userId && (
              <>
                <SelectItem value="mine">My Recipes</SelectItem>
                <SelectItem value="others">Others' Recipes</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Category:</span>
        <Select value={category} onValueChange={(value: RecipeCategory | "all") => setCategory(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="entree">Entrées</SelectItem>
            <SelectItem value="plat">Plats</SelectItem>
            <SelectItem value="dessert">Desserts</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 