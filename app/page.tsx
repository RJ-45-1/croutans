import RecipeCard from "@/components/recipe/recipe-card";
import { NewRecipeDialog } from "@/components/ui/new-recipe-dialog";
import { createClient } from "@/utils/supabase/server";
import { ChefHat } from "lucide-react";
import type { RecipeCardInfo } from "./types/recipe";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function Home() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if(!user){
    redirect("/auth/signin");
  }
  const { data } = await supabase
    .from("recipes")
    .select("id, title, author_username, uri, duration, category")
    .order("created_at", { ascending: false })
    .limit(10);
  const recipes: RecipeCardInfo[] = data || [];
  console.log("reipes: ", recipes);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="flex md:flex-row flex-col gap-8 mb-12 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-8 shadow-sm">
        <div className="flex-shrink-0 w-full md:w-1/3">
          <div className="relative h-96 w-full rounded-lg overflow-hidden ">
            <Image
              src="https://jowvqllgpmgmsqddybxg.supabase.co/storage/v1/object/public/recipes//front-page-logo.jpeg"
              alt="Family cooking together"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Hello friends!</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              This is where the cool kids come to learn how to cook. Since we spend half our time (or all our time, let's be honest) talking about food, we decided to make a compilation of our most delicious recipes. Some of these recipes have been passed down by the generations, some inspired by friends or fellow cooks, some just the product of an empty fridge and our genius/resourceful minds (the best recipes are born from an end of the week fridge, or like a day before grocery day fridge?).
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Mom, since you are the one who has taught us to cook and passed down your love for it, and it's such a big part of who we are and our identity as a family, we wanted to gift this to you to give back for the time you have spent teaching us. Here is proof of the inspiration you have been.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Anyways, enjoy!
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 font-medium">
              And never forget, no inappropriate stirring!
            </p>
            <p className="text-gray-600 text-sm italic">
              PS: Despite dad's lack of skill in the kitchen, we have given him a spot as we can't blame him for lack of trying, and those pancakes and barbecues really are delicious!
            </p>
          </div>
        </div>
      </div>

      {/* Latest Recipes Section */}
      <div className="flex flex-row justify-between gap-4 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">Latest Recipes</h1>
        <NewRecipeDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {recipes.length > 0 ? (
          recipes.map((recipe: RecipeCardInfo, key) => (
            <RecipeCard recipe={recipe} key={key} />
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <ChefHat className="w-12 h-12 mx-auto text-muted-foreground opacity-20" />
            <h3 className="mt-4 text-xl font-medium">No recipes found</h3>
            <p className="text-muted-foreground">
              Add your first recipe to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
