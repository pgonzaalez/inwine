/**
 * Minimal cookie-consent store (GDPR / LOPDGDD friendly).
 *
 * Consent shape: { necessary: true, analysis: boolean, marketing: boolean, ts: number }
 * Persisted in localStorage AND a first-party cookie so it survives across
 * subdomains and can be read before React mounts.
 */
import { setCookie, getCookie, deleteCookie } from "./utils";

export const CONSENT_KEY = "inwine_cookie_consent";
const CONSENT_DAYS = 180;

export const DEFAULT_CONSENT = {
  necessary: true,
  analysis: false,
  marketing: false,
};

const OPEN_EVENT = "inwine:open-cookie-settings";
const CHANGE_EVENT = "inwine:cookie-consent-change";

/** Returns the stored consent object, or null if the user hasn't chosen yet. */
export function getConsent() {
  try {
    const raw =
      window.localStorage.getItem(CONSENT_KEY) || getCookie(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(decodeURIComponent(raw));
    if (parsed && typeof parsed === "object") {
      return { ...DEFAULT_CONSENT, ...parsed };
    }
  } catch {
    /* ignore malformed value */
  }
  return null;
}

export function hasConsented() {
  return getConsent() !== null;
}

export function consentAllows(category) {
  const c = getConsent();
  if (!c) return category === "necessary";
  return Boolean(c[category]);
}

/** Persist a consent choice and notify listeners. */
export function setConsent(partial) {
  const value = {
    ...DEFAULT_CONSENT,
    ...partial,
    necessary: true,
    ts: Date.now(),
  };
  const serialized = encodeURIComponent(JSON.stringify(value));
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
  } catch {
    /* storage disabled */
  }
  setCookie(CONSENT_KEY, serialized, CONSENT_DAYS);

  if (!value.analysis) {
    // Remove GA cookies if analytics consent was withdrawn.
    deleteCookie("_ga");
    document.cookie
      .split("; ")
      .map((c) => c.split("=")[0])
      .filter((n) => n.startsWith("_ga") || n.startsWith("_gid"))
      .forEach(deleteCookie);
  }

  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: value }));
  return value;
}

export const acceptAll = () => setConsent({ analysis: true, marketing: true });
export const rejectAll = () => setConsent({ analysis: false, marketing: false });

/** Open the cookie settings panel from anywhere (e.g. the Cookies Policy page). */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onOpenSettings(handler) {
  window.addEventListener(OPEN_EVENT, handler);
  return () => window.removeEventListener(OPEN_EVENT, handler);
}

export function onConsentChange(handler) {
  window.addEventListener(CHANGE_EVENT, handler);
  return () => window.removeEventListener(CHANGE_EVENT, handler);
}
