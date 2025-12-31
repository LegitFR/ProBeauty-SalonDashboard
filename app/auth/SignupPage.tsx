"use client";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import {
  Calendar,
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
  Check,
  Mail,
  Phone as PhoneIcon,
  Lock,
  User,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

// Use local proxy to avoid CORS issues during development
const API_BASE_URL = "/api/auth";

interface SignupPageProps {
  onBack: () => void;
  onSignupSuccess: (user: any, tokens: any) => void;
}

export function SignupPage({ onBack, onSignupSuccess }: SignupPageProps) {
  const [step, setStep] = useState<"signup" | "verify">("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Signup form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // OTP verification state
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Frontend validation
      if (!formData.name || formData.name.trim().length < 2) {
        throw new Error("Name must be at least 2 characters");
      }

      if (
        !formData.email ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        throw new Error("Please enter a valid email address");
      }

      if (!formData.phone || !/^[6-9]\d{9}$/.test(formData.phone)) {
        throw new Error("Phone must be 10 digits starting with 6-9");
      }

      if (!formData.password || formData.password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      // Check password complexity
      const hasUpperCase = /[A-Z]/.test(formData.password);
      const hasLowerCase = /[a-z]/.test(formData.password);
      const hasNumber = /\d/.test(formData.password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

      if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
        throw new Error(
          "Password must contain uppercase, lowercase, number, and special character"
        );
      }

      const requestBody = {
        ...formData,
        role: "owner", // Fixed role from salon_owner to owner
      };

      console.log("=== SIGNUP REQUEST ===");
      console.log("Request body:", requestBody);

      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      console.log("=== SIGNUP RESPONSE ===");
      console.log("Status:", response.status);
      console.log("Response data:", data);
      console.log("=====================");

      if (!response.ok) {
        // Show detailed error message from backend
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors
            .map((err: any) => err.message || err.msg)
            .join(", ");
          throw new Error(errorMessages || data.message);
        }
        const errorMessage =
          data.message || data.error || JSON.stringify(data) || "Signup failed";
        throw new Error(errorMessage);
      }

      setUserId(data.userId);
      setStep("verify");
      toast.success(
        "Registration successful! Please check your email for the OTP."
      );
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(
        error.message || "Failed to create account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, verify the OTP
      const verifyResponse = await fetch(
        `${API_BASE_URL}/confirm-registration`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            otp: otp,
          }),
        }
      );

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyData.message || "OTP verification failed");
      }

      toast.success("Account verified! Logging you in...");

      // Auto-login after successful verification
      const loginResponse = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: formData.email,
          password: formData.password,
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.message || "Auto-login failed");
      }

      // Store tokens and user data
      localStorage.setItem("accessToken", loginData.accessToken);
      localStorage.setItem("refreshToken", loginData.refreshToken);
      localStorage.setItem("user", JSON.stringify(loginData.user));

      // Store in cookies
      document.cookie = `accessToken=${
        loginData.accessToken
      }; path=/; max-age=${3 * 60 * 60}`;
      document.cookie = `refreshToken=${
        loginData.refreshToken
      }; path=/; max-age=${15 * 24 * 60 * 60}`;

      // Pass login data to parent
      onSignupSuccess(loginData.user, {
        accessToken: loginData.accessToken,
        refreshToken: loginData.refreshToken,
      });
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          role: "owner",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to resend OTP");
      }

      toast.success("New OTP sent to your email!");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-orange-50/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-orange-200/20 to-transparent rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="font-heading text-3xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
              ProBeauty
            </span>
          </div>

          {step === "signup" ? (
            <>
              <h1 className="font-heading text-3xl font-bold mb-2">
                Start Your Journey
              </h1>
              <p className="text-muted-foreground">
                Create your salon owner account and transform your business
              </p>
            </>
          ) : (
            <>
              <h1 className="font-heading text-3xl font-bold mb-2">
                Verify Your Email
              </h1>
              <p className="text-muted-foreground">
                We've sent a 6-digit code to {formData.email}
              </p>
            </>
          )}
        </div>

        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl">
              {step === "signup" ? "Create Account" : "Enter Verification Code"}
            </CardTitle>
            <CardDescription>
              {step === "signup"
                ? "Join thousands of salon owners managing their business smarter"
                : "Please enter the OTP sent to your email"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "signup" ? (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <PhoneIcon className="w-4 h-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="h-11"
                    maxLength={10}
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be 10 digits starting with 6, 7, 8, or 9
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="h-11 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Must contain at least 8 characters with uppercase,
                    lowercase, number and special character
                  </p>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary">
                      Salon Owner Account
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      You're signing up as a salon owner with full management
                      access
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-primary to-orange-600 text-white hover:from-primary/90 hover:to-orange-600/90 shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <Sparkles className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By creating an account, you agree to our{" "}
                  <a href="#" className="text-primary hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-center block">
                    Verification Code
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    required
                    maxLength={6}
                    className="h-14 text-center text-2xl tracking-widest font-bold"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">
                      Check your email
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      The code will expire in 10 minutes
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-primary to-orange-600 text-white hover:from-primary/90 hover:to-orange-600/90 shadow-lg"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Verify & Continue
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Didn't receive the code?
                  </p>
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-primary"
                  >
                    Resend Code
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {step === "signup" && (
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button
                variant="link"
                onClick={onBack}
                className="text-primary p-0 h-auto font-semibold"
              >
                Sign in here
              </Button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
