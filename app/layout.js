"use client";

import React, { useEffect } from "react";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Login from "./login/page";
import ResetPassword from "./reset-password/page";
import Dashboard from "@/components/Dashboard";
import { Loader } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function AuthWrapper({ children }) {
  const { data: session, status } = useSession(); // Get session and status
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      // Redirect only after session status has been checked
      router.replace("/login");
    }
  }, [status, router]);

  // If session status is still loading, show a loading message
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" />
      </div>
    );
  }

  // If no session and not authenticated, render nothing
  if (!session) {
    return null; // Don't render anything while redirecting
  }

  // Render authenticated content
  return children;
}

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>KSVJ</title>
      </head>
      <body>
        <SessionProvider>
          <div className="main">
            <main className="app">
              {pathname === "/login" || pathname === "/reset-password" ? (
                // Allow the resetPassword page to be rendered without authentication
                pathname === "/login" ? (
                  <Login />
                ) : (
                  children // This will render the ResetPassword page
                )
              ) : pathname === "/update-information/print" ||
                pathname === "/register-user" ? (
                // Render the print page directly without the Dashboard
                children // Assuming the print page is passed as children
              ) : (
                <AuthWrapper>
                  <Dashboard>{children}</Dashboard>
                </AuthWrapper>
              )}
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
