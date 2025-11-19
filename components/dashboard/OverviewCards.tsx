import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";

export function OverviewCards() {
  const stats = [
    {
      title: "Today's Revenue",
      value: "$1,248",
      change: "+12%",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "vs yesterday",
    },
    {
      title: "Today's Bookings",
      value: "24",
      change: "+8%",
      changeType: "positive" as const,
      icon: Calendar,
      description: "12 completed, 8 upcoming",
    },
    {
      title: "Active Customers",
      value: "342",
      change: "+23%",
      changeType: "positive" as const,
      icon: Users,
      description: "this month",
    },
    {
      title: "Staff Utilization",
      value: "87%",
      change: "+5%",
      changeType: "positive" as const,
      icon: TrendingUp,
      description: "average this week",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={
                    stat.changeType === "positive" ? "default" : "destructive"
                  }
                  className="bg-primary/10 text-primary hover:bg-primary/20"
                >
                  {stat.change}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
