import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://probeauty-backend.onrender.com/api/v1";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();

    if (!queryString) {
      return NextResponse.json(
        { message: "salonId, serviceId, staffId, and date are required" },
        { status: 400 }
      );
    }

    const url = `${API_BASE_URL}/bookings/availability?${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch availability", error: error.message },
      { status: 500 }
    );
  }
}
