/**
 * Lightweight Google Analytics 4 helpers with consent gating.
 *
 * The GA script is NOT loaded until the user explicitly grants analytics
 * consent. If they reject, nothing is loaded and no GA cookie is ever set.
 * All helpers are safe to call unconditionally (they no-op without consent
 * or when VITE_GA_MEASUREMENT_ID is not configured).
 */
import { consentAllows } from "./cookieConsent";

export const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let gtagLoaded = false;

function gtag() {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(arguments);
}

/** Inject the GA script exactly once, and only with analytics consent. */
function ensureGtagLoaded() {
  if (gtagLoaded || !GA_ID || !consentAllows("analysis")) return false;
  gtagLoaded = true;

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  window.gtag = window.gtag || gtag;
  window.gtag("js", new Date());
  window.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: consentAllows("marketing") ? "granted" : "denied",
  });
  // SPA: we send page_view manually on route changes.
  window.gtag("config", GA_ID, { send_page_view: false });
  return true;
}

/** Delete any GA cookies that might already exist (used when consent is withdrawn). */
function purgeGaCookies() {
  const host = window.location.hostname;
  const domains = [host, `.${host}`, ""];
  document.cookie
    .split("; ")
    .map((c) => c.split("=")[0])
    .filter((n) => /^_ga|^_gid$|^_gat|^_gcl/.test(n))
    .forEach((name) => {
      domains.forEach((d) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${
          d ? `; domain=${d}` : ""
        }`;
      });
    });
}

/**
 * Apply the current consent state.
 * Call on load and whenever the user changes their choice.
 */
export function syncAnalyticsConsent() {
  if (!GA_ID) return;

  if (consentAllows("analysis")) {
    ensureGtagLoaded();
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: consentAllows("marketing") ? "granted" : "denied",
      });
    }
  } else {
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
      });
    }
    purgeGaCookies();
  }
}

/** Send a SPA page_view (only if analytics consent was granted). */
export function trackPageView(path) {
  if (!ensureGtagLoaded() && !gtagLoaded) return;
  if (!consentAllows("analysis") || typeof window.gtag !== "function") return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/** Send a custom event (only if analytics consent was granted). */
export function trackEvent(name, params = {}) {
  if (!ensureGtagLoaded() && !gtagLoaded) return;
  if (!consentAllows("analysis") || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}
