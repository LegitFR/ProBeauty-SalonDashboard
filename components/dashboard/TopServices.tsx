import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";

export function TopServices() {
  const services = [
    {
      name: "Hair Cut & Color",
      bookings: 156,
      revenue: "€4.680",
      percentage: 100,
      trend: "+12%",
    },
    {
      name: "Facial Treatment",
      bookings: 89,
      revenue: "€2.670",
      percentage: 75,
      trend: "+8%",
    },
    {
      name: "Manicure & Pedicure",
      bookings: 67,
      revenue: "€1.340",
      percentage: 60,
      trend: "+15%",
    },
    {
      name: "Deep Tissue Massage",
      bookings: 45,
      revenue: "€2.250",
      percentage: 45,
      trend: "+3%",
    },
    {
      name: "Eyebrow Threading",
      bookings: 34,
      revenue: "€680",
      percentage: 30,
      trend: "-2%",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Top Services This Month</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {services.map((service, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{service.name}</p>
                <p className="text-sm text-muted-foreground">
                  {service.bookings} bookings • {service.revenue}
                </p>
              </div>
              <Badge
                variant={
                  service.trend.startsWith("+") ? "default" : "destructive"
                }
                className="bg-primary/10 text-primary hover:bg-primary/20"
              >
                {service.trend}
              </Badge>
            </div>
            <Progress value={service.percentage} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
