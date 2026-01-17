"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";
import { getMonthAnalytics, formatCurrency } from "../../lib/analytics";
import { CategoryBreakdown } from "../../lib/types/analytics";

export function TopServices() {
  const [services, setServices] = useState<CategoryBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopServices();
  }, []);

  const fetchTopServices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      if (!token) return;

      // Fetch salon data from API
      const salonResponse = await fetch("/api/salons/my-salons", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const salonData = await salonResponse.json();
      if (!salonResponse.ok || !salonData.data || salonData.data.length === 0) {
        return;
      }

      const salonId = salonData.data[0].id;
      console.log("TopServices: Fetching analytics for salon:", salonId);

      const response = await getMonthAnalytics(salonId, token);
      const serviceCategories = response.data.serviceRevenue.byCategory;

      // Sort by revenue (highest first) and take top 5
      const topServices = [...serviceCategories]
        .sort((a, b) => parseFloat(b.revenue) - parseFloat(a.revenue))
        .slice(0, 5);

      setServices(topServices);
    } catch (error) {
      console.error("Error fetching top services:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Services This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (services.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Services This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No service data available
          </p>
        </CardContent>
      </Card>
    );
  }

  // Find max revenue for percentage calculation
  const maxRevenue = Math.max(...services.map((s) => parseFloat(s.revenue)));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Top Services This Month</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {services.map((service, index) => {
          const percentage =
            maxRevenue > 0
              ? (parseFloat(service.revenue) / maxRevenue) * 100
              : 0;

          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {service.category || "Uncategorized"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {service.count} bookings • {formatCurrency(service.revenue)}
                  </p>
                </div>
                <Badge
                  variant="default"
                  className="bg-primary/10 text-primary hover:bg-primary/20"
                >
                  {service.percentage.toFixed(1)}%
                </Badge>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
