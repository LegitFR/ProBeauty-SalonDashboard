"use client";
import { useState } from "react";
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
} from "lucide-react";

export default function StaffPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [searchQuery, setSearchQuery] = useState("");

  const staffMembers = [
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
    { label: "Total Staff", value: "4", change: "+0", icon: Users },
    { label: "Active Today", value: "3", change: "+1", icon: CheckCircle },
    { label: "Avg Rating", value: "4.8", change: "+0.1", icon: Star },
    {
      label: "Team Revenue",
      value: "$25.6K",
      change: "+12%",
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
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchQuery.toLowerCase())
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
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Staff Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
                <DialogDescription>
                  Add a new team member to your salon
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select>
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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="(555) 123-4567" />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">Add Staff Member</Button>
                  <Button variant="outline" className="flex-1">
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
                        <AvatarImage src={staff.avatar} alt={staff.name} />
                        <AvatarFallback>
                          {staff.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{staff.name}</CardTitle>
                        <CardDescription>{staff.role}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(staff.status)}
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
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="truncate">{staff.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{staff.phone}</span>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div>
                      <p className="text-sm font-medium mb-2">Specialties</p>
                      <div className="flex flex-wrap gap-1">
                        {staff.specialties.map((specialty, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">
                          {staff.performance.bookings}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Bookings
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          ${staff.performance.revenue.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {staff.rating}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <CalendarIcon className="w-3 h-3 mr-1" />
                          Schedule
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
                  {staffMembers.map((staff) => (
                    <div key={staff.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={staff.avatar} alt={staff.name} />
                          <AvatarFallback>
                            {staff.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{staff.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {staff.role}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-2 text-sm">
                        {Object.entries(staff.thisWeek).map(
                          ([day, schedule]) => (
                            <div key={day} className="text-center">
                              <p className="font-medium text-xs text-muted-foreground mb-1">
                                {day}
                              </p>
                              {schedule.start === "OFF" ? (
                                <div className="p-1 bg-gray-100 rounded text-xs">
                                  OFF
                                </div>
                              ) : schedule.start === "LEAVE" ? (
                                <div className="p-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                                  LEAVE
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <div className="p-1 bg-blue-50 border border-blue-200 rounded text-xs">
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {staffMembers.map((staff) => (
              <Card key={staff.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={staff.avatar} alt={staff.name} />
                      <AvatarFallback>
                        {staff.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{staff.name}</CardTitle>
                      <CardDescription>{staff.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold">
                          {staff.performance.bookings}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Total Bookings
                        </p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          ${staff.performance.revenue.toLocaleString()}
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
                          <span>{staff.performance.satisfaction}/5.0</span>
                        </div>
                        <Progress
                          value={staff.performance.satisfaction * 20}
                          className="h-2"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Efficiency</span>
                          <span>{staff.performance.efficiency}%</span>
                        </div>
                        <Progress
                          value={staff.performance.efficiency}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Summary</CardTitle>
              <CardDescription>
                Current month payroll information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staffMembers.map((staff) => (
                  <div
                    key={staff.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={staff.avatar} alt={staff.name} />
                        <AvatarFallback>
                          {staff.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{staff.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {staff.role}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${(staff.performance.revenue * 0.4).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        40% commission
                      </p>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total Payroll</span>
                    <span className="text-primary">
                      $
                      {staffMembers
                        .reduce(
                          (sum, staff) => sum + staff.performance.revenue * 0.4,
                          0
                        )
                        .toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
