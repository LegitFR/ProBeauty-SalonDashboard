"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Plus,
  UserPlus,
  Scissors,
  Gift,
  Calendar,
  Package,
  ShoppingBag,
} from "lucide-react";
import { useRouter } from "next/navigation";

export function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      icon: Calendar,
      label: "New Booking",
      description: "Schedule appointment",
      color: "bg-blue-500",
      onClick: () => router.push("/bookings"),
    },
    {
      icon: Scissors,
      label: "Add Service",
      description: "Create new service",
      color: "bg-primary",
      onClick: () => router.push("/services"),
    },
    {
      icon: UserPlus,
      label: "Add Staff",
      description: "Invite team member",
      color: "bg-green-500",
      onClick: () => router.push("/staff"),
    },
    {
      icon: ShoppingBag,
      label: "View Orders",
      description: "Manage orders",
      color: "bg-orange-500",
      onClick: () => router.push("/orders"),
    },
    {
      icon: Package,
      label: "Add Product",
      description: "Inventory item",
      color: "bg-teal-500",
      onClick: () => router.push("/products"),
    },
    {
      icon: Gift,
      label: "Settings",
      description: "Configure salon",
      color: "bg-purple-500",
      onClick: () => router.push("/settings"),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-muted/50"
                      onClick={action.onClick}
                    >
                      <div
                        className={`w-8 h-8 rounded-full shrink-0 ${action.color} flex items-center justify-center`}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-center w-full">
                        <p className="font-medium text-sm truncate">
                          {action.label}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {action.description}
                        </p>
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="hidden sm:flex md:flex lg:flex xl:flex">
                    <div className="text-center">
                      <p className="font-medium text-black">{action.label}</p>
                      <p className="text-xs">{action.description}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
