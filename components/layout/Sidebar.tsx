import { useState } from "react";
import {
  Home,
  Calendar,
  Scissors,
  Package,
  Brain,
  Users,
  UserSquare,
  CreditCard,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  User,
  Sun,
  Moon,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { cn } from "../../components/ui/utils";
import Image from "next/image";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const navigation = [
  { id: "home", label: "Home", icon: Home },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "services", label: "Services", icon: Scissors },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "offers", label: "Offers", icon: Tag },
  { id: "ai-insights", label: "AI Insights", icon: Brain },
  { id: "staff", label: "Staff", icon: Users },
  { id: "customers", label: "Customers", icon: UserSquare },
  { id: "finance", label: "Finance", icon: CreditCard },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  currentPage,
  onPageChange,
  isCollapsed,
  onToggleCollapse,
  isDarkMode,
  onToggleDarkMode,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onToggleCollapse}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed lg:relative top-0 left-0 h-full bg-card border-r border-border z-50 transition-all duration-300",
          isCollapsed ? "w-16 lg:w-16" : "w-64 lg:w-64",
          "lg:translate-x-0",
          isCollapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Image
                src="/probeauty-footer.png"
                alt="ProBeauty"
                width={120}
                height={32}
                className="h-8 w-auto"
              />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="lg:hidden"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  isCollapsed && "justify-center px-2",
                  currentPage === item.id &&
                    "bg-primary text-primary-foreground hover:bg-primary/90",
                )}
                onClick={() => onPageChange(item.id)}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDarkMode}
            className="w-full justify-center"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
