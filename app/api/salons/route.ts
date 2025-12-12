import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://probeauty-backend.onrender.com/api/v1";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    console.log("🔵 API ROUTE /api/salons GET CALLED!");
    console.log("🔑 Auth header present:", !!authHeader);

    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/salons${queryString ? `?${queryString}` : ""}`;
    console.log("🌐 Fetching from backend:", url);

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Add auth header if present
    if (authHeader) {
      headers.Authorization = authHeader;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    console.log("📊 Backend response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Backend error response:", errorText);
      return NextResponse.json(
        { message: "Backend returned error", error: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("✅ Salons data received:", data);

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("❌ Salons API route error:", error);
    return NextResponse.json(
      { message: "Failed to fetch salons", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { message: "Authorization header missing" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/salons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to create salon", error: error.message },
      { status: 500 }
    );
  }
}
