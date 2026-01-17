import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://probeauty-backend.onrender.com/api/v1";

// GET - Get active offers (public)
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();

    const url = `${API_BASE_URL}/offers/public/active${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("❌ Get active offers API route error:", error);
    return NextResponse.json(
      { message: "Failed to fetch active offers", error: error.message },
      { status: 500 },
    );
  }
}
