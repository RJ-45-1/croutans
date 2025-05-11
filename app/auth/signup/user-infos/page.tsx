import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UserInfoForm } from "./user-info-form";

export const metadata: Metadata = {
  title: "Complete Your Profile",
  description: "Add your username and avatar",
};

export default async function UserInfoPage() {
  const supabase = await createClient();

  // Check if user is already signed in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is not signed in, redirect to signup
  if (!user) {
    //redirect("/auth/signup");
  }

  return (
    <div className="w-full min-h-[calc(100vh-100px)] flex flex-row justify-center items-center">
      <Card className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] bg-background/90 backdrop-blur-sm shadow-xl pt-4">
        <CardContent className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Complete Your Profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose a username and avatar to complete your profile
          </p>

          <UserInfoForm />
        </CardContent>
      </Card>
    </div>
  );
} 