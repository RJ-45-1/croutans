import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignUpForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account",
};

export default async function SignUpPage() {
  const supabase = await createClient();

  // Check if user is already signed in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is signed in, redirect to dashboard
  if (user) {
    redirect("/");
  }

  return (
    <div className="w-full min-h-[calc(100vh-100px)] flex flex-row justify-center items-center ">
      <Card className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] bg-background/90 backdrop-blur-sm shadow-xl pt-4">
        <CardContent className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to create your account
          </p>

          <SignUpForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              href="/auth/signin"
              className="hover:text-brand underline underline-offset-4"
            >
              Already have an account? Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
