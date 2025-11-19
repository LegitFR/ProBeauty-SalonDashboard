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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Clock,
  Target,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  BarChart3,
  Eye,
  Zap,
  MessageSquare,
} from "lucide-react";

export default function AIInsightsPage() {
  const recommendations = [
    {
      type: "revenue",
      priority: "high",
      title: "Optimize Peak Hour Pricing",
      description:
        "Increase prices by 15% during 2-4 PM slots to maximize revenue",
      impact: "+$2,400/month",
      confidence: 94,
      action: "Adjust Pricing",
    },
    {
      type: "scheduling",
      priority: "medium",
      title: "Staff Scheduling Optimization",
      description: "Add one more stylist on Saturdays to reduce wait times",
      impact: "+18% customer satisfaction",
      confidence: 87,
      action: "Update Schedule",
    },
    {
      type: "marketing",
      priority: "high",
      title: "Retention Campaign",
      description: "Send personalized offers to 47 at-risk customers",
      impact: "+12% retention rate",
      confidence: 91,
      action: "Start Campaign",
    },
    {
      type: "inventory",
      priority: "low",
      title: "Product Bundle Opportunity",
      description: "Create hair care bundle - high customer interest detected",
      impact: "+$800/month",
      confidence: 76,
      action: "Create Bundle",
    },
  ];

  const insights = [
    {
      title: "Revenue Forecast",
      value: "$47,200",
      change: "+12.5%",
      trend: "up",
      description: "Next month projection",
      confidence: "High",
    },
    {
      title: "Busy Period Prediction",
      value: "Thu 2-4 PM",
      change: "+34% bookings",
      trend: "up",
      description: "Highest demand this week",
      confidence: "Very High",
    },
    {
      title: "Customer Satisfaction",
      value: "4.8/5.0",
      change: "+0.3 points",
      trend: "up",
      description: "Based on recent reviews",
      confidence: "High",
    },
    {
      title: "Churn Risk Alert",
      value: "12 customers",
      change: "23% likely to leave",
      trend: "down",
      description: "Require immediate attention",
      confidence: "Medium",
    },
  ];

  const performanceMetrics = [
    { label: "Revenue Growth", value: 85, target: 90, status: "good" },
    { label: "Customer Retention", value: 92, target: 95, status: "excellent" },
    {
      label: "Booking Efficiency",
      value: 78,
      target: 85,
      status: "needs-improvement",
    },
    { label: "Staff Utilization", value: 88, target: 85, status: "excellent" },
    {
      label: "Average Service Value",
      value: 67,
      target: 75,
      status: "needs-improvement",
    },
    {
      label: "Customer Satisfaction",
      value: 96,
      target: 90,
      status: "excellent",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600";
      case "good":
        return "text-blue-600";
      case "needs-improvement":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-4 flex-col md:flex-row">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            AI Business Insights
          </h1>
          <p className="text-muted-foreground mt-2">
            Intelligent recommendations and predictive analytics for your
            business
          </p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-orange-600 text-white">
          <Sparkles className="w-4 h-4 mr-2" />
          Generate New Insights
        </Button>
      </div>

      {/* Key Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-all duration-200"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {insight.title}
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  {insight.confidence}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">{insight.value}</p>
                <div className="flex items-center gap-1">
                  {insight.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm ${
                      insight.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {insight.change}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {insight.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="recommendations" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-1 lg:grid-cols-3 h-auto">
          <TabsTrigger
            value="recommendations"
            className="text-xs sm:text-sm md:text-base"
          >
            AI Recommendations
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className="text-xs sm:text-sm md:text-base"
          >
            Performance Analysis
          </TabsTrigger>
          <TabsTrigger
            value="predictions"
            className="text-xs sm:text-sm md:text-base"
          >
            Predictive Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-6">
          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                Smart Recommendations
              </CardTitle>
              <CardDescription>
                AI-powered suggestions to optimize your business performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority.toUpperCase()}
                        </Badge>
                        <h3 className="font-semibold">{rec.title}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-primary">
                          {rec.impact}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {rec.confidence}% confidence
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {rec.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Progress value={rec.confidence} className="w-32" />
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90"
                      >
                        {rec.action}
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>
                  Track your business KPIs against targets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceMetrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {metric.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-medium ${getStatusColor(
                              metric.status
                            )}`}
                          >
                            {metric.value}%
                          </span>
                          <span className="text-xs text-muted-foreground">
                            (Target: {metric.target}%)
                          </span>
                        </div>
                      </div>
                      <Progress
                        value={metric.value}
                        className={`h-2 ${
                          metric.status === "excellent"
                            ? "[&>div]:bg-green-500"
                            : metric.status === "good"
                            ? "[&>div]:bg-blue-500"
                            : "[&>div]:bg-yellow-500"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Quick Insights
                </CardTitle>
                <CardDescription>
                  Key observations from your data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        Strong Performance
                      </p>
                      <p className="text-xs text-green-700">
                        Customer satisfaction is 16% above industry average
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        Opportunity Detected
                      </p>
                      <p className="text-xs text-yellow-700">
                        Booking efficiency could improve with better scheduling
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Trending Up
                      </p>
                      <p className="text-xs text-blue-700">
                        Revenue growth accelerating - up 34% vs last quarter
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          {/* Predictive Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Revenue Predictions
                </CardTitle>
                <CardDescription>
                  AI-powered revenue forecasts for the next 3 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Next Month</span>
                      <Badge className="bg-green-100 text-green-800">
                        95% Confidence
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-green-700">$47,200</p>
                    <p className="text-sm text-green-600">
                      +12.5% vs current month
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">2 Months</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        88% Confidence
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-blue-700">$51,800</p>
                    <p className="text-sm text-blue-600">
                      +23.1% vs current month
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">3 Months</span>
                      <Badge className="bg-purple-100 text-purple-800">
                        76% Confidence
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-purple-700">
                      $48,900
                    </p>
                    <p className="text-sm text-purple-600">
                      +16.3% vs current month
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Customer Behavior Predictions
                </CardTitle>
                <CardDescription>
                  Anticipate customer needs and behaviors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">High-Value Customers</h4>
                      <span className="text-sm text-muted-foreground">
                        23 predicted
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Likely to book premium services in next 30 days
                    </p>
                    <Progress value={78} className="h-2" />
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Churn Risk</h4>
                      <span className="text-sm text-red-600">12 at risk</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Customers likely to stop visiting in next 60 days
                    </p>
                    <Progress value={23} className="h-2 [&>div]:bg-red-500" />
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Referral Potential</h4>
                      <span className="text-sm text-green-600">34 likely</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Satisfied customers likely to refer friends
                    </p>
                    <Progress value={67} className="h-2 [&>div]:bg-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
