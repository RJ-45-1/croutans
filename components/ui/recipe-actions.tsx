"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface RecipeActionsProps {
  recipeId: string;
  recipeImageUrl?: string | null;
}

export function RecipeActions({ recipeId, recipeImageUrl }: RecipeActionsProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    try {
      // Delete the recipe image from storage if it exists
      if (recipeImageUrl) {
        const imagePath = recipeImageUrl.split('/').pop();
        if (imagePath) {
          await supabase.storage
            .from('recipes')
            .remove([imagePath]);
        }
      }

      // Delete the recipe from the database
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeId);

      if (error) throw error;

      toast.success("Recipe deleted successfully");
      router.push('/');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast.error("Failed to delete recipe");
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push(`/recipe/edit/${recipeId}`)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your recipe.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 