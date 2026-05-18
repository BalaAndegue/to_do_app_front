import { ApiError, OpenAPI } from "@/lib";

export const AUTH_TOKEN_STORAGE_KEY = "auth_token";

const getApiBaseUrl = (): string => {
  const envBase = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!envBase) {
    return OpenAPI.BASE;
  }

  return envBase.replace(/\/+$/, "");
};

export const configureOpenApiClient = (token: string | null): void => {
  OpenAPI.BASE = getApiBaseUrl();
  OpenAPI.TOKEN = undefined;
  OpenAPI.HEADERS = token ? { Authorization: `Token ${token}` } : undefined;
};

export const extractAuthToken = (payload: unknown): string | null => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const response = payload as Record<string, unknown>;
  const candidates = [
    response.token,
    response.access,
    response.key,
    (response.data as Record<string, unknown> | undefined)?.token,
    (response.data as Record<string, unknown> | undefined)?.access,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate;
    }
  }

  return null;
};

export const normalizeApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    const body = error.body as Record<string, unknown> | undefined;

    const detail =
      (typeof body?.detail === "string" && body.detail) ||
      (Array.isArray(body?.non_field_errors) &&
        typeof body?.non_field_errors[0] === "string" &&
        body.non_field_errors[0]) ||
      (typeof body?.message === "string" && body.message);

    if (detail) {
      return detail;
    }

    return `${error.status} ${error.statusText}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Une erreur inattendue est survenue.";
};
