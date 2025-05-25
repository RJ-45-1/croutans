import { RecipeCardInfo } from "@/app/types/recipe";
import { ChefHat, Clock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function RecipeCard({ recipe }: { recipe: RecipeCardInfo }) {
  // Debug log for image URL in development
  if (process.env.NODE_ENV === 'development' && recipe.uri) {
    console.log('Recipe image URL:', recipe.uri);
  }

  return (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col">
      <Link
        href={`/recipe/${recipe.id}`}
        key={recipe.id}
        className="group h-full"
      >
        {recipe.uri ? (
          <div className="relative aspect-[4/3]">
            <Image
              src={recipe.uri}
              alt={recipe.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                console.error('Image failed to load:', recipe.uri);
                // Hide the image container on error
                if (e.currentTarget.parentElement) {
                  e.currentTarget.parentElement.style.display = 'none';
                }
              }}
              unoptimized={process.env.NODE_ENV === 'development'}
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
      </Link>
    </Card>
  );
}
