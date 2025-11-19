import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Brain,
  TrendingUp,
  Users,
  DollarSign,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { Button } from "../ui/button";

export function AIInsights() {
  const insights = [
    {
      type: "prediction",
      icon: TrendingUp,
      title: "Peak Hours Forecast",
      description: "Tomorrow 2-4 PM will be 85% busier than usual",
      action: "Add extra staff",
      priority: "high",
    },
    {
      type: "opportunity",
      icon: Lightbulb,
      title: "Service Recommendation",
      description: "Facial treatments have 40% higher profit margins",
      action: "Promote facials",
      priority: "medium",
    },
    {
      type: "alert",
      icon: AlertTriangle,
      title: "Customer Retention",
      description: "3 high-value customers haven't booked in 30 days",
      action: "Send offers",
      priority: "high",
    },
    {
      type: "trend",
      icon: Users,
      title: "Popular Service",
      description: "Hair coloring bookings increased 25% this week",
      action: "Stock up supplies",
      priority: "low",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-600";
      case "medium":
        return "bg-yellow-500/10 text-yellow-600";
      case "low":
        return "bg-green-500/10 text-green-600";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
  };

  return (
    <Card className="h-auto lg:h-[500px] w-full">
      <CardHeader className="flex flex-col items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          <CardTitle className="text-base sm:text-lg">AI Insights</CardTitle>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full sm:w-auto text-xs sm:text-sm h-8"
        >
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 max-h-none lg:max-h-[400px] overflow-auto p-4 sm:p-6">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div
              key={index}
              className="p-3 sm:p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-1.5 sm:gap-2 mb-2">
                    <div className="flex items-start sm:items-center gap-2 flex-wrap">
                      <h4 className="font-medium text-sm sm:text-base break-words">
                        {insight.title}
                      </h4>
                      <Badge
                        className={`${getPriorityColor(
                          insight.priority
                        )} w-fit text-xs shrink-0`}
                      >
                        {insight.priority}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 break-words leading-relaxed">
                    {insight.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto text-xs sm:text-sm h-8"
                  >
                    {insight.action}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
