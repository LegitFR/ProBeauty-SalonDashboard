import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export function RevenueChart() {
  const data = [
    { date: "Mon", revenue: 1200, bookings: 15 },
    { date: "Tue", revenue: 1800, bookings: 22 },
    { date: "Wed", revenue: 1600, bookings: 18 },
    { date: "Thu", revenue: 2200, bookings: 28 },
    { date: "Fri", revenue: 2800, bookings: 35 },
    { date: "Sat", revenue: 3200, bookings: 42 },
    { date: "Sun", revenue: 2400, bookings: 30 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Weekly Revenue Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                className="text-xs"
              />
              <YAxis axisLine={false} tickLine={false} className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#FF6A00"
                strokeWidth={3}
                dot={{ fill: "#FF6A00", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#FF6A00", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
