import { NextRequest, NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/apiBaseUrl";

const API_BASE_URL = getApiBaseUrl();

// GET /api/addresses - Get all addresses for authenticated user
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    console.log("🔵 API ROUTE /api/addresses GET CALLED!");
    console.log("🔑 Auth header present:", !!authHeader);

    if (!authHeader) {
      return NextResponse.json(
        { message: "Authorization header missing" },
        { status: 401 },
      );
    }

    const response = await fetch(`${API_BASE_URL}/addresses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    console.log("📊 Backend response status:", response.status);

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("❌ Addresses GET error:", error);
    return NextResponse.json(
      { message: "Failed to fetch addresses", error: error.message },
      { status: 500 },
    );
  }
}

// POST /api/addresses - Create new address
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    console.log("🔵 API ROUTE /api/addresses POST CALLED!");

    if (!authHeader) {
      return NextResponse.json(
        { message: "Authorization header missing" },
        { status: 401 },
      );
    }

    const body = await request.json();
    console.log("📦 Request body:", body);

    const response = await fetch(`${API_BASE_URL}/addresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    console.log("📊 Backend response status:", response.status);

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("❌ Addresses POST error:", error);
    return NextResponse.json(
      { message: "Failed to create address", error: error.message },
      { status: 500 },
    );
  }
}
