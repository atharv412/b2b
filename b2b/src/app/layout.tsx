import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { OnboardingProvider } from "@/context/OnboardingContext";
import { NavProvider } from "@/context/NavContext";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "B2B Platform - Professional Network & Marketplace",
  description: "Connect, collaborate, and grow your business on our professional networking and marketplace platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <OnboardingProvider>
            <NavProvider>
              {children}
              <Toaster />
            </NavProvider>
          </OnboardingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
