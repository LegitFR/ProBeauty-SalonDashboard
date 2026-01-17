"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Progress } from "../../../components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  DollarSign,
  TrendingUp,
  Users,
  Receipt,
  Download,
  Package,
  Scissors,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  getMonthAnalytics,
  getLastNDaysAnalytics,
  getAllTimeAnalytics,
  getWeekAnalytics,
  getYearAnalytics,
  formatCurrency,
} from "../../../lib/analytics";
import { AnalyticsData } from "../../../lib/types/analytics";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

type DateRange = "today" | "week" | "month" | "year" | "all-time";

export default function FinancePage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>("month");

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

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

      let response;
      switch (dateRange) {
        case "today":
          response = await getLastNDaysAnalytics(salonId, 1, token);
          break;
        case "week":
          response = await getWeekAnalytics(salonId, token);
          break;
        case "month":
          response = await getMonthAnalytics(salonId, token);
          break;
        case "year":
          response = await getYearAnalytics(salonId, token);
          break;
        case "all-time":
          response = await getAllTimeAnalytics(salonId, token);
          break;
        default:
          response = await getMonthAnalytics(salonId, token);
      }

      if (response.data) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  function getDateRangeLabel(range: DateRange): string {
    switch (range) {
      case "today":
        return "Today";
      case "week":
        return "This week";
      case "month":
        return "This month";
      case "year":
        return "This year";
      case "all-time":
        return "All time";
      default:
        return "This month";
    }
  }

  const financialMetrics = [
    {
      title: "Total Revenue",
      value: loading
        ? "..."
        : formatCurrency(analytics?.summary.totalRevenue || "0"),
      change: `${analytics?.summary.totalTransactions || 0} transactions`,
      icon: DollarSign,
      description: getDateRangeLabel(dateRange),
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Net Profit",
      value: loading
        ? "..."
        : formatCurrency(analytics?.summary.netProfit || "0"),
      change: analytics
        ? `Commission: ${formatCurrency(analytics.summary.adminCommission)}`
        : "...",
      icon: TrendingUp,
      description: "After 2% platform fee",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Unique Customers",
      value: loading
        ? "..."
        : (analytics?.summary.uniqueCustomers || 0).toString(),
      change: loading
        ? "..."
        : formatCurrency(analytics?.summary.averageTransactionValue || "0"),
      icon: Users,
      description: "Average per customer",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Admin Commission",
      value: loading
        ? "..."
        : formatCurrency(analytics?.summary.adminCommission || "0"),
      change: "2% of revenue",
      icon: Receipt,
      description: "Platform fee",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  const COLORS = [
    "#FF6A00",
    "#00C49F",
    "#FFBB28",
    "#0088FE",
    "#FF8042",
    "#8884d8",
  ];

  // Prepare data for charts
  const revenueByCategory = analytics
    ? [
        ...analytics.serviceRevenue.byCategory.map((cat) => ({
          name: cat.category || "Uncategorized",
          value: parseFloat(cat.revenue),
          count: cat.count,
          type: "Service",
        })),
        ...analytics.productRevenue.byCategory.map((cat) => ({
          name: cat.category || "Products",
          value: parseFloat(cat.revenue),
          count: cat.count,
          type: "Product",
        })),
      ]
    : [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-col md:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            Financial Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive financial insights and metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={dateRange}
            onValueChange={(value) => setDateRange(value as DateRange)}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all-time">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-bold mt-2">{metric.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {metric.change}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {metric.description}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 ${metric.bgColor} rounded-full flex items-center justify-center`}
                  >
                    <Icon className={`w-6 h-6 ${metric.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>
              Revenue distribution by category and type
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-80 flex items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : revenueByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <RechartsPieChart>
                  <Pie
                    data={revenueByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueByCategory.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) =>
                      formatCurrency(value.toString())
                    }
                  />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Details */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>
              Detailed breakdown of revenue sources
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : (
              <div className="space-y-4">
                {/* Service Revenue */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Scissors className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold">Services</h3>
                    <Badge variant="secondary">
                      {formatCurrency(analytics?.serviceRevenue.total || "0")}
                    </Badge>
                  </div>
                  <div className="space-y-2 ml-6">
                    {analytics?.serviceRevenue.byCategory.map((cat, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{cat.category || "Uncategorized"}</span>
                          <span className="font-medium">
                            {formatCurrency(cat.revenue)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{cat.count} bookings</span>
                          <span>{cat.percentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={cat.percentage} className="h-1" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product Revenue */}
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-green-600" />
                    <h3 className="font-semibold">Products</h3>
                    <Badge variant="secondary">
                      {formatCurrency(analytics?.productRevenue.total || "0")}
                    </Badge>
                  </div>
                  <div className="space-y-2 ml-6">
                    {analytics?.productRevenue.byCategory.map((cat, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{cat.category || "Products"}</span>
                          <span className="font-medium">
                            {formatCurrency(cat.revenue)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{cat.count} orders</span>
                          <span>{cat.percentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={cat.percentage} className="h-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Service Revenue Summary</CardTitle>
            <CardDescription>
              Total revenue from service bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-3xl font-bold text-primary">
                  {loading
                    ? "..."
                    : formatCurrency(analytics?.serviceRevenue.total || "0")}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {analytics?.serviceRevenue.byCategory.reduce(
                    (sum, cat) => sum + cat.count,
                    0
                  ) || 0}{" "}
                  total bookings
                </p>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">
                  Top Service Categories
                </p>
                <div className="space-y-2">
                  {analytics?.serviceRevenue.byCategory
                    .slice(0, 3)
                    .map((cat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-muted-foreground">
                          {cat.category || "Uncategorized"}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(cat.revenue)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Revenue Summary</CardTitle>
            <CardDescription>Total revenue from product sales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-3xl font-bold text-green-600">
                  {loading
                    ? "..."
                    : formatCurrency(analytics?.productRevenue.total || "0")}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {analytics?.productRevenue.byCategory.reduce(
                    (sum, cat) => sum + cat.count,
                    0
                  ) || 0}{" "}
                  total orders
                </p>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Revenue Metrics</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Avg Order Value
                    </span>
                    <span className="font-medium">
                      {analytics?.productRevenue.byCategory.reduce(
                        (sum, cat) => sum + cat.count,
                        0
                      )
                        ? formatCurrency(
                            (
                              parseFloat(analytics.productRevenue.total) /
                              analytics.productRevenue.byCategory.reduce(
                                (sum, cat) => sum + cat.count,
                                0
                              )
                            ).toString()
                          )
                        : "$0.00"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      % of Total Revenue
                    </span>
                    <span className="font-medium">
                      {analytics
                        ? (
                            (parseFloat(analytics.productRevenue.total) /
                              parseFloat(analytics.summary.totalRevenue)) *
                            100
                          ).toFixed(1)
                        : "0"}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
