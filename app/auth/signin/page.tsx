import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignInForm } from "./signin-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default async function SignInPage() {
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
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose a way to connect to Croutans
          </p>

          <SignInForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              href="/auth/signup"
              className="hover:text-brand underline underline-offset-4"
            >
              Don&apos;t have an account? Sign Up
            </Link>
          </p>
          <Link
            href="/auth/reset-password"
            className="hover:text-brand underline underline-offset-4 px-8 text-center text-sm text-muted-foreground"
          >
            Forgot password?
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
