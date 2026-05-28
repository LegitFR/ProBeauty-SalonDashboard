"use client";
import { useEffect } from "react";
import { LandingPage } from "../components/landing/LandingPage";
import { useRouter } from "next/navigation";
import { Toaster } from "../components/ui/sonner";

export default function RootPage() {
  const router = useRouter();

  const navigateWithTranslate = (path: string) => {
    try {
      const lang = localStorage.getItem("pb_lang");
      if (lang && lang !== "en") {
        window.location.href = path;
        return;
      }
    } catch (error) {
      console.error("Failed to read language preference:", error);
    }
    router.push(path);
  };

  // Force light mode on landing page
  useEffect(() => {
    // Remove dark mode class to force light theme on landing page
    document.documentElement.classList.remove("dark");

    // Store the original theme preference (if it exists)
    const savedTheme = localStorage.getItem("theme");

    // Initialize theme for first-time visitors only
    if (!savedTheme) {
      try {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        localStorage.setItem("theme", prefersDark ? "dark" : "light");
      } catch (error) {
        console.error("Failed to initialize theme:", error);
      }
    }

    // Cleanup: restore theme when leaving landing page
    return () => {
      const theme = localStorage.getItem("theme");
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      }
    };
  }, []);

  return (
    <div>
      <LandingPage
        onGetStarted={() => navigateWithTranslate("/auth")}
        onLogin={() => navigateWithTranslate("/auth")}
        onCustomerSite={() => navigateWithTranslate("/marketplace")}
      />
      <Toaster />
    </div>
  );
}
