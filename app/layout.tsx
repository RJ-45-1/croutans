import TopBar from "@/components/ui/top-bar";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Croutans",
  description: "The family recipe book",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body>
        <Toaster />
        {/* Animated background */}
        <header className="w-full py-4 px-6 flex justify-between items-center z-10 bg-background/80 backdrop-blur-sm">
          <TopBar />
        </header>
        <div className="min-h-[calc(100vh-100px)] px-8">{children}</div>
      </body>
    </html>
  );
}
