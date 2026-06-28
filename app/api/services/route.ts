import { NextRequest, NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/apiBaseUrl";

const API_BASE_URL = getApiBaseUrl();

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch services", error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      console.error("❌ Authorization header missing");
      return NextResponse.json(
        { message: "Authorization header missing" },
        { status: 401 },
      );
    }

    // Check content type to determine how to parse the body
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      // Forward the FormData directly to backend (like products API does)
      const response = await fetch(`${API_BASE_URL}/services`, {
        method: "POST",
        headers: {
          Authorization: authHeader,
          // Don't set Content-Type - let fetch set it with boundary
        },
        body: formData,
      });

      // Get response text first
      const responseText = await response.text();

      // Check if response is JSON
      const responseContentType = response.headers.get("content-type");
      if (
        !responseContentType ||
        !responseContentType.includes("application/json")
      ) {
        console.error(
          "Backend returned non-JSON response:",
          responseText.substring(0, 500),
        );
        return NextResponse.json(
          {
            message: "Backend returned invalid response",
            error:
              "Expected JSON but got HTML. The backend endpoint may not exist or is returning an error page.",
            details: responseText.substring(0, 500),
            backendStatus: response.status,
          },
          { status: 500 },
        );
      }

      // Parse JSON from text
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse JSON:", e);
        return NextResponse.json(
          {
            message: "Backend returned invalid JSON",
            error: String(e),
            details: responseText.substring(0, 500),
          },
          { status: 500 },
        );
      }

      return NextResponse.json(data, { status: response.status });
    } else {
      const body = await request.json();

      // Extract all fields
      const { salonId, title, description, category, durationMinutes, price } =
        body;

      // Validate required fields
      if (
        !salonId ||
        !title ||
        !category ||
        !durationMinutes ||
        price === null ||
        price === undefined
      ) {
        console.error("Missing required fields:", {
          hasSalonId: !!salonId,
          hasTitle: !!title,
          hasCategory: !!category,
          hasDuration: !!durationMinutes,
          hasPrice: price !== null && price !== undefined,
        });
        return NextResponse.json(
          {
            message:
              "Missing required fields: salonId, title, category, durationMinutes, and price are required",
          },
          { status: 400 },
        );
      }

      // Send JSON to backend
      const requestBody = {
        salonId,
        title,
        description: description || "",
        category,
        durationMinutes,
        price,
        isActive: true,
      };

      const response = await fetch(`${API_BASE_URL}/services`, {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      // Get response text first
      const responseText = await response.text();

      // Check if response is JSON
      const responseContentType = response.headers.get("content-type");
      if (
        !responseContentType ||
        !responseContentType.includes("application/json")
      ) {
        console.error(
          "Backend returned non-JSON response:",
          responseText.substring(0, 500),
        );
        return NextResponse.json(
          {
            message: "Backend returned invalid response",
            error:
              "Expected JSON but got HTML. The backend endpoint may not exist or is returning an error page.",
            details: responseText.substring(0, 500),
            backendStatus: response.status,
          },
          { status: 500 },
        );
      }

      // Parse JSON from text
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse JSON:", e);
        return NextResponse.json(
          {
            message: "Backend returned invalid JSON",
            error: String(e),
            response: responseText.substring(0, 500),
          },
          { status: 500 },
        );
      }

      return NextResponse.json(data, { status: response.status });
    }
  } catch (error: any) {
    console.error("Error in POST /api/services:", error);
    return NextResponse.json(
      { message: "Failed to create service", error: error.message },
      { status: 500 },
    );
  }
}
