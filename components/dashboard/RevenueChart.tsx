"use client";
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
import { useEffect, useState } from "react";
import { getLastNDaysAnalytics } from "../../lib/analytics";
import { AnalyticsResponse } from "../../lib/types/analytics";

interface DayData {
  date: string;
  revenue: number;
  transactions: number;
}

export function RevenueChart() {
  const [chartData, setChartData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeeklyData();
  }, []);

  const fetchWeeklyData = async () => {
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

      // Fetch data for each day of the last 7 days
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const promises: Promise<{ day: string; data: AnalyticsResponse }>[] = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayName = days[date.getDay()];

        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        promises.push(
          fetch(
            `/api/analytics/salons/${salonId}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            },
          )
            .then((res) => res.json())
            .then((data) => ({ day: dayName, data }))
            .catch((err) => {
              console.error(`Error fetching data for ${dayName}:`, err);
              return {
                day: dayName,
                data: {
                  message: "Error fetching analytics",
                  data: {
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
                  },
                },
              };
            }),
        );
      }

      const results = await Promise.all(promises);
      const formattedData: DayData[] = results.map((result) => ({
        date: result.day,
        revenue: parseFloat(result.data?.data?.summary?.totalRevenue || "0"),
        transactions: result.data?.data?.summary?.totalTransactions || 0,
      }));

      setChartData(formattedData);
    } catch (error) {
      console.error("Error fetching weekly data:", error);
    } finally {
      setLoading(false);
    }
  };

  const data = loading
    ? [
        { date: "Mon", revenue: 0, transactions: 0 },
        { date: "Tue", revenue: 0, transactions: 0 },
        { date: "Wed", revenue: 0, transactions: 0 },
        { date: "Thu", revenue: 0, transactions: 0 },
        { date: "Fri", revenue: 0, transactions: 0 },
        { date: "Sat", revenue: 0, transactions: 0 },
        { date: "Sun", revenue: 0, transactions: 0 },
      ]
    : chartData;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Weekly Revenue Trend {loading && "(Loading...)"}
        </CardTitle>
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
                formatter={(value: number) => [
                  `$${value.toFixed(2)}`,
                  "Revenue",
                ]}
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
