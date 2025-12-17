import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://probeauty-backend.onrender.com/api/v1";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ salonId: string }> }
) {
  try {
    const { salonId } = await params;

    console.log("Fetching services for salon:", salonId);

    // Backend expects salonId as a query parameter
    const response = await fetch(
      `${API_BASE_URL}/services?salonId=${salonId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Backend response status:", response.status);
    const data = await response.json();
    console.log(
      "Backend response data (services):",
      JSON.stringify(data, null, 2)
    );

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch salon services", error: error.message },
      { status: 500 }
    );
  }
}
