"use client";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Search,
  MapPin,
  Star,
  Calendar,
  Menu,
  Sun,
  Moon,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Toaster } from "../../components/ui/sonner";
import { useToast } from "../../components/ui/use-toast";

interface Salon {
  _id: string;
  name: string;
  address:
    | {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
      }
    | string;
  phone: string;
  verified: boolean;
  geo?: {
    type: string;
    coordinates: [number, number];
  };
  openingHours?: Array<{
    day: string;
    open: string;
    close: string;
  }>;
  hours?: Array<{
    day: string;
    open?: string;
    close?: string;
    openTime?: string;
    closeTime?: string;
  }>;
  staff?: any[];
  services?: any[];
  products?: any[];
  createdAt?: string;
}

interface SalonResponse {
  message: string;
  data: Salon[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function MarketplacePage() {
  const router = useRouter();
  const { toast } = useToast();

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
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState<
    "" | "morning" | "afternoon" | "evening" | "night"
  >("");
  const [venueType, setVenueType] = useState<
    "" | "male" | "female" | "everyone"
  >("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState<
    "" | "top_rated" | "recommended" | "nearest"
  >("recommended");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

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

  // Fetch salons from API
  useEffect(() => {
    const fetchSalons = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          page: page.toString(),
          limit: "12",
        });

        // Add search filters if they exist
        if (searchTerm) params.append("service", searchTerm);
        if (location) params.append("location", location);
        if (date) params.append("date", date);
        if (time) params.append("time", time);
        if (venueType) params.append("venueType", venueType);
        if (maxPrice) params.append("maxPrice", maxPrice);
        if (sortBy) params.append("sortBy", sortBy);

        const response = await fetch(`/api/salons/search?${params}`);

        if (!response.ok) {
          throw new Error("Failed to fetch salons");
        }

        const data: SalonResponse = await response.json();
        setSalons(data.data);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load salons";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSalons();
  }, [
    page,
    searchTerm,
    location,
    date,
    time,
    venueType,
    maxPrice,
    sortBy,
    toast,
  ]);

  // Handle search button click
  const handleSearch = () => {
    setPage(1); // Reset to first page when searching
  };

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
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent"
                onClick={(e) => {
                  e.preventDefault();
                  console.log(
                    "Desktop menu clicked, current state:",
                    mobileMenuOpen
                  );
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
              >
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
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent"
                onClick={(e) => {
                  e.preventDefault();
                  console.log(
                    "Mobile menu clicked, current state:",
                    mobileMenuOpen
                  );
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="bg-card border-b border-border shadow-lg relative z-40">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
            <Button
              variant="ghost"
              className="w-full text-left justify-start text-foreground hover:text-primary font-medium"
              onClick={() => {
                onBack();
                setMobileMenuOpen(false);
              }}
            >
              Log In
            </Button>
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              onClick={() => {
                setMobileMenuOpen(false);
              }}
            >
              List your business
            </Button>
          </div>
        </div>
      )}

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
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="marketplace-input pl-14 pr-4 border-0 focus-visible:ring-0 h-14 text-base bg-card w-full"
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
              <Input
                placeholder="Current location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="marketplace-input pl-14 pr-4 border-0 focus-visible:ring-0 h-14 text-base bg-card w-full"
              />
            </div>
            <div className="flex-1 relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
              <Input
                type="date"
                placeholder="Any time"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="marketplace-input pl-14 pr-4 border-0 focus-visible:ring-0 h-14 text-base bg-card w-full"
              />
            </div>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 h-14 text-base font-semibold rounded-full"
              size="lg"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>

          {/* Advanced Filters */}
          <div className="max-w-4xl mx-auto mb-8">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="mb-4"
            >
              {showFilters ? "Hide" : "Show"} Filters
            </Button>

            {showFilters && (
              <div className="bg-card p-6 rounded-lg shadow-md space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Venue Type */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Venue Type
                    </label>
                    <select
                      value={venueType}
                      onChange={(e) =>
                        setVenueType(
                          e.target.value as "" | "male" | "female" | "everyone"
                        )
                      }
                      className="w-full h-10 px-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">All</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="everyone">Everyone</option>
                    </select>
                  </div>

                  {/* Time of Day */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Time of Day
                    </label>
                    <select
                      value={time}
                      onChange={(e) =>
                        setTime(
                          e.target.value as
                            | ""
                            | "morning"
                            | "afternoon"
                            | "evening"
                            | "night"
                        )
                      }
                      className="w-full h-10 px-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Any Time</option>
                      <option value="morning">Morning (5:00-12:00)</option>
                      <option value="afternoon">Afternoon (12:00-17:00)</option>
                      <option value="evening">Evening (17:00-21:00)</option>
                      <option value="night">Night (21:00-24:00)</option>
                    </select>
                  </div>

                  {/* Max Price */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Max Price (₹)
                    </label>
                    <Input
                      type="number"
                      placeholder="e.g. 1500"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="h-10"
                    />
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) =>
                        setSortBy(
                          e.target.value as
                            | ""
                            | "top_rated"
                            | "recommended"
                            | "nearest"
                        )
                      }
                      className="w-full h-10 px-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="recommended">Recommended</option>
                      <option value="top_rated">Top Rated</option>
                      <option value="nearest">Nearest</option>
                    </select>
                  </div>
                </div>

                {/* Clear Filters Button */}
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSearchTerm("");
                      setLocation("");
                      setDate("");
                      setTime("");
                      setVenueType("");
                      setMaxPrice("");
                      setSortBy("recommended");
                      setPage(1);
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            )}
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
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">
                Loading salons...
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => setPage(1)} variant="outline">
                Retry
              </Button>
            </div>
          ) : salons.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No salons found</p>
            </div>
          ) : (
            <div className="salon-cards-grid">
              {salons.map((salon, index) => {
                const salonId = (salon as any).id || salon._id;
                return (
                  <div
                    key={salonId || `salon-${index}`}
                    className="salon-card"
                    onClick={() => {
                      if (salonId) {
                        router.push(`/marketplace/${salonId}`);
                      } else {
                        console.error("Salon ID is missing:", salon);
                      }
                    }}
                  >
                    <div className="relative">
                      <img
                        src={`https://images.unsplash.com/photo-1611211235015-e2e3a7d09e97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400`}
                        alt={salon.name}
                        className="salon-card-image"
                      />
                      {salon.verified && (
                        <div className="absolute top-3 right-3 bg-primary/90 text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Verified
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-xl text-foreground mb-2">
                        {salon.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="text-sm text-muted-foreground ml-1">
                            {typeof salon.address === "string"
                              ? salon.address
                              : `${salon.address?.city || "N/A"}, ${
                                  salon.address?.state || "N/A"
                                }`}
                          </span>
                        </div>
                      </div>
                      {typeof salon.address !== "string" &&
                        salon.address?.street && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {salon.address.street}
                          </p>
                        )}
                      {(salon.services?.length || salon.staff?.length) && (
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {salon.services?.length && (
                            <span>{salon.services.length} services</span>
                          )}
                          {salon.staff?.length && (
                            <span>{salon.staff.length} staff</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </section>

      <Toaster />
    </div>
  );
}
