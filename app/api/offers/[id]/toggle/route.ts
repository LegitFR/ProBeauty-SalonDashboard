import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://probeauty-backend.onrender.com/api/v1";

// PATCH - Toggle offer active status
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const authHeader = request.headers.get("authorization");
    const params = await context.params;
    const offerId = params.id;

    if (!authHeader) {
      return NextResponse.json(
        { message: "Authorization header required" },
        { status: 401 },
      );
    }

    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/offers/${offerId}/toggle`, {
      method: "PATCH",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("❌ Toggle offer API route error:", error);
    return NextResponse.json(
      { message: "Failed to toggle offer status", error: error.message },
      { status: 500 },
    );
  }
}
