import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://probeauty-backend.onrender.com/api/v1/reviews";

// GET review by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log(`[REVIEWS PROXY] GET /${id}`);

    const response = await fetch(`${BACKEND_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
      { message: error.message || "Failed to fetch review" },
      { status: 500 }
    );
  }
}

// PATCH update review
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { message: "Authorization required" },
        { status: 401 }
      );
    }

    console.log(`[REVIEWS PROXY] PATCH /${id}`, { body });

    const response = await fetch(`${BACKEND_URL}/${id}`, {
      method: "PATCH",
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
      { message: error.message || "Failed to update review" },
      { status: 500 }
    );
  }
}

// DELETE review
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { message: "Authorization required" },
        { status: 401 }
      );
    }

    console.log(`[REVIEWS PROXY] DELETE /${id}`);

    const response = await fetch(`${BACKEND_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
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
      { message: error.message || "Failed to delete review" },
      { status: 500 }
    );
  }
}
