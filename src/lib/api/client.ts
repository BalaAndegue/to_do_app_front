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
    if (error.status === 403) {
      return "Accès refusé. Vous n'avez pas la permission d'effectuer cette action.";
    }

    const body = error.body as Record<string, unknown> | undefined;

    const detail =
      (typeof body?.detail === "string" && body.detail) ||
      (Array.isArray(body?.non_field_errors) &&
        typeof body?.non_field_errors[0] === "string" &&
        body.non_field_errors[0]) ||
      (typeof body?.message === "string" && body.message);

    if (detail) return detail;

    // Collect field-level validation messages (e.g. {"password": ["Trop courant."]})
    if (body) {
      const skip = new Set(["detail", "non_field_errors", "message"]);
      const msgs: string[] = [];
      for (const [key, val] of Object.entries(body)) {
        if (skip.has(key)) continue;
        if (Array.isArray(val)) {
          for (const v of val) {
            if (typeof v === "string") msgs.push(v);
          }
        }
      }
      if (msgs.length > 0) return msgs.join(" ");
    }

    return "Une erreur est survenue. Vérifiez les champs du formulaire.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Une erreur inattendue est survenue.";
};

export const extractFieldErrors = (error: unknown): Record<string, string[]> => {
  if (!(error instanceof ApiError)) return {};
  const body = error.body as Record<string, unknown> | undefined;
  if (!body) return {};
  const skip = new Set(["detail", "non_field_errors", "message"]);
  const result: Record<string, string[]> = {};
  for (const [key, val] of Object.entries(body)) {
    if (skip.has(key)) continue;
    if (Array.isArray(val)) {
      const strings = val.filter((v): v is string => typeof v === "string");
      if (strings.length > 0) result[key] = strings;
    }
  }
  return result;
};
