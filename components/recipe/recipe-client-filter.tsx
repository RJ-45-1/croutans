"use client";

import type {
  Recipe,
  RecipeCardInfo,
  RecipeCategory,
} from "@/app/types/recipe";
import RecipeCard from "@/components/recipe/recipe-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Filter, X, ChevronDown, UtensilsCrossed, Cake, Coffee, User } from "lucide-react";
import { useEffect, useState } from "react";

interface RecipeFilterClientProps {
  initialRecipes: Recipe[];
  authors: string[];
}

export function RecipeFilterClient({
  initialRecipes,
  authors,
}: RecipeFilterClientProps) {
  const [recipes] = useState<Recipe[]>(initialRecipes);
  const [filteredRecipes, setFilteredRecipes] =
    useState<Recipe[]>(initialRecipes);
  const [selectedCategory, setSelectedCategory] =
    useState<RecipeCategory | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Filter recipes based on selected filters
    let result = [...recipes];

    if (selectedCategory) {
      result = result.filter((recipe) => recipe.category === selectedCategory);
    }

    if (selectedAuthor) {
      result = result.filter(
        (recipe) => recipe.author_username === selectedAuthor,
      );
    }

    setFilteredRecipes(result);
  }, [recipes, selectedCategory, selectedAuthor]);

  const handleCategoryFilter = (category: RecipeCategory | null) => {
    if (category === selectedCategory) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const handleAuthorFilter = (author: string | null) => {
    if (author === selectedAuthor) {
      setSelectedAuthor(null);
    } else {
      setSelectedAuthor(author);
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSelectedAuthor(null);
  };

  // Helper function to get the icon for the category
  const getCategoryIcon = (category: RecipeCategory) => {
    switch(category) {
      case "entree":
        return <UtensilsCrossed className="h-4 w-4 mr-2" />;
      case "plat":
        return <Coffee className="h-4 w-4 mr-2" />;
      case "dessert":
        return <Cake className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  const activeFiltersCount = [selectedCategory, selectedAuthor].filter(Boolean).length;

  return (
    <>
      {/* Desktop filters */}
      <div className="mb-8 hidden md:block">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Filters</h2>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear all
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Category</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "entree" ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryFilter("entree")}
                className="gap-1"
              >
                <UtensilsCrossed className="h-4 w-4" />
                Entrée
              </Button>
              <Button
                variant={selectedCategory === "plat" ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryFilter("plat")}
                className="gap-1"
              >
                <Coffee className="h-4 w-4" />
                Plat
              </Button>
              <Button
                variant={selectedCategory === "dessert" ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryFilter("dessert")}
                className="gap-1"
              >
                <Cake className="h-4 w-4" />
                Dessert
              </Button>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-2">Authors</h3>
            <div className="flex flex-wrap gap-2">
              {authors.map((author) => (
                <Button
                  key={author}
                  variant={selectedAuthor === author ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleAuthorFilter(author)}
                  className="gap-1"
                >
                  <User className="h-4 w-4" />
                  {author}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filters */}
      <div className="md:hidden mb-6 flex items-center justify-between">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5">
                  {activeFiltersCount}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[240px] p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Category</h3>
                <div className="flex flex-col gap-1">
                  <DropdownMenuItem
                    className={`gap-2 rounded-md ${selectedCategory === "entree" ? "bg-primary text-primary-foreground" : ""}`}
                    onClick={() => handleCategoryFilter("entree")}
                  >
                    <UtensilsCrossed className="h-4 w-4" />
                    Entrée
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={`gap-2 rounded-md ${selectedCategory === "plat" ? "bg-primary text-primary-foreground" : ""}`}
                    onClick={() => handleCategoryFilter("plat")}
                  >
                    <Coffee className="h-4 w-4" />
                    Plat
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={`gap-2 rounded-md ${selectedCategory === "dessert" ? "bg-primary text-primary-foreground" : ""}`}
                    onClick={() => handleCategoryFilter("dessert")}
                  >
                    <Cake className="h-4 w-4" />
                    Dessert
                  </DropdownMenuItem>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">Authors</h3>
                <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto">
                  {authors.map((author) => (
                    <DropdownMenuItem
                      key={author}
                      className={`gap-2 rounded-md ${selectedAuthor === author ? "bg-primary text-primary-foreground" : ""}`}
                      onClick={() => handleAuthorFilter(author)}
                    >
                      <User className="h-4 w-4" />
                      {author}
                    </DropdownMenuItem>
                  ))}
                </div>
              </div>
              
              {activeFiltersCount > 0 && (
                <>
                  <Separator />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      clearAllFilters();
                      setIsOpen(false);
                    }}
                    className="w-full"
                  >
                    Clear all filters
                    <X className="ml-2 h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Active filter badges for mobile */}
        <div className="flex flex-wrap gap-1">
          {selectedCategory && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {getCategoryIcon(selectedCategory)}
              {selectedCategory === "entree" ? "Entrée" : 
               selectedCategory === "plat" ? "Plat" : "Dessert"}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => setSelectedCategory(null)} 
              />
            </Badge>
          )}
          {selectedAuthor && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {selectedAuthor}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => setSelectedAuthor(null)} 
              />
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe: RecipeCardInfo, key) => (
            <RecipeCard recipe={recipe} key={key} />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            No recipes found matching your filters.
          </div>
        )}
      </div>
    </>
  );
}
