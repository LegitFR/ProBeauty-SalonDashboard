"use client";
import { useEffect, useState } from "react";
import { OverviewCards } from "../../../components/dashboard/OverviewCards";
import { TodayBookings } from "../../../components/dashboard/TodayBookings";
import { AIInsights } from "../../../components/dashboard/AIInsights";
import { QuickActions } from "../../../components/dashboard/QuickActions";
import { RevenueChart } from "../../../components/dashboard/RevenueChart";
import { TopServices } from "../../../components/dashboard/TopServices";

export default function HomePage() {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      // Get first name from full name
      const firstName = user.name?.split(" ")[0] || "User";
      setUserName(firstName);
    }
  }, []);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">
          {getGreeting()}, {userName}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening at ProBeauty Salon today.
        </p>
      </div>

      {/* Overview Cards */}
      <OverviewCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <RevenueChart />
          <TodayBookings />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <QuickActions />
          <AIInsights />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopServices />
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-6 border border-primary/20">
          <h3 className="font-heading text-xl font-semibold mb-2">
            🎉 Monthly Performance
          </h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">847</p>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">$28.5K</p>
              <p className="text-sm text-muted-foreground">Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">4.8</p>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">92%</p>
              <p className="text-sm text-muted-foreground">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
