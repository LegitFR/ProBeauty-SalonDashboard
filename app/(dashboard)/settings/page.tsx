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
import { Label } from "../../../components/ui/label";
import { toast } from "sonner";
import { Toaster } from "../../../components/ui/sonner";
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
import { Switch } from "../../../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { Separator } from "../../../components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import {
  Settings,
  User,
  Building,
  Building2,
  Bell,
  Shield,
  CreditCard,
  Users,
  Calendar,
  Palette,
  Globe,
  Smartphone,
  Mail,
  MessageSquare,
  Cloud,
  Database,
  Key,
  Download,
  Upload,
  Trash2,
  Edit,
  Save,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Camera,
  Zap,
  Plus,
  Home,
  Star,
  Eye,
  EyeOff,
} from "lucide-react";

interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface StaffMember {
  id: string;
  name?: string;
  role: string;
  isAvailable?: boolean;
  availability?: string[];
  serviceId?: string;
  user?: {
    name: string;
    email: string;
    phone?: string;
  };
}

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password change form states
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // Logo upload states
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Address management states
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showAddressDialog, setShowAddressDialog] = useState(false);

  // Staff/Team management states
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [salon, setSalon] = useState<any>(null);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
  });

  // User profile and salon states
  const [userProfile, setUserProfile] = useState<any>(null);
  const [salonData, setSalonData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Editable form states
  const [editableBusinessInfo, setEditableBusinessInfo] = useState<any>({});
  const [editableHours, setEditableHours] = useState<any>({});

  // Delete account states
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Reset data states
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState("");
  const [resettingData, setResettingData] = useState(false);

  // Compute business info - this will update when salonData or userProfile changes
  const getBusinessInfo = () => {
    // Get default address if available
    const defaultAddress = addresses.find((addr) => addr.isDefault);
    console.log("🏠 Default address:", defaultAddress);
    console.log("📍 All addresses:", addresses);

    const addressString = defaultAddress
      ? `${defaultAddress.addressLine1}, ${defaultAddress.city}, ${defaultAddress.state} ${defaultAddress.postalCode}, ${defaultAddress.country}`
      : salonData?.address || "123 Beauty Street, Los Angeles, CA 90210";

    return {
      name: salonData?.name || userProfile?.name || "Luxe Beauty Salon",
      address: addressString,
      phone: salonData?.phone || userProfile?.phone || "(555) 123-4567",
      email: userProfile?.email || "info@luxebeauty.com",
      website: "www.luxebeauty.com",
      description:
        "Premium beauty salon offering comprehensive hair, nail, and wellness services.",
      logo:
        salonData?.thumbnail ||
        salon?.thumbnail ||
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop",
      timezone: "America/Los_Angeles",
      currency: "USD",
    };
  };

  const [businessInfo, setBusinessInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    logo: "",
    timezone: "",
    currency: "",
  });
  useEffect(() => {
    const info = getBusinessInfo();
    setBusinessInfo(info);
    setEditableBusinessInfo(info);
  }, [salonData, userProfile, addresses]);

  useEffect(() => {
    setEditableHours(getOperatingHours());
  }, [salonData]);

  // Convert salon hours to display format with closed flag
  const getOperatingHours = () => {
    const defaultHours = {
      monday: { open: "09:00", close: "18:00", closed: false },
      tuesday: { open: "09:00", close: "18:00", closed: false },
      wednesday: { open: "09:00", close: "18:00", closed: false },
      thursday: { open: "09:00", close: "19:00", closed: false },
      friday: { open: "09:00", close: "19:00", closed: false },
      saturday: { open: "08:00", close: "17:00", closed: false },
      sunday: { open: "10:00", close: "16:00", closed: false },
    };

    if (salonData?.hours) {
      const formattedHours: any = { ...defaultHours };

      // Update with salon data - days present in salon data are open
      Object.keys(salonData.hours).forEach((day) => {
        formattedHours[day] = {
          ...salonData.hours[day],
          closed: false,
        };
      });

      // Mark days NOT in salon data as closed
      Object.keys(defaultHours).forEach((day) => {
        if (!salonData.hours[day]) {
          formattedHours[day] = {
            ...defaultHours[day as keyof typeof defaultHours],
            closed: true,
          };
        }
      });

      return formattedHours;
    }

    return defaultHours;
  };

  const operatingHours = getOperatingHours();

  const integrations = [
    {
      name: "Google Calendar",
      description: "Sync appointments with Google Calendar",
      status: "connected",
      icon: Calendar,
      lastSync: "2 minutes ago",
    },
    {
      name: "Stripe",
      description: "Payment processing integration",
      status: "connected",
      icon: CreditCard,
      lastSync: "1 hour ago",
    },
    {
      name: "Mailchimp",
      description: "Email marketing automation",
      status: "not-connected",
      icon: Mail,
      lastSync: null,
    },
    {
      name: "QuickBooks",
      description: "Accounting and bookkeeping",
      status: "not-connected",
      icon: Database,
      lastSync: null,
    },
    {
      name: "Instagram",
      description: "Social media integration",
      status: "connected",
      icon: Smartphone,
      lastSync: "30 minutes ago",
    },
  ];

  // Fetch salon and staff data
  useEffect(() => {
    fetchSalon();
  }, []);

  useEffect(() => {
    if (salon?.id) {
      fetchStaff();
    }
  }, [salon]);

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

  const fetchStaff = async () => {
    try {
      setLoadingStaff(true);
      const token = localStorage.getItem("accessToken");
      if (!token || !salon?.id) return;

      const response = await fetch(`/api/salons/${salon.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data?.staff) {
          setStaffMembers(data.data.staff);
          console.log("Fetched staff members:", data.data.staff);
        }
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoadingStaff(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Connected
          </Badge>
        );
      case "not-connected":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            Not Connected
          </Badge>
        );
      case "error":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Error
          </Badge>
        );
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    const normalizedRole = role?.toLowerCase() || "";

    if (normalizedRole.includes("owner")) {
      return (
        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
          Owner
        </Badge>
      );
    }
    if (normalizedRole.includes("manager")) {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          Manager
        </Badge>
      );
    }
    if (
      normalizedRole.includes("stylist") ||
      normalizedRole.includes("staff") ||
      normalizedRole.includes("employee")
    ) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Staff
        </Badge>
      );
    }
    // Default to Staff for any other role
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        Staff
      </Badge>
    );
  };

  // Fetch addresses, user profile, and salon data on component mount
  useEffect(() => {
    fetchAddresses();
    fetchUserProfile();
    fetchSalonData();
  }, []);

  // Debug: Log when addresses state changes
  useEffect(() => {
    console.log("🔄 Addresses state changed:", addresses);
  }, [addresses]);

  const fetchUserProfile = async () => {
    try {
      // Get user data from localStorage (set during login)
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsed = JSON.parse(userData);
        console.log("User profile loaded from storage:", parsed);
        setUserProfile(parsed);
      } else {
        console.error("No user data found in localStorage");
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  const fetchSalonData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No access token found");
        return;
      }

      const response = await fetch("/api/salons/my-salons", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok && data.data && data.data.length > 0) {
        const salon = data.data[0]; // Get first salon
        console.log("Salon data fetched from API:", salon);
        setSalonData(salon);
      } else {
        console.error("Failed to fetch salon data:", data.message);
      }
    } catch (error) {
      console.error("Failed to fetch salon data:", error);
    }
  };

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.error("No access token found");
        toast.error("Please login to view addresses");
        return;
      }

      console.log(
        "🔵 Fetching addresses with token:",
        token.substring(0, 20) + "..."
      );

      const response = await fetch("/api/addresses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("📦 Addresses API response:", data);

      if (response.ok) {
        const addressList = data.data || [];
        console.log("✅ Setting addresses:", addressList);
        setAddresses(addressList);

        console.log("📍 Addresses state will be:", addressList);
      } else {
        console.error("❌ Failed to fetch addresses:", data.message);
        toast.error(data.message || "Failed to load addresses");
      }
    } catch (error: any) {
      console.error("❌ Failed to fetch addresses:", error);
      toast.error(error.message || "Failed to load addresses");
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleSaveAddress = async () => {
    try {
      // Validate form
      if (
        !addressForm.fullName ||
        !addressForm.phone ||
        !addressForm.addressLine1 ||
        !addressForm.city ||
        !addressForm.state ||
        !addressForm.postalCode
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const url = editingAddress
        ? `/api/addresses/${editingAddress.id}`
        : "/api/addresses";
      const method = editingAddress ? "PATCH" : "POST";

      // Prepare the payload - ensure all fields are strings and trimmed
      const payload: any = {
        fullName: addressForm.fullName.trim(),
        phone: addressForm.phone.trim(),
        addressLine1: addressForm.addressLine1.trim(),
        city: addressForm.city.trim(),
        state: addressForm.state.trim(),
        postalCode: addressForm.postalCode.trim(),
        country: addressForm.country.trim(),
      };

      // Add optional addressLine2 if provided
      if (addressForm.addressLine2 && addressForm.addressLine2.trim()) {
        payload.addressLine2 = addressForm.addressLine2.trim();
      }

      console.log("💾 Saving address:", {
        method,
        url,
        payload,
      });

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("📨 Save address response:", {
        status: response.status,
        data,
      });

      if (response.ok) {
        await fetchAddresses();
        setShowAddressDialog(false);
        setEditingAddress(null);
        setAddressForm({
          fullName: "",
          phone: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          postalCode: "",
          country: "United States",
        });
        toast.success(
          editingAddress
            ? "Address updated successfully"
            : "Address added successfully"
        );
      } else {
        console.error("❌ Save failed:", data);
        // Show more detailed error message
        const errorMsg = data.message || data.error || "Failed to save address";
        const validationErrors = data.errors || data.validationErrors;

        if (validationErrors) {
          console.error("Validation errors:", validationErrors);
          toast.error(`Validation failed: ${JSON.stringify(validationErrors)}`);
        } else {
          toast.error(errorMsg);
        }
      }
    } catch (error: any) {
      console.error("❌ Failed to save address:", error);
      toast.error(error.message || "Failed to save address");
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressForm({
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    });
    setShowAddressDialog(true);
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch(`/api/addresses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        await fetchAddresses();
        toast.success("Address deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete address");
      }
    } catch (error: any) {
      console.error("Failed to delete address:", error);
      toast.error(error.message || "Failed to delete address");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch(`/api/addresses/${id}/set-default`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        await fetchAddresses();
        toast.success("Default address updated successfully");
      } else {
        toast.error(data.message || "Failed to set default address");
      }
    } catch (error: any) {
      console.error("Failed to set default address:", error);
      toast.error(error.message || "Failed to set default address");
    }
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setAddressForm({
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "United States",
    });
    setShowAddressDialog(true);
  };

  const handleBusinessInfoChange = (field: string, value: string) => {
    setEditableBusinessInfo((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleHoursChange = (day: string, field: string, value: any) => {
    setEditableHours((prev: any) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile || !salon?.id) {
      toast.error("Please select an image first");
      return;
    }

    setUploadingLogo(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Please login to update logo");
        return;
      }

      const formData = new FormData();
      formData.append("thumbnail", logoFile);

      console.log("📤 Uploading logo for salon:", salon.id);

      const response = await fetch(`/api/salons/${salon.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log("📥 Logo upload response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload logo");
      }

      toast.success("Logo updated successfully!");

      // Update both salon states
      setSalon(data.data);
      setSalonData(data.data);
      setLogoFile(null);
      setLogoPreview("");

      // Update business info with new thumbnail
      setBusinessInfo((prev) => ({
        ...prev,
        logo: data.data.thumbnail,
      }));
    } catch (error: any) {
      console.error("Error uploading logo:", error);
      toast.error(error.message || "Failed to upload logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handlePasswordChange = async () => {
    setChangingPassword(true);
    try {
      const userEmail = userProfile?.email;

      if (!userEmail) {
        toast.error("Please login to change password");
        return;
      }

      // Validate passwords
      if (
        !passwordForm.currentPassword ||
        !passwordForm.newPassword ||
        !passwordForm.confirmPassword
      ) {
        toast.error("Please fill in all password fields");
        return;
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }

      if (passwordForm.newPassword.length < 6) {
        toast.error("New password must be at least 6 characters");
        return;
      }

      // Step 1: Request OTP
      toast.info("Sending OTP to your email...");
      const otpResponse = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          step: "request-otp",
        }),
      });

      const otpData = await otpResponse.json();

      if (!otpResponse.ok) {
        toast.error(
          `Failed to send OTP: ${
            otpData.message || "Email service error. Please try again later."
          }`
        );
        return;
      }

      // Step 2: Prompt for OTP
      toast.success("OTP sent to your email!");
      const otp = prompt("Please enter the 6-digit OTP sent to your email:");

      if (!otp) {
        toast.info("Password change cancelled");
        return;
      }

      // Step 3: Reset password with OTP
      const resetResponse = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          step: "reset-password",
          otp: otp.trim(),
          newPassword: passwordForm.newPassword,
        }),
      });

      const resetData = await resetResponse.json();

      if (resetResponse.ok) {
        toast.success(
          "Password changed successfully! Please login again with your new password."
        );
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Logout user and redirect to login
        setTimeout(() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.location.href = "/auth";
        }, 2000);
      } else {
        toast.error(
          `Failed to change password: ${
            resetData.message || "Invalid or expired OTP. Please try again."
          }`
        );
      }
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(`Error changing password: ${error.message}`);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error('Please type "DELETE" to confirm');
      return;
    }

    setDeletingAccount(true);
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Please login to delete account");
        return;
      }

      const response = await fetch("/api/users/me", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Account deleted successfully");
        // Clear all local storage
        localStorage.clear();
        // Redirect to home page after a short delay
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to delete account");
      }
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast.error(`Error deleting account: ${error.message}`);
    } finally {
      setDeletingAccount(false);
      setShowDeleteDialog(false);
      setDeleteConfirmText("");
    }
  };

  const handleResetData = async () => {
    if (resetConfirmText !== "RESET") {
      toast.error('Please type "RESET" to confirm');
      return;
    }

    setResettingData(true);
    let deletedCount = 0;
    const errors: string[] = [];

    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Please login to reset data");
        return;
      }

      if (!salon?.id) {
        toast.error("Salon information not found");
        return;
      }

      toast.info("Starting data reset...");

      // 1. Delete all bookings
      try {
        const bookingsResponse = await fetch("/api/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          const bookings = bookingsData.data || [];

          for (const booking of bookings) {
            try {
              const deleteResponse = await fetch(
                `/api/bookings/${booking.id}`,
                {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              if (deleteResponse.ok) deletedCount++;
            } catch (error) {
              console.error(`Failed to delete booking ${booking.id}:`, error);
            }
          }
          console.log(`Deleted ${bookings.length} bookings`);
        }
      } catch (error) {
        console.error("Error deleting bookings:", error);
        errors.push("Some bookings could not be deleted");
      }

      // 2. Delete all customers (if endpoint exists)
      try {
        const customersResponse = await fetch("/api/customers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (customersResponse.ok) {
          const customersData = await customersResponse.json();
          const customers = customersData.data || [];

          for (const customer of customers) {
            try {
              const deleteResponse = await fetch(
                `/api/customers/${customer.id}`,
                {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              if (deleteResponse.ok) deletedCount++;
            } catch (error) {
              console.error(`Failed to delete customer ${customer.id}:`, error);
            }
          }
          console.log(`Deleted ${customers.length} customers`);
        }
      } catch (error) {
        console.error("Error deleting customers:", error);
        errors.push("Some customers could not be deleted");
      }

      // 3. Delete all services
      try {
        const servicesResponse = await fetch(
          `/api/services/salon/${salon.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          const services = servicesData.data || [];

          for (const service of services) {
            try {
              const deleteResponse = await fetch(
                `/api/services/${service.id}`,
                {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              if (deleteResponse.ok) deletedCount++;
            } catch (error) {
              console.error(`Failed to delete service ${service.id}:`, error);
            }
          }
          console.log(`Deleted ${services.length} services`);
        }
      } catch (error) {
        console.error("Error deleting services:", error);
        errors.push("Some services could not be deleted");
      }

      // 4. Delete all orders (if endpoint exists)
      try {
        const ordersResponse = await fetch("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          const orders = ordersData.data || [];

          for (const order of orders) {
            try {
              const deleteResponse = await fetch(`/api/orders/${order.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              });
              if (deleteResponse.ok) deletedCount++;
            } catch (error) {
              console.error(`Failed to delete order ${order.id}:`, error);
            }
          }
          console.log(`Deleted ${orders.length} orders`);
        }
      } catch (error) {
        console.error("Error deleting orders:", error);
        // Orders might not exist, so don't add to errors
      }

      // 5. Delete all products (if endpoint exists)
      try {
        const productsResponse = await fetch(
          `/api/products/salon/${salon.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          const products = productsData.data || [];

          for (const product of products) {
            try {
              const deleteResponse = await fetch(
                `/api/products/${product.id}`,
                {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              if (deleteResponse.ok) deletedCount++;
            } catch (error) {
              console.error(`Failed to delete product ${product.id}:`, error);
            }
          }
          console.log(`Deleted ${products.length} products`);
        }
      } catch (error) {
        console.error("Error deleting products:", error);
        // Products might not exist, so don't add to errors
      }

      if (errors.length > 0) {
        toast.warning(
          `Data reset completed with warnings. ${deletedCount} items deleted. ${errors.join(
            ", "
          )}`
        );
      } else {
        toast.success(
          `All data reset successfully! ${deletedCount} items deleted.`
        );
      }

      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.error("Error resetting data:", error);
      toast.error(`Error resetting data: ${error.message}`);
    } finally {
      setResettingData(false);
      setShowResetDialog(false);
      setResetConfirmText("");
    }
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("accessToken");
      const salonId = salonData?.id;

      if (!token || !salonId) {
        alert("Unable to save: Missing authentication or salon information");
        return;
      }

      // Prepare update payload
      const updateData: any = {
        name: editableBusinessInfo.name,
        address: editableBusinessInfo.address,
        phone: editableBusinessInfo.phone,
      };

      // Add optional fields if they exist
      if (editableBusinessInfo.website) {
        updateData.website = editableBusinessInfo.website;
      }
      if (editableBusinessInfo.description) {
        updateData.description = editableBusinessInfo.description;
      }

      // Convert hours back to API format (remove closed flag)
      const hoursForApi: any = {};
      Object.keys(editableHours).forEach((day) => {
        if (!editableHours[day].closed) {
          hoursForApi[day] = {
            open: editableHours[day].open,
            close: editableHours[day].close,
          };
        }
      });
      updateData.hours = hoursForApi;

      console.log("Saving salon updates:", updateData);

      const response = await fetch(`/api/salons/${salonId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        // Update localStorage with new data
        localStorage.setItem("salon", JSON.stringify(data.data));
        setSalonData(data.data);
        alert("Settings saved successfully!");
      } else {
        alert(`Failed to save: ${data.message || "Unknown error"}`);
      }
    } catch (error: any) {
      console.error("Error saving settings:", error);
      alert(`Error saving settings: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-4 flex-col md:flex-row">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure your salon settings and preferences
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={handleSaveChanges}
          disabled={saving}
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      <Tabs defaultValue="business" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto">
          <TabsTrigger value="business" className="text-xs sm:text-sm">
            Business
          </TabsTrigger>
          <TabsTrigger value="team" className="text-xs sm:text-sm">
            Team & Permissions
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs sm:text-sm">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="integrations" className="text-xs sm:text-sm">
            Integrations
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs sm:text-sm">
            Security
          </TabsTrigger>
          <TabsTrigger value="data" className="text-xs sm:text-sm">
            Data & Backup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary" />
                  Business Information
                </CardTitle>
                <CardDescription>
                  Update your salon's basic information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage
                      src={logoPreview || businessInfo.logo || salon?.thumbnail}
                      alt="Business Logo"
                    />
                    <AvatarFallback>LB</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <input
                      type="file"
                      id="logo-upload"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("logo-upload")?.click()
                        }
                        disabled={uploadingLogo}
                      >
                        <Camera className="w-3 h-3 mr-1" />
                        {logoFile ? "Change" : "Select"} Logo
                      </Button>
                      {logoFile && (
                        <Button
                          size="sm"
                          onClick={handleLogoUpload}
                          disabled={uploadingLogo}
                        >
                          {uploadingLogo ? "Uploading..." : "Upload"}
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, WebP up to 5MB
                    </p>
                    {logoFile && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ {logoFile.name} selected
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={editableBusinessInfo.name || ""}
                    onChange={(e) =>
                      handleBusinessInfoChange("name", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Address</Label>
                  <div className="relative">
                    <Textarea
                      id="businessAddress"
                      value={editableBusinessInfo.address || ""}
                      onChange={(e) =>
                        handleBusinessInfoChange("address", e.target.value)
                      }
                      className="resize-none"
                      rows={2}
                      disabled
                    />
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-1">
                        This displays your default address. Manage addresses in
                        the Security tab.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessPhone">Phone</Label>
                    <Input
                      id="businessPhone"
                      value={editableBusinessInfo.phone || ""}
                      onChange={(e) =>
                        handleBusinessInfoChange("phone", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessEmail">Email</Label>
                    <Input
                      id="businessEmail"
                      type="email"
                      defaultValue={businessInfo.email}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessWebsite">Website</Label>
                  <Input
                    id="businessWebsite"
                    value={editableBusinessInfo.website || ""}
                    onChange={(e) =>
                      handleBusinessInfoChange("website", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessDescription">Description</Label>
                  <Textarea
                    id="businessDescription"
                    value={editableBusinessInfo.description || ""}
                    onChange={(e) =>
                      handleBusinessInfoChange("description", e.target.value)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Operating Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Operating Hours
                </CardTitle>
                <CardDescription>
                  Set your business hours for each day
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(operatingHours).map(
                  ([day, hours]: [string, any]) => (
                    <div
                      key={day}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-20 text-sm font-medium capitalize">
                          {day}
                        </span>
                        <Switch
                          checked={!editableHours[day]?.closed}
                          onCheckedChange={(checked) =>
                            handleHoursChange(day, "closed", !checked)
                          }
                        />
                      </div>
                      {!editableHours[day]?.closed ? (
                        <div className="flex items-center gap-2">
                          <Select
                            value={editableHours[day]?.open || hours.open}
                            onValueChange={(value) =>
                              handleHoursChange(day, "open", value)
                            }
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 24 }, (_, i) => (
                                <SelectItem
                                  key={i}
                                  value={`${i.toString().padStart(2, "0")}:00`}
                                >
                                  {`${i.toString().padStart(2, "0")}:00`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span className="text-sm text-muted-foreground">
                            to
                          </span>
                          <Select
                            value={editableHours[day]?.close || hours.close}
                            onValueChange={(value) =>
                              handleHoursChange(day, "close", value)
                            }
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 24 }, (_, i) => (
                                <SelectItem
                                  key={i}
                                  value={`${i.toString().padStart(2, "0")}:00`}
                                >
                                  {`${i.toString().padStart(2, "0")}:00`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Closed
                        </span>
                      )}
                    </div>
                  )
                )}
              </CardContent>
            </Card>

            {/* Regional Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Regional Settings
                </CardTitle>
                <CardDescription>
                  Timezone and currency preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select defaultValue={businessInfo.timezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Los_Angeles">
                        Pacific Time (PT)
                      </SelectItem>
                      <SelectItem value="America/Denver">
                        Mountain Time (MT)
                      </SelectItem>
                      <SelectItem value="America/Chicago">
                        Central Time (CT)
                      </SelectItem>
                      <SelectItem value="America/New_York">
                        Eastern Time (ET)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select defaultValue={businessInfo.currency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select defaultValue="MM/DD/YYYY">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Branding */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  Branding & Appearance
                </CardTitle>
                <CardDescription>
                  Customize your salon's look and feel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Dark Mode</span>
                    <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded border"></div>
                    <Input defaultValue="#FF6A00" className="flex-1" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Booking Widget Style</Label>
                  <Select defaultValue="modern">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Team Members
              </CardTitle>
              <CardDescription>
                Manage team access and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingStaff ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading team members...
                </div>
              ) : staffMembers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No team members found
                </div>
              ) : (
                <div className="space-y-4">
                  {staffMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {(member.name || member.user?.name || "U")
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {member.name || member.user?.name || "Unknown"}
                          </p>
                          <div className="space-y-0.5">
                            <p className="text-sm text-muted-foreground">
                              {member.user?.email || "No email provided"}
                            </p>
                            {member.user?.phone && (
                              <p className="text-xs text-muted-foreground">
                                {member.user.phone}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {getRoleBadge(member.role)}
                            <span className="text-xs text-muted-foreground">
                              {member.isAvailable ? "Available" : "Unavailable"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button className="w-full" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Invite Team Member
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how you want to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via text message
                      </p>
                    </div>
                    <Switch
                      checked={smsNotifications}
                      onCheckedChange={setSmsNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive browser/app notifications
                      </p>
                    </div>
                    <Switch
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Types</CardTitle>
                <CardDescription>
                  Configure which events trigger notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">New bookings</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Booking cancellations</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Payment received</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Customer reviews</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Inventory alerts</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Staff schedule changes</span>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Third-Party Integrations
              </CardTitle>
              <CardDescription>
                Connect your favorite tools and services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.map((integration, index) => {
                  const Icon = integration.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{integration.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {integration.description}
                          </p>
                          {integration.lastSync && (
                            <p className="text-xs text-green-600">
                              Last sync: {integration.lastSync}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(integration.status)}
                        <Button
                          variant="outline"
                          size="sm"
                          className={
                            integration.status === "connected"
                              ? "text-red-600 hover:text-red-700"
                              : ""
                          }
                        >
                          {integration.status === "connected"
                            ? "Disconnect"
                            : "Connect"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your account security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={handlePasswordChange}
                  disabled={changingPassword}
                >
                  <Key className="w-4 h-4 mr-2" />
                  {changingPassword ? "Updating..." : "Update Password"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Secure your account with 2FA
                    </p>
                  </div>
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    Disabled
                  </Badge>
                </div>

                <Button className="w-full" variant="outline">
                  <Shield className="w-4 h-4 mr-2" />
                  Enable Two-Factor Authentication
                </Button>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Session timeout</span>
                    <Select defaultValue="4h">
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">1 hour</SelectItem>
                        <SelectItem value="4h">4 hours</SelectItem>
                        <SelectItem value="8h">8 hours</SelectItem>
                        <SelectItem value="24h">24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Login notifications</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Saved Addresses */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="w-5 h-5 text-primary" />
                      Saved Addresses
                    </CardTitle>
                    <CardDescription>
                      Manage your delivery and billing addresses
                    </CardDescription>
                  </div>
                  <Button onClick={handleAddNew} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Address
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loadingAddresses ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Loading addresses...
                  </p>
                ) : addresses.length === 0 ? (
                  <div className="space-y-6">
                    {salonData?.address ? (
                      <div className="relative overflow-hidden border-2 border-primary/20 rounded-xl p-6 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                        {/* Decorative background pattern */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -z-10"></div>

                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-primary/10 rounded-lg">
                              <MapPin className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-base text-foreground">
                                Your Salon Address
                              </h4>
                              <Badge className="mt-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                                <Star className="w-3 h-3 mr-1" />
                                From Registration
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Address content */}
                        <div className="ml-12 space-y-3">
                          <div className="flex items-start gap-2">
                            <Building2 className="w-4 h-4 text-primary/70 mt-0.5 flex-shrink-0" />
                            <p className="text-sm font-medium text-foreground leading-relaxed">
                              {salonData.address}
                            </p>
                          </div>

                          {salonData.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-primary/70" />
                              <p className="text-sm text-muted-foreground">
                                {salonData.phone}
                              </p>
                            </div>
                          )}

                          <div className="pt-3 border-t border-primary/10">
                            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                              💡 Save this address for easy access when placing
                              orders or managing deliveries.
                            </p>
                            <Button
                              onClick={() => {
                                setEditingAddress(null);
                                setAddressForm({
                                  fullName: salonData.name || "",
                                  phone: salonData.phone || "",
                                  addressLine1: salonData.address || "",
                                  addressLine2: "",
                                  city: "",
                                  state: "",
                                  postalCode: "",
                                  country: "United States",
                                });
                                setShowAddressDialog(true);
                              }}
                              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                              size="sm"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Save to My Addresses
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {/* Empty state */}
                    <div className="text-center py-12 px-4">
                      <div className="relative inline-block">
                        <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
                        <div className="relative p-4 bg-muted/50 rounded-full">
                          <MapPin className="w-10 h-10 text-muted-foreground" />
                        </div>
                      </div>
                      <h3 className="mt-6 text-base font-semibold text-foreground">
                        No saved addresses yet
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                        {salonData?.address
                          ? "Add more addresses for different delivery locations"
                          : "Add your first address to start receiving deliveries"}
                      </p>
                      <Button
                        onClick={handleAddNew}
                        className="mt-6 bg-primary hover:bg-primary/90"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Address
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">
                              {address.fullName}
                            </span>
                            {address.isDefault && (
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                <Star className="w-3 h-3 mr-1" />
                                Default
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground pl-6">
                            {address.addressLine1}
                            {address.addressLine2 &&
                              `, ${address.addressLine2}`}
                          </p>
                          <p className="text-sm text-muted-foreground pl-6">
                            {address.city}, {address.state} {address.postalCode}
                          </p>
                          <p className="text-sm text-muted-foreground pl-6">
                            {address.country}
                          </p>
                          <p className="text-sm text-muted-foreground pl-6">
                            Phone: {address.phone}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!address.isDefault && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSetDefault(address.id)}
                            >
                              Set Default
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditAddress(address)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAddress(address.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  Data Management
                </CardTitle>
                <CardDescription>
                  Export and backup your business data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Auto Backup Enabled
                    </span>
                  </div>
                  <p className="text-xs text-blue-700">
                    Last backup: Today at 3:00 AM
                  </p>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export All Data
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Backup
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible actions for your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h4 className="font-medium text-red-800 mb-2">
                    Delete Account
                  </h4>
                  <p className="text-sm text-red-700 mb-3">
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete Account
                  </Button>
                </div>

                <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                  <h4 className="font-medium text-yellow-800 mb-2">
                    Reset All Data
                  </h4>
                  <p className="text-sm text-yellow-700 mb-3">
                    Remove all customers, bookings, and transaction data while
                    keeping your account.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-yellow-300 text-yellow-700"
                    onClick={() => setShowResetDialog(true)}
                  >
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Reset Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Address Dialog */}
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "Edit Address" : "Add New Address"}
            </DialogTitle>
            <DialogDescription>
              {editingAddress
                ? "Update your address information below"
                : "Add a new delivery or billing address"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={addressForm.fullName}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, fullName: e.target.value })
                  }
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  value={addressForm.phone}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, phone: e.target.value })
                  }
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="addressLine1">
                Address Line 1 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="addressLine1"
                value={addressForm.addressLine1}
                onChange={(e) =>
                  setAddressForm({
                    ...addressForm,
                    addressLine1: e.target.value,
                  })
                }
                placeholder="123 Main St"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
              <Input
                id="addressLine2"
                value={addressForm.addressLine2}
                onChange={(e) =>
                  setAddressForm({
                    ...addressForm,
                    addressLine2: e.target.value,
                  })
                }
                placeholder="Apt 4B, Suite 100, etc."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">
                  City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  value={addressForm.city}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, city: e.target.value })
                  }
                  placeholder="Los Angeles"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">
                  State <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="state"
                  value={addressForm.state}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, state: e.target.value })
                  }
                  placeholder="CA"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode">
                  Postal Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="postalCode"
                  value={addressForm.postalCode}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      postalCode: e.target.value,
                    })
                  }
                  placeholder="90210"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={addressForm.country}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, country: e.target.value })
                  }
                  placeholder="United States"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddressDialog(false);
                setEditingAddress(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveAddress}>
              {editingAddress ? "Update Address" : "Add Address"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Delete Account
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Type <span className="font-bold text-red-600">DELETE</span> to
                confirm:
              </p>
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="font-mono"
              />
            </div>
            <div className="rounded-lg bg-red-50 p-3 border border-red-200">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> All your data will be permanently
                deleted including:
              </p>
              <ul className="text-sm text-red-700 mt-2 ml-4 list-disc">
                <li>Profile information</li>
                <li>Booking history</li>
                <li>Saved addresses</li>
                <li>All associated data</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setDeleteConfirmText("");
              }}
              disabled={deletingAccount}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deletingAccount || deleteConfirmText !== "DELETE"}
            >
              {deletingAccount ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete My Account
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Data Confirmation Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="w-5 h-5" />
              Reset All Data
            </DialogTitle>
            <DialogDescription>
              This will permanently delete all your salon data but keep your
              account active. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Type <span className="font-bold text-yellow-600">RESET</span> to
                confirm:
              </p>
              <Input
                value={resetConfirmText}
                onChange={(e) => setResetConfirmText(e.target.value)}
                placeholder="Type RESET to confirm"
                className="font-mono"
              />
            </div>
            <div className="rounded-lg bg-yellow-50 p-3 border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> The following data will be permanently
                deleted:
              </p>
              <ul className="text-sm text-yellow-700 mt-2 ml-4 list-disc">
                <li>All bookings</li>
                <li>All customers</li>
                <li>Transaction history</li>
                <li>Staff schedules</li>
              </ul>
              <p className="text-sm text-yellow-800 mt-2">
                Your account, salon profile, and staff members will be
                preserved.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowResetDialog(false);
                setResetConfirmText("");
              }}
              disabled={resettingData}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="bg-yellow-600 hover:bg-yellow-700"
              onClick={handleResetData}
              disabled={resettingData || resetConfirmText !== "RESET"}
            >
              {resettingData ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Reset All Data
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}
