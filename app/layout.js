"use client";

import React, { useEffect } from "react";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Login from "./login/page";
import Dashboard from "@/components/Dashboard";

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
    return <p>Loading...</p>;
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <div className="main">
            <main className="app">
              {pathname === "/login" ? (
                <Login />
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
