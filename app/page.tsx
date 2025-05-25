import RecipeCard from "@/components/recipe/recipe-card";
import { NewRecipeDialog } from "@/components/ui/new-recipe-dialog";
import { createClient } from "@/utils/supabase/server";
import { ChefHat } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import type { RecipeCardInfo } from "./types/recipe";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
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
              unoptimized={true}
              priority={false}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Hello friends!
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to the place where the cool kids come to cook. Since we spend at least half our time (okay, probably all our time) talking about food, we decided it was time to compile some of our most delicious recipes.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Some have been passed down through generations, some inspired by friends or fellow food lovers, and others were born from an almost-empty fridge and our brilliantly resourceful minds (you know the kind — the "day-before-grocery-day" fridge).
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Mom, you're the one who taught us how to cook and passed down your love for it. It's more than just making meals — it's become a part of who we are and what ties us together as a family. So this is our gift to you — a small way to thank you for all the time, patience, and love you've poured into teaching us. Here's the proof of just how much you've inspired us.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Enjoy!
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 font-medium">
              And never forget: no inappropriate stirring !!!
            </p>
            <p className="text-gray-600 text-sm italic">
              P.S. Despite Dad's questionable kitchen skills, we've given him his own tab. We can't blame him for not trying — and let's be honest, his pancakes and barbecues are pretty legendary.
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
