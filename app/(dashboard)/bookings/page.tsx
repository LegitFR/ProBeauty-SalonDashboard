"use client";
import { useState } from "react";
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
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const bookings = [
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
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Booking
        </Button>
      </div>

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
      <Tabs defaultValue="all" className="w-full">
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
          {bookings.map((booking) => (
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
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${booking.customer}`}
                      />
                      <AvatarFallback>
                        {booking.customer
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{booking.customer}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        {booking.phone}
                      </div>
                    </div>
                  </div>

                  {/* Service & Time */}
                  <div>
                    <p className="font-medium">{booking.service}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <Clock className="w-3 h-3" />
                      {booking.date} at {booking.time} ({booking.duration})
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {booking.staff}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center">
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status.replace("-", " ")}
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
          ))}
        </TabsContent>

        <TabsContent value="today">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Today's bookings would be filtered here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Upcoming bookings would be filtered here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Completed bookings would be filtered here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
