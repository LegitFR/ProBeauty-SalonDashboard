"use client";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  Search,
  MapPin,
  Star,
  Clock,
  DollarSign,
  Filter,
  Heart,
  Calendar,
  ArrowLeft,
  Scissors,
  Sparkles,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Toaster } from "../../components/ui/sonner";

export default function MarketplacePage() {
  const router = useRouter();

  // Initialize theme for marketplace visitors
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

  const onBack = () => router.push("/");
  const onBookService = (salon: any, service: any) => {
    console.log("Booking:", salon.name, service.name);
    // In real app, would handle booking flow
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Services", icon: Sparkles },
    { id: "hair", label: "Hair", icon: Scissors },
    { id: "nails", label: "Nails", icon: Sparkles },
    { id: "facial", label: "Facial", icon: Users },
    { id: "massage", label: "Massage", icon: Users },
  ];

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
      specialties: ["Hair", "Color", "Styling"],
      nextAvailable: "Today 2:00 PM",
      services: [
        {
          id: 1,
          name: "Haircut & Blow Dry",
          price: 65,
          duration: "1h",
          category: "hair",
        },
        {
          id: 2,
          name: "Hair Color & Highlights",
          price: 120,
          duration: "2.5h",
          category: "hair",
        },
        {
          id: 3,
          name: "Deep Conditioning Treatment",
          price: 45,
          duration: "45m",
          category: "hair",
        },
      ],
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
      specialties: ["Nails", "Facial", "Lashes"],
      nextAvailable: "Tomorrow 10:00 AM",
      services: [
        {
          id: 4,
          name: "Classic Manicure",
          price: 35,
          duration: "45m",
          category: "nails",
        },
        {
          id: 5,
          name: "Gel Manicure & Pedicure",
          price: 75,
          duration: "1.5h",
          category: "nails",
        },
        {
          id: 6,
          name: "Hydrating Facial",
          price: 85,
          duration: "1h",
          category: "facial",
        },
      ],
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
      specialties: ["Massage", "Facial", "Body Treatment"],
      nextAvailable: "Today 4:30 PM",
      services: [
        {
          id: 7,
          name: "Deep Tissue Massage",
          price: 95,
          duration: "1h",
          category: "massage",
        },
        {
          id: 8,
          name: "Anti-Aging Facial",
          price: 110,
          duration: "1.5h",
          category: "facial",
        },
        {
          id: 9,
          name: "Hot Stone Massage",
          price: 120,
          duration: "1.5h",
          category: "massage",
        },
      ],
    },
  ];

  const filteredSalons = salons.filter((salon) => {
    const matchesSearch =
      salon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salon.specialties.some((s) =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" ||
      salon.services.some((service) => service.category === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-heading text-xl font-bold">
                  ProBeauty
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline">Sign In</Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                List Your Business
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold mb-4">
            Find the perfect beauty salon near you
          </h1>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search for salons, services, or treatments..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <Input placeholder="Location" className="w-48" />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  className={`flex-shrink-0 ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSalons.map((salon) => (
            <Card
              key={salon.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="relative">
                <img
                  src={salon.image}
                  alt={salon.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>

              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading text-lg font-semibold">
                    {salon.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">{salon.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({salon.reviews})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <MapPin className="w-3 h-3" />
                  {salon.address} • {salon.distance}
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {salon.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                  <Clock className="w-3 h-3" />
                  Next available: {salon.nextAvailable}
                </div>

                {/* Popular Services */}
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium">Popular Services:</p>
                  {salon.services.slice(0, 2).map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>{service.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {service.duration}
                        </span>
                        <span className="font-medium">${service.price}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => onBookService(salon, salon.services[0])}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No results */}
        {filteredSalons.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No salons found matching your criteria. Try adjusting your search
              or filters.
            </p>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}
