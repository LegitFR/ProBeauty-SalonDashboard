"use client";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import {
  Calendar,
  MapPin,
  Phone as PhoneIcon,
  Clock,
  Building2,
  Loader2,
  Sparkles,
  CheckCircle,
  Image as ImageIcon,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { WeeklySchedule } from "../../components/auth/WeeklySchedule";

const API_BASE_URL = "/api/salons";

interface CreateSalonPageProps {
  onSalonCreated: () => void;
}

const DEFAULT_HOURS = {
  monday: { open: "09:00", close: "18:00" },
  tuesday: { open: "09:00", close: "18:00" },
  wednesday: { open: "09:00", close: "18:00" },
  thursday: { open: "09:00", close: "18:00" },
  friday: { open: "09:00", close: "18:00" },
  saturday: { open: "10:00", close: "16:00" },
  sunday: { open: "10:00", close: "16:00" },
};

export function CreateSalonPage({ onSalonCreated }: CreateSalonPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1); // Two-step form

  // Step 1: Basic Information
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    venueType: "everyone" as "male" | "female" | "everyone",
  });

  // Step 2: Location & Hours
  const [locationData, setLocationData] = useState({
    latitude: "",
    longitude: "",
  });

  const [hours, setHours] = useState(DEFAULT_HOURS);

  // Image uploads
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationData({
      ...locationData,
      [e.target.name]: e.target.value,
    });
  };

  const handleHoursChange = (newHours: typeof DEFAULT_HOURS) => {
    setHours(newHours);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    if (galleryImages.length + validFiles.length > 5) {
      toast.error("You can upload maximum 5 gallery images");
      return;
    }

    setGalleryImages([...galleryImages, ...validFiles]);

    // Generate previews
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
    setGalleryPreviews(galleryPreviews.filter((_, i) => i !== index));
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview("");
  };

  const handleNextStep = () => {
    if (!formData.name || formData.name.length < 2) {
      toast.error("Salon name must be at least 2 characters");
      return;
    }
    if (!formData.address || formData.address.length < 5) {
      toast.error("Address must be at least 5 characters");
      return;
    }
    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
      toast.error("Phone must be 10 digits starting with 6-9");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Please login first");
      }

      // Validate location data
      let geoData = null;
      if (locationData.latitude?.trim() && locationData.longitude?.trim()) {
        const lat = parseFloat(locationData.latitude);
        const lng = parseFloat(locationData.longitude);

        if (!isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng)) {
          geoData = { latitude: lat, longitude: lng };
        } else {
          toast.error("Invalid latitude or longitude values");
          setIsLoading(false);
          return;
        }
      } else if (
        locationData.latitude?.trim() ||
        locationData.longitude?.trim()
      ) {
        toast.error(
          "Please provide both latitude and longitude or leave both empty"
        );
        setIsLoading(false);
        return;
      }

      // Check if we have any files to upload
      const hasFiles = thumbnail || galleryImages.length > 0;

      console.log("🔍 Debug - Has files?", hasFiles);
      console.log("🔍 Debug - Thumbnail?", thumbnail);
      console.log("🔍 Debug - Gallery images?", galleryImages.length);

      let response;

      if (hasFiles) {
        // Use FormData for multipart/form-data request with files
        const formDataToSend = new FormData();

        // Add text fields
        formDataToSend.append("name", formData.name);
        formDataToSend.append("address", formData.address);
        formDataToSend.append("venueType", formData.venueType);

        if (formData.phone) {
          formDataToSend.append("phone", formData.phone);
        }

        // Add geo location as JSON string
        if (geoData) {
          formDataToSend.append("geo", JSON.stringify(geoData));
        }

        // Add hours as JSON string
        formDataToSend.append("hours", JSON.stringify(hours));

        // Add thumbnail image
        if (thumbnail) {
          formDataToSend.append("thumbnail", thumbnail);
        }

        // Add gallery images
        if (galleryImages.length > 0) {
          galleryImages.forEach((image) => {
            formDataToSend.append("images", image);
          });
        }

        console.log("🏢 Creating salon with files:");
        console.log("- Thumbnail:", thumbnail ? thumbnail.name : "none");
        console.log(
          "- Gallery images:",
          galleryImages.map((img) => img.name)
        );

        response = await fetch(API_BASE_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // Don't set Content-Type - browser will set it with boundary for multipart/form-data
          },
          body: formDataToSend,
        });
      } else {
        // Use JSON for simple request without files
        const requestBody: any = {
          name: formData.name,
          address: formData.address,
          venueType: formData.venueType,
          hours: hours,
        };

        if (formData.phone) {
          requestBody.phone = formData.phone;
        }

        if (geoData) {
          requestBody.geo = geoData;
        }

        console.log("🏢 Creating salon (JSON):", requestBody);

        response = await fetch(API_BASE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(requestBody),
        });
      }

      const data = await response.json();
      console.log("📨 Salon creation response:", data);

      if (!response.ok) {
        const errorMsg = data.message || "Failed to create salon";
        const validationErrors = data.errors || data.validationErrors;

        if (validationErrors) {
          console.error(
            "❌ Validation errors:",
            JSON.stringify(validationErrors, null, 2)
          );
          const errorMessages = validationErrors
            .map((err: any) => `${err.path || err.field}: ${err.message}`)
            .join(", ");
          throw new Error(`Validation failed: ${errorMessages}`);
        }

        throw new Error(errorMsg);
      }

      localStorage.setItem("salon", JSON.stringify(data.data));
      toast.success("Salon created successfully! Welcome to ProBeauty!");

      setTimeout(() => {
        onSalonCreated();
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || "Failed to create salon. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-orange-50/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-orange-200/20 to-transparent rounded-full blur-3xl"></div>

      <div className="w-full max-w-3xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="font-heading text-3xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
              ProBeauty
            </span>
          </div>

          <h1 className="font-heading text-3xl font-bold mb-2">
            Set Up Your Salon
          </h1>
          <p className="text-muted-foreground">
            Let's get your business started! Fill in your salon details below.
          </p>

          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                step === 1
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span className="text-sm font-medium">Basic Info</span>
            </div>
            <div className="w-8 h-0.5 bg-muted"></div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                step === 2
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Details</span>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl">
              {step === 1 ? "Basic Information" : "Location & Hours"}
            </CardTitle>
            <CardDescription>
              {step === 1
                ? "Tell us about your salon"
                : "Add location and operating hours (optional)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleNextStep();
                }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Salon Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g., Glamour Studio"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum 2 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address *
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="123 Fashion Street, Mumbai, Maharashtra 400001"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum 5 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <PhoneIcon className="w-4 h-4" />
                    Phone Number (Optional)
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">
                    10 digits starting with 6-9
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="venueType"
                    className="flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    Venue Type
                  </Label>
                  <select
                    id="venueType"
                    name="venueType"
                    value={formData.venueType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        venueType: e.target.value as
                          | "male"
                          | "female"
                          | "everyone",
                      })
                    }
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="everyone">Everyone</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Who can visit your salon
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-primary to-orange-600 text-white hover:from-primary/90 hover:to-orange-600/90 shadow-lg"
                >
                  Continue to Details
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Location Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Geo Location (Optional)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        name="latitude"
                        type="number"
                        step="any"
                        placeholder="19.0760"
                        value={locationData.latitude}
                        onChange={handleLocationChange}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        name="longitude"
                        type="number"
                        step="any"
                        placeholder="72.8777"
                        value={locationData.longitude}
                        onChange={handleLocationChange}
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>

                {/* Operating Hours Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Operating Hours
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Set your weekly availability. Toggle days on/off and add
                    multiple time slots per day.
                  </p>
                  <WeeklySchedule value={hours} onChange={handleHoursChange} />
                </div>

                {/* Image Uploads Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    Images (Optional)
                  </h3>

                  {/* Thumbnail Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail" className="text-sm">
                      Salon Thumbnail
                    </Label>
                    <div className="flex items-start gap-3">
                      {thumbnailPreview ? (
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-primary">
                          <img
                            src={thumbnailPreview}
                            alt="Thumbnail preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={removeThumbnail}
                            className="absolute top-1 right-1 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <label
                          htmlFor="thumbnail"
                          className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                        >
                          <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                          <span className="text-xs text-muted-foreground text-center px-2">
                            Click to upload
                          </span>
                        </label>
                      )}
                      <input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                      />
                      <div className="flex-1 text-xs text-muted-foreground">
                        <p className="mb-1">Main image for your salon</p>
                        <p>• Max size: 5MB</p>
                        <p>• Format: JPG, PNG, WebP</p>
                      </div>
                    </div>
                  </div>

                  {/* Gallery Images Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="gallery" className="text-sm">
                      Gallery Images (Up to 5)
                    </Label>
                    <div className="space-y-3">
                      {galleryPreviews.length > 0 && (
                        <div className="grid grid-cols-5 gap-2">
                          {galleryPreviews.map((preview, index) => (
                            <div
                              key={index}
                              className="relative aspect-square rounded-lg overflow-hidden border-2 border-muted"
                            >
                              <img
                                src={preview}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeGalleryImage(index)}
                                className="absolute top-1 right-1 p-0.5 bg-destructive text-white rounded-full hover:bg-destructive/90"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      {galleryImages.length < 5 && (
                        <label
                          htmlFor="gallery"
                          className="flex items-center justify-center h-24 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                        >
                          <div className="text-center">
                            <Upload className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                            <span className="text-xs text-muted-foreground">
                              Click to add gallery images (
                              {galleryImages.length}/5)
                            </span>
                          </div>
                        </label>
                      )}
                      <input
                        id="gallery"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryImagesChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 h-11"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-11 bg-gradient-to-r from-primary to-orange-600 text-white hover:from-primary/90 hover:to-orange-600/90 shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Salon...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Create Salon
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            * Required fields | You can update these details later from settings
          </p>
        </div>
      </div>
    </div>
  );
}
