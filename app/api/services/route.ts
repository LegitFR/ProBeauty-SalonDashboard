import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://probeauty-backend.onrender.com/api/v1";

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch services", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log("🔵 API ROUTE /api/services POST CALLED!");

  try {
    const authHeader = request.headers.get("authorization");
    console.log("🔑 Auth header:", authHeader ? "EXISTS" : "MISSING");

    if (!authHeader) {
      console.error("❌ Authorization header missing");
      return NextResponse.json(
        { message: "Authorization header missing" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    console.log("API Route - Received body:", body);

    // Validate required fields
    if (
      !body.salonId ||
      !body.title ||
      !body.durationMinutes ||
      body.price === undefined
    ) {
      console.error("Missing required fields:", {
        hasSalonId: !!body.salonId,
        hasTitle: !!body.title,
        hasDuration: !!body.durationMinutes,
        hasPrice: body.price !== undefined,
      });
      return NextResponse.json(
        {
          message:
            "Missing required fields: salonId, title, durationMinutes, and price are required",
        },
        { status: 400 }
      );
    }

    // Forward to backend API
    console.log(
      "API Route - Forwarding to backend:",
      `${API_BASE_URL}/services`
    );
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("API Route - Backend response:", response.status, data);

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error in POST /api/services:", error);
    return NextResponse.json(
      { message: "Failed to create service", error: error.message },
      { status: 500 }
    );
  }
}
