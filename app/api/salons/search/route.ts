import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://probeauty-backend.onrender.com/api/v1";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Build the backend URL with all query parameters
    const backendUrl = new URL(`${BACKEND_URL}/salons/search`);

    // Forward all query parameters
    searchParams.forEach((value, key) => {
      backendUrl.searchParams.append(key, value);
    });

    console.log("Fetching from backend:", backendUrl.toString());

    const response = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error:", response.status, errorText);

      // Return empty data instead of error for better UX
      if (response.status === 500 || response.status === 404) {
        return NextResponse.json({
          message: "No salons found",
          data: [],
          pagination: {
            page: 1,
            limit: 12,
            total: 0,
            totalPages: 0,
          },
        });
      }

      return NextResponse.json(
        { error: "Failed to search salons", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Search results:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Search salons error:", error);

    // Return empty data instead of error for better UX
    return NextResponse.json({
      message: "No salons found",
      data: [],
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
      },
    });
  }
}
