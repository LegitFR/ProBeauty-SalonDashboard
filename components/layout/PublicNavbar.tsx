"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Menu,
  X,
  Globe,
  Sparkles,
  LayoutDashboard,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface PublicNavbarProps {
  onGetStarted?: () => void;
  onLogin?: () => void;
  onMarketplace?: () => void;
  forceLightTheme?: boolean;
}

export function PublicNavbar({
  onGetStarted,
  onLogin,
  onMarketplace,
  forceLightTheme = false,
}: PublicNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const accessToken = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");
    const hasCookie = document.cookie.includes("accessToken=");
    setIsAuthenticated(!!(accessToken && user && hasCookie));

    // Check for dark mode (only if not forced to light theme)
    if (!forceLightTheme) {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      const darkMode = savedTheme === "dark" || (!savedTheme && prefersDark);
      setIsDarkMode(darkMode);
    } else {
      setIsDarkMode(false);
    }
  }, [forceLightTheme]);

  const handleDashboardClick = () => {
    router.push("/home");
  };

  const handleMarketplace = () => {
    if (onMarketplace) {
      onMarketplace();
    } else {
      router.push("/marketplace");
    }
  };

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else {
      router.push("/auth");
    }
  };

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      router.push("/auth");
    }
  };

  const handleHome = () => {
    router.push("/");
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 backdrop-blur-lg border-b ${
        isDarkMode
          ? "bg-gray-900/80 border-gray-700"
          : "bg-white/80 border-border"
      }`}
    >
      <div className="safe-container max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
            onClick={handleHome}
          >
            <Image
              src="/probeauty-footer.png"
              alt="ProBeauty"
              width={150}
              height={40}
              className="h-8 sm:h-10 w-auto"
              priority
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <a
              href="/#features"
              className={`transition-colors font-medium ${
                isDarkMode
                  ? "text-gray-300 hover:text-primary"
                  : "text-gray-700 hover:text-primary"
              }`}
            >
              Features
            </a>
            <a
              href="/#pricing"
              className={`transition-colors font-medium ${
                isDarkMode
                  ? "text-gray-300 hover:text-primary"
                  : "text-gray-700 hover:text-primary"
              }`}
            >
              Pricing
            </a>
            <a
              href="/#testimonials"
              className={`transition-colors font-medium ${
                isDarkMode
                  ? "text-gray-300 hover:text-primary"
                  : "text-gray-700 hover:text-primary"
              }`}
            >
              Success Stories
            </a>
            <Link href="https://pro-beauty-web.vercel.app/">
              <button
                // onClick={handleMarketplace}
                className={`flex items-center transition-colors font-medium ${
                  isDarkMode
                    ? "text-gray-300 hover:text-primary"
                    : "text-gray-700 hover:text-primary"
                }`}
              >
                <Globe className="w-4 h-4 mr-2" />
                Find Salons
              </button>
            </Link>
          </div>

          {/* Right Side Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <Button
                className="bg-gradient-to-r from-primary to-orange-600 text-white hover:from-primary/90 hover:to-orange-600/90 shadow-lg px-6 py-3"
                onClick={handleDashboardClick}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={handleLogin}
                  className={`px-6 py-3 ${
                    isDarkMode
                      ? "text-gray-300 hover:text-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  Sign In
                </Button>
                <Button
                  className="bg-gradient-to-r from-primary to-orange-600 text-white hover:from-primary/90 hover:to-orange-600/90 shadow-lg btn-trial-padding text-sm sm:text-base whitespace-nowrap"
                  onClick={handleGetStarted}
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className={`lg:hidden ${isDarkMode ? "text-gray-300" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden border-t py-4 space-y-4 backdrop-blur-lg ${
              isDarkMode
                ? "bg-gray-900/95 border-gray-700"
                : "bg-white/95 border-border"
            }`}
          >
            <a
              href="/#features"
              className={`block py-2 font-medium ${
                isDarkMode
                  ? "text-gray-300 hover:text-primary"
                  : "text-gray-700 hover:text-primary"
              }`}
            >
              Features
            </a>
            <a
              href="/#pricing"
              className={`block py-2 font-medium ${
                isDarkMode
                  ? "text-gray-300 hover:text-primary"
                  : "text-gray-700 hover:text-primary"
              }`}
            >
              Pricing
            </a>
            <a
              href="/#testimonials"
              className={`block py-2 font-medium ${
                isDarkMode
                  ? "text-gray-300 hover:text-primary"
                  : "text-gray-700 hover:text-primary"
              }`}
            >
              Success Stories
            </a>
            <button
              onClick={() => {
                handleMarketplace();
                setMobileMenuOpen(false);
              }}
              className={`flex items-center w-full py-2 font-medium ${
                isDarkMode
                  ? "text-gray-300 hover:text-primary"
                  : "text-gray-700 hover:text-primary"
              }`}
            >
              <Globe className="w-4 h-4 mr-2" />
              Find Salons
            </button>
            {isAuthenticated ? (
              <Button
                className="btn-auto-width bg-gradient-to-r from-primary to-orange-600 text-white"
                onClick={() => {
                  handleDashboardClick();
                  setMobileMenuOpen(false);
                }}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="btn-auto-width justify-start"
                  onClick={() => {
                    handleLogin();
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign In
                </Button>
                <Button
                  className="btn-auto-width bg-gradient-to-r from-primary to-orange-600 text-white btn-trial-padding"
                  onClick={() => {
                    handleGetStarted();
                    setMobileMenuOpen(false);
                  }}
                >
                  Start Free Trial
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
