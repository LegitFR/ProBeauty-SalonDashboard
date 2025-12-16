import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://probeauty-backend.onrender.com/api/v1";

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
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log("🔵 API ROUTE /api/services POST CALLED!");

  try {
    const authHeader = request.headers.get("authorization");
    console.log("🔑 Auth header:", authHeader ? "EXISTS" : "MISSING");

    if (!authHeader) {
      console.error("❌ Authorization header missing");
      return NextResponse.json(
        { message: "Authorization header missing" },
        { status: 401 }
      );
    }

    // Always receive FormData from frontend
    const formData = await request.formData();

    console.log(
      "API Route - Received FormData with keys:",
      Array.from(formData.keys())
    );

    // Extract all fields
    const salonId = formData.get("salonId");
    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const durationMinutes = formData.get("durationMinutes");
    const price = formData.get("price");
    const images = formData.getAll("images");

    console.log("API Route - Parsed fields:", {
      salonId,
      title,
      description,
      category,
      durationMinutes,
      price,
      imageCount: images.filter((img) => img instanceof File).length,
    });

    console.log("API Route - Field types:", {
      salonIdType: typeof salonId,
      titleType: typeof title,
      categoryType: typeof category,
      categoryValue: category,
      categoryEmpty: category === "" || !category,
    });

    // Validate required fields (category must not be empty)
    if (!salonId || !title || !category || !durationMinutes || price === null) {
      console.error("Missing required fields:", {
        hasSalonId: !!salonId,
        hasTitle: !!title,
        hasCategory: !!category,
        hasDuration: !!durationMinutes,
        hasPrice: price !== null,
      });
      return NextResponse.json(
        {
          message:
            "Missing required fields: salonId, title, category, durationMinutes, and price are required",
        },
        { status: 400 }
      );
    }

    // Check if there are actual image files
    const actualImages = images.filter(
      (img) => img instanceof File && img.size > 0
    );
    const hasImages = actualImages.length > 0;

    console.log(
      "API Route - Has images:",
      hasImages,
      "Count:",
      actualImages.length
    );

    // ALWAYS send as FormData - backend requires multipart/form-data or x-www-form-urlencoded
    const backendFormData = new FormData();
    backendFormData.append("salonId", salonId as string);
    backendFormData.append("title", title as string);
    backendFormData.append("description", (description as string) || "");
    backendFormData.append("category", category as string);
    backendFormData.append("durationMinutes", durationMinutes as string);
    backendFormData.append("price", price as string);

    // Try adding isActive field which might be required
    backendFormData.append("isActive", "true");

    // Append images if present
    if (hasImages) {
      actualImages.forEach((img) => {
        backendFormData.append("images", img);
      });
      console.log("API Route - Sending FormData with images to backend");
    } else {
      console.log("API Route - Sending FormData without images to backend");
    }

    // Log what we're sending to backend
    console.log("=== SENDING TO BACKEND ===");
    console.log("URL:", `${API_BASE_URL}/services`);
    console.log("Method: POST");
    console.log("FormData keys:", Array.from(backendFormData.keys()));
    for (const [key, value] of backendFormData.entries()) {
      console.log(
        `  ${key}:`,
        value instanceof File ? `File: ${value.name}` : value
      );
    }

    const response = await fetch(`${API_BASE_URL}/services`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        // Don't set Content-Type for FormData - browser sets it with boundary
      },
      body: backendFormData,
    });

    console.log("Backend response status:", response.status);

    // Get response text first
    const responseText = await response.text();
    console.log(
      "Backend response (first 500 chars):",
      responseText.substring(0, 500)
    );

    // Check if response is JSON
    const responseContentType = response.headers.get("content-type");
    if (
      !responseContentType ||
      !responseContentType.includes("application/json")
    ) {
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

    console.log("API Route - Backend response data:", data);

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error in POST /api/services:", error);
    return NextResponse.json(
      { message: "Failed to create service", error: error.message },
      { status: 500 }
    );
  }
}
