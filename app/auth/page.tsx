"use client";
import { useState, useEffect } from "react";
import { LoginPage } from "./LoginPage";
import { SignupPage } from "./SignupPage";
import { CreateSalonPage } from "./CreateSalonPage";
import { useRouter } from "next/navigation";
import { Toaster } from "../../components/ui/sonner";

export default function AuthPage() {
  const router = useRouter();
  const [view, setView] = useState<"login" | "signup" | "create-salon">(
    "login"
  );

  // Initialize theme for users on auth page
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme");
      if (!savedTheme) {
        // First-time visitor: detect system preference
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        localStorage.setItem("theme", prefersDark ? "dark" : "light");
        if (prefersDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    } catch (error) {
      console.error("Failed to initialize theme:", error);
    }
  }, []);

  const handleLogin = async (user: any, tokens: any) => {
    // Store tokens in localStorage
    if (tokens?.accessToken) {
      localStorage.setItem("accessToken", tokens.accessToken);
      // Also store in cookie for middleware
      document.cookie = `accessToken=${tokens.accessToken}; path=/; max-age=${
        3 * 60 * 60
      }`; // 3 hours
    }
    if (tokens?.refreshToken) {
      localStorage.setItem("refreshToken", tokens.refreshToken);
      document.cookie = `refreshToken=${tokens.refreshToken}; path=/; max-age=${
        15 * 24 * 60 * 60
      }`; // 15 days
    }

    // Store user data
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }

    // Check if user has a salon
    try {
      const response = await fetch("/api/salons/my-salons", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        // If user has no salons, prompt to create one
        if (!data.data || data.data.length === 0) {
          setView("create-salon");
          return;
        }

        // Store first salon as active salon
        if (data.data.length > 0) {
          localStorage.setItem("salon", JSON.stringify(data.data[0]));
        }
      }
    } catch (error) {
      console.error("Failed to check salons:", error);
    }

    // Redirect to dashboard
    router.push("/home");
  };

  const handleSignupSuccess = async (user: any, tokens: any) => {
    // Store tokens and user data (already done in SignupPage, but ensure it's set)
    if (tokens?.accessToken) {
      localStorage.setItem("accessToken", tokens.accessToken);
    }
    if (tokens?.refreshToken) {
      localStorage.setItem("refreshToken", tokens.refreshToken);
    }
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }

    // Always prompt to create salon after signup
    setView("create-salon");
  };

  return (
    <div>
      {view === "login" ? (
        <LoginPage
          onBack={() => router.push("/")}
          onLogin={handleLogin}
          onSignup={() => setView("signup")}
        />
      ) : view === "signup" ? (
        <SignupPage
          onBack={() => setView("login")}
          onSignupSuccess={handleSignupSuccess}
        />
      ) : (
        <CreateSalonPage onSalonCreated={() => router.push("/home")} />
      )}
      <Toaster />
    </div>
  );
}
