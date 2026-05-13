const DEFAULT_API_BASE_URL = "http://vps-9ebf5d76.vps.ovh.net:5000/api/v1";

export function getApiBaseUrl(): string {
  const baseUrl = process.env.API_BASE_URL || DEFAULT_API_BASE_URL;
  return baseUrl.replace(/\/+$/, "");
}
