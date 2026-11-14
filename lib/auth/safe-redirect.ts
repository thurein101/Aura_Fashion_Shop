const DEFAULT_REDIRECT_URL = "/";

export const sanitizeCallBackUrl = (
  callBackUrl: string | null | undefined,
  fallback: string = DEFAULT_REDIRECT_URL,
): string => {
  if (!callBackUrl || typeof callBackUrl !== "string") {
    return fallback;
  }

  const trimmed = callBackUrl.trim();

  if (trimmed.startsWith("//") || trimmed.includes("@")) {
    return fallback;
  }

  try {
    const url = new URL(trimmed, "http://localhost3000");

    if (url.origin !== "http://localhost3000") {
      return fallback;
    }

    return url.pathname + url.search + url.hash;
  } catch {
    return fallback;
  }
};
