import { BASE_URL } from "@/config/api";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function getXsrfTokenFromCookie() {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

let csrfCookiePromise = null;

// Sanctum SPA: antes de la primera petición que muta estado hace falta pedir
// la cookie CSRF (GET /sanctum/csrf-cookie). Se memoiza en curso para no
// disparar varias peticiones a la vez si hay llamadas simultáneas.
function ensureCsrfCookie() {
  if (getXsrfTokenFromCookie()) return Promise.resolve();

  if (!csrfCookiePromise) {
    csrfCookiePromise = fetch(`${BASE_URL}/sanctum/csrf-cookie`, {
      credentials: "include",
    }).finally(() => {
      csrfCookiePromise = null;
    });
  }

  return csrfCookiePromise;
}

// Sustituto de `fetch` para llamadas a la API: manda siempre la cookie de
// sesión (credentials: "include") y, en peticiones que mutan estado, la
// cabecera X-XSRF-TOKEN que exige Sanctum contra CSRF.
export async function apiFetch(url, options = {}) {
  const method = (options.method || "GET").toUpperCase();

  if (MUTATING_METHODS.has(method)) {
    await ensureCsrfCookie();
  }

  const headers = new Headers(options.headers || {});

  const xsrfToken = getXsrfTokenFromCookie();
  if (xsrfToken && MUTATING_METHODS.has(method)) {
    headers.set("X-XSRF-TOKEN", xsrfToken);
  }

  return fetch(url, {
    ...options,
    credentials: "include",
    headers,
  });
}
