import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://probeauty-backend.onrender.com/api/v1";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/products${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch products", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { message: "Authorization header missing" },
        { status: 401 }
      );
    }

    // Get FormData from request (for image uploads)
    const formData = await request.formData();

    console.log("Sending product to backend:", {
      url: `${API_BASE_URL}/products`,
      authHeader: authHeader ? "Present" : "Missing",
      formDataKeys: Array.from(formData.keys()),
    });

    // Forward the FormData to backend (supporting multipart/form-data for image uploads)
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        // Don't set Content-Type - let the browser set it with boundary
      },
      body: formData,
    });
    console.log("Backend response status:", response.status);
    console.log(
      "Backend response headers:",
      Object.fromEntries(response.headers.entries())
    );

    // Get response text first
    const responseText = await response.text();
    console.log(
      "Backend response (first 500 chars):",
      responseText.substring(0, 500)
    );

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error(
        "Backend returned non-JSON response:",
        responseText.substring(0, 500)
      );
      return NextResponse.json(
        {
          message: "Backend returned invalid response",
          error:
            "Expected JSON but got HTML. The backend endpoint may not exist or is returning an error page.",
          details: responseText.substring(0, 500),
          backendStatus: response.status,
        },
        { status: 500 }
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
        { status: 500 }
      );
    }

    console.log("Backend response data:", data);

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error in POST /api/products:", error);
    return NextResponse.json(
      { message: "Failed to create product", error: error.message },
      { status: 500 }
    );
  }
}
