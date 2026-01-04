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
import { Progress } from "../../../components/ui/progress";
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
import { useToast } from "../../../components/ui/use-toast";
import {
  Users,
  Plus,
  Search,
  Calendar,
  Star,
  TrendingUp,
  Edit,
  Phone,
  Mail,
  MapPin,
  Heart,
  DollarSign,
  Clock,
  Gift,
  MessageSquare,
  Send,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  MoreHorizontal,
  Eye,
  Target,
  Loader2,
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  status?: string;
  joinDate?: string;
  lastVisit?: string;
  totalSpent?: number;
  visits?: number;
  avgSpend?: number;
  satisfaction?: number;
  preferences?: string[];
  upcomingBooking?: string;
  notes?: string;
  segment?: string;
  churnRisk?: string;
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
  service?: {
    id: string;
    title: string;
  };
  product?: {
    id: string;
    name: string;
  };
}

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegment, setSelectedSegment] = useState("all");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [salonReviews, setSalonReviews] = useState<Review[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
    fetchSalonAndReviews();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please login to view customers",
          variant: "destructive",
        });
        setCustomers([]);
        setLoading(false);
        return;
      }

      // Fetch all bookings to get customers
      const response = await fetch("/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      const bookings = data.data || [];

      // Extract unique customers from bookings
      const customerMap = new Map<string, Customer>();

      bookings.forEach((booking: any) => {
        if (booking.user && booking.userId) {
          const customerId = booking.userId;

          if (!customerMap.has(customerId)) {
            // Create new customer entry
            customerMap.set(customerId, {
              id: customerId,
              name: booking.user.name || "Unknown",
              email: booking.user.email || "",
              phone: booking.user.phone || "",
              avatar: booking.user.avatar || undefined,
              status: "regular",
              joinDate: new Date(
                booking.createdAt || Date.now()
              ).toLocaleDateString("de-DE"),
              lastVisit: new Date(booking.startTime).toLocaleDateString(
                "de-DE"
              ),
              totalSpent: parseFloat(booking.service?.price || 0),
              visits: 1,
              avgSpend: parseFloat(booking.service?.price || 0),
              satisfaction: 4.5,
              preferences: booking.service?.title
                ? [booking.service.title]
                : [],
              upcomingBooking:
                booking.status === "CONFIRMED" || booking.status === "PENDING"
                  ? `${new Date(booking.startTime).toLocaleDateString(
                      "de-DE"
                    )} - ${booking.service?.title}`
                  : undefined,
              notes: "",
              segment: "new",
              churnRisk: "low",
            });
          } else {
            // Update existing customer
            const customer = customerMap.get(customerId)!;
            customer.visits = (customer.visits || 0) + 1;
            customer.totalSpent =
              (customer.totalSpent || 0) +
              parseFloat(booking.service?.price || 0);
            customer.avgSpend = customer.totalSpent / customer.visits;

            // Update last visit to most recent
            const bookingDate = new Date(booking.startTime);
            const lastVisitDate = new Date(customer.lastVisit || 0);
            if (bookingDate > lastVisitDate) {
              customer.lastVisit = bookingDate.toLocaleDateString("de-DE");
            }

            // Add service to preferences if not already there
            if (
              booking.service?.title &&
              !customer.preferences?.includes(booking.service.title)
            ) {
              customer.preferences = [
                ...(customer.preferences || []),
                booking.service.title,
              ];
            }

            // Update upcoming booking if this booking is confirmed/pending and in future
            if (
              (booking.status === "CONFIRMED" ||
                booking.status === "PENDING") &&
              bookingDate > new Date()
            ) {
              customer.upcomingBooking = `${bookingDate.toLocaleDateString(
                "de-DE"
              )} - ${booking.service?.title}`;
            }
          }
        }
      });

      // Convert map to array and determine customer segments
      const customersArray = Array.from(customerMap.values()).map(
        (customer) => {
          // Determine segment based on visits and spending
          if (
            customer.visits &&
            customer.visits >= 20 &&
            customer.totalSpent &&
            customer.totalSpent >= 1500
          ) {
            customer.status = "vip";
            customer.segment = "high-value";
          } else if (customer.visits && customer.visits >= 10) {
            customer.status = "regular";
            customer.segment = "regular";
          } else if (customer.visits && customer.visits <= 3) {
            customer.segment = "new";
          }

          // Determine churn risk based on last visit
          if (customer.lastVisit) {
            const daysSinceLastVisit = Math.floor(
              (Date.now() - new Date(customer.lastVisit).getTime()) /
                (1000 * 60 * 60 * 24)
            );
            if (daysSinceLastVisit > 90) {
              customer.churnRisk = "high";
              customer.status = "at-risk";
            } else if (daysSinceLastVisit > 60) {
              customer.churnRisk = "medium";
            } else {
              customer.churnRisk = "low";
            }
          }

          return customer;
        }
      );

      setCustomers(customersArray);

      if (customersArray.length === 0) {
        toast({
          title: "No customers found",
          description: "No customers with bookings yet",
        });
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast({
        title: "Error",
        description: "Failed to load customers",
        variant: "destructive",
      });
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalonAndReviews = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      // Fetch salon
      const salonResponse = await fetch("/api/salons/my-salons", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!salonResponse.ok) return;

      const salonData = await salonResponse.json();
      if (!salonData.data || salonData.data.length === 0) return;

      const salon = salonData.data[0];

      // Fetch reviews for salon
      const reviewsResponse = await fetch(`/api/reviews/salon/${salon.id}`);
      if (!reviewsResponse.ok) return;

      const reviewsData = await reviewsResponse.json();
      const reviews = reviewsData.data || [];
      setSalonReviews(reviews);

      // Calculate review stats per customer
      const customerReviewStats = reviews.reduce((acc: any, review: Review) => {
        const userId = review.userId;
        if (!acc[userId]) {
          acc[userId] = { total: 0, count: 0, reviews: [] };
        }
        acc[userId].total += review.rating;
        acc[userId].count += 1;
        acc[userId].reviews.push(review);
        return acc;
      }, {});

      // Update customers with review data
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) => {
          const stats = customerReviewStats[customer.id];
          if (stats) {
            return {
              ...customer,
              averageRating: stats.total / stats.count,
              reviewCount: stats.count,
              satisfaction: stats.total / stats.count,
            };
          }
          return customer;
        })
      );
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // Calculate real statistics from customer data
  const totalCustomers = customers.length;

  // Active this month - customers with visits in the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const activeThisMonth = customers.filter((c) => {
    if (!c.lastVisit) return false;
    const lastVisitDate = new Date(c.lastVisit);
    return lastVisitDate >= thirtyDaysAgo;
  }).length;

  // Average customer value
  const totalRevenue = customers.reduce(
    (sum, c) => sum + (c.totalSpent || 0),
    0
  );
  const avgCustomerValue =
    totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

  // Retention rate - customers with churn risk "low" divided by total
  const lowChurnCustomers = customers.filter(
    (c) => c.churnRisk === "low"
  ).length;
  const retentionRate =
    totalCustomers > 0 ? (lowChurnCustomers / totalCustomers) * 100 : 0;

  const customerStats = [
    {
      label: "Total Customers",
      value: totalCustomers.toLocaleString(),
      change: totalCustomers > 0 ? `${totalCustomers}` : "0",
      icon: Users,
    },
    {
      label: "Active This Month",
      value: activeThisMonth.toLocaleString(),
      change: `${activeThisMonth}`,
      icon: CheckCircle,
    },
    {
      label: "Avg Customer Value",
      value: `$${avgCustomerValue.toFixed(0)}`,
      change: `$${avgCustomerValue.toFixed(0)}`,
      icon: DollarSign,
    },
    {
      label: "Retention Rate",
      value: `${retentionRate.toFixed(0)}%`,
      change: `${retentionRate.toFixed(0)}%`,
      icon: Heart,
    },
  ];

  const segments = [
    { id: "all", name: "All Customers", count: customers.length },
    {
      id: "vip",
      name: "VIP",
      count: customers.filter((c) => c.status === "vip").length,
    },
    {
      id: "regular",
      name: "Regular",
      count: customers.filter((c) => c.status === "regular").length,
    },
    {
      id: "new",
      name: "New",
      count: customers.filter((c) => c.segment === "new").length,
    },
    {
      id: "at-risk",
      name: "At Risk",
      count: customers.filter((c) => c.status === "at-risk").length,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "vip":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            VIP
          </Badge>
        );
      case "regular":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Regular
          </Badge>
        );
      case "at-risk":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            At Risk
          </Badge>
        );
      default:
        return <Badge>Customer</Badge>;
    }
  };

  const getChurnRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "high":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSegment =
      selectedSegment === "all" ||
      (selectedSegment === "vip" && customer.status === "vip") ||
      (selectedSegment === "regular" && customer.status === "regular") ||
      (selectedSegment === "new" && customer.segment === "new") ||
      (selectedSegment === "at-risk" && customer.status === "at-risk");
    return matchesSearch && matchesSegment;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-4 flex-col md:flex-row">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            Customer Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage customer relationships and drive retention
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>
                  Add a new customer to your database
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Full Name</Label>
                  <Input id="customerName" placeholder="Enter customer name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone</Label>
                  <Input id="customerPhone" placeholder="(555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerNotes">Notes</Label>
                  <Textarea
                    id="customerNotes"
                    placeholder="Customer preferences, allergies, etc."
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">Add Customer</Button>
                  <Button variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {customerStats.map((stat, index) => {
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
                      {stat.change} this month
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

      <Tabs defaultValue="customers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="customers" className="text-xs sm:text-sm">
            Customer Database
          </TabsTrigger>
          <TabsTrigger value="segmentation" className="text-xs sm:text-sm">
            Segmentation
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="text-xs sm:text-sm">
            Marketing Campaigns
          </TabsTrigger>
          <TabsTrigger value="retention" className="text-xs sm:text-sm">
            Retention Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSegment} onValueChange={setSelectedSegment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by segment" />
              </SelectTrigger>
              <SelectContent>
                {segments.map((segment) => (
                  <SelectItem key={segment.id} value={segment.id}>
                    {segment.name} ({segment.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Customer List */}
          {loading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
                <p className="text-muted-foreground mt-4">
                  Loading customers...
                </p>
              </CardContent>
            </Card>
          ) : customers.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No customers yet</h3>
                <p className="text-muted-foreground mb-6">
                  Customers will appear here once they book appointments at your
                  salon.
                </p>
                <Button
                  onClick={() => (window.location.href = "/dashboard/bookings")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  View Bookings
                </Button>
              </CardContent>
            </Card>
          ) : filteredCustomers.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-2">
                  No customers match your search
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSegment("all");
                  }}
                >
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCustomers.map((customer) => (
                <Card
                  key={customer.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={customer.avatar}
                            alt={customer.name}
                          />
                          <AvatarFallback>
                            {customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">
                            {customer.name}
                          </CardTitle>
                          <CardDescription>
                            Customer since{" "}
                            {customer.joinDate
                              ? new Date(customer.joinDate).getFullYear()
                              : "N/A"}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(customer.status || "regular")}
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Contact Info */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="truncate">{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>

                      {/* Key Metrics */}
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-lg font-bold text-primary">
                            {customer.visits}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Visits
                          </p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-green-600">
                            ${(Number(customer.totalSpent) || 0).toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Total Spent
                          </p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-blue-600">
                            ${(Number(customer.avgSpend) || 0).toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Avg Spend
                          </p>
                        </div>
                      </div>

                      {/* Satisfaction & Churn Risk */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">
                              {customer.averageRating
                                ? customer.averageRating.toFixed(1)
                                : customer.satisfaction
                                ? customer.satisfaction.toFixed(1)
                                : "N/A"}
                            </span>
                          </div>
                          {customer.reviewCount && customer.reviewCount > 0 && (
                            <span className="text-xs text-muted-foreground ml-5">
                              {customer.reviewCount} review
                              {customer.reviewCount !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertTriangle
                            className={`w-4 h-4 ${getChurnRiskColor(
                              customer.churnRisk || "low"
                            )}`}
                          />
                          <span
                            className={`text-sm font-medium ${getChurnRiskColor(
                              customer.churnRisk || "low"
                            )}`}
                          >
                            {customer.churnRisk || "low"} risk
                          </span>
                        </div>
                      </div>

                      {/* Upcoming Booking */}
                      {customer.upcomingBooking ? (
                        <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm font-medium text-blue-800">
                            Upcoming Booking
                          </p>
                          <p className="text-xs text-blue-600">
                            {customer.upcomingBooking}
                          </p>
                        </div>
                      ) : (
                        <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm font-medium text-yellow-800">
                            No Upcoming Booking
                          </p>
                          <p className="text-xs text-yellow-600">
                            Consider reaching out
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          View Profile
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          Book Service
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="segmentation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
                <CardDescription>
                  Distribution of customers by value
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-purple-500 rounded"></div>
                      <span className="font-medium">VIP Customers</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {customers.filter((c) => c.status === "vip").length}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        $
                        {customers.filter((c) => c.status === "vip").length > 0
                          ? (
                              customers
                                .filter((c) => c.status === "vip")
                                .reduce(
                                  (sum, c) => sum + (c.totalSpent || 0),
                                  0
                                ) /
                              customers.filter((c) => c.status === "vip").length
                            ).toFixed(0)
                          : 0}{" "}
                        avg value
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="font-medium">Regular Customers</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {customers.filter((c) => c.status === "regular").length}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        $
                        {customers.filter((c) => c.status === "regular")
                          .length > 0
                          ? (
                              customers
                                .filter((c) => c.status === "regular")
                                .reduce(
                                  (sum, c) => sum + (c.totalSpent || 0),
                                  0
                                ) /
                              customers.filter((c) => c.status === "regular")
                                .length
                            ).toFixed(0)
                          : 0}{" "}
                        avg value
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="font-medium">New Customers</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {customers.filter((c) => c.segment === "new").length}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        $
                        {customers.filter((c) => c.segment === "new").length > 0
                          ? (
                              customers
                                .filter((c) => c.segment === "new")
                                .reduce(
                                  (sum, c) => sum + (c.totalSpent || 0),
                                  0
                                ) /
                              customers.filter((c) => c.segment === "new")
                                .length
                            ).toFixed(0)
                          : 0}{" "}
                        avg value
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className="font-medium">At-Risk Customers</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {customers.filter((c) => c.status === "at-risk").length}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {customers.filter((c) => c.status === "at-risk")
                          .length > 0
                          ? "Needs attention"
                          : "No at-risk customers"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Segment Insights</CardTitle>
                <CardDescription>
                  Key insights about customer behavior
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customers.filter((c) => c.status === "vip").length > 0 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-800">
                        High Retention
                      </p>
                      <p className="text-xs text-green-700">
                        VIP customers show{" "}
                        {customers.filter(
                          (c) => c.status === "vip" && c.churnRisk === "low"
                        ).length > 0
                          ? Math.round(
                              (customers.filter(
                                (c) =>
                                  c.status === "vip" && c.churnRisk === "low"
                              ).length /
                                customers.filter((c) => c.status === "vip")
                                  .length) *
                                100
                            )
                          : 0}
                        % retention rate
                      </p>
                    </div>
                  )}

                  {customers.filter((c) => c.status === "regular").length >
                    0 && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">
                        Growth Opportunity
                      </p>
                      <p className="text-xs text-blue-700">
                        {customers.filter((c) => c.status === "regular").length}{" "}
                        regular customers can be upgraded to VIP
                      </p>
                    </div>
                  )}

                  {customers.filter((c) => c.churnRisk === "high").length >
                    0 && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm font-medium text-yellow-800">
                        Attention Needed
                      </p>
                      <p className="text-xs text-yellow-700">
                        {customers.filter((c) => c.churnRisk === "high").length}{" "}
                        customer(s) haven't visited in 3+ months
                      </p>
                    </div>
                  )}

                  {customers.length === 0 && (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-600">
                        No customer data available
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Campaigns</CardTitle>
              <CardDescription>
                Create and manage customer marketing campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Win-Back Campaign</h3>
                    <p className="text-sm text-muted-foreground">
                      Target at-risk customers with 20% discount
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Active
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {customers.filter((c) => c.status === "at-risk").length}{" "}
                        customer(s) targeted
                      </span>
                    </div>
                  </div>
                  <Button size="sm">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">VIP Appreciation</h3>
                    <p className="text-sm text-muted-foreground">
                      Special offers for VIP customers
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="bg-green-100 text-green-800">
                        Scheduled
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {customers.filter((c) => c.status === "vip").length}{" "}
                        customer(s) targeted
                      </span>
                    </div>
                  </div>
                  <Button size="sm">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </div>

                <Button className="w-full" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Retention Metrics</CardTitle>
                <CardDescription>
                  Track customer retention and churn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>30-Day Retention</span>
                      <span>
                        {customers.length > 0
                          ? Math.round(
                              (customers.filter((c) => {
                                if (!c.lastVisit) return false;
                                const daysSince = Math.floor(
                                  (Date.now() -
                                    new Date(c.lastVisit).getTime()) /
                                    (1000 * 60 * 60 * 24)
                                );
                                return daysSince <= 30;
                              }).length /
                                customers.length) *
                                100
                            )
                          : 0}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        customers.length > 0
                          ? (customers.filter((c) => {
                              if (!c.lastVisit) return false;
                              const daysSince = Math.floor(
                                (Date.now() - new Date(c.lastVisit).getTime()) /
                                  (1000 * 60 * 60 * 24)
                              );
                              return daysSince <= 30;
                            }).length /
                              customers.length) *
                            100
                          : 0
                      }
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>90-Day Retention</span>
                      <span>
                        {customers.length > 0
                          ? Math.round(
                              (customers.filter((c) => {
                                if (!c.lastVisit) return false;
                                const daysSince = Math.floor(
                                  (Date.now() -
                                    new Date(c.lastVisit).getTime()) /
                                    (1000 * 60 * 60 * 24)
                                );
                                return daysSince <= 90;
                              }).length /
                                customers.length) *
                                100
                            )
                          : 0}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        customers.length > 0
                          ? (customers.filter((c) => {
                              if (!c.lastVisit) return false;
                              const daysSince = Math.floor(
                                (Date.now() - new Date(c.lastVisit).getTime()) /
                                  (1000 * 60 * 60 * 24)
                              );
                              return daysSince <= 90;
                            }).length /
                              customers.length) *
                            100
                          : 0
                      }
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>1-Year Retention</span>
                      <span>
                        {customers.length > 0
                          ? Math.round(
                              (customers.filter((c) => {
                                if (!c.lastVisit) return false;
                                const daysSince = Math.floor(
                                  (Date.now() -
                                    new Date(c.lastVisit).getTime()) /
                                    (1000 * 60 * 60 * 24)
                                );
                                return daysSince <= 365;
                              }).length /
                                customers.length) *
                                100
                            )
                          : 0}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        customers.length > 0
                          ? (customers.filter((c) => {
                              if (!c.lastVisit) return false;
                              const daysSince = Math.floor(
                                (Date.now() - new Date(c.lastVisit).getTime()) /
                                  (1000 * 60 * 60 * 24)
                              );
                              return daysSince <= 365;
                            }).length /
                              customers.length) *
                            100
                          : 0
                      }
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Churn Analysis</CardTitle>
                <CardDescription>Customers at risk of churning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customers.filter((c) => c.churnRisk === "high").length >
                  0 ? (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-medium text-red-800">
                          High Risk
                        </span>
                      </div>
                      <p className="text-xs text-red-700">
                        {customers.filter((c) => c.churnRisk === "high").length}{" "}
                        customer(s)
                      </p>
                      <p className="text-xs text-red-700">
                        No visit in 3+ months
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700">
                        No high-risk customers
                      </p>
                    </div>
                  )}

                  {customers.filter((c) => c.churnRisk === "medium").length >
                  0 ? (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">
                          Medium Risk
                        </span>
                      </div>
                      <p className="text-xs text-yellow-700">
                        {
                          customers.filter((c) => c.churnRisk === "medium")
                            .length
                        }{" "}
                        customer(s)
                      </p>
                      <p className="text-xs text-yellow-700">
                        Declining visit frequency
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700">
                        No medium-risk customers
                      </p>
                    </div>
                  )}

                  <Button className="w-full" size="sm">
                    <Target className="w-3 h-3 mr-1" />
                    Create Retention Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
