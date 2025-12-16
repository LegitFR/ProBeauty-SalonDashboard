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
  name: string;
  price: number;
  duration: number;
}

interface StaffMember {
  id: string;
  user: { name: string };
  role: string;
}

interface Booking {
  id: string;
  customer: { name: string; email?: string; phone?: string };
  service: { name: string };
  staff: { name: string };
  date: string;
  time: string;
  status: string;
  notes?: string;
}

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [showNewBookingDialog, setShowNewBookingDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  // Booking form state
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
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
        const today = new Date().toISOString().split("T")[0];
        params.append("startDate", today);
        params.append("endDate", today);
      } else if (activeTab === "upcoming") {
        params.append("status", "CONFIRMED");
        params.append("startDate", new Date().toISOString().split("T")[0]);
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
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      setBookings(data.bookings || []);
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

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("/api/services", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.ok) {
        const data = await response.json();
        setServices(data.services || []);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("/api/staff", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.ok) {
        const data = await response.json();
        setStaff(data.staff || []);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const fetchAvailability = async () => {
    try {
      if (!bookingForm.serviceId || !bookingForm.staffId || !bookingForm.date)
        return;

      const dateStr = format(bookingForm.date, "yyyy-MM-dd");
      const url = `/api/bookings/availability?serviceId=${bookingForm.serviceId}&staffId=${bookingForm.staffId}&date=${dateStr}`;

      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        setAvailableTimeSlots(data.availableSlots || []);
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
        return;
      }

      const bookingData = {
        serviceId: bookingForm.serviceId,
        staffId: bookingForm.staffId,
        date: format(bookingForm.date!, "yyyy-MM-dd"),
        time: bookingForm.time,
        customerName: bookingForm.customerName,
        customerEmail: bookingForm.customerEmail,
        customerPhone: bookingForm.customerPhone,
        notes: bookingForm.notes,
      };

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error("Failed to create booking");
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
    if (
      currentStep === 3 &&
      (!bookingForm.customerName ||
        !bookingForm.customerEmail ||
        !bookingForm.customerPhone)
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all customer details",
        variant: "destructive",
      });
      return;
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
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
    switch (status) {
      case "confirmed":
        return "bg-blue-500/10 text-blue-600";
      case "in-progress":
        return "bg-primary/10 text-primary";
      case "upcoming":
        return "bg-yellow-500/10 text-yellow-600";
      case "completed":
        return "bg-green-500/10 text-green-600";
      case "cancelled":
        return "bg-red-500/10 text-red-600";
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
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setShowNewBookingDialog(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Booking
        </Button>
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
                            <span className="font-medium">{service.name}</span>
                            <span className="text-sm text-muted-foreground ml-4">
                              ${(service.price || 0).toFixed(2)} •{" "}
                              {service.duration} min
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
                      {availableTimeSlots.map((slot) => (
                        <Button
                          key={slot}
                          variant={
                            bookingForm.time === slot ? "default" : "outline"
                          }
                          className={cn(
                            "h-12",
                            bookingForm.time === slot &&
                              "ring-2 ring-primary ring-offset-2"
                          )}
                          onClick={() =>
                            setBookingForm({ ...bookingForm, time: slot })
                          }
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          {slot}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Customer Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <span className="text-2xl">👤</span>
                  Customer Information
                </h3>
                <p className="text-sm text-muted-foreground">
                  Enter the customer's contact details for booking confirmation
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="customerName"
                    className="text-base font-semibold"
                  >
                    Full Name *
                  </Label>
                  <Input
                    id="customerName"
                    placeholder="John Doe"
                    className="mt-2 h-12"
                    value={bookingForm.customerName}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        customerName: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label
                    htmlFor="customerEmail"
                    className="text-base font-semibold"
                  >
                    Email Address *
                  </Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    placeholder="john@example.com"
                    className="mt-2 h-12"
                    value={bookingForm.customerEmail}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        customerEmail: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label
                    htmlFor="customerPhone"
                    className="text-base font-semibold"
                  >
                    Phone Number *
                  </Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="mt-2 h-12"
                    value={bookingForm.customerPhone}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        customerPhone: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="notes" className="text-base font-semibold">
                    Special Notes (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special requests or notes..."
                    className="mt-2 min-h-24"
                    value={bookingForm.notes}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, notes: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-100">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  Review Your Booking
                </h3>
                <p className="text-sm text-muted-foreground">
                  Please review all details before confirming
                </p>
              </div>

              <div className="space-y-4">
                <Card className="border-2">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xl">💇</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Service</p>
                        <p className="font-semibold">{selectedService?.name}</p>
                        <p className="text-sm text-primary">
                          ${(selectedService?.price || 0).toFixed(2)} •{" "}
                          {selectedService?.duration} minutes
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-xl">👤</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">
                          Staff Member
                        </p>
                        <p className="font-semibold">
                          {selectedStaff?.user.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedStaff?.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-xl">📅</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">
                          Date & Time
                        </p>
                        <p className="font-semibold">
                          {bookingForm.date &&
                            format(bookingForm.date, "MMMM dd, yyyy")}
                        </p>
                        <p className="text-sm text-primary">
                          {bookingForm.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-xl">👥</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">
                          Customer
                        </p>
                        <p className="font-semibold">
                          {bookingForm.customerName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {bookingForm.customerEmail}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {bookingForm.customerPhone}
                        </p>
                      </div>
                    </div>

                    {bookingForm.notes && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-xl">📝</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Notes</p>
                          <p className="text-sm">{bookingForm.notes}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
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

              {currentStep < 4 ? (
                <Button onClick={handleNextStep} className="min-w-24">
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleCreateBooking}
                  disabled={submitting}
                  className="min-w-24 bg-primary hover:bg-primary/90"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">✓</span>
                      Confirm Booking
                    </>
                  )}
                </Button>
              )}
            </div>
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
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Calendar View
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
          ) : bookings.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No bookings found</p>
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
                    {/* Customer Info */}
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${booking.customer.name}`}
                        />
                        <AvatarFallback>
                          {booking.customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{booking.customer.name}</p>
                        {booking.customer.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            {booking.customer.phone}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Service & Time */}
                    <div>
                      <p className="font-medium">{booking.service.name}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Clock className="w-3 h-3" />
                        {new Date(booking.date).toLocaleDateString()} at{" "}
                        {booking.time}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {booking.staff.name}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.toLowerCase().replace("_", " ")}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 lg:justify-end">
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                      <Button variant="outline" size="sm">
                        Contact
                      </Button>
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        <strong>Notes:</strong> {booking.notes}
                      </p>
                    </div>
                  )}
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
                <p className="text-muted-foreground">No bookings for today</p>
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
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${booking.customer.name}`}
                        />
                        <AvatarFallback>
                          {booking.customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{booking.customer.name}</p>
                        {booking.customer.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            {booking.customer.phone}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{booking.service.name}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Clock className="w-3 h-3" />
                        {booking.time}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {booking.staff.name}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.toLowerCase().replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 lg:justify-end">
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
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
                <p className="text-muted-foreground">No upcoming bookings</p>
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
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${booking.customer.name}`}
                        />
                        <AvatarFallback>
                          {booking.customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{booking.customer.name}</p>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{booking.service.name}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Clock className="w-3 h-3" />
                        {new Date(booking.date).toLocaleDateString()} at{" "}
                        {booking.time}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.toLowerCase().replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 lg:justify-end">
                      <Button variant="outline" size="sm">
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
                <p className="text-muted-foreground">No completed bookings</p>
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
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${booking.customer.name}`}
                        />
                        <AvatarFallback>
                          {booking.customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{booking.customer.name}</p>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{booking.service.name}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Clock className="w-3 h-3" />
                        {new Date(booking.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.toLowerCase().replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 lg:justify-end">
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
