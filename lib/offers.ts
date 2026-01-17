import {
  Offer,
  CreateOfferData,
  UpdateOfferData,
  OfferListResponse,
  OfferResponse,
  ValidateOfferResponse,
  ValidateOfferRequest,
  OfferFilters,
} from "./types/offers";

const BASE_URL = "/api";

/**
 * Create a new offer
 */
export async function createOffer(
  data: CreateOfferData,
  token: string,
): Promise<OfferResponse> {
  const formData = new FormData();

  formData.append("salonId", data.salonId);
  formData.append("title", data.title);
  if (data.description) formData.append("description", data.description);
  formData.append("offerType", data.offerType);
  if (data.productId) formData.append("productId", data.productId);
  if (data.serviceId) formData.append("serviceId", data.serviceId);
  formData.append("discountType", data.discountType);
  formData.append("discountValue", data.discountValue);
  formData.append("startsAt", data.startsAt);
  formData.append("endsAt", data.endsAt);
  if (data.image) formData.append("image", data.image);

  const response = await fetch(`${BASE_URL}/offers`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Failed to create offer" }));
    throw new Error(error.message || "Failed to create offer");
  }

  return response.json();
}

/**
 * Update an existing offer
 */
export async function updateOffer(
  id: string,
  data: UpdateOfferData,
  token: string,
): Promise<OfferResponse> {
  const formData = new FormData();

  if (data.title) formData.append("title", data.title);
  if (data.description) formData.append("description", data.description);
  if (data.discountValue) formData.append("discountValue", data.discountValue);
  if (data.startsAt) formData.append("startsAt", data.startsAt);
  if (data.endsAt) formData.append("endsAt", data.endsAt);
  if (data.image) formData.append("image", data.image);

  const response = await fetch(`${BASE_URL}/offers/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Failed to update offer" }));
    throw new Error(error.message || "Failed to update offer");
  }

  return response.json();
}

/**
 * Toggle offer active status
 */
export async function toggleOfferStatus(
  id: string,
  isActive: boolean,
  token: string,
): Promise<OfferResponse> {
  const response = await fetch(`${BASE_URL}/offers/${id}/toggle`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isActive }),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Failed to toggle offer status" }));
    throw new Error(error.message || "Failed to toggle offer status");
  }

  return response.json();
}

/**
 * Delete an offer
 */
export async function deleteOffer(
  id: string,
  token: string,
): Promise<{ message: string }> {
  const response = await fetch(`${BASE_URL}/offers/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Failed to delete offer" }));
    throw new Error(error.message || "Failed to delete offer");
  }

  return response.json();
}

/**
 * Get all offers with filters
 */
export async function getOffers(
  filters: OfferFilters,
  token: string,
): Promise<OfferListResponse> {
  const queryParams = new URLSearchParams();

  if (filters.salonId) queryParams.append("salonId", filters.salonId);
  if (filters.productId) queryParams.append("productId", filters.productId);
  if (filters.serviceId) queryParams.append("serviceId", filters.serviceId);
  if (filters.activeOnly) queryParams.append("activeOnly", "true");
  if (filters.page) queryParams.append("page", filters.page.toString());
  if (filters.limit) queryParams.append("limit", filters.limit.toString());

  const queryString = queryParams.toString();
  const url = `${BASE_URL}/offers${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Failed to fetch offers" }));
    throw new Error(error.message || "Failed to fetch offers");
  }

  return response.json();
}

/**
 * Get offer by ID
 */
export async function getOfferById(
  id: string,
  token: string,
): Promise<OfferResponse> {
  const response = await fetch(`${BASE_URL}/offers/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Failed to fetch offer" }));
    throw new Error(error.message || "Failed to fetch offer");
  }

  return response.json();
}

/**
 * Get active offers (public)
 */
export async function getActiveOffers(
  filters: OfferFilters,
): Promise<OfferListResponse> {
  const queryParams = new URLSearchParams();

  if (filters.salonId) queryParams.append("salonId", filters.salonId);
  if (filters.productId) queryParams.append("productId", filters.productId);
  if (filters.serviceId) queryParams.append("serviceId", filters.serviceId);
  if (filters.page) queryParams.append("page", filters.page.toString());
  if (filters.limit) queryParams.append("limit", filters.limit.toString());

  const queryString = queryParams.toString();
  const url = `${BASE_URL}/offers/public/active${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Failed to fetch active offers" }));
    throw new Error(error.message || "Failed to fetch active offers");
  }

  return response.json();
}

/**
 * Validate offer and calculate discount
 */
export async function validateOffer(
  data: ValidateOfferRequest,
): Promise<ValidateOfferResponse> {
  const response = await fetch(`${BASE_URL}/offers/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    return result;
  }

  return result;
}

/**
 * Format discount display
 */
export function formatDiscount(
  discountType: string,
  discountValue: string,
): string {
  if (discountType === "percentage") {
    return `${discountValue}% OFF`;
  }
  return `$${parseFloat(discountValue).toFixed(2)} OFF`;
}

/**
 * Check if offer is currently active
 */
export function isOfferActive(offer: Offer): boolean {
  const now = new Date();
  const startsAt = new Date(offer.startsAt);
  const endsAt = new Date(offer.endsAt);

  return offer.isActive && now >= startsAt && now <= endsAt;
}

/**
 * Get offer status label
 */
export function getOfferStatusLabel(offer: Offer): {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
} {
  const now = new Date();
  const startsAt = new Date(offer.startsAt);
  const endsAt = new Date(offer.endsAt);

  if (!offer.isActive) {
    return { label: "Inactive", variant: "secondary" };
  }

  if (now < startsAt) {
    return { label: "Scheduled", variant: "outline" };
  }

  if (now > endsAt) {
    return { label: "Expired", variant: "destructive" };
  }

  return { label: "Active", variant: "default" };
}
