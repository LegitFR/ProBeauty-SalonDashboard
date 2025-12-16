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
}

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegment, setSelectedSegment] = useState("all");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("/api/customers", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const data = await response.json();
      setCustomers(data.customers || data.data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast({
        title: "Error",
        description: "Failed to load customers. Using sample data.",
        variant: "destructive",
      });
      // Set sample data as fallback - use empty array for now
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const sampleCustomersData: Customer[] = [
    {
      id: "1",
      name: "Emma Thompson",
      email: "emma.thompson@email.com",
      phone: "(555) 123-4567",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      status: "vip",
      joinDate: "2023-01-15",
      lastVisit: "2024-12-10",
      totalSpent: 2340,
      visits: 28,
      avgSpend: 83.5,
      satisfaction: 4.9,
      preferences: ["Hair Color", "Styling", "Treatments"],
      upcomingBooking: "Dec 20, 2024 - Hair Color",
      notes: "Prefers organic products. Allergic to sulfates.",
      segment: "high-value",
      churnRisk: "low",
    },
    {
      id: "2",
      name: "James Wilson",
      email: "james.wilson@email.com",
      phone: "(555) 234-5678",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      status: "regular",
      joinDate: "2023-06-20",
      lastVisit: "2024-12-05",
      totalSpent: 890,
      visits: 12,
      avgSpend: 74.2,
      satisfaction: 4.7,
      preferences: ["Haircut", "Beard Trim"],
      upcomingBooking: "Dec 18, 2024 - Haircut + Beard",
      notes: "Prefers same stylist (Marcus). Comes every 3 weeks.",
      segment: "regular",
      churnRisk: "low",
    },
    {
      id: "3",
      name: "Sofia Martinez",
      email: "sofia.martinez@email.com",
      phone: "(555) 345-6789",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      status: "regular",
      joinDate: "2024-03-10",
      lastVisit: "2024-11-25",
      totalSpent: 420,
      visits: 6,
      avgSpend: 70.0,
      satisfaction: 4.6,
      preferences: ["Manicure", "Pedicure", "Nail Art"],
      upcomingBooking: undefined,
      notes: "New customer. Show interest in loyalty program.",
      segment: "new",
      churnRisk: "medium",
    },
    {
      id: "4",
      name: "Michael Brown",
      email: "michael.brown@email.com",
      phone: "(555) 456-7890",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      status: "at-risk",
      joinDate: "2022-08-12",
      lastVisit: "2024-09-15",
      totalSpent: 1560,
      visits: 18,
      avgSpend: 86.7,
      satisfaction: 4.2,
      preferences: ["Massage", "Facial"],
      upcomingBooking: undefined,
      notes: "Has not visited in 3 months. Send retention offer.",
      segment: "at-risk",
      churnRisk: "high",
    },
    {
      id: "5",
      name: "Isabella Garcia",
      email: "isabella.garcia@email.com",
      phone: "(555) 567-8901",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      status: "vip",
      joinDate: "2022-11-30",
      lastVisit: "2024-12-08",
      totalSpent: 3240,
      visits: 35,
      avgSpend: 92.6,
      satisfaction: 4.8,
      preferences: ["Full Service", "Premium Treatments"],
      upcomingBooking: "Dec 22, 2024 - Full Day Package",
      notes: "VIP customer. Always books premium services.",
      segment: "high-value",
      churnRisk: "low",
    },
  ];

  const actualCustomers =
    customers.length > 0 ? customers : sampleCustomersData;

  const customerStats = [
    { label: "Total Customers", value: "1,247", change: "+23", icon: Users },
    {
      label: "Active This Month",
      value: "892",
      change: "+67",
      icon: CheckCircle,
    },
    {
      label: "Avg Customer Value",
      value: "$156",
      change: "+$12",
      icon: DollarSign,
    },
    { label: "Retention Rate", value: "87%", change: "+3%", icon: Heart },
  ];

  const segments = [
    { id: "all", name: "All Customers", count: actualCustomers.length },
    {
      id: "vip",
      name: "VIP",
      count: actualCustomers.filter((c) => c.status === "vip").length,
    },
    {
      id: "regular",
      name: "Regular",
      count: actualCustomers.filter((c) => c.status === "regular").length,
    },
    {
      id: "new",
      name: "New",
      count: actualCustomers.filter((c) => c.segment === "new").length,
    },
    {
      id: "at-risk",
      name: "At Risk",
      count: actualCustomers.filter((c) => c.status === "at-risk").length,
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

  const filteredCustomers = actualCustomers.filter((customer) => {
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
          ) : filteredCustomers.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No customers found</p>
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
                            ${(customer.totalSpent || 0).toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Total Spent
                          </p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-blue-600">
                            ${(customer.avgSpend || 0).toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Avg Spend
                          </p>
                        </div>
                      </div>

                      {/* Satisfaction & Churn Risk */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">
                            {customer.satisfaction}
                          </span>
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
                      <p className="font-bold">2</p>
                      <p className="text-sm text-muted-foreground">
                        $5,580 avg value
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="font-medium">Regular Customers</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">2</p>
                      <p className="text-sm text-muted-foreground">
                        $655 avg value
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="font-medium">New Customers</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">1</p>
                      <p className="text-sm text-muted-foreground">
                        $420 avg value
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className="font-medium">At-Risk Customers</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">1</p>
                      <p className="text-sm text-muted-foreground">
                        Needs attention
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
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800">
                      High Retention
                    </p>
                    <p className="text-xs text-green-700">
                      VIP customers show 95% retention rate
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">
                      Growth Opportunity
                    </p>
                    <p className="text-xs text-blue-700">
                      Regular customers can be upgraded to VIP
                    </p>
                  </div>

                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800">
                      Attention Needed
                    </p>
                    <p className="text-xs text-yellow-700">
                      1 customer hasn't visited in 3+ months
                    </p>
                  </div>
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
                        1 customer targeted
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
                        2 customers targeted
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
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>90-Day Retention</span>
                      <span>87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>1-Year Retention</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
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
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">
                        High Risk
                      </span>
                    </div>
                    <p className="text-xs text-red-700">
                      1 customer (Michael Brown)
                    </p>
                    <p className="text-xs text-red-700">
                      No visit in 3+ months
                    </p>
                  </div>

                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">
                        Medium Risk
                      </span>
                    </div>
                    <p className="text-xs text-yellow-700">
                      1 customer (Sofia Martinez)
                    </p>
                    <p className="text-xs text-yellow-700">
                      Declining visit frequency
                    </p>
                  </div>

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
