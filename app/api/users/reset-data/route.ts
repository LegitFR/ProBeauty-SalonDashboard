import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://probeauty-backend.onrender.com/api/v1";

// POST /api/users/reset-data - Reset all user data (bookings, customers, etc.)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { message: "Authorization header missing" },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/users/reset-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to reset data", error: error.message },
      { status: 500 }
    );
  }
}
