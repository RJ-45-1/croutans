"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { User, LogOut, Settings, Book } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function UserDropdown() {
  const router = useRouter();
  const supabase = createClient();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setAvatarUrl(user?.user_metadata?.user_avatar_url ?? user?.user_metadata?.avatar_url ?? null);
    };
    getUser();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      router.push("/auth/signin");
      router.refresh();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-14 w-14 rounded-full">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="User avatar"
              fill
              unoptimized={true}
              priority={false}
              className="rounded-full object-cover p-1"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-muted rounded-full">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/recipe")}
        >
          <Book className="h-4 w-4" />
          <span>All recipes</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/account")}
        >
          <Settings className="h-4 w-4" />
          <span>Account</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 