import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://probeauty-backend.onrender.com/api/v1";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ salonId: string }> },
) {
  try {
    const authHeader = request.headers.get("authorization");
    const params = await context.params;
    const salonId = params.salonId;

    console.log("📊 Analytics route called with salon ID:", salonId);

    if (!authHeader) {
      return NextResponse.json(
        { message: "Authorization header required" },
        { status: 401 },
      );
    }

    if (!salonId) {
      return NextResponse.json(
        { message: "Salon ID is required" },
        { status: 400 },
      );
    }

    // Get query parameters (startDate, endDate)
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build the backend URL - correct endpoint is /api/v1/analytics/salons/:salonId
    let url = `${API_BASE_URL}/analytics/salons/${salonId}`;
    const queryParams = new URLSearchParams();

    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);

    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    console.log("📊 Fetching analytics from backend:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    console.log("📊 Analytics response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Backend analytics error response:", errorText);
      console.error("❌ Status code:", response.status);

      // Try to parse the error as JSON for better error messages
      let errorData;
      try {
        errorData = JSON.parse(errorText);
        console.error("❌ Parsed error data:", errorData);
      } catch {
        errorData = { message: errorText };
      }

      return NextResponse.json(
        {
          message: "Failed to fetch analytics",
          error: errorData,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    console.log("✅ Analytics data received successfully for salon:", salonId);
    console.log("✅ Data summary:", {
      totalRevenue: data.data?.summary?.totalRevenue,
      transactions: data.data?.summary?.totalTransactions,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("❌ Analytics API route error:", error);
    return NextResponse.json(
      { message: "Failed to fetch analytics", error: error.message },
      { status: 500 },
    );
  }
}
