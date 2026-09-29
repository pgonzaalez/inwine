export const API_URL = import.meta.env.VITE_API_URL;
export const BASE_URL = import.meta.env.VITE_URL_BASE;
export const SITE_URL = import.meta.env.VITE_SITE_URL;

if (import.meta.env.DEV) {
  if (!API_URL) {
    console.warn("VITE_API_URL is not defined. Set it in your .env file.");
  }
  if (!BASE_URL) {
    console.warn("VITE_URL_BASE is not defined. Set it in your .env file.");
  }
  if (!SITE_URL) {
    console.warn("VITE_SITE_URL is not defined. Set it in your .env file.");
  }
}
