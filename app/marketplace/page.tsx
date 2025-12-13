"use client";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search, MapPin, Star, Calendar, Menu, Sun, Moon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Toaster } from "../../components/ui/sonner";

export default function MarketplacePage() {
  const router = useRouter();

  // Initialize theme for marketplace visitors
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme") as
        | "light"
        | "dark"
        | null;
      const initialTheme = savedTheme || "dark"; // Default to dark
      setTheme(initialTheme);
      if (initialTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (error) {
      console.error("Failed to initialize theme:", error);
    }
  }, []);

  const onBack = () => router.push("/");
  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const salons = [
    {
      id: 1,
      name: "Luxe Beauty Salon",
      rating: 4.9,
      reviews: 340,
      distance: "0.5 km",
      image:
        "https://images.unsplash.com/photo-1611211235015-e2e3a7d09e97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBzYWxvbiUyMGludGVyaW9yJTIwbW9kZXJufGVufDF8fHx8MTc1ODEwMzg0MHww&ixlib=rb-4.1.0&q=80&w=400",
      address: "123 Beauty Street, Downtown",
    },
    {
      id: 2,
      name: "Glamour Studio",
      rating: 4.8,
      reviews: 189,
      distance: "1.2 km",
      image:
        "https://images.unsplash.com/photo-1647462741268-e5724e5886c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwc2Fsb24lMjBzZXJ2aWNlc3xlbnwxfHx8fDE3NTgxMTg2MTV8MA&ixlib=rb-4.1.0&q=80&w=400",
      address: "456 Style Avenue, Midtown",
    },
    {
      id: 3,
      name: "Zen Spa & Wellness",
      rating: 4.7,
      reviews: 256,
      distance: "2.1 km",
      image:
        "https://images.unsplash.com/photo-1611211235015-e2e3a7d09e97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBzYWxvbiUyMGludGVyaW9yJTIwbW9kZXJufGVufDF8fHx8MTc1ODEwMzg0MHww&ixlib=rb-4.1.0&q=80&w=400",
      address: "789 Wellness Way, Uptown",
    },
    {
      id: 4,
      name: "Modern Hair Studio",
      rating: 4.9,
      reviews: 412,
      distance: "0.8 km",
      image:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxoYWlyJTIwc2Fsb258ZW58MXx8fHwxNzU4MTE4NjE1fDA&ixlib=rb-4.1.0&q=80&w=400",
      address: "321 Fashion Blvd, City Center",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={onBack}>
              <span className="font-heading text-2xl font-bold bg-linear-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                ProBeauty
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="hover:bg-accent"
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                className="text-foreground hover:text-primary font-medium"
                onClick={onBack}
              >
                Log In
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                List your business
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-accent">
                <Menu className="w-5 h-5" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="hover:bg-accent"
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-accent">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="marketplace-hero">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Book local selfcare services
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-10 max-w-3xl mx-auto">
            Discover top-rated salons, barbers, medspas, wellness studios and
            beauty experts trusted by millions worldwide
          </p>

          {/* Search Bar */}
          <div className="search-bar-container max-w-4xl mx-auto mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
              <Input
                placeholder="All treatments and venues"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="marketplace-input pl-14 pr-4 border-0 focus-visible:ring-0 h-14 text-base bg-card w-full"
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
              <Input
                placeholder="Current location"
                className="marketplace-input pl-14 pr-4 border-0 focus-visible:ring-0 h-14 text-base bg-card w-full"
              />
            </div>
            <div className="flex-1 relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
              <Input
                placeholder="Any time"
                className="marketplace-input pl-14 pr-4 border-0 focus-visible:ring-0 h-14 text-base bg-card w-full"
              />
            </div>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 h-14 text-base font-semibold rounded-full"
              size="lg"
            >
              Search
            </Button>
          </div>

          {/* Stats */}
          <p className="text-foreground text-base sm:text-lg mb-8 font-medium">
            <span className="font-bold text-primary">5,84,463</span>{" "}
            appointments booked today
          </p>

          {/* Get the app button */}
          <Button
            variant="outline"
            className="border-border hover:bg-accent px-6 py-3 rounded-lg font-medium"
          >
            Get the app
          </Button>
        </div>
      </section>

      {/* Recommended Section */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
              Recommended
            </h2>
          </div>

          {/* Salon Cards */}
          <div className="salon-cards-grid">
            {salons.map((salon) => (
              <div key={salon.id} className="salon-card">
                <div className="relative">
                  <img
                    src={salon.image}
                    alt={salon.name}
                    className="salon-card-image"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-xl text-foreground mb-2">
                    {salon.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="text-sm font-semibold text-foreground ml-1">
                        {salon.rating}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({salon.reviews})
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {salon.address}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Toaster />
    </div>
  );
}
