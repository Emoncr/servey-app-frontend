const TOKEN_KEY = "token";

export const setAuthToken = (token: string) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TOKEN_KEY, token);
    // 7 days in seconds = 604800; set on the frontend domain so Next.js middleware has access
    document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax`;
  } catch (error) {
    console.error("Failed to store auth token:", error);
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const local = localStorage.getItem(TOKEN_KEY);
    if (local) return local;

    const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_KEY}=([^;]*)`));
    if (match?.[1]) {
      const cookieVal = decodeURIComponent(match[1]);
      localStorage.setItem(TOKEN_KEY, cookieVal);
      return cookieVal;
    }
    return null;
  } catch {
    return null;
  }
};

export const clearAuthToken = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(TOKEN_KEY);
    // Expire cookie with past date across possible path and domain scopes
    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax`;
    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0`;
    document.cookie = `${TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0`;
  } catch (error) {
    console.error("Failed to clear auth token:", error);
  }
};
