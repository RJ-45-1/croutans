import { createClient } from "@/utils/supabase/server";
import { Book, Menu, Settings, Utensils } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import UserDropdown from "./user-dropdown";

export default async function TopBar() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  return (
    <div className="w-full flex flex-row justify-between items-center px-4 py-2">
      {/* Logo on the left */}
      <Link href="/" className="flex items-center gap-2 p-2 rounded">
        <Image
          src="https://jowvqllgpmgmsqddybxg.supabase.co/storage/v1/object/public/recipes//little-logo.png"
          alt="Croutans"
          width={64}
          height={64}
          unoptimized={true}
          priority={false}
        />
        <span className="text-lg font-medium">Home</span>
      </Link>

      {/* Title in the center - hidden on very small screens */}
      <div className="absolute left-1/2 transform -translate-x-1/2  md:block">
        <h1
          className="text-3xl lg:text-5xl font-bold text-center"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          The Croutans
        </h1>
      </div>

      {/* Desktop Navigation and user controls on the right - hidden on mobile */}
      <div className="hidden md:flex items-center gap-4">
        {user.user?.user_metadata ? (
          <>
            {/* Navigation items */}
            <nav className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="flex items-center gap-2"
              >
                <Link href="/recipe">
                  <Book className="h-4 w-4" />
                  <span>All recipes</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="flex items-center gap-2"
              >
                <Link href="/les-restes">
                  <Utensils className="h-4 w-4" />
                  <span>Les restes</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="flex items-center gap-2"
              >
                <Link href="/account">
                  <Settings className="h-4 w-4" />
                  <span>Account</span>
                </Link>
              </Button>
            </nav>
            <UserDropdown />
          </>
        ) : (
          <>
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </>
        )}
      </div>

      {/* Mobile Navigation - Sheet with hamburger menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <SheetHeader>
              <SheetTitle
                className="text-left"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                The croutans
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-6">
              {user.user?.user_metadata ? (
                <>
                  <nav className="flex flex-col gap-2">
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        asChild
                        className="justify-start gap-2"
                      >
                        <Link href="/recipe">
                          <Book className="h-4 w-4" />
                          <span>All recipes</span>
                        </Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        asChild
                        className="justify-start gap-2"
                      >
                        <Link href="/les-restes">
                          <Utensils className="h-4 w-4" />
                          <span>Les restes</span>
                        </Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        asChild
                        className="justify-start gap-2"
                      >
                        <Link href="/account">
                          <Settings className="h-4 w-4" />
                          <span>Account</span>
                        </Link>
                      </Button>
                    </SheetClose>
                  </nav>
                  <div className="pt-4 border-t">
                    <UserDropdown />
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <SheetClose asChild>
                    <Button variant="ghost" asChild className="justify-start">
                      <Link href="/auth/signin">Sign In</Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button variant="outline" asChild className="justify-start">
                      <Link href="/auth/signup">Sign Up</Link>
                    </Button>
                  </SheetClose>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
