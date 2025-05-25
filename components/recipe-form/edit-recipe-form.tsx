"use client";

import { Ingredient, Recipe, RecipeCategory, Step } from "@/app/types/recipe";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";
import { ListChecks, Plus, Upload, Utensils, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface EditRecipeFormProps {
  recipe: Recipe;
}

export default function EditRecipeForm({ recipe: initialRecipe }: EditRecipeFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialRecipe.uri);
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialRecipe.ingredients || []);
  const [steps, setSteps] = useState<Step[]>(initialRecipe.steps || []);
  const [title, setTitle] = useState(initialRecipe.title);
  const [category, setCategory] = useState<RecipeCategory | null>(initialRecipe.category);
  const [duration, setDuration] = useState(initialRecipe.duration?.toString() || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: string,
  ) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  const addStep = () => {
    setSteps([...steps, { step: steps.length + 1, description: "" }]);
  };

  const removeStep = (index: number) => {
    const newSteps = steps
      .filter((_, i) => i !== index)
      .map((step, i) => ({
        ...step,
        step: i + 1,
      }));
    setSteps(newSteps);
  };

  const updateStep = (index: number, description: string) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], description };
    setSteps(newSteps);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      let imageUrl = initialRecipe.uri || null;
      if (imageFile) {
        // Delete old image if it exists
        if (initialRecipe.uri) {
          const oldImagePath = initialRecipe.uri.split("/").pop();
          if (oldImagePath) {
            await supabase.storage.from("recipes").remove([oldImagePath]);
          }
        }

        // Upload new image
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("recipes")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("recipes").getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const { error } = await supabase
        .from("recipes")
        .update({
          title,
          category,
          duration: parseInt(duration),
          uri: imageUrl,
          ingredients: ingredients.filter((i) => i.name && i.quantity),
          steps: steps.filter((s) => s.description),
        })
        .eq("id", initialRecipe.id);

      if (error) throw error;

      toast.success("Recipe updated successfully");
      router.push(`/recipe/${initialRecipe.id}`);
    } catch (error) {
      console.error("Error updating recipe:", error);
      toast.error("Failed to update recipe");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Image and Info */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recipe Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                onClick={handleImageClick}
                className="relative aspect-[4/3] border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              >
                {imagePreview ? (
                  <>
                    <Image
                      src={imagePreview}
                      alt="Recipe preview"
                      fill
                      className="object-cover rounded-lg"
                      unoptimized={true}
                      priority={false}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                    <Upload className="h-8 w-8 mb-2" />
                    <span>Click to upload image</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recipe Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={category || ""}
                  onValueChange={(value) =>
                    setCategory(value as RecipeCategory)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entree">Entrée</SelectItem>
                    <SelectItem value="plat">Main Course</SelectItem>
                    <SelectItem value="dessert">Dessert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Ingredients and Steps */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Utensils className="w-5 h-5" />
                  Ingredients
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addIngredient}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Ingredient
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-1 space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={ingredient.name}
                        onChange={(e) =>
                          updateIngredient(index, "name", e.target.value)
                        }
                        placeholder="Ingredient name"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>Quantity</Label>
                      <Input
                        value={ingredient.quantity}
                        onChange={(e) =>
                          updateIngredient(index, "quantity", e.target.value)
                        }
                        placeholder="Amount"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeIngredient(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ListChecks className="w-5 h-5" />
                  Instructions
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addStep}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Step
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {step.step}
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>Step {step.step}</Label>
                      <Input
                        value={step.description}
                        onChange={(e) => updateStep(index, e.target.value)}
                        placeholder="Describe this step"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeStep(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Recipe"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
} 