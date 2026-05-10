/* eslint-disable @typescript-eslint/no-explicit-any */

export const decodeJwt = (token: string): Record<string, any> | null => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const getStoredToken = (): string | null => {
  return (
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    localStorage.getItem('authToken') ||
    sessionStorage.getItem('token') ||
    sessionStorage.getItem('accessToken') ||
    null
  );
};