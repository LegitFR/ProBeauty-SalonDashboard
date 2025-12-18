import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://probeauty-backend.onrender.com/api/v1/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log(`[AUTH PROXY] POST /login`, { body });

    const response = await fetch(`${BACKEND_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`[AUTH PROXY] Error response from backend:`, {
        status: response.status,
        data,
        errors: JSON.stringify(data.errors, null, 2),
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("[AUTH PROXY] Proxy error:", error);
    return NextResponse.json(
      { message: error.message || "Proxy request failed" },
      { status: 500 }
    );
  }
}
