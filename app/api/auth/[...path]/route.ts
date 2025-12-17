import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://probeauty-backend.onrender.com/api/v1/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const pathString = path.join("/");
    const body = await request.json();
    const authHeader = request.headers.get("authorization");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Add authorization header if present (for endpoints like change-password)
    if (authHeader) {
      headers.Authorization = authHeader;
    }

    console.log(`[AUTH PROXY] POST /${pathString}`, { body });

    const response = await fetch(`${BACKEND_URL}/${pathString}`, {
      method: "POST",
      headers,
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const pathString = path.join("/");

    const response = await fetch(`${BACKEND_URL}/${pathString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Proxy request failed" },
      { status: 500 }
    );
  }
}
