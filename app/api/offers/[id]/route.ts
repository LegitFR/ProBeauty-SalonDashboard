import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://probeauty-backend.onrender.com/api/v1";

// GET - Get offer by ID
export async function GET(
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

    const response = await fetch(`${API_BASE_URL}/offers/${offerId}`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("❌ Get offer API route error:", error);
    return NextResponse.json(
      { message: "Failed to fetch offer", error: error.message },
      { status: 500 },
    );
  }
}

// PATCH - Update offer
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

    // Get form data
    const formData = await request.formData();

    const response = await fetch(`${API_BASE_URL}/offers/${offerId}`, {
      method: "PATCH",
      headers: {
        Authorization: authHeader,
      },
      body: formData,
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("❌ Update offer API route error:", error);
    return NextResponse.json(
      { message: "Failed to update offer", error: error.message },
      { status: 500 },
    );
  }
}

// DELETE - Delete offer
export async function DELETE(
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

    const response = await fetch(`${API_BASE_URL}/offers/${offerId}`, {
      method: "DELETE",
      headers: {
        Authorization: authHeader,
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("❌ Delete offer API route error:", error);
    return NextResponse.json(
      { message: "Failed to delete offer", error: error.message },
      { status: 500 },
    );
  }
}
