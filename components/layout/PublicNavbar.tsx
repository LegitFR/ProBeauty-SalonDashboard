"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Menu,
  X,
  Globe,
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
  logo?: string;
}

export function PublicNavbar({
  onGetStarted,
  onLogin,
  onMarketplace,
  forceLightTheme = false,
  logo,
}: PublicNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Check if user is authenticated
    const accessToken = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");
    const hasCookie = document.cookie.includes("accessToken=");
    setIsAuthenticated(!!(accessToken && user && hasCookie));

    const storedLanguage = localStorage.getItem("pb_lang");
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage);
    }

    const handleLanguageChange = () => {
      const nextLanguage = localStorage.getItem("pb_lang");
      if (nextLanguage) {
        setSelectedLanguage(nextLanguage);
      }
    };

    window.addEventListener("pb_lang_change", handleLanguageChange);

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

    return () => {
      window.removeEventListener("pb_lang_change", handleLanguageChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [forceLightTheme]);

  const handleDashboardClick = () => {
    navigateWithTranslate("/home");
  };

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else {
      navigateWithTranslate("/auth");
    }
  };

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      navigateWithTranslate("/auth");
    }
  };

  const handleHome = () => {
    navigateWithTranslate("/");
  };

  const languageOptions = [
    { value: "en", label: "EN" },
    { value: "fr", label: "FR" },
    { value: "de", label: "DE" },
    { value: "es", label: "ES" },
    { value: "pt", label: "PT" },
  ];

  const handleLanguageSelect = (nextLanguage: string) => {
    setSelectedLanguage(nextLanguage);
    window.localStorage.setItem("pb_lang", nextLanguage);
    const translateWindow = window as Window & {
      setGoogleTranslateLanguage?: (lang: string) => void;
    };
    translateWindow.setGoogleTranslateLanguage?.(nextLanguage);
    window.dispatchEvent(new CustomEvent("pb_lang_change"));
  };

  return (
    <nav className={`fixed w-full z-50 flex justify-center px-0 sm:px-4 lg:px-8 pointer-events-none transition-all duration-500 ${scrolled ? "top-2 sm:top-6" : "top-0 sm:top-4"}`}>
      <div 
        className={`pointer-events-auto w-full max-w-7xl backdrop-blur-2xl border-b sm:border transition-all duration-500 ${
          mobileMenuOpen ? "sm:rounded-3xl" : "sm:rounded-full"
        } ${
          scrolled || mobileMenuOpen
            ? isDarkMode 
              ? "bg-gray-900/90 border-gray-700/50 shadow-2xl shadow-black/20 py-2 px-4 sm:px-6" 
              : "bg-[#ECE3DC]/90 border-black/5 shadow-2xl shadow-primary/5 py-2 px-4 sm:px-6"
            : isDarkMode
              ? "bg-transparent border-transparent py-4 px-4 sm:px-6"
              : "bg-transparent border-transparent py-4 px-4 sm:px-6"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer shrink-0"
            onClick={handleHome}
          >
            <Image
              src={logo || "/probeauty-header-black.svg"}
              alt="ProBeauty"
              width={150}
              height={40}
              className="h-8 sm:h-10 w-auto transition-transform hover:scale-105"
              priority
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center justify-center gap-1 xl:gap-2">
            {[
              { label: 'Features', href: '/#features' },
              { label: 'Pricing', href: '/#pricing' },
              { label: 'Success Stories', href: '/#testimonials' }
            ].map(item => (
              <a
                key={item.label}
                href={item.href}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  isDarkMode
                    ? "text-gray-300 hover:text-white hover:bg-white/10"
                    : "text-gray-600 hover:text-gray-900 hover:bg-black/5"
                }`}
              >
                {item.label}
              </a>
            ))}
            <Link href="https://probeautyapp.com">
              <button
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  isDarkMode
                    ? "text-gray-300 hover:text-white hover:bg-white/10"
                    : "text-gray-600 hover:text-gray-900 hover:bg-black/5"
                }`}
              >
                <Globe className="w-4 h-4 mr-2" />
                Find Salons
              </button>
            </Link>
          </div>

          {/* Right Side Navigation */}
          <div className="hidden xl:flex items-center gap-2 xl:gap-3 shrink-0">
            <div className={`flex items-center rounded-full px-1 ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`}>
              <Globe className={`w-3.5 h-3.5 ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <select
                value={selectedLanguage}
                onChange={(event) => handleLanguageSelect(event.target.value)}
                aria-label="Translate page"
                className={`notranslate appearance-none bg-transparent border-0 pl-1.5 pr-6 py-2 text-xs font-semibold focus:outline-none focus:ring-0 cursor-pointer ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-[#ECE3DC] text-black dark:bg-gray-800 dark:text-white">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {isAuthenticated ? (
              <Button
                className="rounded-full bg-gradient-to-r from-primary to-orange-600 text-white hover:from-primary/90 hover:to-orange-600/90 shadow-lg px-6"
                onClick={handleDashboardClick}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={handleLogin}
                  className={`rounded-full px-5 font-medium whitespace-nowrap transition-all duration-300 ${
                    isDarkMode
                      ? "text-gray-300 hover:text-white hover:bg-white/10"
                      : "text-gray-700 hover:text-gray-900 hover:bg-black/5"
                  }`}
                >
                  Sign In
                </Button>
                <Button
                  className="rounded-full bg-gradient-to-r from-primary to-orange-600 text-white hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:scale-105 transition-all duration-300 px-6 whitespace-nowrap font-semibold border-0"
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
            className={`xl:hidden rounded-full shrink-0 ${isDarkMode ? "text-gray-300 hover:bg-white/10" : "hover:bg-black/5"}`}
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
          <div className="xl:hidden border-t mt-4 pt-4 space-y-2">
             <div className={`flex items-center rounded-xl p-3 ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>
              <Globe className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <select
                value={selectedLanguage}
                onChange={(event) => handleLanguageSelect(event.target.value)}
                aria-label="Translate page"
                className="notranslate w-full bg-transparent border-0 text-sm font-semibold focus:outline-none"
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {[{label: 'Features', href: '/#features'}, {label: 'Pricing', href: '/#pricing'}, {label: 'Success Stories', href: '/#testimonials'}].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`block px-4 py-3 rounded-xl font-medium ${
                  isDarkMode
                    ? "text-gray-300 hover:bg-white/10"
                    : "text-gray-700 hover:bg-black/5"
                }`}
              >
                {item.label}
              </a>
            ))}
            
            <Link href="https://probeautyapp.com">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center w-full px-4 py-3 rounded-xl font-medium ${
                  isDarkMode
                    ? "text-gray-300 hover:bg-white/10"
                    : "text-gray-700 hover:bg-black/5"
                }`}
              >
                <Globe className="w-4 h-4 mr-2" />
                Find Salons
              </button>
            </Link>

            <div className="grid grid-cols-1 gap-2 pt-2">
              {isAuthenticated ? (
                <Button
                  className="w-full rounded-xl bg-gradient-to-r from-primary to-orange-600 text-white py-6"
                  onClick={() => {
                    handleDashboardClick();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl py-6 border-2"
                    onClick={() => {
                      handleLogin();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="w-full rounded-xl bg-gradient-to-r from-primary to-orange-600 text-white py-6 shadow-lg shadow-orange-500/25"
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
          </div>
        )}
      </div>
    </nav>
  );
}
