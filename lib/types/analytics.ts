// Analytics API Types
export interface AnalyticsSummary {
  totalRevenue: string;
  totalTransactions: number;
  netProfit: string;
  adminCommission: string;
  averageTransactionValue: string;
  uniqueCustomers: number;
}

export interface CategoryBreakdown {
  category: string | null;
  revenue: string;
  count: number;
  percentage: number;
}

export interface RevenueByType {
  total: string;
  byCategory: CategoryBreakdown[];
}

export interface TimeRange {
  startDate: string | null;
  endDate: string | null;
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  productRevenue: RevenueByType;
  serviceRevenue: RevenueByType;
  timeRange: TimeRange;
}

export interface AnalyticsResponse {
  message: string;
  data: AnalyticsData;
}

export interface AnalyticsParams {
  salonId: string;
  startDate?: string; // ISO 8601 format
  endDate?: string; // ISO 8601 format
}
