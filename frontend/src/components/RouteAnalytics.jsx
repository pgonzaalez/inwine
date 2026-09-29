import { useEffect } from "react";
import { useLocation } from "react-router";
import { trackPageView } from "@utils/analytics";

/**
 * Fires a GA4 page_view on every client-side navigation.
 * Render once inside <Router>.
 */
export default function RouteAnalytics() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  return null;
}
