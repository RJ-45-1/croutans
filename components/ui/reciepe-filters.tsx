"use client";

import type React from "react";

import type { RecipeCategory } from "@/app/types/recipe";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import {
  ChefHat,
  Clock,
  Search,
  SlidersHorizontal,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface RecipeFiltersProps {
  onFilterChange: (filters: {
    ownership: "all" | "mine" | "others";
    category: RecipeCategory | "all";
    search?: string;
    maxDuration?: number;
  }) => void;
}

export function RecipeFilters({ onFilterChange }: RecipeFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    ownership: "all" as "all" | "mine" | "others",
    category: "all" as RecipeCategory | "all",
    search: "",
    maxDuration: 120,
  });
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Update parent component when filters change
  useEffect(() => {
    onFilterChange(filters);

    // Track active filters for badge display
    const active = [];
    if (filters.ownership !== "all") active.push("ownership");
    if (filters.category !== "all") active.push("category");
    if (filters.search) active.push("search");
    if (filters.maxDuration < 120) active.push("duration");

    setActiveFilters(active);
  }, [filters, onFilterChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleDurationChange = (value: number[]) => {
    setFilters((prev) => ({ ...prev, maxDuration: value[0] }));
  };

  const resetFilters = () => {
    setFilters({
      ownership: "all",
      category: "all",
      search: "",
      maxDuration: 120,
    });
  };

  const categoryLabels: Record<RecipeCategory | "all", string> = {
    all: "All Categories",
    entree: "Entrée",
    plat: "Main Course",
    dessert: "Dessert",
  };

  const ownershipLabels: Record<"all" | "mine" | "others", string> = {
    all: "All Recipes",
    mine: "My Recipes",
    others: "Others' Recipes",
  };

  return (
    <div className="mb-8 space-y-4">
      {/* Mobile filter button */}
      {isMobile && (
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="outline"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex items-center gap-2",
              activeFilters.length > 0 && "border-primary text-primary",
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilters.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFilters.length}
              </Badge>
            )}
          </Button>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search recipes..."
              value={filters.search}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* Desktop filters or expanded mobile filters */}
      <div
        className={cn(
          "grid gap-4 transition-all duration-300",
          isMobile
            ? isOpen
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0 overflow-hidden"
            : "grid-cols-[1fr_auto_auto] items-center",
        )}
      >
        {!isMobile && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search recipes..."
              value={filters.search}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "flex items-center gap-2",
                  filters.category !== "all" && "border-primary text-primary",
                )}
              >
                <ChefHat className="w-4 h-4" />
                {categoryLabels[filters.category]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              <DropdownMenuRadioGroup
                value={filters.category}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    category: value as RecipeCategory | "all",
                  }))
                }
              >
                <DropdownMenuRadioItem value="all">
                  All Categories
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="entree">
                  Entrée
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="plat">
                  Main Course
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dessert">
                  Dessert
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "flex items-center gap-2",
                  filters.ownership !== "all" && "border-primary text-primary",
                )}
              >
                <User className="w-4 h-4" />
                {ownershipLabels[filters.ownership]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              <DropdownMenuRadioGroup
                value={filters.ownership}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    ownership: value as "all" | "mine" | "others",
                  }))
                }
              >
                <DropdownMenuRadioItem value="all">
                  All Recipes
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="mine">
                  My Recipes
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="others">
                  Others' Recipes
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Accordion type="single" collapsible className="w-full max-w-[200px]">
            <AccordionItem value="duration" className="border-0">
              <AccordionTrigger className="py-2 px-3 h-9 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground">
                <div
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium",
                    filters.maxDuration < 120 && "text-primary",
                  )}
                >
                  <Clock className="w-4 h-4" />
                  Duration: {filters.maxDuration} min
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-2">
                <Slider
                  defaultValue={[120]}
                  max={120}
                  step={5}
                  value={[filters.maxDuration]}
                  onValueChange={handleDurationChange}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>5 min</span>
                  <span>120 min</span>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {activeFilters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-9"
          >
            <X className="w-4 h-4 mr-2" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Active filters badges */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {filters.category !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <ChefHat className="w-3 h-3" />
              {categoryLabels[filters.category]}
              <X
                className="w-3 h-3 ml-1 cursor-pointer"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, category: "all" }))
                }
              />
            </Badge>
          )}
          {filters.ownership !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {ownershipLabels[filters.ownership]}
              <X
                className="w-3 h-3 ml-1 cursor-pointer"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, ownership: "all" }))
                }
              />
            </Badge>
          )}
          {filters.maxDuration < 120 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Max {filters.maxDuration} min
              <X
                className="w-3 h-3 ml-1 cursor-pointer"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, maxDuration: 120 }))
                }
              />
            </Badge>
          )}
          {filters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Search className="w-3 h-3" />"{filters.search}"
              <X
                className="w-3 h-3 ml-1 cursor-pointer"
                onClick={() => setFilters((prev) => ({ ...prev, search: "" }))}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
