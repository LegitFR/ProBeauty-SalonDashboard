"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Switch } from "../../../components/ui/switch";
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Camera,
  Loader2,
  Star,
  Tag,
} from "lucide-react";
import { useToast } from "../../../components/ui/use-toast";
import { getAnalytics, formatCurrency } from "../../../lib/analytics";
import { AnalyticsData } from "../../../lib/types/analytics";

interface Service {
  id: string;
  salonId?: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  category?: string;
  isActive?: boolean;
  image?: string;
  bookings?: number;
  revenue?: number;
  rating?: number;
  reviewCount?: number;
  averageRating?: number;
}

interface Review {
  id: string;
  userId: string;
  salonId: string;
  serviceId?: string;
  productId?: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}

interface NewService {
  salonId?: string;
  title?: string;
  durationMinutes?: number;
  price?: number;
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import Image from "next/image";

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [offersFilter, setOffersFilter] = useState("all");
  const [offers, setOffers] = useState<any[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [salon, setSalon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [serviceImages, setServiceImages] = useState<File[]>([]);
  const [salonReviews, setSalonReviews] = useState<Review[]>([]);
  const [salonAverageRating, setSalonAverageRating] = useState<number>(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const { toast } = useToast();

  const totalServices = services.length;
  const activeServices = services.filter((service) => service.isActive).length;
  const avgPrice = totalServices
    ? services.reduce((sum, service) => sum + (service.price || 0), 0) /
      totalServices
    : 0;
  const analyticsServiceRevenue = analytics?.serviceRevenue?.total
    ? parseFloat(analytics.serviceRevenue.total)
    : null;
  const totalRevenue =
    analyticsServiceRevenue && Number.isFinite(analyticsServiceRevenue)
      ? analyticsServiceRevenue
      : services.reduce((sum, service) => sum + (service.revenue || 0), 0);

  // Service form state
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    duration: "",
  });

  useEffect(() => {
    fetchSalon();

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
      }
    }

    const userStr = localStorage.getItem("user");
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
      } catch (e) {
        console.error("Error parsing user:", e);
      }
    }
  }, []);

  const fetchSalon = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please login to continue",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const response = await fetch("/api/salons/my-salons", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch salon");
      }

      const data = await response.json();
      if (data.data && data.data.length > 0) {
        setSalon(data.data[0]); // Use first salon
        // Fetch services and offers after salon is loaded
        fetchServicesForSalon(data.data[0].id);
        fetchOffers(data.data[0].id);
        fetchAnalyticsForSalon(data.data[0].id);
      } else {
        toast({
          title: "No salon found",
          description: "Please create a salon first",
          variant: "destructive",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching salon:", error);
      toast({
        title: "Error",
        description: "Failed to load salon information",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    if (!salon?.id) return;
    await fetchServicesForSalon(salon.id);
  };

  const fetchAnalyticsForSalon = async (salonId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await getAnalytics({ salonId }, token);
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const fetchBookingsForServices = async (
    serviceIds: string[],
    salonId: string,
    currentServices: Service[],
  ) => {
    if (serviceIds.length === 0) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      // Fetch all bookings for the salon
      const response = await fetch(`/api/bookings?salonId=${salonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        console.error("Failed to fetch bookings");
        return;
      }

      const data = await response.json();
      const bookings = data.data || [];

      // Calculate booking count and revenue per service
      const serviceStats = serviceIds.reduce(
        (acc, serviceId) => {
          const serviceBookings = bookings.filter((b: any) => {
            const directId = b.serviceId;
            const nestedId = b.service?.id;
            const listIds = Array.isArray(b.serviceIds) ? b.serviceIds : [];
            const nestedListIds = Array.isArray(b.services)
              ? b.services.map((serviceItem: any) => serviceItem?.id)
              : [];
            return (
              directId === serviceId ||
              nestedId === serviceId ||
              listIds.includes(serviceId) ||
              nestedListIds.includes(serviceId)
            );
          });

          // Count only completed or confirmed bookings
          const completedBookings = serviceBookings.filter((b: any) => {
            const status = String(b.status || "").toLowerCase();
            return [
              "completed",
              "confirmed",
              "paid",
              "success",
              "succeeded",
              "done",
            ].includes(status);
          });

          const bookingCount = completedBookings.length;

          // Find the service to get its price from the passed currentServices
          const service = currentServices.find((s) => s.id === serviceId);
          const servicePrice = service?.price || 0;

          // Calculate revenue: service price × number of bookings
          const revenue = completedBookings.reduce(
            (sum: number, booking: any) => {
              const bookingPrice =
                typeof booking.price === "number"
                  ? booking.price
                  : typeof booking.totalPrice === "number"
                    ? booking.totalPrice
                    : typeof booking.amount === "number"
                      ? booking.amount
                      : typeof booking.totalAmount === "number"
                        ? booking.totalAmount
                        : servicePrice;
              return sum + bookingPrice;
            },
            0,
          );

          acc[serviceId] = { bookings: bookingCount, revenue };
          return acc;
        },
        {} as Record<string, { bookings: number; revenue: number }>,
      );

      // Update services with booking data
      setServices((prevServices) =>
        prevServices.map((service) => ({
          ...service,
          bookings: serviceStats[service.id]?.bookings || 0,
          revenue: serviceStats[service.id]?.revenue || 0,
        })),
      );
    } catch (error) {
      console.error("Error fetching bookings:", error);
      // Don't show error toast as bookings are supplementary data
    }
  };

  const fetchReviewsForSalon = async (salonId: string) => {
    try {
      const response = await fetch(`/api/reviews/salon/${salonId}`);

      if (!response.ok) {
        console.error("Failed to fetch reviews");
        return;
      }

      const data = await response.json();
      const reviews = data.data || [];
      const averageRating = data.averageRating || 0;

      setSalonReviews(reviews);
      setSalonAverageRating(averageRating);

      // Calculate review stats per service
      const serviceReviewStats = reviews.reduce((acc: any, review: Review) => {
        const reviewServiceId = review.serviceId;
        if (reviewServiceId) {
          if (!acc[reviewServiceId]) {
            acc[reviewServiceId] = { total: 0, count: 0, reviews: [] };
          }
          acc[reviewServiceId].total += review.rating;
          acc[reviewServiceId].count += 1;
          acc[reviewServiceId].reviews.push(review);
        }
        return acc;
      }, {});

      // Update services with review data
      setServices((prevServices) =>
        prevServices.map((service) => {
          const stats = serviceReviewStats[service.id];
          if (stats) {
            return {
              ...service,
              averageRating: stats.total / stats.count,
              reviewCount: stats.count,
              rating: stats.total / stats.count,
            };
          }
          return service;
        }),
      );
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const fetchServicesForSalon = async (salonId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`/api/services/salon/${salonId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch services");
      }

      // Transform and filter services by salon ID
      const rawServices = data.data || [];

      const transformedServices = rawServices
        .filter((service: any) => service.salonId === salonId)
        .map((service: any) => {
        const parsedPrice =
          typeof service.price === "string"
            ? parseFloat(service.price)
            : service.price;

        const rawActive =
          service.isActive ?? service.active ?? service.status ?? "active";
        let isActive = true;
        if (typeof rawActive === "boolean") {
          isActive = rawActive;
        } else if (typeof rawActive === "string") {
          const normalized = rawActive.toLowerCase();
          isActive = ["true", "active", "enabled", "available"].includes(
            normalized,
          );
        } else if (typeof rawActive === "number") {
          isActive = rawActive === 1;
        }

        const rawBookings =
          service.bookings ??
          service.bookingCount ??
          service.totalBookings ??
          0;
        const rawRevenue =
          service.revenue ??
          service.totalRevenue ??
          service.totalEarnings ??
          0;
        const rawRating =
          service.rating ?? service.averageRating ?? service.avgRating ?? 0;

        return {
          id: service.id,
          salonId: service.salonId,
          name: service.title || service.name || "",
          description: service.description || "",
          price:
            !isNaN(parsedPrice) && isFinite(parsedPrice) ? parsedPrice : 0,
          duration: service.durationMinutes || service.duration || 0,
          category: service.category || "",
          isActive,
          image: service.image,
          bookings:
            typeof rawBookings === "number"
              ? rawBookings
              : Number(rawBookings) || 0,
          revenue:
            typeof rawRevenue === "number"
              ? rawRevenue
              : Number(rawRevenue) || 0,
          rating:
            typeof rawRating === "number"
              ? rawRating
              : Number(rawRating) || 0,
        };
      });
      setServices(transformedServices);

      // Fetch bookings data for services - pass the current services
      await fetchBookingsForServices(
        transformedServices.map((s: Service) => s.id),
        salonId,
        transformedServices,
      );

      // Fetch reviews for services
      await fetchReviewsForSalon(salonId);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditService = (service: Service) => {
    setIsEditMode(true);
    setEditingServiceId(service.id);
    setServiceForm({
      name: service.name,
      description: service.description || "",
      category: service.category || "",
      price: service.price.toString(),
      duration: service.duration.toString(),
    });
    setShowAddDialog(true);
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please login to delete services",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`/api/services/${serviceId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete service");
      }

      toast({
        title: "Success",
        description: "Service deleted successfully",
      });

      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      });
    }
  };

  const handleUpdateService = async () => {
    if (!editingServiceId) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please login to update services",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      if (!salon?.id) {
        toast({
          title: "Error",
          description: "Salon information not found. Please refresh the page.",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      const duration = parseInt(serviceForm.duration);
      const price = parseFloat(serviceForm.price);

      if (isNaN(duration) || duration <= 0) {
        toast({
          title: "Invalid duration",
          description: "Please enter a valid duration in minutes",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      if (isNaN(price) || price <= 0) {
        toast({
          title: "Invalid price",
          description: "Please enter a valid price",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      const hasImage = serviceImages.length > 0;
      let response;

      if (hasImage) {
        const formData = new FormData();
        formData.append("salonId", salon.id);
        formData.append("title", serviceForm.name);
        formData.append("category", serviceForm.category);
        formData.append("durationMinutes", duration.toString());
        formData.append("price", price.toString());

        if (serviceForm.description) {
          formData.append("description", serviceForm.description);
        }

        formData.append("image", serviceImages[0]);

        response = await fetch(`/api/services/${editingServiceId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      } else {
        const updateData = {
          salonId: salon.id,
          title: serviceForm.name,
          description: serviceForm.description || "",
          category: serviceForm.category,
          durationMinutes: duration,
          price: price,
        };

        response = await fetch(`/api/services/${editingServiceId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update service");
      }

      toast({
        title: "Success!",
        description: "Service updated successfully",
      });

      // Reset form
      setShowAddDialog(false);
      setIsEditMode(false);
      setEditingServiceId(null);
      setCurrentStep(1);
      setServiceForm({
        name: "",
        description: "",
        category: "",
        price: "",
        duration: "",
      });
      setServiceImages([]);

      // Refresh services
      await fetchServices();
    } catch (error) {
      console.error("Error updating service:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update service",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateService = async () => {
    try {
      setSubmitting(true);

      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.error("❌ No token found in any storage key!");
        toast({
          title: "Authentication required",
          description: "Please login again to create services",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      // Use salon state instead of fetching from localStorage or API
      if (!salon?.id) {
        console.error("❌ No salon found in state!");
        toast({
          title: "Error",
          description: "Salon information not found. Please refresh the page.",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      const salonId = salon.id;

      // Prepare request body matching backend API
      const duration = parseInt(serviceForm.duration);
      const price = parseFloat(serviceForm.price);

      if (isNaN(duration) || duration <= 0) {
        toast({
          title: "Invalid duration",
          description: "Please enter a valid duration in minutes",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      if (isNaN(price) || price <= 0) {
        toast({
          title: "Invalid price",
          description: "Please enter a valid price",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      const hasImage = serviceImages.length > 0;
      let response;

      if (hasImage) {
        // Use FormData for multipart/form-data with image
        const formData = new FormData();
        formData.append("salonId", salonId);
        formData.append("title", serviceForm.name);
        formData.append("category", serviceForm.category);
        // Backend automatically converts string to number for these fields
        formData.append("durationMinutes", duration.toString());
        formData.append("price", price.toString());

        if (serviceForm.description) {
          formData.append("description", serviceForm.description);
        }

        formData.append("image", serviceImages[0]);

        response = await fetch("/api/services", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type - browser will set it with boundary
          },
          body: formData,
        });
      } else {
        // Use JSON for request without image
        const requestBody = {
          salonId: salonId,
          title: serviceForm.name,
          description: serviceForm.description || "",
          category: serviceForm.category,
          durationMinutes: duration,
          price: price,
        };

        response = await fetch("/api/services", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ API Error - Status:", response.status);
        console.error("❌ API Error - Data:", data);
        if (data.errors && Array.isArray(data.errors)) {
          console.error(
            "❌ Validation Errors:",
            JSON.stringify(data.errors, null, 2),
          );
          data.errors.forEach((err: any, index: number) => {
            console.error(`❌ Error ${index + 1}:`, err);
          });
        }
        throw new Error(data.message || "Failed to create service");
      }

      toast({
        title: "Success!",
        description: "Service created successfully",
      });

      // Reset form
      setShowAddDialog(false);
      setCurrentStep(1);
      setServiceForm({
        name: "",
        description: "",
        category: "",
        price: "",
        duration: "",
      });
      setServiceImages([]);
      setServiceImages([]);

      await fetchServices();
    } catch (error) {
      console.error("❌ CATCH BLOCK - Error creating service:", error);
      console.error("❌ Error type:", typeof error);
      console.error("❌ Error details:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create service",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && (!serviceForm.name || !serviceForm.category)) {
      toast({
        title: "Missing Information",
        description: "Please fill in service name and category",
        variant: "destructive",
      });
      return;
    }
    if (currentStep === 2 && (!serviceForm.price || !serviceForm.duration)) {
      toast({
        title: "Missing Information",
        description: "Please enter price and duration",
        variant: "destructive",
      });
      return;
    }
    // Step 3 (image upload) temporarily disabled - skip directly to creation
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 2) {
      // After step 2, create or update the service
      if (isEditMode) {
        handleUpdateService();
      } else {
        handleCreateService();
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const categories = [
    { id: "all", label: "All Services" },
    { id: "hair", label: "Hair Services" },
    { id: "nails", label: "Nail Services" },
    { id: "facial", label: "Facial Treatments" },
    { id: "massage", label: "Massage Therapy" },
    { id: "waxing", label: "Waxing Services" },
  ];

  const offersOptions = [
    { id: "all", label: "All Services" },
    { id: "with-offers", label: "With Active Offers" },
    { id: "without-offers", label: "Without Offers" },
  ];

  const oldServices = [
    {
      id: "1",
      name: "Haircut & Blow Dry",
      description: "Professional haircut with styling and blow dry finish",
      category: "hair",
      price: 65,
      duration: 60,
      image:
        "https://images.unsplash.com/photo-1647462741268-e5724e5886c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwc2Fsb24lMjBzZXJ2aWNlc3xlbnwxfHx8fDE3NTgxMTg2MTV8MA&ixlib=rb-4.1.0&q=80&w=400",
      isActive: true,
      bookings: 45,
      revenue: 2925,
      rating: 4.8,
    },
    {
      id: 2,
      name: "Hair Color & Highlights",
      description:
        "Full color service with highlights and professional color consultation",
      category: "hair",
      price: 120,
      duration: 150,
      image:
        "https://images.unsplash.com/photo-1647462741268-e5724e5886c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwc2Fsb24lMjBzZXJ2aWNlc3xlbnwxfHx8fDE3NTgxMTg2MTV8MA&ixlib=rb-4.1.0&q=80&w=400",
      isActive: true,
      bookings: 28,
      revenue: 3360,
      rating: 4.9,
    },
    {
      id: 3,
      name: "Classic Manicure",
      description:
        "Traditional manicure with cuticle care, shaping, and polish",
      category: "nails",
      price: 35,
      duration: 45,
      image:
        "https://images.unsplash.com/photo-1624574966266-1cdd65b74500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBwcm9kdWN0cyUyMGNvc21ldGljc3xlbnwxfHx8fDE3NTgwNTgyMjl8MA&ixlib=rb-4.1.0&q=80&w=400",
      isActive: true,
      bookings: 52,
      revenue: 1820,
      rating: 4.7,
    },
    {
      id: 4,
      name: "Gel Manicure & Pedicure",
      description:
        "Long-lasting gel manicure and pedicure combo with nail art options",
      category: "nails",
      price: 75,
      duration: 90,
      image:
        "https://images.unsplash.com/photo-1624574966266-1cdd65b74500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBwcm9kdWN0cyUyMGNvc21ldGljc3xlbnwxfHx8fDE3NTgwNTgyMjl8MA&ixlib=rb-4.1.0&q=80&w=400",
      isActive: true,
      bookings: 34,
      revenue: 2550,
      rating: 4.8,
    },
    {
      id: 5,
      name: "Hydrating Facial",
      description:
        "Deep cleansing and hydrating facial treatment for all skin types",
      category: "facial",
      price: 85,
      duration: 75,
      image:
        "https://images.unsplash.com/photo-1611211235015-e2e3a7d09e97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBzYWxvbiUyMGludGVyaW9yJTIwbW9kZXJufGVufDF8fHx8MTc1ODEwMzg0MHww&ixlib=rb-4.1.0&q=80&w=400",
      isActive: true,
      bookings: 22,
      revenue: 1870,
      rating: 4.9,
    },
    {
      id: 6,
      name: "Deep Tissue Massage",
      description:
        "Therapeutic deep tissue massage to relieve tension and stress",
      category: "massage",
      price: 95,
      duration: 60,
      image:
        "https://images.unsplash.com/photo-1611211235015-e2e3a7d09e97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBzYWxvbiUyMGludGVyaW9yJTIwbW9kZXJufGVufDF8fHx8MTc1ODEwMzg0MHww&ixlib=rb-4.1.0&q=80&w=400",
      isActive: false,
      bookings: 18,
      revenue: 1710,
      rating: 4.6,
    },
  ];

  const fetchOffers = async (salonId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `/api/offers?salonId=${salonId}&offerType=service&isActive=true`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );

      if (response.ok) {
        const data = await response.json();
        setOffers(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  const getActiveOffersForService = (serviceId: string) => {
    return offers.filter((offer) => {
      if (offer.offerType === "salon") return true;
      if (offer.offerType === "service" && offer.serviceId === serviceId)
        return true;
      return false;
    });
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;

    const serviceOffers = getActiveOffersForService(service.id);
    const matchesOffers =
      offersFilter === "all" ||
      (offersFilter === "with-offers" && serviceOffers.length > 0) ||
      (offersFilter === "without-offers" && serviceOffers.length === 0);

    return matchesSearch && matchesCategory && matchesOffers;
  });

  const toggleServiceStatus = async (serviceId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please login to update services",
          variant: "destructive",
        });
        return;
      }

      const service = services.find((s) => s.id === serviceId);
      if (!service) return;

      const updateData = {
        salonId: service.salonId,
        title: service.name,
        description: service.description,
        category: service.category,
        durationMinutes: service.duration,
        price: service.price,
        isActive: !service.isActive,
      };

      // Send complete service object for PUT request
      const response = await fetch(`/api/services/${serviceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Update failed:", data);
        throw new Error(data.message || "Failed to update service");
      }

      // Refresh services from backend to ensure sync
      await fetchServices();

      toast({
        title: "Success",
        description: "Service status updated",
      });
    } catch (error) {
      console.error("Error updating service:", error);
      toast({
        title: "Error",
        description: "Failed to update service status",
        variant: "destructive",
      });
    }
  };

  const getCategoryLabel = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.label || categoryId;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ""}`;
    }
    return `${mins}m`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground">
            Manage your salon services and pricing
          </p>
        </div>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Add Service Dialog */}
      <Dialog
        open={showAddDialog}
        onOpenChange={(open) => {
          setShowAddDialog(open);
          if (!open) {
            setIsEditMode(false);
            setEditingServiceId(null);
            setCurrentStep(1);
            setServiceForm({
              name: "",
              description: "",
              category: "",
              price: "",
              duration: "",
            });
            setServiceImages([]);
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Edit Service" : "Add New Service"}
              </DialogTitle>
              {/* Progress Stepper */}
              <div className="flex items-center justify-center gap-1 sm:gap-2 mt-4">
                {[1, 2].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${
                        step === currentStep
                          ? "bg-primary text-primary-foreground"
                          : step < currentStep
                            ? "bg-primary/80 text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step < currentStep ? "✓" : step}
                    </div>
                    {step < 2 && (
                      <div
                        className={`w-8 sm:w-12 h-1 mx-0.5 sm:mx-1 ${
                          step < currentStep ? "bg-primary/80" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-center text-xs sm:text-sm text-muted-foreground mt-2">
                {currentStep === 1 && "Basic Information"}
                {currentStep === 2 && "Pricing & Duration"}
              </p>
            </DialogHeader>

            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="service-name">Service Name *</Label>
                    <Input
                      id="service-name"
                      placeholder="e.g., Haircut & Styling"
                      value={serviceForm.name}
                      onChange={(e) =>
                        setServiceForm({ ...serviceForm, name: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="service-category">Category *</Label>
                    <Select
                      value={serviceForm.category}
                      onValueChange={(value) =>
                        setServiceForm({ ...serviceForm, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="service-description">Description</Label>
                    <Textarea
                      id="service-description"
                      placeholder="Describe your service..."
                      value={serviceForm.description}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          description: e.target.value,
                        })
                      }
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Pricing & Duration */}
            {currentStep === 2 && (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="service-price">Price (€) *</Label>
                    <Input
                      id="service-price"
                      type="number"
                      placeholder="0.00"
                      value={serviceForm.price}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          price: e.target.value,
                        })
                      }
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <Label htmlFor="service-duration">
                      Duration (minutes) *
                    </Label>
                    <Input
                      id="service-duration"
                      type="number"
                      placeholder="60"
                      value={serviceForm.duration}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          duration: e.target.value,
                        })
                      }
                      min="1"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label
                    htmlFor="service-image"
                    className="flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Service Image (Optional)
                  </Label>
                  <Input
                    id="service-image"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          toast({
                            title: "File too large",
                            description: "Image must be less than 5MB",
                            variant: "destructive",
                          });
                          e.target.value = "";
                          return;
                        }
                        setServiceImages([file]);
                      }
                    }}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    Supported: JPEG, PNG, WebP, GIF • Max 5MB
                  </p>
                  {serviceImages.length > 0 && (
                    <p className="text-sm text-green-600 font-medium">
                      ✓ {serviceImages[0].name} selected
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Image & Preview - TEMPORARILY DISABLED */}
            {false && currentStep === 3 && (
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="service-images">
                    Service Images (Max 5, Optional)
                  </Label>
                  <Input
                    id="service-images"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 5) {
                        toast({
                          title: "Too many files",
                          description: "You can only upload up to 5 images",
                          variant: "destructive",
                        });
                        return;
                      }
                      setServiceImages(files);
                    }}
                    className="cursor-pointer mt-2"
                  />
                  {serviceImages.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {serviceImages.length} file(s) selected
                    </p>
                  )}
                </div>

                {/* Final Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Service Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-lg">
                          {serviceForm.name || "Service Name"}
                        </p>
                        <Badge variant="outline" className="mt-1">
                          {categories.find((c) => c.id === serviceForm.category)
                            ?.label || "Category"}
                        </Badge>
                      </div>
                      <p className="text-2xl font-bold text-primary">
                        €{serviceForm.price || "0"}
                      </p>
                    </div>
                    {serviceForm.description && (
                      <p className="text-sm text-muted-foreground">
                        {serviceForm.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{serviceForm.duration || "0"} min</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Fixed Navigation Buttons */}
          <div className="border-t bg-background p-4 sm:p-6 flex justify-between gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={
                currentStep === 1
                  ? () => setShowAddDialog(false)
                  : handlePreviousStep
              }
              disabled={submitting}
            >
              {currentStep === 1 ? "Cancel" : "Back"}
            </Button>

            {currentStep < 2 ? (
              <Button
                onClick={handleNextStep}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Next Step
              </Button>
            ) : (
              <Button
                onClick={handleNextStep}
                disabled={submitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : isEditMode ? (
                  "Update Service"
                ) : (
                  "Create Service"
                )}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Services</p>
                <p className="text-2xl font-bold">{totalServices}</p>
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Services</p>
                <p className="text-2xl font-bold">{activeServices}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Eye className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Price</p>
                <p className="text-2xl font-bold">{formatCurrency(avgPrice)}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={offersFilter} onValueChange={setOffersFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {offersOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
            <p className="text-muted-foreground mt-4">Loading services...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const serviceOffers = getActiveOffersForService(service.id);

            return (
              <Card
                key={service.id}
                className="hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={
                      service.image ||
                      "https://images.unsplash.com/photo-1611211235015-e2e3a7d09e97?w=400"
                    }
                    alt={service.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {serviceOffers.length > 0 && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-gradient-to-r from-primary via-pink-500 to-rose-500 text-white shadow-md hover:shadow-lg transition-shadow">
                        <Tag className="w-3 h-3 mr-1" />
                        {serviceOffers.length}{" "}
                        {serviceOffers.length === 1 ? "Offer" : "Offers"}
                      </Badge>
                    </div>
                  )}
                  {/*<div className="absolute top-2 right-2">
                  <Switch
                    checked={service.isActive ?? true}
                    onCheckedChange={() => toggleServiceStatus(service.id)}
                  />
                </div>*/}
                  {!service.isActive && (
                    <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center">
                      <Badge
                        variant="secondary"
                        className="bg-white text-black"
                      >
                        <EyeOff className="w-3 h-3 mr-1" />
                        Hidden
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-heading text-lg font-semibold">
                        {service.name}
                      </h3>
                      <Badge variant="outline" className="text-xs mt-1">
                        {getCategoryLabel(service.category || "")}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditService(service)}
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {service.description || "No description available"}
                  </p>

                  {serviceOffers.length > 0 && (
                    <div className="mb-3 p-3 bg-gradient-to-br from-primary/5 via-pink-50/50 to-rose-50/50 rounded-lg border border-primary/20 shadow-sm">
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="p-1 bg-primary/10 rounded">
                          <Tag className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-xs font-semibold text-primary">
                          Special Offers
                        </span>
                      </div>
                      <div className="space-y-1">
                        {serviceOffers.slice(0, 2).map((offer: any) => (
                          <div
                            key={offer.id}
                            className="flex items-start gap-2 text-xs"
                          >
                            <span className="text-primary mt-0.5">•</span>
                            <div className="flex-1">
                              <span className="font-medium text-foreground">
                                {offer.title}
                              </span>
                              <span className="ml-1.5 px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-semibold">
                                {offer.discountType === "percentage"
                                  ? `${offer.discountValue}% OFF`
                                  : `€${offer.discountValue} OFF`}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {serviceOffers.length > 2 && (
                        <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-primary/10">
                          +{serviceOffers.length - 2} more{" "}
                          {serviceOffers.length - 2 === 1 ? "offer" : "offers"}{" "}
                          available
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="font-semibold">
                        €{(Number(service.price) || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {formatDuration(service.duration)}
                      </span>
                    </div>
                  </div>

                  {/* Always show stats section */}
                  <div className="grid grid-cols-3 gap-2 text-center border-t border-border pt-3">
                    <div>
                      <p className="text-sm font-medium">
                        {service.bookings ?? 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Bookings</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        €{(service.revenue ?? 0).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 justify-center">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <p className="text-sm font-medium">
                          {service.averageRating
                            ? service.averageRating.toFixed(1)
                            : service.rating
                              ? service.rating.toFixed(1)
                              : "0.0"}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {service.reviewCount
                          ? `${service.reviewCount} reviews`
                          : "No reviews"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* No results */}
      {filteredServices.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">
              No services found matching your criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
