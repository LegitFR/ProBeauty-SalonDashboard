import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Clock, MapPin, Phone } from "lucide-react";
import { Button } from "../ui/button";

export function TodayBookings() {
  const bookings = [
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
    switch (status) {
      case "confirmed":
        return "bg-blue-500/10 text-blue-600";
      case "in-progress":
        return "bg-primary/10 text-primary";
      case "upcoming":
        return "bg-yellow-500/10 text-yellow-600";
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
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
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

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{booking.customer}</p>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status.replace("-", " ")}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {booking.service}
                </p>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {booking.time} ({booking.duration})
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {booking.staff}
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
            >
              <Phone className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
