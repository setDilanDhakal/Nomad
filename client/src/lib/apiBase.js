const rawApiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const API_BASE_URL = String(rawApiBaseUrl)
  .trim()
  .replace(/^['"`\s]+|['"`\s]+$/g, "")
  .replace(/\/+$/, "");

export function toAbsoluteUrl(value) {
  if (!value) {
    return "";
  }

  if (/^https?:\/\//i.test(value) || value.startsWith("data:")) {
    return value;
  }

  return `${API_BASE_URL}${value.startsWith("/") ? "" : "/"}${value}`;
}
