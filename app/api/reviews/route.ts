import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://probeauty-backend.onrender.com/api/v1/reviews";

// POST create review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { message: "Authorization required" },
        { status: 401 }
      );
    }

    console.log(`[REVIEWS PROXY] POST /`, { body });

    const response = await fetch(`${BACKEND_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`[REVIEWS PROXY] Error response:`, {
        status: response.status,
        data,
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("[REVIEWS PROXY] Error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create review" },
      { status: 500 }
    );
  }
}
