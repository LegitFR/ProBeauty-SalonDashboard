"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { useToast } from "../../../components/ui/use-toast";
import { Progress } from "../../../components/ui/progress";
import { Calendar } from "../../../components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Switch } from "../../../components/ui/switch";
import {
  Users,
  Plus,
  Search,
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  Star,
  TrendingUp,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Award,
  Target,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  UserPlus,
  Settings,
  Loader2,
} from "lucide-react";

interface Schedule {
  start: string;
  end: string;
  booked: number;
}

interface StaffMember {
  performance: any;
  id: string;
  name: string;
  userId: string | null;
  salonId: string;
  user?: {
    name: string;
    email?: string;
    phone?: string;
    avatar?: string;
  };
  role?: string;
  availability?: any;
  salon?: {
    name: string;
  };
  thisWeek?: Record<string, Schedule>;
  avatar?: string;
  email?: string;
  phone?: string;
}

export default function StaffPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [salonOperatingHours, setSalonOperatingHours] = useState<
    Record<string, { open: string; close: string; closed: boolean }>
  >({});
  const [services, setServices] = useState<any[]>([]);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Staff form state
  const [staffForm, setStaffForm] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    serviceId: "",
    availability: {
      monday: { enabled: true, start: "09:00", end: "17:00" },
      tuesday: { enabled: true, start: "09:00", end: "17:00" },
      wednesday: { enabled: true, start: "09:00", end: "17:00" },
      thursday: { enabled: true, start: "09:00", end: "17:00" },
      friday: { enabled: true, start: "09:00", end: "17:00" },
      saturday: { enabled: true, start: "10:00", end: "16:00" },
      sunday: { enabled: false, start: "10:00", end: "16:00" },
    },
  });

  // Helper function to generate time slots filtered by salon operating hours
  const getAvailableTimeSlots = (day: string): string[] => {
    const salonHours = salonOperatingHours[day];

    // If salon is closed on this day, return empty array
    if (!salonHours || salonHours.closed) {
      return [];
    }

    // Validate salon hours exist
    if (!salonHours.open || !salonHours.close) {
      return [];
    }

    // Parse salon hours
    const salonOpen = parseInt(salonHours.open.split(":")[0]);
    const salonClose = parseInt(salonHours.close.split(":")[0]);

    // Validate parsed hours
    if (isNaN(salonOpen) || isNaN(salonClose)) {
      return [];
    }

    // Generate time slots within salon operating hours
    const slots: string[] = [];
    for (let i = salonOpen; i <= salonClose; i++) {
      slots.push(`${i.toString().padStart(2, "0")}:00`);
    }

    return slots;
  };

  const handleAvailabilityChange = (day: string, field: string, value: any) => {
    // Prevent enabling days that are closed for the salon or not loaded
    if (field === "enabled" && value === true) {
      const salonHours = salonOperatingHours[day];

      // If salon hours not loaded yet
      if (!salonHours) {
        toast({
          title: "Loading salon hours",
          description: "Please wait for salon hours to load",
          variant: "destructive",
        });
        return;
      }

      // If salon is closed on this day
      if (salonHours.closed) {
        toast({
          title: "Salon closed",
          description: `The salon is closed on ${day}s`,
          variant: "destructive",
        });
        return;
      }
    }

    // Validate time slots are within salon operating hours
    if (field === "start" || field === "end") {
      const salonHours = salonOperatingHours[day];
      if (salonHours && !salonHours.closed) {
        const selectedHour = parseInt(value.split(":")[0]);
        const salonOpen = parseInt(salonHours.open.split(":")[0]);
        const salonClose = parseInt(salonHours.close.split(":")[0]);

        // Prevent selecting times outside salon hours
        if (selectedHour < salonOpen || selectedHour > salonClose) {
          toast({
            title: "Invalid time",
            description: `Time must be within salon operating hours (${salonHours.open} - ${salonHours.close})`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    setStaffForm((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day as keyof typeof prev.availability],
          [field]: value,
        },
      },
    }));
  };

  const handleAddStaff = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const salon = JSON.parse(localStorage.getItem("salon") || "{}");

      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please login to add staff",
          variant: "destructive",
        });
        return;
      }

      if (
        !staffForm.name ||
        !staffForm.role ||
        !staffForm.email ||
        !staffForm.serviceId
      ) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields including service",
          variant: "destructive",
        });
        return;
      }

      // Transform availability format
      const transformedAvailability: any = {};
      Object.entries(staffForm.availability).forEach(([day, schedule]) => {
        transformedAvailability[day] = {
          isAvailable: schedule.enabled,
          slots: schedule.enabled
            ? [{ start: schedule.start, end: schedule.end }]
            : [],
        };
      });

      const requestBody = {
        name: staffForm.name,
        salonId: salon.id,
        serviceId: staffForm.serviceId,
        availability: transformedAvailability,
      };

      const response = await fetch("/api/staff", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add staff member");
      }

      toast({
        title: "Success",
        description: "Staff member added successfully",
      });

      // Close dialog
      setIsAddDialogOpen(false);

      // Reset form
      setStaffForm({
        name: "",
        role: "",
        email: "",
        phone: "",
        serviceId: "",
        availability: {
          monday: { enabled: true, start: "09:00", end: "17:00" },
          tuesday: { enabled: true, start: "09:00", end: "17:00" },
          wednesday: { enabled: true, start: "09:00", end: "17:00" },
          thursday: { enabled: true, start: "09:00", end: "17:00" },
          friday: { enabled: true, start: "09:00", end: "17:00" },
          saturday: { enabled: true, start: "10:00", end: "16:00" },
          sunday: { enabled: false, start: "10:00", end: "16:00" },
        },
      });

      // Refresh staff list
      fetchStaff();
    } catch (error: any) {
      console.error("Error adding staff:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add staff member",
        variant: "destructive",
      });
    }
  };

  const handleEditStaff = (staff: StaffMember) => {
    setEditingStaff(staff);

    // Transform availability data to form format
    const transformedAvailability: any = {};
    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    days.forEach((day) => {
      const dayAvailability = staff.availability?.[day];
      if (dayAvailability) {
        transformedAvailability[day] = {
          enabled: dayAvailability.isAvailable || false,
          start: dayAvailability.slots?.[0]?.start || "09:00",
          end: dayAvailability.slots?.[0]?.end || "17:00",
        };
      } else {
        transformedAvailability[day] = {
          enabled: false,
          start: "09:00",
          end: "17:00",
        };
      }
    });

    setStaffForm({
      name: staff.name || staff.user?.name || "",
      role: staff.role || "",
      email: staff.email || staff.user?.email || "",
      phone: staff.phone || staff.user?.phone || "",
      serviceId: "", // Would need to get from staff.services if available
      availability: transformedAvailability,
    });

    setIsEditDialogOpen(true);
  };

  const handleUpdateStaff = async () => {
    if (!editingStaff) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please login to update staff",
          variant: "destructive",
        });
        return;
      }

      // Transform availability format
      const transformedAvailability: any = {};
      Object.entries(staffForm.availability).forEach(([day, schedule]) => {
        transformedAvailability[day] = {
          isAvailable: schedule.enabled,
          slots: schedule.enabled
            ? [{ start: schedule.start, end: schedule.end }]
            : [],
        };
      });

      const requestBody: any = {
        availability: transformedAvailability,
      };

      if (staffForm.serviceId) {
        requestBody.serviceId = staffForm.serviceId;
      }

      const response = await fetch(`/api/staff/${editingStaff.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Update response status:", response.status);
      const result = await response.json();
      console.log("Update response data:", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to update staff member");
      }

      toast({
        title: "Success",
        description: "Staff member updated successfully",
      });

      setIsEditDialogOpen(false);
      setEditingStaff(null);
      fetchStaff();
    } catch (error: any) {
      console.error("Error updating staff:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update staff member",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchSalonOperatingHours();
    fetchServices();
    fetchBookings();
    fetchReviews();
  }, []);

  // Fetch bookings from API
  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const token = localStorage.getItem("accessToken");
      const salon = JSON.parse(localStorage.getItem("salon") || "{}");

      if (!salon.id || !token) {
        console.log("No salon ID or token found");
        return;
      }

      const response = await fetch(`/api/bookings?salonId=${salon.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Bookings data:", result);
        setBookings(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoadingBookings(false);
    }
  };

  // Fetch reviews from API
  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const token = localStorage.getItem("accessToken");
      const salon = JSON.parse(localStorage.getItem("salon") || "{}");

      if (!salon.id || !token) {
        console.log("No salon ID or token found");
        return;
      }

      const response = await fetch(`/api/reviews/salon/${salon.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Reviews data:", result);
        setReviews(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Calculate staff metrics from bookings and reviews
  const calculateStaffMetrics = (staffId: string) => {
    console.log("Calculating metrics for staffId:", staffId);
    console.log("All bookings:", bookings);

    // Filter only completed bookings first (case-insensitive)
    const completedBookings = bookings.filter(
      (booking) => booking.status?.toLowerCase() === "completed"
    );

    console.log("All completed bookings:", completedBookings);

    // Filter completed bookings for this staff member
    const staffCompletedBookings = completedBookings.filter((booking) => {
      const matchesStaffId =
        booking.staffId === staffId || booking.staff?.id === staffId;
      console.log(
        `Booking ${booking.id}: staffId=${booking.staffId}, staff?.id=${booking.staff?.id}, matches=${matchesStaffId}`
      );
      return matchesStaffId;
    });

    console.log("Staff completed bookings:", staffCompletedBookings);

    // Calculate total revenue from completed bookings
    const revenue = staffCompletedBookings.reduce((sum, booking) => {
      // Get price from various possible sources
      let price = 0;

      if (booking.totalPrice) {
        price =
          typeof booking.totalPrice === "string"
            ? parseFloat(booking.totalPrice)
            : booking.totalPrice;
      } else if (booking.price) {
        price =
          typeof booking.price === "string"
            ? parseFloat(booking.price)
            : booking.price;
      } else if (booking.service?.price) {
        price =
          typeof booking.service.price === "string"
            ? parseFloat(booking.service.price)
            : booking.service.price;
      }

      // Handle NaN cases
      if (isNaN(price)) {
        price = 0;
      }

      console.log(`Booking ${booking.id} price:`, price);
      return sum + price;
    }, 0);

    console.log("Total revenue:", revenue);

    // Filter all bookings for this staff member (for total count)
    const staffBookings = bookings.filter(
      (booking) => booking.staffId === staffId || booking.staff?.id === staffId
    );

    // Get all booking IDs for this staff member
    const staffBookingIds = staffBookings.map((booking) => booking.id);
    console.log(`Staff ${staffId} booking IDs:`, staffBookingIds);

    // Filter reviews that are linked to this staff's bookings via bookingId
    const staffReviews = reviews.filter((review) => {
      // Reviews can be linked via bookingId
      const matchesBookingId =
        review.bookingId && staffBookingIds.includes(review.bookingId);
      // Or reviews might have staffId directly
      const matchesStaffId =
        review.staffId === staffId || review.staff?.id === staffId;
      return matchesBookingId || matchesStaffId;
    });

    console.log(`Staff ${staffId} reviews:`, staffReviews);
    console.log(`Total reviews for staff ${staffId}:`, staffReviews.length);
    console.log(`All reviews in system:`, reviews);

    // Calculate average rating from reviews
    const avgRating =
      staffReviews.length > 0
        ? staffReviews.reduce((sum, review) => {
            const rating =
              typeof review.rating === "string"
                ? parseFloat(review.rating)
                : review.rating || 0;
            return sum + rating;
          }, 0) / staffReviews.length
        : 0;

    console.log(`Average rating for staff ${staffId}:`, avgRating);

    // Calculate efficiency (percentage of completed bookings)
    const efficiency =
      staffBookings.length > 0
        ? (staffCompletedBookings.length / staffBookings.length) * 100
        : 0;

    return {
      bookings: staffBookings.length,
      revenue,
      satisfaction: avgRating,
      efficiency: Math.round(efficiency),
      completedBookings: staffCompletedBookings.length,
    };
  };

  // Get weekly schedule for a staff member
  const getWeeklySchedule = (staffId: string) => {
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = new Date();
    const weekSchedule: Record<string, Schedule> = {};

    daysOfWeek.forEach((day, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - today.getDay() + index + 1);

      const dayBookings = bookings.filter((booking) => {
        if (booking.staffId !== staffId) return false;
        const bookingDate = new Date(booking.date || booking.startTime);
        return bookingDate.toDateString() === date.toDateString();
      });

      if (dayBookings.length > 0) {
        const times = dayBookings.map((b) =>
          new Date(b.startTime || b.date).getHours()
        );
        const startHour = Math.min(...times);
        const endHour = Math.max(...times) + 1;

        weekSchedule[day] = {
          start: `${startHour.toString().padStart(2, "0")}:00`,
          end: `${endHour.toString().padStart(2, "0")}:00`,
          booked: dayBookings.length,
        };
      } else {
        weekSchedule[day] = {
          start: "OFF",
          end: "OFF",
          booked: 0,
        };
      }
    });

    return weekSchedule;
  };

  // Update staff form availability when salon hours are loaded or when opening Add dialog
  useEffect(() => {
    if (isAddDialogOpen && Object.keys(salonOperatingHours).length > 0) {
      const updatedAvailability: any = {};
      const days = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];

      days.forEach((day) => {
        const salonHours = salonOperatingHours[day];
        if (salonHours && !salonHours.closed) {
          // Salon is open on this day - enable with salon hours
          updatedAvailability[day] = {
            enabled: true,
            start: salonHours.open,
            end: salonHours.close,
          };
        } else {
          // Salon is closed on this day - disable
          updatedAvailability[day] = {
            enabled: false,
            start: "09:00",
            end: "17:00",
          };
        }
      });

      setStaffForm((prev) => ({
        ...prev,
        availability: updatedAvailability,
      }));
    }
  }, [isAddDialogOpen, salonOperatingHours]);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const salon = JSON.parse(localStorage.getItem("salon") || "{}");

      if (!salon.id) return;

      const response = await fetch(`/api/services/salon/${salon.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.ok) {
        const data = await response.json();
        setServices(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchSalonOperatingHours = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const salon = JSON.parse(localStorage.getItem("salon") || "{}");

      if (!salon.id) {
        console.error("No salon ID found");
        return;
      }

      const response = await fetch(`/api/salons/${salon.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Salon hours response:", result);

        const salonData = result.data;
        if (salonData && salonData.hours) {
          const allDays = [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ];
          const formattedHours: any = {};

          // Only add days that exist in salon data as open
          Object.keys(salonData.hours).forEach((day) => {
            formattedHours[day] = {
              ...salonData.hours[day],
              closed: false,
            };
          });

          // Mark days NOT in salon data as closed
          allDays.forEach((day) => {
            if (!salonData.hours[day]) {
              formattedHours[day] = {
                open: "00:00",
                close: "00:00",
                closed: true,
              };
            }
          });

          console.log("Formatted salon hours:", formattedHours);
          setSalonOperatingHours(formattedHours);
        }
      }
    } catch (error) {
      console.error("Error fetching salon hours:", error);
    }
  };

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const salon = JSON.parse(localStorage.getItem("salon") || "{}");
      const response = await fetch(`/api/salons/${salon.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const result = await response.json();
      console.log("Salon API Response:", result);

      if (!response.ok) {
        console.error("API Error Details:", result);
        throw new Error(result.message || "Failed to fetch salon details");
      }

      // Extract staff from salon data
      const staffData = result.data?.staff || [];
      setStaffMembers(Array.isArray(staffData) ? staffData : []);
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast({
        title: "Error",
        description: "Failed to load staff members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please login to delete staff",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`/api/staff/${staffId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete staff member");
      }

      toast({
        title: "Success",
        description: "Staff member deleted successfully",
      });

      fetchStaff();
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast({
        title: "Error",
        description: "Failed to delete staff member",
        variant: "destructive",
      });
    }
  };

  const oldStaffMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Senior Hair Stylist",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      email: "sarah@probeauty.com",
      phone: "(555) 123-4567",
      status: "active",
      schedule: "Full-time",
      rating: 4.9,
      specialties: ["Hair Color", "Cuts", "Styling"],
      performance: {
        bookings: 156,
        revenue: 8400,
        satisfaction: 4.9,
        efficiency: 92,
      },
      thisWeek: {
        Mon: { start: "9:00", end: "17:00", booked: 6 },
        Tue: { start: "9:00", end: "17:00", booked: 7 },
        Wed: { start: "9:00", end: "17:00", booked: 5 },
        Thu: { start: "9:00", end: "17:00", booked: 8 },
        Fri: { start: "9:00", end: "17:00", booked: 6 },
        Sat: { start: "8:00", end: "16:00", booked: 5 },
        Sun: { start: "OFF", end: "OFF", booked: 0 },
      },
    },
    {
      id: 2,
      name: "Marcus Williams",
      role: "Master Barber",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      email: "marcus@probeauty.com",
      phone: "(555) 234-5678",
      status: "active",
      schedule: "Full-time",
      rating: 4.8,
      specialties: ["Beard Trim", "Haircuts", "Styling"],
      performance: {
        bookings: 142,
        revenue: 7200,
        satisfaction: 4.8,
        efficiency: 88,
      },
      thisWeek: {
        Mon: { start: "10:00", end: "18:00", booked: 5 },
        Tue: { start: "10:00", end: "18:00", booked: 6 },
        Wed: { start: "10:00", end: "18:00", booked: 7 },
        Thu: { start: "10:00", end: "18:00", booked: 6 },
        Fri: { start: "10:00", end: "18:00", booked: 8 },
        Sat: { start: "9:00", end: "17:00", booked: 7 },
        Sun: { start: "OFF", end: "OFF", booked: 0 },
      },
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Nail Technician",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      email: "emily@probeauty.com",
      phone: "(555) 345-6789",
      status: "active",
      schedule: "Part-time",
      rating: 4.7,
      specialties: ["Manicure", "Pedicure", "Nail Art"],
      performance: {
        bookings: 98,
        revenue: 4600,
        satisfaction: 4.7,
        efficiency: 85,
      },
      thisWeek: {
        Mon: { start: "OFF", end: "OFF", booked: 0 },
        Tue: { start: "12:00", end: "20:00", booked: 4 },
        Wed: { start: "12:00", end: "20:00", booked: 5 },
        Thu: { start: "12:00", end: "20:00", booked: 3 },
        Fri: { start: "12:00", end: "20:00", booked: 6 },
        Sat: { start: "10:00", end: "18:00", booked: 5 },
        Sun: { start: "10:00", end: "16:00", booked: 3 },
      },
    },
    {
      id: 4,
      name: "David Chen",
      role: "Massage Therapist",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      email: "david@probeauty.com",
      phone: "(555) 456-7890",
      status: "on-leave",
      schedule: "Full-time",
      rating: 4.9,
      specialties: ["Deep Tissue", "Swedish", "Hot Stone"],
      performance: {
        bookings: 89,
        revenue: 5400,
        satisfaction: 4.9,
        efficiency: 94,
      },
      thisWeek: {
        Mon: { start: "LEAVE", end: "LEAVE", booked: 0 },
        Tue: { start: "LEAVE", end: "LEAVE", booked: 0 },
        Wed: { start: "LEAVE", end: "LEAVE", booked: 0 },
        Thu: { start: "LEAVE", end: "LEAVE", booked: 0 },
        Fri: { start: "LEAVE", end: "LEAVE", booked: 0 },
        Sat: { start: "LEAVE", end: "LEAVE", booked: 0 },
        Sun: { start: "LEAVE", end: "LEAVE", booked: 0 },
      },
    },
  ];

  const teamStats = [
    {
      label: "Total Staff",
      value: staffMembers.length.toString(),
      change: "+0",
      icon: Users,
    },
    {
      label: "Active Today",
      value: staffMembers.length.toString(),
      change: "+0",
      icon: CheckCircle,
    },
    {
      label: "Avg Rating",
      value:
        staffMembers.length > 0 && reviews.length > 0
          ? (
              reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
              reviews.length
            ).toFixed(1)
          : "0.0",
      change: "+0",
      icon: Star,
    },
    {
      label: "Team Revenue",
      value: (() => {
        // Calculate total revenue from completed bookings only
        const completedBookings = bookings.filter(
          (booking) => booking.status?.toLowerCase() === "completed"
        );

        const totalRevenue = completedBookings.reduce((sum, booking) => {
          let price = 0;

          if (booking.totalPrice) {
            price =
              typeof booking.totalPrice === "string"
                ? parseFloat(booking.totalPrice)
                : booking.totalPrice;
          } else if (booking.price) {
            price =
              typeof booking.price === "string"
                ? parseFloat(booking.price)
                : booking.price;
          } else if (booking.service?.price) {
            price =
              typeof booking.service.price === "string"
                ? parseFloat(booking.service.price)
                : booking.service.price;
          }

          return sum + (isNaN(price) ? 0 : price);
        }, 0);

        return totalRevenue > 0
          ? `€${(totalRevenue / 1000).toFixed(1)}K`
          : "€0";
      })(),
      change: "+0%",
      icon: DollarSign,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Active
          </Badge>
        );
      case "on-leave":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            On Leave
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            Inactive
          </Badge>
        );
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const filteredStaff = staffMembers.filter(
    (staff) =>
      (staff?.name || staff?.user?.name)
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      staff?.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-4 flex-col md:flex-row">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            Staff Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your team, schedules, and performance
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Staff Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] flex flex-col">
              <DialogHeader className="shrink-0">
                <DialogTitle>Add New Staff Member</DialogTitle>
                <DialogDescription>
                  Add a new team member to your salon
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 overflow-y-auto pr-2 flex-1">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={staffForm.name}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={staffForm.role}
                    onValueChange={(value) =>
                      setStaffForm({ ...staffForm, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stylist">Hair Stylist</SelectItem>
                      <SelectItem value="barber">Barber</SelectItem>
                      <SelectItem value="nail-tech">Nail Technician</SelectItem>
                      <SelectItem value="massage">Massage Therapist</SelectItem>
                      <SelectItem value="esthetician">Esthetician</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">Service *</Label>
                  <Select
                    value={staffForm.serviceId}
                    onValueChange={(value) =>
                      setStaffForm({ ...staffForm, serviceId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.length === 0 ? (
                        <SelectItem value="no-services" disabled>
                          No services available
                        </SelectItem>
                      ) : (
                        services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.title} - €{service.price}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={staffForm.email}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="(555) 123-4567"
                    value={staffForm.phone}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, phone: e.target.value })
                    }
                  />
                </div>

                {/* Working Hours Section */}
                <div className="space-y-3 pt-4 border-t">
                  <Label className="text-base font-semibold">
                    Working Hours
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Set available working hours for each day
                  </p>

                  <div className="space-y-3">
                    {Object.entries(staffForm.availability).map(
                      ([day, schedule]) => {
                        const salonDayHours = salonOperatingHours[day];
                        const isSalonClosed =
                          !salonDayHours || salonDayHours.closed === true;

                        return (
                          <div
                            key={day}
                            className="flex items-center gap-3 p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-2 min-w-[120px]">
                              <Switch
                                checked={schedule.enabled}
                                disabled={isSalonClosed}
                                onCheckedChange={(checked) =>
                                  handleAvailabilityChange(
                                    day,
                                    "enabled",
                                    checked
                                  )
                                }
                              />
                              <span className="text-sm font-medium capitalize">
                                {day}
                                {isSalonClosed && (
                                  <span className="text-xs text-muted-foreground ml-1">
                                    (Salon Closed)
                                  </span>
                                )}
                              </span>
                            </div>

                            {schedule.enabled && (
                              <div className="flex items-center gap-2 flex-1">
                                <Select
                                  value={schedule.start}
                                  onValueChange={(value) =>
                                    handleAvailabilityChange(
                                      day,
                                      "start",
                                      value
                                    )
                                  }
                                >
                                  <SelectTrigger className="w-[110px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getAvailableTimeSlots(day).map(
                                      (timeSlot) => (
                                        <SelectItem
                                          key={timeSlot}
                                          value={timeSlot}
                                        >
                                          {timeSlot}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                                <span className="text-sm text-muted-foreground">
                                  to
                                </span>
                                <Select
                                  value={schedule.end}
                                  onValueChange={(value) =>
                                    handleAvailabilityChange(day, "end", value)
                                  }
                                >
                                  <SelectTrigger className="w-[110px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getAvailableTimeSlots(day).map(
                                      (timeSlot) => (
                                        <SelectItem
                                          key={timeSlot}
                                          value={timeSlot}
                                        >
                                          {timeSlot}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            {!schedule.enabled && (
                              <span className="text-sm text-muted-foreground">
                                Day off
                              </span>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1" onClick={handleAddStaff}>
                    Add Staff Member
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Staff Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-md max-h-[90vh] flex flex-col">
              <DialogHeader className="shrink-0">
                <DialogTitle>Edit Staff Member</DialogTitle>
                <DialogDescription>
                  Update staff member information and availability
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 overflow-y-auto pr-2 flex-1">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    placeholder="Enter full name"
                    value={staffForm.name}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, name: e.target.value })
                    }
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Name cannot be changed
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-service">Service</Label>
                  <Select
                    value={staffForm.serviceId}
                    onValueChange={(value) =>
                      setStaffForm({ ...staffForm, serviceId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.length === 0 ? (
                        <SelectItem value="no-services" disabled>
                          No services available
                        </SelectItem>
                      ) : (
                        services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.title} - €{service.price}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Working Hours Section */}
                <div className="space-y-3 pt-4 border-t">
                  <Label className="text-base font-semibold">
                    Working Hours
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Update available working hours for each day
                  </p>

                  <div className="space-y-3">
                    {Object.entries(staffForm.availability).map(
                      ([day, schedule]) => {
                        const salonDayHours = salonOperatingHours[day];
                        const isSalonClosed =
                          !salonDayHours || salonDayHours.closed === true;

                        return (
                          <div
                            key={day}
                            className="flex items-center gap-3 p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-2 min-w-[120px]">
                              <Switch
                                checked={schedule.enabled}
                                disabled={isSalonClosed}
                                onCheckedChange={(checked) =>
                                  handleAvailabilityChange(
                                    day,
                                    "enabled",
                                    checked
                                  )
                                }
                              />
                              <span className="text-sm font-medium capitalize">
                                {day}
                                {isSalonClosed && (
                                  <span className="text-xs text-muted-foreground ml-1">
                                    (Salon Closed)
                                  </span>
                                )}
                              </span>
                            </div>

                            {schedule.enabled && (
                              <div className="flex items-center gap-2 flex-1">
                                <Select
                                  value={schedule.start}
                                  onValueChange={(value) =>
                                    handleAvailabilityChange(
                                      day,
                                      "start",
                                      value
                                    )
                                  }
                                >
                                  <SelectTrigger className="w-[110px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getAvailableTimeSlots(day).map(
                                      (timeSlot) => (
                                        <SelectItem
                                          key={timeSlot}
                                          value={timeSlot}
                                        >
                                          {timeSlot}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                                <span className="text-sm text-muted-foreground">
                                  to
                                </span>
                                <Select
                                  value={schedule.end}
                                  onValueChange={(value) =>
                                    handleAvailabilityChange(day, "end", value)
                                  }
                                >
                                  <SelectTrigger className="w-[110px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getAvailableTimeSlots(day).map(
                                      (timeSlot) => (
                                        <SelectItem
                                          key={timeSlot}
                                          value={timeSlot}
                                        >
                                          {timeSlot}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            {!schedule.enabled && (
                              <span className="text-sm text-muted-foreground">
                                Day off
                              </span>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1" onClick={handleUpdateStaff}>
                    Update Staff Member
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teamStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-green-600">
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">
            Team Overview
          </TabsTrigger>
          <TabsTrigger value="schedule" className="text-xs sm:text-sm">
            Schedule
          </TabsTrigger>
          <TabsTrigger value="performance" className="text-xs sm:text-sm">
            Performance
          </TabsTrigger>
          <TabsTrigger value="payroll" className="text-xs sm:text-sm">
            Payroll
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search staff members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Staff Grid */}
          {loading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
                <p className="text-muted-foreground mt-4">Loading staff...</p>
              </CardContent>
            </Card>
          ) : filteredStaff.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No staff members found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredStaff.map((staff) => (
                <Card
                  key={staff.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={
                              staff.user?.avatar ||
                              staff.avatar ||
                              `https://api.dicebear.com/7.x/initials/svg?seed=${
                                staff.name || staff.user?.name || "User"
                              }`
                            }
                            alt={staff.name || staff.user?.name || "User"}
                          />
                          <AvatarFallback>
                            {(staff.name || staff.user?.name || "U")
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">
                            {staff.name || staff.user?.name || "Unknown"}
                          </CardTitle>
                          <CardDescription>
                            {staff.role || "Staff Member"}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Active
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Contact Info */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {(staff.email || staff.user?.email) && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span className="truncate">
                              {staff.email || staff.user?.email}
                            </span>
                          </div>
                        )}
                        {(staff.phone || staff.user?.phone) && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{staff.phone || staff.user?.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Salon Info */}
                      {staff.salon && (
                        <div>
                          <p className="text-sm font-medium mb-2">Salon</p>
                          <Badge variant="outline" className="text-xs">
                            {staff.salon.name}
                          </Badge>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditStaff(staff)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteStaff(staff.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Schedule Calendar</CardTitle>
                <CardDescription>
                  Select a date to view schedules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Weekly Schedule */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>This Week's Schedule</CardTitle>
                <CardDescription>
                  Overview of staff schedules and bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loadingBookings ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-6 h-6 mx-auto animate-spin text-primary" />
                      <p className="text-muted-foreground mt-2">
                        Loading schedules...
                      </p>
                    </div>
                  ) : staffMembers.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No staff members found
                    </p>
                  ) : (
                    staffMembers.map((staff) => {
                      const weekSchedule = getWeeklySchedule(staff.id);
                      return (
                        <div key={staff.id} className="border rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src={staff.user?.avatar || staff.avatar}
                                alt={staff.name || staff.user?.name || "User"}
                              />
                              <AvatarFallback>
                                {(staff.name || staff.user?.name || "U")
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {staff.name || staff.user?.name || "Unknown"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {staff.role || "Staff Member"}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-7 gap-2 text-sm">
                            {Object.entries(weekSchedule).map(
                              ([day, schedule]) => (
                                <div key={day} className="text-center">
                                  <p className="font-medium text-xs text-muted-foreground mb-1">
                                    {day}
                                  </p>
                                  {schedule.start === "OFF" ? (
                                    <div className="p-1 bg-gray-100 rounded text-xs text-gray-700 font-medium">
                                      OFF
                                    </div>
                                  ) : schedule.start === "LEAVE" ? (
                                    <div className="p-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                                      LEAVE
                                    </div>
                                  ) : (
                                    <div className="space-y-1">
                                      <div className="p-1 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 font-medium">
                                        {schedule.start}-{schedule.end}
                                      </div>
                                      <div className="text-xs text-primary font-medium">
                                        {schedule.booked} booked
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {loadingBookings || loadingReviews ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
                <p className="text-muted-foreground mt-4">
                  Loading performance data...
                </p>
              </CardContent>
            </Card>
          ) : staffMembers.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No staff members found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {staffMembers.map((staff) => {
                const metrics = calculateStaffMetrics(staff.id);
                return (
                  <Card key={staff.id}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={staff.user?.avatar || staff.avatar}
                            alt={staff.name || staff.user?.name || "User"}
                          />
                          <AvatarFallback>
                            {(staff.name || staff.user?.name || "U")
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle>
                            {staff.name || staff.user?.name || "Unknown"}
                          </CardTitle>
                          <CardDescription>
                            {staff.role || "Staff Member"}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <p className="text-2xl font-bold">
                              {metrics.bookings}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Total Bookings
                            </p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-green-600">
                              €{metrics.revenue.toLocaleString("de-DE")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Revenue Generated
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Customer Satisfaction</span>
                              <span>{metrics.satisfaction.toFixed(1)}/5.0</span>
                            </div>
                            <Progress
                              value={metrics.satisfaction * 20}
                              className="h-2"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Efficiency</span>
                              <span>{metrics.efficiency}%</span>
                            </div>
                            <Progress
                              value={metrics.efficiency}
                              className="h-2"
                            />
                          </div>
                        </div>

                        {metrics.bookings > 0 && (
                          <div className="pt-2 border-t text-sm text-muted-foreground">
                            <p>
                              {metrics.completedBookings} completed out of{" "}
                              {metrics.bookings} total bookings
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="payroll" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Summary</CardTitle>
              <CardDescription>
                Current month payroll information based on bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingBookings ? (
                <div className="text-center py-8">
                  <Loader2 className="w-6 h-6 mx-auto animate-spin text-primary" />
                  <p className="text-muted-foreground mt-2">
                    Loading payroll data...
                  </p>
                </div>
              ) : staffMembers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No staff members found
                </p>
              ) : (
                <div className="space-y-4">
                  {staffMembers.map((staff) => {
                    const metrics = calculateStaffMetrics(staff.id);
                    const commission = metrics.revenue * 0.4; // 40% commission
                    return (
                      <div
                        key={staff.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={staff.user?.avatar || staff.avatar}
                              alt={staff.name || staff.user?.name || "User"}
                            />
                            <AvatarFallback>
                              {(staff.name || staff.user?.name || "U")
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {staff.name || staff.user?.name || "Unknown"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {staff.role || "Staff Member"} •{" "}
                              {metrics.bookings} bookings
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            €{commission.toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            40% of €{metrics.revenue.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total Payroll</span>
                      <span className="text-primary">
                        €
                        {staffMembers
                          .reduce((sum, staff) => {
                            const metrics = calculateStaffMetrics(staff.id);
                            return sum + metrics.revenue * 0.4;
                          }, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Based on {bookings.length} total bookings this period
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
