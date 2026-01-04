"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Phone,
  Clock,
  Star,
  ChevronLeft,
  Calendar,
  Users,
  Scissors,
  Package,
  CheckCircle2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/sonner";

interface Salon {
  _id: string;
  name: string;
  image?: string;
  images?: string[];
  photo?: string;
  picture?: string;
  thumbnail?: string;
  logo?: string;
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
    open?: string;
    close?: string;
    openTime?: string;
    closeTime?: string;
  }>;
  hours?: Array<{
    day: string;
    open?: string;
    close?: string;
    openTime?: string;
    closeTime?: string;
  }>;
  staff?: Array<{
    _id?: string;
    name?: string;
    specialization?: string;
    phone?: string;
    availability?: Array<{
      day: string;
      startTime?: string;
      endTime?: string;
    }>;
  }>;
  services?: Array<{
    _id?: string;
    title?: string;
    category?: string;
    durationMinutes?: number;
    price?: number;
    description?: string;
  }>;
  products?: Array<{
    _id?: string;
    name?: string;
    productName?: string;
    title?: string;
    brand?: string;
    sku?: string;
    price?: number;
    stock?: number;
    quantity?: number;
  }>;
  createdAt?: string;
}

export default function SalonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [salonId, setSalonId] = useState<string | null>(null);

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setSalonId(resolvedParams.id);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    const fetchSalonDetails = async () => {
      if (!salonId) return;

      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/salons/${salonId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch salon details");
        }

        const data = await response.json();
        console.log("Salon API Response:", data);
        console.log("Salon data:", data.data);
        console.log("Products:", data.data?.products);
        console.log(
          "Opening Hours:",
          data.data?.openingHours,
          data.data?.hours
        );
        console.log("Staff:", data.data?.staff);
        setSalon(data.data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load salon details";
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

    fetchSalonDetails();
  }, [salonId, toast]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
          <p className="text-muted-foreground">Loading salon details...</p>
        </div>
      </div>
    );
  }

  if (error || !salon) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <X className="w-16 h-16 text-destructive mx-auto mb-4" />
          <p className="text-destructive mb-4">{error || "Salon not found"}</p>
          <Button onClick={() => router.push("/marketplace")} variant="outline">
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Button
              variant="ghost"
              onClick={() => router.push("/marketplace")}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Marketplace
            </Button>
            <span className="font-heading text-2xl font-bold bg-linear-to-r from-primary to-orange-600 bg-clip-text text-transparent">
              ProBeauty
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-orange-600/20">
          <img
            src={
              salon.image ||
              salon.photo ||
              salon.picture ||
              salon.thumbnail ||
              salon.logo ||
              (salon.images &&
                Array.isArray(salon.images) &&
                salon.images[0]) ||
              "https://images.unsplash.com/photo-1611211235015-e2e3a7d09e97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200"
            }
            alt={salon.name}
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
                {salon.name}
              </h1>
              {salon.verified && (
                <div className="flex items-center gap-1 bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-full text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  Verified
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Services Section */}
            <section className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Scissors className="w-6 h-6 text-primary" />
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  Services
                </h2>
                {salon.services && salon.services.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    ({salon.services.length})
                  </span>
                )}
              </div>
              {salon.services && salon.services.length > 0 ? (
                <div className="space-y-3">
                  {salon.services.map((service, index) => (
                    <div
                      key={`service-${index}`}
                      className="flex items-start justify-between p-4 rounded-lg bg-background hover:bg-accent/50 transition-colors border border-border/50"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {service.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDuration(service.durationMinutes || 0)}
                          </span>
                          <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                            {service.category}
                          </span>
                        </div>
                        {service.description && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {service.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-lg text-primary">
                          {formatPrice(
                            typeof service.price === "string"
                              ? parseFloat(service.price)
                              : service.price || 0
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Scissors className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground text-lg">
                    No services available at this time
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-2">
                    Please check back later or contact the salon directly
                  </p>
                </div>
              )}
            </section>

            {/* Staff Section */}
            <section className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-6 h-6 text-primary" />
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  Our Team
                </h2>
                {salon.staff && salon.staff.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    ({salon.staff.length})
                  </span>
                )}
              </div>
              {salon.staff && salon.staff.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {salon.staff.map((member, index) => (
                    <div
                      key={`staff-${index}`}
                      className="flex items-center gap-4 p-4 rounded-lg bg-background border border-border/50 hover:border-primary/50 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-orange-600 flex items-center justify-center text-primary-foreground font-bold text-lg">
                        {member.name?.charAt(0) ||
                          member.specialization?.charAt(0) ||
                          "S"}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {member.name || `Staff Member ${index + 1}`}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {member.specialization || "Specialist"}
                        </p>{" "}
                        {member.availability &&
                          typeof member.availability === "object" && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              <p className="font-medium mb-1">Available:</p>
                              {Object.entries(member.availability)
                                .slice(0, 3)
                                .map(([day, times], idx) => {
                                  let timeDisplay = "";

                                  if (Array.isArray(times)) {
                                    // Simple array of time strings: ["08:00-16:00"]
                                    timeDisplay = times.join(", ");
                                  } else if (
                                    typeof times === "object" &&
                                    times !== null
                                  ) {
                                    // Object structure
                                    const timesObj = times as any;

                                    // Check for isAvailable flag first
                                    if (
                                      timesObj.isAvailable === false ||
                                      timesObj.closed === true
                                    ) {
                                      timeDisplay = "Not Available";
                                    } else if (timesObj.isAvailable === true) {
                                      // Has isAvailable: true, check for slots
                                      if (
                                        timesObj.slots &&
                                        Array.isArray(timesObj.slots) &&
                                        timesObj.slots.length > 0
                                      ) {
                                        // Format slots array into readable times
                                        timeDisplay = timesObj.slots
                                          .map((slot: any) => {
                                            if (typeof slot === "string") {
                                              return slot;
                                            } else if (
                                              slot &&
                                              typeof slot === "object" &&
                                              "start" in slot &&
                                              "end" in slot
                                            ) {
                                              return `${slot.start}-${slot.end}`;
                                            }
                                            return String(slot);
                                          })
                                          .join(", ");
                                      } else {
                                        timeDisplay = "Available";
                                      }
                                    } else if (
                                      timesObj.slots &&
                                      Array.isArray(timesObj.slots) &&
                                      timesObj.slots.length > 0
                                    ) {
                                      // Has slots array without explicit isAvailable
                                      timeDisplay = timesObj.slots.join(", ");
                                    } else if (
                                      timesObj.open &&
                                      timesObj.close
                                    ) {
                                      // Has open/close times
                                      timeDisplay = `${timesObj.open} - ${timesObj.close}`;
                                    } else {
                                      // Unknown object structure - extract time-like values
                                      const values = Object.values(timesObj)
                                        .filter(
                                          (v) =>
                                            typeof v === "string" ||
                                            Array.isArray(v)
                                        )
                                        .map((v) =>
                                          Array.isArray(v)
                                            ? v.join(", ")
                                            : String(v)
                                        )
                                        .join(", ");
                                      timeDisplay = values || "Available";
                                    }
                                  } else if (typeof times === "string") {
                                    timeDisplay = times;
                                  } else {
                                    timeDisplay = "N/A";
                                  }

                                  return (
                                    <p key={idx} className="capitalize">
                                      {day}: {timeDisplay}
                                    </p>
                                  );
                                })}
                            </div>
                          )}{" "}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground text-lg">
                    No team members listed at this time
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-2">
                    Contact the salon for staff availability
                  </p>
                </div>
              )}
            </section>

            {/* Products Section */}
            <section className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Package className="w-6 h-6 text-primary" />
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  Products
                </h2>
                {salon.products && salon.products.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    ({salon.products.length})
                  </span>
                )}
              </div>
              {salon.products && salon.products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {salon.products.map((product, index) => {
                    console.log(`Product ${index}:`, product);
                    return (
                      <div
                        key={`product-${index}`}
                        className="p-4 rounded-lg bg-background border border-border/50 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">
                              {product.title ||
                                product.name ||
                                product.productName ||
                                "Product"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {product.brand || product.sku || "N/A"}
                            </p>
                          </div>
                          <p className="font-bold text-primary">
                            {formatPrice(
                              typeof product.price === "string"
                                ? parseFloat(product.price)
                                : product.price || 0
                            )}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span
                            className={`${
                              (product.stock || product.quantity || 0) > 0
                                ? "text-green-600 dark:text-green-400"
                                : "text-destructive"
                            }`}
                          >
                            {(product.stock || product.quantity || 0) > 0
                              ? `${product.stock || product.quantity} in stock`
                              : "Out of stock"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground text-lg">
                    No products available at this time
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-2">
                    Check back later for product offerings
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm sticky top-24">
              <h2 className="font-heading text-xl font-bold text-foreground mb-4">
                Contact Information
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Address
                    </p>
                    {typeof salon.address === "string" ? (
                      <p className="text-sm text-muted-foreground">
                        {salon.address}
                      </p>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground">
                          {salon.address?.street || "N/A"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {salon.address?.city || "N/A"},{" "}
                          {salon.address?.state || "N/A"}{" "}
                          {salon.address?.zipCode || ""}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {salon.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Phone
                      </p>
                      <a
                        href={`tel:${salon.phone}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {salon.phone}
                      </a>
                    </div>
                  </div>
                )}

                {salon.geo &&
                  salon.geo.coordinates &&
                  salon.geo.coordinates.length === 2 && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Coordinates
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {salon.geo.coordinates[1].toFixed(6)},{" "}
                          {salon.geo.coordinates[0].toFixed(6)}
                        </p>
                      </div>
                    </div>
                  )}
              </div>

              {/* Opening Hours */}
              {(() => {
                let hoursArray: Array<{
                  day: string;
                  open?: string;
                  close?: string;
                  closed?: boolean;
                }> = [];

                if (
                  salon.hours &&
                  typeof salon.hours === "object" &&
                  !Array.isArray(salon.hours)
                ) {
                  // Convert hours object to array
                  hoursArray = Object.entries(salon.hours).map(
                    ([day, times]: [string, any]) => ({
                      day,
                      ...(times as any),
                    })
                  );
                } else if (salon.openingHours) {
                  hoursArray = salon.openingHours;
                }

                console.log("Hours array:", hoursArray);

                return (
                  hoursArray.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-foreground">
                          Opening Hours
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {hoursArray.map((hours, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-muted-foreground font-medium capitalize">
                              {hours.day}
                            </span>
                            <span className="text-foreground">
                              {hours.closed
                                ? "Closed"
                                : `${hours.open || "N/A"} - ${
                                    hours.close || "N/A"
                                  }`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                );
              })()}

              {/* <Button
                className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                size="lg"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Appointment
              </Button> */}
            </div>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
}
