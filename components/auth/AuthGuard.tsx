"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated and authorized
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const userStr = localStorage.getItem("user");

      // First check: Token and user data must exist
      if (!accessToken || !userStr) {
        router.push("/auth");
        return;
      }

      try {
        // Parse stored user data
        const storedUser = JSON.parse(userStr);

        // Second check: User must have 'owner' role (from stored data)
        if (!storedUser || storedUser.role !== "owner") {
          toast.error(
            "Access denied. This application is for salon owners only."
          );
          // Clear invalid auth data
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          localStorage.removeItem("salon");
          document.cookie = "accessToken=; path=/; max-age=0";
          document.cookie = "refreshToken=; path=/; max-age=0";
          router.push("/auth");
          return;
        }

        // Third check: Verify token is still valid by calling the API
        // This is now a soft check - we proceed even if it fails temporarily
        const userResponse = await fetch("/api/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          const user = userData.data;

          // Update user data in localStorage with fresh data
          if (user) {
            localStorage.setItem("user", JSON.stringify(user));

            // Verify role again from fresh data
            if (user.role !== "owner") {
              toast.error(
                "Access denied. This application is for salon owners only."
              );
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              localStorage.removeItem("user");
              localStorage.removeItem("salon");
              document.cookie = "accessToken=; path=/; max-age=0";
              document.cookie = "refreshToken=; path=/; max-age=0";
              router.push("/auth");
              return;
            }
          }
        } else {
          // If API call fails, log it but don't block if we have valid stored data
          const errorData = await userResponse.json().catch(() => ({}));
          console.warn("User validation API call failed:", {
            status: userResponse.status,
            error: errorData,
          });

          // Only block on 401 Unauthorized - token is definitely invalid
          if (userResponse.status === 401) {
            toast.error("Session expired. Please login again.");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            localStorage.removeItem("salon");
            document.cookie = "accessToken=; path=/; max-age=0";
            document.cookie = "refreshToken=; path=/; max-age=0";
            router.push("/auth");
            return;
          }
        }

        // Fourth check: User should have at least one salon (soft check)
        const salonResponse = await fetch("/api/salons/my-salons", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (salonResponse.ok) {
          const salonData = await salonResponse.json();

          if (!salonData.data || salonData.data.length === 0) {
            // User hasn't completed salon setup
            toast.error(
              "Please complete your salon setup to access the dashboard."
            );
            router.push("/auth"); // This will show create-salon page
            return;
          }

          // Update salon data if needed
          const currentSalon = localStorage.getItem("salon");
          if (!currentSalon && salonData.data.length > 0) {
            localStorage.setItem("salon", JSON.stringify(salonData.data[0]));
          }
        } else if (salonResponse.status === 401) {
          // Token invalid
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          localStorage.removeItem("salon");
          document.cookie = "accessToken=; path=/; max-age=0";
          document.cookie = "refreshToken=; path=/; max-age=0";
          router.push("/auth");
          return;
        }

        // All checks passed
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error: any) {
        console.error("Auth check failed:", error);
        // Clear auth data on any error
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("salon");
        document.cookie = "accessToken=; path=/; max-age=0";
        document.cookie = "refreshToken=; path=/; max-age=0";
        toast.error("Authentication error. Please login again.");
        router.push("/auth");
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
