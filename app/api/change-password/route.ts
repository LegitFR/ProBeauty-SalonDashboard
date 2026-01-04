import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://probeauty-backend.onrender.com/api/v1";

// Step 1: Request OTP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, step, otp, newPassword } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Step 1: Send OTP to email
    if (step === "request-otp") {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    // Step 2: Reset password with OTP
    if (step === "reset-password") {
      if (!otp || !newPassword) {
        return NextResponse.json(
          { message: "OTP and new password are required" },
          { status: 400 }
        );
      }

      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(
      { message: "Invalid step. Use 'request-otp' or 'reset-password'" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("[PASSWORD CHANGE] Error:", error);
    return NextResponse.json(
      { message: "Failed to change password", error: error.message },
      { status: 500 }
    );
  }
}
