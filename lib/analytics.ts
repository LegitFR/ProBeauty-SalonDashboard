import { AnalyticsResponse, AnalyticsParams } from "./types/analytics";

// Use Next.js API route instead of calling backend directly
const BASE_URL = "/api";

/**
 * Fetches analytics data for a specific salon
 * @param params - Analytics parameters including salonId and optional date range
 * @param token - JWT authentication token
 * @returns Promise with analytics data
 */
export async function getAnalytics(
  params: AnalyticsParams,
  token: string,
): Promise<AnalyticsResponse> {
  const { salonId, startDate, endDate } = params;

  // Build query string
  const queryParams = new URLSearchParams();
  if (startDate) queryParams.append("startDate", startDate);
  if (endDate) queryParams.append("endDate", endDate);

  const queryString = queryParams.toString();
  const url = `${BASE_URL}/analytics/salons/${salonId}${
    queryString ? `?${queryString}` : ""
  }`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    console.error("Analytics API error:", errorData);

    // Return empty analytics data instead of throwing
    return {
      message: "Analytics unavailable",
      data: {
        summary: {
          totalRevenue: "0",
          totalTransactions: 0,
          netProfit: "0",
          adminCommission: "0",
          averageTransactionValue: "0",
          uniqueCustomers: 0,
        },
        productRevenue: { total: "0", byCategory: [] },
        serviceRevenue: { total: "0", byCategory: [] },
        timeRange: { startDate: null, endDate: null },
      },
    };
  }

  return response.json();
}

/**
 * Get analytics for today
 */
export async function getTodayAnalytics(
  salonId: string,
  token: string,
): Promise<AnalyticsResponse> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = today.toISOString();

  today.setHours(23, 59, 59, 999);
  const endDate = today.toISOString();

  return getAnalytics({ salonId, startDate, endDate }, token);
}

/**
 * Get analytics for current week
 */
export async function getWeekAnalytics(
  salonId: string,
  token: string,
): Promise<AnalyticsResponse> {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
  endOfWeek.setHours(23, 59, 59, 999);

  return getAnalytics(
    {
      salonId,
      startDate: startOfWeek.toISOString(),
      endDate: endOfWeek.toISOString(),
    },
    token,
  );
}

/**
 * Get analytics for current month
 */
export async function getMonthAnalytics(
  salonId: string,
  token: string,
): Promise<AnalyticsResponse> {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);

  return getAnalytics(
    {
      salonId,
      startDate: startOfMonth.toISOString(),
      endDate: endOfMonth.toISOString(),
    },
    token,
  );
}

/**
 * Get analytics for current year
 */
export async function getYearAnalytics(
  salonId: string,
  token: string,
): Promise<AnalyticsResponse> {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  startOfYear.setHours(0, 0, 0, 0);

  const endOfYear = new Date(today.getFullYear(), 11, 31);
  endOfYear.setHours(23, 59, 59, 999);

  return getAnalytics(
    {
      salonId,
      startDate: startOfYear.toISOString(),
      endDate: endOfYear.toISOString(),
    },
    token,
  );
}

/**
 * Get all-time analytics (no date filters)
 */
export async function getAllTimeAnalytics(
  salonId: string,
  token: string,
): Promise<AnalyticsResponse> {
  return getAnalytics({ salonId }, token);
}

/**
 * Get analytics for a custom date range
 */
export async function getCustomRangeAnalytics(
  salonId: string,
  startDate: Date,
  endDate: Date,
  token: string,
): Promise<AnalyticsResponse> {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  return getAnalytics(
    {
      salonId,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    },
    token,
  );
}

/**
 * Get analytics for the last N days
 */
export async function getLastNDaysAnalytics(
  salonId: string,
  days: number,
  token: string,
): Promise<AnalyticsResponse> {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  return getAnalytics(
    {
      salonId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
    token,
  );
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: string | number): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(
  current: string | number,
  previous: string | number,
): number {
  const curr = typeof current === "string" ? parseFloat(current) : current;
  const prev = typeof previous === "string" ? parseFloat(previous) : previous;

  if (prev === 0) return curr > 0 ? 100 : 0;
  return ((curr - prev) / prev) * 100;
}
