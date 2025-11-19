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
} from "lucide-react";
import { toast } from "sonner";

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
  });

  // Step 2: Location & Hours
  const [locationData, setLocationData] = useState({
    latitude: "",
    longitude: "",
  });

  const [hours, setHours] = useState(DEFAULT_HOURS);
  const [sameTimeForAll, setSameTimeForAll] = useState(false);
  const [commonTime, setCommonTime] = useState({
    open: "09:00",
    close: "18:00",
  });

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

  const handleHoursChange = (
    day: string,
    field: "open" | "close",
    value: string
  ) => {
    setHours({
      ...hours,
      [day]: {
        ...hours[day as keyof typeof hours],
        [field]: value,
      },
    });
  };

  const handleCommonTimeChange = (field: "open" | "close", value: string) => {
    const newCommonTime = { ...commonTime, [field]: value };
    setCommonTime(newCommonTime);

    if (sameTimeForAll) {
      // Apply to all days
      const updatedHours = { ...hours };
      Object.keys(updatedHours).forEach((day) => {
        updatedHours[day as keyof typeof hours] = newCommonTime;
      });
      setHours(updatedHours);
    }
  };

  const handleSameTimeToggle = (checked: boolean) => {
    setSameTimeForAll(checked);
    if (checked) {
      // Apply common time to all days
      const updatedHours = { ...hours };
      Object.keys(updatedHours).forEach((day) => {
        updatedHours[day as keyof typeof hours] = commonTime;
      });
      setHours(updatedHours);
    }
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

      // Build request body
      const requestBody: any = {
        name: formData.name,
        address: formData.address,
      };

      // Add optional phone
      if (formData.phone) {
        requestBody.phone = formData.phone;
      }

      // Add optional geo coordinates
      if (locationData.latitude && locationData.longitude) {
        requestBody.geo = {
          latitude: parseFloat(locationData.latitude),
          longitude: parseFloat(locationData.longitude),
        };
      }

      // Add hours
      requestBody.hours = hours;

      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create salon");
      }

      // Store salon data
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
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Operating Hours
                    </h3>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameTimeForAll}
                        onChange={(e) => handleSameTimeToggle(e.target.checked)}
                        className="rounded border-border w-4 h-4"
                      />
                      <span className="text-sm text-muted-foreground">
                        Same for all days
                      </span>
                    </label>
                  </div>

                  {sameTimeForAll && (
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <Label className="text-sm font-medium mb-3 block">
                        Set time for all days
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs">Opens at</Label>
                          <Input
                            type="time"
                            value={commonTime.open}
                            onChange={(e) =>
                              handleCommonTimeChange("open", e.target.value)
                            }
                            className="h-9 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 dark:[&::-webkit-calendar-picker-indicator]:invert-0 dark:[&::-webkit-calendar-picker-indicator]:brightness-100"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Closes at</Label>
                          <Input
                            type="time"
                            value={commonTime.close}
                            onChange={(e) =>
                              handleCommonTimeChange("close", e.target.value)
                            }
                            className="h-9 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 dark:[&::-webkit-calendar-picker-indicator]:invert-0 dark:[&::-webkit-calendar-picker-indicator]:brightness-100"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {Object.keys(hours).map((day) => (
                      <div
                        key={day}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center p-3 bg-muted/50 rounded-lg"
                      >
                        <Label className="capitalize font-medium">{day}</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="time"
                            value={hours[day as keyof typeof hours].open}
                            onChange={(e) =>
                              handleHoursChange(day, "open", e.target.value)
                            }
                            disabled={sameTimeForAll}
                            className="h-9 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 dark:[&::-webkit-calendar-picker-indicator]:invert-0 dark:[&::-webkit-calendar-picker-indicator]:brightness-100"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground hidden sm:inline">
                            to
                          </span>
                          <Input
                            type="time"
                            value={hours[day as keyof typeof hours].close}
                            onChange={(e) =>
                              handleHoursChange(day, "close", e.target.value)
                            }
                            disabled={sameTimeForAll}
                            className="h-9 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 dark:[&::-webkit-calendar-picker-indicator]:invert-0 dark:[&::-webkit-calendar-picker-indicator]:brightness-100"
                          />
                        </div>
                      </div>
                    ))}
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
