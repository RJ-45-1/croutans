import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AccountForm } from "./account-form";

export default async function AccountPage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();

  // If user is not signed in, redirect to signin
  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="bg-background/90 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AccountForm user={user} />
        </CardContent>
      </Card>
    </div>
  );
} 