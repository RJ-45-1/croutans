"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Upload, X } from "lucide-react";
import { useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RecipeCategory, Ingredient, Step } from "@/app/types/recipe";
import Image from "next/image";

export function NewRecipeDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: "", quantity: "" }]);
  const [steps, setSteps] = useState<Step[]>([{ step: 1, description: "" }]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<RecipeCategory | "">("");
  const [duration, setDuration] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
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

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  const addStep = () => {
    setSteps([...steps, { step: steps.length + 1, description: "" }]);
  };

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index).map((step, i) => ({
      ...step,
      step: i + 1
    }));
    setSteps(newSteps);
  };

  const updateStep = (index: number, description: string) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], description };
    setSteps(newSteps);
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    // Check if title, category, and duration are filled
    if (!title.trim() || !category || !duration.trim()) {
      return false;
    }

    // Check if at least one ingredient has both name and quantity
    const validIngredients = ingredients.filter(i => i.name.trim() && i.quantity.trim());
    if (validIngredients.length === 0) {
      return false;
    }

    // Check if at least one step has description
    const validSteps = steps.filter(s => s.description.trim());
    if (validSteps.length === 0) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to create a recipe");
        return;
      }

      let imageUrl = null;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('recipes')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;
        console.log("error: ", uploadError);
        
        const { data: { publicUrl } } = supabase.storage
          .from('recipes')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      const { error } = await supabase.from("recipes").insert({
        title,
        category: category as RecipeCategory,
        duration: parseInt(duration),
        author: user.id,
        uri: imageUrl,
        ingredients: ingredients.filter(i => i.name && i.quantity),
        steps: steps.filter(s => s.description),
        author_username: user.user_metadata.username,
      });

      if (error) throw error;

      toast.success("Recipe created successfully");
      setOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error("Error creating recipe");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" className="h-10 w-10">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Recipe</DialogTitle>
          <DialogDescription>
            Add a new recipe to your collection with all its details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter recipe title"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Recipe Image</Label>
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
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(value: RecipeCategory) => setCategory(value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entree">Entrée</SelectItem>
                  <SelectItem value="plat">Plat</SelectItem>
                  <SelectItem value="dessert">Dessert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Enter cooking duration"
                required
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Ingredients</Label>
                <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Ingredient
                </Button>
              </div>
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Ingredient name"
                    value={ingredient.name}
                    onChange={(e) => updateIngredient(index, "name", e.target.value)}
                    required
                  />
                  <Input
                    placeholder="Quantity"
                    value={ingredient.quantity}
                    onChange={(e) => updateIngredient(index, "quantity", e.target.value)}
                    required
                  />
                  {ingredients.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeIngredient(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Steps</Label>
                <Button type="button" variant="outline" size="sm" onClick={addStep}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Step
                </Button>
              </div>
              {steps.map((step, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {step.step}
                  </div>
                  <Input
                    placeholder="Step description"
                    value={step.description}
                    onChange={(e) => updateStep(index, e.target.value)}
                    required
                  />
                  {steps.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeStep(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading || !isFormValid()}>
              {isLoading ? "Creating..." : "Create Recipe"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 