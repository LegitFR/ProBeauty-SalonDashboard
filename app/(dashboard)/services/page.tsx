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
} from "lucide-react";
import { useToast } from "../../../components/ui/use-toast";

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
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  // Service form state
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    duration: "",
    imageFile: null as File | null,
    imagePreview: "",
  });

  useEffect(() => {
    fetchServices();

    // Debug: Check localStorage data
    console.log("=== Debug Info ===");
    console.log("All localStorage keys:", Object.keys(localStorage));
    console.log("localStorage contents:");
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        console.log(`  ${key}:`, value?.substring(0, 100));
      }
    }

    const userStr = localStorage.getItem("user");
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken");
    console.log("Token exists:", !!token);
    console.log("User data:", userStr);
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log("Parsed user:", user);
        console.log("SalonId options:", {
          direct: user.salonId,
          nested: user.salon?.id,
          userId: user.id,
        });
      } catch (e) {
        console.error("Error parsing user:", e);
      }
    }
    console.log("==================");
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const salon = JSON.parse(localStorage.getItem("salon") || "{}");
      console.log("Fetching services for salon:", salon.id);

      const response = await fetch(`/api/services/salon/${salon.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch services");
      }

      // Filter services by salon ID to ensure we only show services for this salon
      const filteredServices = (data.services || []).filter(
        (service: Service) => service.salonId === salon.id
      );
      console.log("Filtered services for salon:", filteredServices);
      setServices(filteredServices);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setServiceForm({
        ...serviceForm,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleCreateService = async () => {
    console.log("🚀 handleCreateService CALLED!");
    console.log("Current form state:", serviceForm);

    try {
      setSubmitting(true);
      console.log("Submitting set to true");

      const token = localStorage.getItem("accessToken");
      console.log("Token retrieved:", token ? "EXISTS" : "MISSING");

      if (!token) {
        console.error("❌ No token found in any storage key!");
        console.log("All localStorage keys:", Object.keys(localStorage));
        toast({
          title: "Authentication required",
          description: "Please login again to create services",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      console.log("✅ Token found:", token.substring(0, 20) + "...");

      // Get salonId - need to fetch user's salon first
      const userStr = localStorage.getItem("user");
      console.log("User string from localStorage:", userStr);

      let salonId = null;

      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          console.log("Parsed user object:", user);
          console.log("User role:", user.role);

          // Check if salonId is directly in user object
          salonId = user.salonId || user.salon?.id;

          // If no salonId, try to fetch user's salon
          if (!salonId && user.role === "owner") {
            console.log("No salonId in user object, fetching user's salon...");
            try {
              const salonsResponse = await fetch("/api/salons", {
                headers: { Authorization: `Bearer ${token}` },
              });

              console.log("Salons API response status:", salonsResponse.status);

              if (salonsResponse.ok) {
                const salonsData = await salonsResponse.json();
                console.log("Salons data received:", salonsData);

                // Get the first salon (assuming owner owns one salon)
                const userSalon =
                  salonsData.salons?.[0] ||
                  salonsData.data?.[0] ||
                  salonsData[0];
                if (userSalon) {
                  salonId = userSalon.id;
                  console.log("✅ Found salon from API:", salonId);
                } else {
                  console.warn("⚠️ No salon found in response");
                }
              } else {
                const errorData = await salonsResponse.text();
                console.error(
                  "❌ Failed to fetch salons:",
                  salonsResponse.status
                );
                console.error("❌ Error response:", errorData);
              }
            } catch (fetchError) {
              console.error("❌ Exception fetching salons:", fetchError);
            }
          }

          // Fallback: If still no salonId and user is owner, use user.id as salonId
          if (!salonId && user.role === "owner") {
            console.warn("⚠️ Using user.id as fallback salonId");
            salonId = user.id;
          }

          console.log("Final salonId:", salonId);
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }

      if (!salonId) {
        console.error("❌ No salonId found!");
        toast({
          title: "Error",
          description:
            "Could not determine your salon. Please make sure you have a salon set up.",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      console.log("✅ Using salonId:", salonId);

      // Prepare request body matching backend API
      const requestBody = {
        salonId: salonId,
        title: serviceForm.name,
        durationMinutes: parseInt(serviceForm.duration),
        price: parseFloat(serviceForm.price),
      };

      console.log("📦 Request body prepared:", requestBody);
      console.log("🌐 Sending POST to /api/services...");

      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📥 Response received, status:", response.status);

      const data = await response.json();
      console.log("📥 Response data:", data);

      if (!response.ok) {
        console.error("❌ API Error - Status:", response.status);
        console.error("❌ API Error - Data:", data);
        throw new Error(data.message || "Failed to create service");
      }

      console.log("✅ Service created successfully!");

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
        imageFile: null,
        imagePreview: "",
      });

      // Refresh services
      console.log("🔄 Refreshing services list...");
      await fetchServices();
      console.log("✅ All done!");
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
      console.log("🔚 Finally block - setting submitting to false");
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
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
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

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
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

      const response = await fetch(`/api/services/${serviceId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isActive: !service.isActive,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update service");
      }

      setServices(
        services.map((s) =>
          s.id === serviceId ? { ...s, isActive: !s.isActive } : s
        )
      );

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
            setCurrentStep(1);
            setServiceForm({
              name: "",
              description: "",
              category: "",
              price: "",
              duration: "",
              imageFile: null,
              imagePreview: "",
            });
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
              {/* Progress Stepper */}
              <div className="flex items-center justify-center gap-1 sm:gap-2 mt-4">
                {[1, 2, 3].map((step) => (
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
                    {step < 3 && (
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
                {currentStep === 3 && "Image & Preview"}
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
                    <Label htmlFor="service-price">Price ($) *</Label>
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
              </div>
            )}

            {/* Step 3: Image & Preview */}
            {currentStep === 3 && (
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Service Image (Optional)</Label>
                  <div className="mt-2">
                    {serviceForm.imagePreview ? (
                      <div className="relative">
                        <Image
                          src={serviceForm.imagePreview}
                          alt="Service preview"
                          width={400}
                          height={200}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setServiceForm({
                              ...serviceForm,
                              imageFile: null,
                              imagePreview: "",
                            });
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-border rounded-lg p-8 text-center block cursor-pointer hover:border-primary transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                        <Camera className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload image
                        </p>
                      </label>
                    )}
                  </div>
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
                        ${serviceForm.price || "0"}
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
          <div className="border-t bg-background p-4 sm:p-6 flex justify-between gap-2 flex-shrink-0">
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

            {currentStep < 3 ? (
              <Button
                onClick={handleNextStep}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Next Step
              </Button>
            ) : (
              <Button
                onClick={(e) => {
                  console.log("🖱️ CREATE SERVICE BUTTON CLICKED!");
                  console.log("Event:", e);
                  console.log("Submitting state:", submitting);
                  handleCreateService();
                }}
                disabled={submitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Add Service"
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
                <p className="text-2xl font-bold">{services.length}</p>
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
                <p className="text-2xl font-bold">
                  {services.filter((s) => s.isActive).length}
                </p>
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
                <p className="text-2xl font-bold">
                  $
                  {Math.round(
                    services.reduce((sum, s) => sum + s.price, 0) /
                      services.length
                  )}
                </p>
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
                  $
                  {services
                    .reduce((sum, s) => sum + (s.revenue || 0), 0)
                    .toLocaleString()}
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
          {filteredServices.map((service) => (
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
                <div className="absolute top-2 right-2">
                  <Switch
                    checked={service.isActive ?? true}
                    onCheckedChange={() => toggleServiceStatus(service.id)}
                  />
                </div>
                {!service.isActive && (
                  <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center">
                    <Badge variant="secondary" className="bg-white text-black">
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
                    <Button variant="ghost" size="icon" className="h-8 w-8">
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

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="font-semibold">${service.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {formatDuration(service.duration)}
                    </span>
                  </div>
                </div>

                {(service.bookings || service.revenue || service.rating) && (
                  <div className="grid grid-cols-3 gap-2 text-center border-t border-border pt-3">
                    {service.bookings !== undefined && (
                      <div>
                        <p className="text-sm font-medium">
                          {service.bookings}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Bookings
                        </p>
                      </div>
                    )}
                    {service.revenue !== undefined && (
                      <div>
                        <p className="text-sm font-medium">
                          ${service.revenue.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                      </div>
                    )}
                    {service.rating !== undefined && (
                      <div>
                        <p className="text-sm font-medium">{service.rating}</p>
                        <p className="text-xs text-muted-foreground">Rating</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
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
