"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getTodayAnalytics, formatCurrency } from "../../lib/analytics";
import { AnalyticsData } from "../../lib/types/analytics";

export function OverviewCards() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
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
        console.error("No salon found for user");
        return;
      }

      const salonId = salonData.data[0].id;
      console.log("OverviewCards: Fetching analytics for salon:", salonId);

      const response = await getTodayAnalytics(salonId, token);
      if (response.data) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      // Set default analytics data on error
      setAnalytics({
        summary: {
          totalRevenue: "0",
          totalTransactions: 0,
          netProfit: "0",
          adminCommission: "0",
          averageTransactionValue: "0",
          uniqueCustomers: 0,
        },
        productRevenue: { total: "0", byCategory: [] },
        serviceRevenue: { total: "0", byCategory: [] },
        timeRange: { startDate: null, endDate: null },
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Today's Revenue",
      value: loading
        ? "..."
        : formatCurrency(analytics?.summary.totalRevenue || "0"),
      change: analytics
        ? `${analytics.summary.totalTransactions} transactions`
        : "...",
      changeType: "positive" as const,
      icon: DollarSign,
      description: loading
        ? "Loading..."
        : `Net: ${formatCurrency(analytics?.summary.netProfit || "0")}`,
    },
    {
      title: "Unique Customers",
      value: loading
        ? "..."
        : analytics?.summary.uniqueCustomers.toString() || "0",
      change: analytics
        ? `Avg: ${formatCurrency(analytics.summary.averageTransactionValue)}`
        : "...",
      changeType: "positive" as const,
      icon: Users,
      description: "Average transaction value",
    },
    {
      title: "Product Sales",
      value: loading
        ? "..."
        : formatCurrency(analytics?.productRevenue.total || "0"),
      change: analytics?.productRevenue.byCategory.length
        ? `${analytics.productRevenue.byCategory[0].count} orders`
        : "No sales",
      changeType: "positive" as const,
      icon: ShoppingBag,
      description: "Today's product revenue",
    },
    {
      title: "Service Revenue",
      value: loading
        ? "..."
        : formatCurrency(analytics?.serviceRevenue.total || "0"),
      change: analytics?.serviceRevenue.byCategory.reduce(
        (sum, cat) => sum + cat.count,
        0
      )
        ? `${analytics.serviceRevenue.byCategory.reduce(
            (sum, cat) => sum + cat.count,
            0
          )} bookings`
        : "No bookings",
      changeType: "positive" as const,
      icon: Calendar,
      description: "Today's service revenue",
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
