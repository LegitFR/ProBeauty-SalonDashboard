import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://probeauty-backend.onrender.com/api/v1/reviews";

// GET all reviews by salon
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ salonId: string }> }
) {
  try {
    const { salonId } = await params;
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    console.log(`[REVIEWS PROXY] GET /salon/${salonId}`, { page, limit });

    const response = await fetch(
      `${BACKEND_URL}/salon/${salonId}?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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
      { message: error.message || "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
