import { NextRequest, NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/apiBaseUrl";

const API_BASE_URL = getApiBaseUrl();

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/salons${queryString ? `?${queryString}` : ""}`;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Add auth header if present
    if (authHeader) {
      headers.Authorization = authHeader;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Backend error response:", errorText);
      return NextResponse.json(
        { message: "Backend returned error", error: errorText },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("❌ Salons API route error:", error);
    return NextResponse.json(
      { message: "Failed to fetch salons", error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { message: "Authorization header missing" },
        { status: 401 },
      );
    }

    const contentType = request.headers.get("content-type");

    // Check if it's multipart/form-data (for image uploads)
    if (contentType?.includes("multipart/form-data")) {
      // Get the FormData from request
      const formDataIn = await request.formData();

      // Create new FormData to send to backend with proper structure
      const formDataOut = new FormData();

      // Process each field
      for (const [key, value] of formDataIn.entries()) {
        if (value instanceof File) {
          // Add files as-is
          formDataOut.append(key, value, value.name);
        } else if (key === "geo" || key === "hours") {
          // Parse JSON strings and add back as JSON strings
          // (backend expects JSON strings in multipart)
          try {
            const parsed = JSON.parse(value as string);
            const jsonString = JSON.stringify(parsed);
            formDataOut.append(key, jsonString);
          } catch (e) {
            console.error(`❌ Failed to parse ${key}:`, value);
            formDataOut.append(key, value);
          }
        } else {
          // Add regular fields
          formDataOut.append(key, value);
        }
      }

      const response = await fetch(`${API_BASE_URL}/salons`, {
        method: "POST",
        headers: {
          Authorization: authHeader,
          // Don't set Content-Type - let fetch set it with boundary
        },
        body: formDataOut,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Backend error:", JSON.stringify(data, null, 2));
      } else {}

      return NextResponse.json(data, { status: response.status });
    } else {
      // Handle JSON requests (backward compatibility)
      const body = await request.json();

      const response = await fetch(`${API_BASE_URL}/salons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Backend error:", JSON.stringify(data, null, 2));
      }

      return NextResponse.json(data, { status: response.status });
    }
  } catch (error: any) {
    console.error("❌ Salon creation error:", error);
    return NextResponse.json(
      { message: "Failed to create salon", error: error.message },
      { status: 500 },
    );
  }
}
