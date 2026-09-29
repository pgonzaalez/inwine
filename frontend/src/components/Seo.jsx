import { useEffect } from "react";
import PropTypes from "prop-types";
import { SITE_URL as CONFIG_SITE_URL } from "@/config/api";

const SITE_NAME = "InWine";
const SITE_URL = (CONFIG_SITE_URL ?? "").replace(/\/$/, "");
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;
const DEFAULT_DESCRIPTION =
  "InWine connecta cellers, restaurants i inversors en un sol lloc. Descobreix vins seleccionats, inverteix en partides exclusives i fes créixer el teu negoci vitivinícola.";

/** Create or update a <meta> tag in <head>. */
function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Per-page SEO / Open Graph / Twitter tags for the SPA.
 * Drop <Seo title="..." description="..." /> near the top of any page.
 */
export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
}) {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : SITE_NAME;
  const url =
    SITE_URL +
    (path ?? (typeof window !== "undefined" ? window.location.pathname : "/"));

  useEffect(() => {
    document.title = fullTitle;

    setMeta("name", "description", description);
    setMeta(
      "name",
      "robots",
      noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large",
    );
    setLink("canonical", url);

    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", type);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", image);
    setMeta("property", "og:site_name", SITE_NAME);

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);
  }, [fullTitle, description, url, image, type, noindex]);

  return null;
}

Seo.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  path: PropTypes.string,
  image: PropTypes.string,
  type: PropTypes.string,
  noindex: PropTypes.bool,
};
