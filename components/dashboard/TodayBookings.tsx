import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Clock, MapPin, Phone, Loader2 } from "lucide-react";
import { Button } from "../ui/button";

interface Booking {
  id: string;
  customer: { name: string; phone?: string };
  service: { name: string };
  staff: { name: string };
  time: string;
  status: string;
}

export function TodayBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayBookings();
  }, []);

  const fetchTodayBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.log("No access token found");
        setLoading(false);
        return;
      }

      // Get today's date in YYYY-MM-DD format
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;

      console.log("Fetching bookings for date:", dateStr);

      const response = await fetch(`/api/bookings?date=${dateStr}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Bookings response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Bookings data:", data);

        // Handle different possible response structures
        const bookingsData = data.data || data.bookings || [];

        // Get today's date for comparison (at midnight)
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        console.log("Filtering bookings between:", todayStart, "and", todayEnd);

        // Filter and format bookings for today only
        const todayBookings = bookingsData
          .filter((booking: any) => {
            // Check if booking date is today
            const bookingDate = new Date(
              booking.date || booking.startTime || booking.createdAt
            );
            const isToday =
              bookingDate >= todayStart && bookingDate <= todayEnd;

            if (!isToday) {
              console.log(
                `Filtering out booking ${booking.id} - date: ${bookingDate}`
              );
            }

            return isToday;
          })
          .map((booking: any) => ({
            id: booking.id || booking._id,
            customer: {
              name: booking.customer?.name || booking.user?.name || "Unknown",
              phone: booking.customer?.phone || booking.user?.phone,
            },
            service: {
              name: booking.service?.name || "Service",
            },
            staff: {
              name: booking.staff?.name || "Staff Member",
            },
            time:
              booking.time ||
              booking.startTime ||
              new Date(booking.date).toLocaleTimeString(),
            status: booking.status || "PENDING",
          }));

        console.log(`Filtered to ${todayBookings.length} bookings for today`);
        setBookings(todayBookings);
      } else {
        console.error("Failed to fetch bookings:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching today's bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const oldBookings = [
    {
      id: 1,
      customer: "Sarah Johnson",
      service: "Hair Cut & Color",
      time: "9:00 AM",
      duration: "2h",
      staff: "Emily Chen",
      status: "confirmed",
      phone: "+1 234 567 8901",
    },
    {
      id: 2,
      customer: "Maria Garcia",
      service: "Facial Treatment",
      time: "11:30 AM",
      duration: "1h",
      staff: "Anna Smith",
      status: "in-progress",
      phone: "+1 234 567 8902",
    },
    {
      id: 3,
      customer: "Jennifer Lee",
      service: "Manicure & Pedicure",
      time: "2:00 PM",
      duration: "1.5h",
      staff: "Sofia Martinez",
      status: "upcoming",
      phone: "+1 234 567 8903",
    },
    {
      id: 4,
      customer: "Lisa Brown",
      service: "Deep Tissue Massage",
      time: "4:30 PM",
      duration: "1h",
      staff: "Emily Chen",
      status: "upcoming",
      phone: "+1 234 567 8904",
    },
  ];

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "confirmed":
        return "bg-blue-500/10 text-blue-600";
      case "completed":
        return "bg-green-500/10 text-green-600";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600";
      case "cancelled":
      case "canceled":
        return "bg-red-500/10 text-red-600";
      case "no_show":
        return "bg-gray-500/10 text-gray-600";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
  };

  return (
    <Card className="h-[500px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Today's Bookings</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[400px] overflow-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground mt-4">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8">
            <p className="text-muted-foreground">No bookings for today</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
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

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{booking.customer.name}</p>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status.toLowerCase().replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {booking.service.name}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {booking.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {booking.staff.name}
                    </div>
                  </div>
                </div>
              </div>

              {booking.customer.phone && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground"
                >
                  <Phone className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
