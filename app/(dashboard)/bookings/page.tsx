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
import { Separator } from "../../../components/ui/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import {
  Calendar,
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  Clock,
  MapPin,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { Calendar as CalendarComponent } from "../../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { format } from "date-fns";
import { cn } from "../../../components/ui/utils";
import { useToast } from "../../../components/ui/use-toast";

interface Service {
  id: string;
  title: string;
  price: number;
  durationMinutes: number;
}

interface StaffMember {
  id: string;
  user: { name: string };
  role: string;
}

interface Booking {
  id: string;
  userId: string;
  salonId: string;
  serviceId: string;
  staffId: string;
  startTime: string;
  endTime: string;
  status: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  salon: {
    id: string;
    name: string;
    address?: string;
  };
  service: {
    id: string;
    title: string;
    durationMinutes: number;
    price: string | number;
  };
  staff: {
    id: string;
    name?: string;
    role: string;
    user: {
      name: string;
      email: string;
    };
  };
  notes?: string;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showNewBookingDialog, setShowNewBookingDialog] = useState(false);
  const [showFiltersDialog, setShowFiltersDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  // Filter state
  const [filters, setFilters] = useState({
    status: "all",
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
    serviceId: "all",
    staffId: "all",
  });

  // Booking form state
  const [salon, setSalon] = useState<any>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [bookingForm, setBookingForm] = useState({
    serviceId: "",
    staffId: "",
    date: undefined as Date | undefined,
    time: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Compute filtered bookings based on search term and filters
  const filteredBookings = bookings.filter((booking) => {
    // Search filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      booking.user.name.toLowerCase().includes(searchLower) ||
      booking.service.title.toLowerCase().includes(searchLower) ||
      (booking.staff?.name || "").toLowerCase().includes(searchLower) ||
      (booking.staff?.user?.name || "").toLowerCase().includes(searchLower);

    if (!matchesSearch) return false;

    // Status filter
    if (filters.status !== "all" && booking.status !== filters.status) {
      return false;
    }

    // Service filter
    if (
      filters.serviceId !== "all" &&
      booking.serviceId !== filters.serviceId
    ) {
      return false;
    }

    // Staff filter
    if (filters.staffId !== "all" && booking.staffId !== filters.staffId) {
      return false;
    }

    // Date range filter
    const bookingDate = new Date(booking.startTime);
    if (filters.dateFrom && bookingDate < filters.dateFrom) {
      return false;
    }
    if (filters.dateTo) {
      const dateTo = new Date(filters.dateTo);
      dateTo.setHours(23, 59, 59, 999);
      if (bookingDate > dateTo) {
        return false;
      }
    }

    return true;
  });

  useEffect(() => {
    fetchSalon();
    fetchBookings();
    fetchServices();
    fetchStaff();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  useEffect(() => {
    if (showNewBookingDialog) {
      fetchServices();
      fetchStaff();
    }
  }, [showNewBookingDialog]);

  useEffect(() => {
    if (bookingForm.serviceId && bookingForm.staffId && bookingForm.date) {
      fetchAvailability();
    }
  }, [bookingForm.serviceId, bookingForm.staffId, bookingForm.date]);

  const fetchSalon = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await fetch("/api/salons/my-salons", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setSalon(data.data[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching salon:", error);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please login to view bookings",
          variant: "destructive",
        });
        return;
      }

      let url = "/api/bookings";
      const params = new URLSearchParams();

      if (activeTab === "today") {
        // Get start and end of today in ISO format
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        params.append("startDate", todayStart.toISOString());
        params.append("endDate", todayEnd.toISOString());
      } else if (activeTab === "upcoming") {
        params.append("status", "CONFIRMED");
        const now = new Date();
        params.append("startDate", now.toISOString());
      } else if (activeTab === "completed") {
        params.append("status", "COMPLETED");
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Bookings API error:", response.status, errorText);
        throw new Error(
          `Failed to fetch bookings: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Bookings API response:", data);

      let bookingsData = data.data || [];

      // Fetch salon details to get full staff information
      // Use salonId from the first booking since salon state might not be loaded yet
      if (bookingsData.length > 0) {
        const salonId = bookingsData[0].salonId;

        try {
          const salonResponse = await fetch(`/api/salons/${salonId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (salonResponse.ok) {
            const salonData = await salonResponse.json();
            const staffList = salonData.data?.staff || [];

            console.log("Salon staff list:", staffList);
            console.log("Bookings before merge:", bookingsData);

            // Merge staff details into bookings
            bookingsData = bookingsData.map((booking: any) => {
              console.log(
                `Looking for staffId: ${booking.staffId}, Staff IDs in list:`,
                staffList.map((s: any) => s.id)
              );

              const fullStaffInfo = staffList.find(
                (s: any) => s.id === booking.staffId
              );

              console.log(
                `Booking ${booking.id} - staffId: ${booking.staffId}, found staff:`,
                fullStaffInfo
              );

              if (fullStaffInfo) {
                const mergedBooking = {
                  ...booking,
                  staff: {
                    ...booking.staff,
                    id: fullStaffInfo.id,
                    name: fullStaffInfo.name || fullStaffInfo.user?.name,
                    role: fullStaffInfo.role,
                    user: fullStaffInfo.user,
                  },
                };
                console.log("Merged booking:", mergedBooking);
                return mergedBooking;
              }
              return booking;
            });

            console.log("Bookings after merge:", bookingsData);
          }
        } catch (error) {
          console.error("Error fetching staff details:", error);
        }
      }

      setBookings(bookingsData);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (
    bookingId: string,
    newStatus: string
  ) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please login to update booking",
          variant: "destructive",
        });
        return;
      }

      let url = `/api/bookings/${bookingId}`;
      let method = "PUT";
      let body: any = { status: newStatus };

      // Use specific endpoints for confirm and complete
      if (newStatus === "CONFIRMED") {
        url = `/api/bookings/${bookingId}/confirm`;
        method = "POST";
        body = {};
      } else if (newStatus === "COMPLETED") {
        url = `/api/bookings/${bookingId}/complete`;
        method = "POST";
        body = {};
      }

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      let errorMessage = "Failed to update booking";

      if (!response.ok) {
        try {
          const error = await response.json();
          errorMessage = error.message || errorMessage;
        } catch (e) {
          // Response doesn't have JSON body, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      toast({
        title: "Success",
        description: `Booking ${newStatus.toLowerCase()} successfully`,
      });

      fetchBookings();
    } catch (error: any) {
      console.error("Error updating booking:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!salon) return;

      const response = await fetch(`/api/services/salon/${salon.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Services API response:", data);
        setServices(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!salon) return;

      const response = await fetch(`/api/staff/salon/${salon.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Staff API response:", data);
        setStaff(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const fetchAvailability = async () => {
    try {
      if (
        !bookingForm.serviceId ||
        !bookingForm.staffId ||
        !bookingForm.date ||
        !salon
      )
        return;

      const dateStr = format(bookingForm.date, "yyyy-MM-dd");
      const url = `/api/bookings/availability?salonId=${salon.id}&serviceId=${bookingForm.serviceId}&staffId=${bookingForm.staffId}&date=${dateStr}`;

      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        console.log("Availability API response:", data);
        setAvailableTimeSlots(data.data?.slots || []);
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
      setAvailableTimeSlots([]);
    }
  };

  const handleCreateBooking = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please login to create bookings",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      if (!salon) {
        toast({
          title: "Error",
          description: "Salon information not found",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      // Parse the selected time slot to get startTime
      const selectedSlot = availableTimeSlots.find(
        (slot) => slot.startTime === bookingForm.time
      );

      if (!selectedSlot) {
        toast({
          title: "Error",
          description: "Invalid time slot selected",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      const bookingData = {
        salonId: salon.id,
        serviceId: bookingForm.serviceId,
        staffId: bookingForm.staffId,
        startTime: selectedSlot.startTime,
      };

      console.log("Creating booking with data:", bookingData);

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();
      console.log("Create booking response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to create booking");
      }

      toast({
        title: "Success!",
        description: "Booking created successfully",
      });

      // Reset form
      setShowNewBookingDialog(false);
      setCurrentStep(1);
      setBookingForm({
        serviceId: "",
        staffId: "",
        date: undefined,
        time: "",
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        notes: "",
      });

      // Refresh bookings
      fetchBookings();
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "Error",
        description: "Failed to create booking",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && (!bookingForm.serviceId || !bookingForm.staffId)) {
      toast({
        title: "Missing Information",
        description: "Please select both service and staff member",
        variant: "destructive",
      });
      return;
    }
    if (currentStep === 2 && (!bookingForm.date || !bookingForm.time)) {
      toast({
        title: "Missing Information",
        description: "Please select date and time",
        variant: "destructive",
      });
      return;
    }
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit the booking on step 2
      handleCreateBooking();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const selectedService = services.find((s) => s.id === bookingForm.serviceId);
  const selectedStaff = staff.find((s) => s.id === bookingForm.staffId);

  const oldBookings = [
    {
      id: 1,
      customer: "Sarah Johnson",
      service: "Hair Cut & Color",
      date: "2024-01-15",
      time: "9:00 AM",
      duration: "2h",
      staff: "Emily Chen",
      status: "confirmed",
      phone: "+1 234 567 8901",
      email: "sarah@email.com",
      notes: "Prefers natural colors",
    },
    {
      id: 2,
      customer: "Maria Garcia",
      service: "Facial Treatment",
      date: "2024-01-15",
      time: "11:30 AM",
      duration: "1h",
      staff: "Anna Smith",
      status: "in-progress",
      phone: "+1 234 567 8902",
      email: "maria@email.com",
      notes: "Sensitive skin",
    },
    {
      id: 3,
      customer: "Jennifer Lee",
      service: "Manicure & Pedicure",
      date: "2024-01-16",
      time: "2:00 PM",
      duration: "1.5h",
      staff: "Sofia Martinez",
      status: "upcoming",
      phone: "+1 234 567 8903",
      email: "jennifer@email.com",
      notes: "Regular customer",
    },
  ];

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toUpperCase();
    switch (normalizedStatus) {
      case "CONFIRMED":
        return "bg-blue-500/10 text-blue-600";
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-600";
      case "COMPLETED":
        return "bg-green-500/10 text-green-600";
      case "CANCELLED":
        return "bg-red-500/10 text-red-600";
      case "NO_SHOW":
        return "bg-gray-500/10 text-gray-600";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold">Bookings</h1>
          <p className="text-muted-foreground">
            Manage all your salon appointments
          </p>
        </div>
        {/* <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setShowNewBookingDialog(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Booking
        </Button> */}
      </div>

      {/* New Booking Dialog */}
      <Dialog
        open={showNewBookingDialog}
        onOpenChange={setShowNewBookingDialog}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              Create New Booking
            </DialogTitle>
            <DialogDescription>
              Book an appointment in {currentStep} easy steps
            </DialogDescription>
          </DialogHeader>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                      step < currentStep
                        ? "bg-primary text-white"
                        : step === currentStep
                        ? "bg-primary text-white ring-4 ring-primary/20"
                        : "bg-gray-200 text-gray-500"
                    )}
                  >
                    {step < currentStep ? "✓" : step}
                  </div>
                  <span className="text-xs mt-1 font-medium">
                    {step === 1 && "Service"}
                    {step === 2 && "Schedule"}
                    {step === 3 && "Customer"}
                    {step === 4 && "Confirm"}
                  </span>
                </div>
                {step < 4 && (
                  <div
                    className={cn(
                      "h-1 flex-1 transition-all",
                      step < currentStep ? "bg-primary" : "bg-gray-200"
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Select Service & Staff */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <span className="text-2xl">💇</span>
                  Select Service & Specialist
                </h3>
                <p className="text-sm text-muted-foreground">
                  Choose the service you want and the staff member you'd like to
                  work with
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="service" className="text-base font-semibold">
                    Service *
                  </Label>
                  <Select
                    value={bookingForm.serviceId}
                    onValueChange={(value) =>
                      setBookingForm({ ...bookingForm, serviceId: value })
                    }
                  >
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue placeholder="Choose a service..." />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium">{service.title}</span>
                            <span className="text-sm text-muted-foreground ml-4">
                              €{(Number(service.price) || 0).toFixed(2)} •{" "}
                              {service.durationMinutes} min
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="staff" className="text-base font-semibold">
                    Staff Member *
                  </Label>
                  <Select
                    value={bookingForm.staffId}
                    onValueChange={(value) =>
                      setBookingForm({ ...bookingForm, staffId: value })
                    }
                  >
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue placeholder="Choose a staff member..." />
                    </SelectTrigger>
                    <SelectContent>
                      {staff.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-xs font-semibold text-primary">
                                {member.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{member.user.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {member.role}
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Select Date & Time */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <span className="text-2xl">📅</span>
                  Pick Your Preferred Time
                </h3>
                <p className="text-sm text-muted-foreground">
                  Select a date and available time slot for your appointment
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-semibold mb-2 block">
                    Select Date *
                  </Label>
                  <CalendarComponent
                    mode="single"
                    selected={bookingForm.date}
                    onSelect={(date) =>
                      setBookingForm({ ...bookingForm, date, time: "" })
                    }
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>

                <div>
                  <Label className="text-base font-semibold mb-2 block">
                    Available Time Slots *
                  </Label>
                  {!bookingForm.date ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Please select a date first</p>
                    </div>
                  ) : availableTimeSlots.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No available slots</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                      {availableTimeSlots
                        .filter((slot) => slot.available)
                        .map((slot) => (
                          <Button
                            key={slot.startTime}
                            variant={
                              bookingForm.time === slot.startTime
                                ? "default"
                                : "outline"
                            }
                            className={cn(
                              "h-12",
                              bookingForm.time === slot.startTime &&
                                "ring-2 ring-primary ring-offset-2"
                            )}
                            onClick={() =>
                              setBookingForm({
                                ...bookingForm,
                                time: slot.startTime,
                              })
                            }
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            {new Date(slot.startTime).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </Button>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              disabled={currentStep === 1 || submitting}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowNewBookingDialog(false);
                  setCurrentStep(1);
                  setBookingForm({
                    serviceId: "",
                    staffId: "",
                    date: undefined,
                    time: "",
                    customerName: "",
                    customerEmail: "",
                    customerPhone: "",
                    notes: "",
                  });
                }}
                disabled={submitting}
              >
                Cancel
              </Button>

              <Button
                onClick={handleNextStep}
                disabled={submitting}
                className="min-w-24"
              >
                {submitting && currentStep === 2 ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : currentStep === 2 ? (
                  <>
                    <span className="mr-2">✓</span>
                    Create Booking
                  </>
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Filters Dialog */}
      <Dialog open={showFiltersDialog} onOpenChange={setShowFiltersDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Bookings</DialogTitle>
            <DialogDescription>
              Apply filters to narrow down your bookings
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Status Filter */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Service Filter */}
            <div className="space-y-2">
              <Label>Service</Label>
              <Select
                value={filters.serviceId}
                onValueChange={(value) =>
                  setFilters({ ...filters, serviceId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Staff Filter */}
            <div className="space-y-2">
              <Label>Staff Member</Label>
              <Select
                value={filters.staffId}
                onValueChange={(value) =>
                  setFilters({ ...filters, staffId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Staff</SelectItem>
                  {staff.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2">
              <Label>Date From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateFrom && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {filters.dateFrom
                      ? format(filters.dateFrom, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={(date) =>
                      setFilters({ ...filters, dateFrom: date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Date To</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateTo && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {filters.dateTo
                      ? format(filters.dateTo, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={filters.dateTo}
                    onSelect={(date) =>
                      setFilters({ ...filters, dateTo: date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-between gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setFilters({
                  status: "all",
                  dateFrom: undefined,
                  dateTo: undefined,
                  serviceId: "all",
                  staffId: "all",
                });
              }}
            >
              Clear Filters
            </Button>
            <Button onClick={() => setShowFiltersDialog(false)}>
              Apply Filters
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings by customer, service, or staff..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFiltersDialog(true)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {(filters.status !== "all" ||
                filters.serviceId !== "all" ||
                filters.staffId !== "all" ||
                filters.dateFrom ||
                filters.dateTo) && (
                <Badge
                  className="ml-2 h-5 w-5 p-0 flex items-center justify-center"
                  variant="destructive"
                >
                  !
                </Badge>
              )}
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "outline"}
              onClick={() =>
                setViewMode(viewMode === "list" ? "calendar" : "list")
              }
            >
              <Calendar className="w-4 h-4 mr-2" />
              {viewMode === "calendar" ? "List View" : "Calendar View"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="all" className="text-xs sm:text-sm">
            All Bookings
          </TabsTrigger>
          <TabsTrigger value="today" className="text-xs sm:text-sm">
            Today
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="text-xs sm:text-sm">
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs sm:text-sm">
            Completed
          </TabsTrigger>
        </TabsList>

        {/* Calendar View */}
        {viewMode === "calendar" ? (
          <div className="mt-4">
            <Card>
              <CardContent className="p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
                    <p className="text-muted-foreground mt-4">
                      Loading bookings...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Group bookings by date */}
                    {Object.entries(
                      filteredBookings.reduce((groups, booking) => {
                        const date = new Date(booking.startTime);
                        const dateKey = date.toISOString().split("T")[0]; // Use ISO date as key (YYYY-MM-DD)
                        if (!groups[dateKey]) {
                          groups[dateKey] = [];
                        }
                        groups[dateKey].push(booking);
                        return groups;
                      }, {} as Record<string, Booking[]>)
                    )
                      .sort(
                        ([dateA], [dateB]) =>
                          new Date(dateA).getTime() - new Date(dateB).getTime()
                      )
                      .map(([dateKey, dayBookings]) => (
                        <div key={dateKey} className="space-y-3">
                          <h3 className="font-semibold text-lg border-b pb-2">
                            {format(new Date(dateKey), "EEEE, d. MMMM yyyy")}
                          </h3>
                          <div className="grid gap-3">
                            {dayBookings
                              .sort(
                                (a, b) =>
                                  new Date(a.startTime).getTime() -
                                  new Date(b.startTime).getTime()
                              )
                              .map((booking) => (
                                <Card
                                  key={booking.id}
                                  className="hover:shadow-md transition-shadow"
                                >
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex items-start gap-3 flex-1">
                                        <div className="bg-primary/10 p-2 rounded-lg">
                                          <Clock className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-medium">
                                              {new Date(
                                                booking.startTime
                                              ).toLocaleTimeString("en-US", {
                                                hour: "numeric",
                                                minute: "2-digit",
                                                hour12: true,
                                              })}
                                            </p>
                                            <Badge
                                              className={getStatusColor(
                                                booking.status
                                              )}
                                            >
                                              {booking.status.toLowerCase()}
                                            </Badge>
                                          </div>
                                          <p className="text-sm text-muted-foreground mt-1">
                                            {booking.user.name} •{" "}
                                            {booking.service.title}
                                          </p>
                                          <p className="text-xs text-muted-foreground mt-1">
                                            Staff:{" "}
                                            {booking.staff?.name ||
                                              booking.staff?.user?.name ||
                                              "Unassigned"}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        {booking.status === "PENDING" && (
                                          <>
                                            <Button
                                              variant="default"
                                              size="sm"
                                              onClick={() =>
                                                handleUpdateBookingStatus(
                                                  booking.id,
                                                  "CONFIRMED"
                                                )
                                              }
                                            >
                                              Approve
                                            </Button>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() =>
                                                handleUpdateBookingStatus(
                                                  booking.id,
                                                  "CANCELLED"
                                                )
                                              }
                                              className="text-red-600 hover:text-red-700"
                                            >
                                              Reject
                                            </Button>
                                          </>
                                        )}
                                        {booking.status === "CONFIRMED" && (
                                          <>
                                            <Button
                                              variant="default"
                                              size="sm"
                                              onClick={() =>
                                                handleUpdateBookingStatus(
                                                  booking.id,
                                                  "COMPLETED"
                                                )
                                              }
                                            >
                                              Complete
                                            </Button>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() =>
                                                handleUpdateBookingStatus(
                                                  booking.id,
                                                  "CANCELLED"
                                                )
                                              }
                                              className="text-red-600"
                                            >
                                              Cancel
                                            </Button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                          </div>
                        </div>
                      ))}
                    {filteredBookings.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>
                          {bookings.length === 0
                            ? "No bookings found"
                            : "No bookings match your search or filters"}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {/* List View */}
            <TabsContent value="all" className="space-y-4">
              {loading ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
                    <p className="text-muted-foreground mt-4">
                      Loading bookings...
                    </p>
                  </CardContent>
                </Card>
              ) : filteredBookings.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">
                      {bookings.length === 0
                        ? "No bookings found"
                        : "No bookings match your search or filters"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredBookings.map((booking) => (
                  <Card
                    key={booking.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        {/* Customer Info */}
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${booking.user.name}`}
                            />
                            <AvatarFallback>
                              {booking.user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{booking.user.name}</p>
                            {booking.user.phone && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="w-3 h-3" />
                                {booking.user.phone}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Service & Time */}
                        <div>
                          <p className="font-medium">{booking.service.title}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <Clock className="w-3 h-3" />
                            {new Date(booking.startTime).toLocaleDateString(
                              "de-DE"
                            )}{" "}
                            at{" "}
                            {new Date(booking.startTime).toLocaleTimeString(
                              "de-DE",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              }
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span className="font-medium">
                              {booking.staff?.name ||
                                booking.staff?.user?.name ||
                                "Unassigned"}
                            </span>
                          </div>
                          {booking.staff?.role && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {booking.staff.role}
                            </div>
                          )}
                        </div>

                        {/* Status */}
                        <div className="flex items-center">
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.toLowerCase().replace("_", " ")}
                          </Badge>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 lg:justify-end">
                          {booking.status === "PENDING" && (
                            <>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() =>
                                  handleUpdateBookingStatus(
                                    booking.id,
                                    "CONFIRMED"
                                  )
                                }
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleUpdateBookingStatus(
                                    booking.id,
                                    "CANCELLED"
                                  )
                                }
                                className="text-red-600 hover:text-red-700"
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {booking.status === "CONFIRMED" && (
                            <>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() =>
                                  handleUpdateBookingStatus(
                                    booking.id,
                                    "COMPLETED"
                                  )
                                }
                              >
                                Complete
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleUpdateBookingStatus(
                                    booking.id,
                                    "CANCELLED"
                                  )
                                }
                                className="text-red-600"
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          {(booking.status === "COMPLETED" ||
                            booking.status === "CANCELLED") && (
                            <Button variant="outline" size="sm" disabled>
                              {booking.status === "COMPLETED"
                                ? "Completed"
                                : "Cancelled"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="today" className="space-y-4">
              {loading ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
                    <p className="text-muted-foreground mt-4">
                      Loading bookings...
                    </p>
                  </CardContent>
                </Card>
              ) : bookings.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">
                      No bookings for today
                    </p>
                  </CardContent>
                </Card>
              ) : (
                bookings.map((booking) => (
                  <Card
                    key={booking.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${booking.user.name}`}
                            />
                            <AvatarFallback>
                              {booking.user.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{booking.user.name}</p>
                            {booking.user.phone && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="w-3 h-3" />
                                {booking.user.phone}
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">{booking.service.title}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <Clock className="w-3 h-3" />
                            {new Date(booking.startTime).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span className="font-medium">
                              {booking.staff?.name ||
                                booking.staff?.user?.name ||
                                "Unassigned"}
                            </span>
                          </div>
                          {booking.staff?.role && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {booking.staff.role}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center">
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.toLowerCase().replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 lg:justify-end">
                          {booking.status === "PENDING" && (
                            <>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() =>
                                  handleUpdateBookingStatus(
                                    booking.id,
                                    "CONFIRMED"
                                  )
                                }
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleUpdateBookingStatus(
                                    booking.id,
                                    "CANCELLED"
                                  )
                                }
                                className="text-red-600 hover:text-red-700"
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {booking.status === "CONFIRMED" && (
                            <>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() =>
                                  handleUpdateBookingStatus(
                                    booking.id,
                                    "COMPLETED"
                                  )
                                }
                              >
                                Complete
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleUpdateBookingStatus(
                                    booking.id,
                                    "CANCELLED"
                                  )
                                }
                                className="text-red-600"
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          {(booking.status === "COMPLETED" ||
                            booking.status === "CANCELLED") && (
                            <Button variant="outline" size="sm" disabled>
                              {booking.status === "COMPLETED"
                                ? "Completed"
                                : "Cancelled"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4">
              {loading ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
                    <p className="text-muted-foreground mt-4">
                      Loading bookings...
                    </p>
                  </CardContent>
                </Card>
              ) : bookings.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">
                      No upcoming bookings
                    </p>
                  </CardContent>
                </Card>
              ) : (
                bookings.map((booking) => (
                  <Card
                    key={booking.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${booking.user.name}`}
                            />
                            <AvatarFallback>
                              {booking.user.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{booking.user.name}</p>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">{booking.service.title}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <Clock className="w-3 h-3" />
                            {new Date(booking.startTime).toLocaleDateString(
                              "de-DE"
                            )}{" "}
                            at{" "}
                            {new Date(booking.startTime).toLocaleTimeString(
                              "de-DE",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              }
                            )}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.toLowerCase().replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 lg:justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowDetailsDialog(true);
                            }}
                          >
                            Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {loading ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
                    <p className="text-muted-foreground mt-4">
                      Loading bookings...
                    </p>
                  </CardContent>
                </Card>
              ) : bookings.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">
                      No completed bookings
                    </p>
                  </CardContent>
                </Card>
              ) : (
                bookings.map((booking) => (
                  <Card
                    key={booking.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${booking.user.name}`}
                            />
                            <AvatarFallback>
                              {booking.user.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{booking.user.name}</p>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">{booking.service.title}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <Clock className="w-3 h-3" />
                            {new Date(booking.startTime).toLocaleDateString(
                              "de-DE"
                            )}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.toLowerCase().replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 lg:justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowDetailsDialog(true);
                            }}
                          >
                            Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* Booking Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Customer</p>
                  <p className="font-medium">{selectedBooking.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedBooking.user.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedBooking.user.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <Badge className={getStatusColor(selectedBooking.status)}>
                    {selectedBooking.status.toLowerCase().replace("_", " ")}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Service</p>
                  <p className="font-medium">{selectedBooking.service.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedBooking.service.durationMinutes} minutes
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Price</p>
                  <p className="font-medium text-primary">
                    €
                    {typeof selectedBooking.service.price === "string"
                      ? parseFloat(selectedBooking.service.price).toFixed(2)
                      : (selectedBooking.service.price as number).toFixed(2)}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Date & Time
                  </p>
                  <p className="font-medium">
                    {new Date(selectedBooking.startTime).toLocaleDateString(
                      "de-DE"
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedBooking.startTime).toLocaleTimeString(
                      "de-DE",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      }
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Staff Member
                  </p>
                  <p className="font-medium">
                    {selectedBooking.staff?.name ||
                      selectedBooking.staff?.user?.name ||
                      "Not assigned"}
                  </p>
                </div>
              </div>

              {selectedBooking.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm">{selectedBooking.notes}</p>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-4">
                {selectedBooking.status === "PENDING" && (
                  <Button
                    onClick={() => {
                      handleUpdateBookingStatus(
                        selectedBooking.id,
                        "CONFIRMED"
                      );
                      setShowDetailsDialog(false);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Confirm Booking
                  </Button>
                )}
                {selectedBooking.status === "CONFIRMED" && (
                  <Button
                    onClick={() => {
                      handleUpdateBookingStatus(
                        selectedBooking.id,
                        "COMPLETED"
                      );
                      setShowDetailsDialog(false);
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Mark as Completed
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setShowDetailsDialog(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
