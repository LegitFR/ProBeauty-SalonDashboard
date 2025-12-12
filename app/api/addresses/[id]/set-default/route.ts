import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://probeauty-backend.onrender.com/api/v1";

// PATCH /api/addresses/:id/set-default - Set address as default
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get("authorization");
    console.log(
      "🔵 API ROUTE /api/addresses/:id/set-default PATCH CALLED!",
      id
    );

    if (!authHeader) {
      return NextResponse.json(
        { message: "Authorization header missing" },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/addresses/${id}/set-default`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      }
    );

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("❌ Set default address error:", error);
    return NextResponse.json(
      { message: "Failed to set default address", error: error.message },
      { status: 500 }
    );
  }
}
