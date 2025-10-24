import { useEffect } from "react";

function upsertMeta({ name, property, content }) {
  if (!content) return;
  const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    if (name) el.setAttribute("name", name);
    if (property) el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink({ rel, href }) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export default function SEO({
  title,
  description,
  url,
  image,
  type = "website",
  noindex = false,
  structuredData, // JSON object -> JSON-LD
}) {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) document.title = title;

    // robots
    upsertMeta({ name: "robots", content: noindex ? "noindex,follow" : "index,follow" });

    // basic
    upsertMeta({ name: "description", content: description });

    // canonical
    upsertLink({ rel: "canonical", href: url });

    // OpenGraph
    upsertMeta({ property: "og:title", content: title });
    upsertMeta({ property: "og:description", content: description });
    upsertMeta({ property: "og:type", content: type });
    upsertMeta({ property: "og:url", content: url });
    upsertMeta({ property: "og:image", content: image });

    // Twitter
    upsertMeta({ name: "twitter:card", content: image ? "summary_large_image" : "summary" });
    upsertMeta({ name: "twitter:title", content: title });
    upsertMeta({ name: "twitter:description", content: description });
    upsertMeta({ name: "twitter:image", content: image });

    // JSON-LD
    let ldEl;
    if (structuredData) {
      ldEl = document.head.querySelector('script[type="application/ld+json"]');
      if (!ldEl) {
        ldEl = document.createElement("script");
        ldEl.type = "application/ld+json";
        document.head.appendChild(ldEl);
      }
      ldEl.textContent = JSON.stringify(structuredData);
    }

    // optional cleanup (title’ı geri alma)
    return () => {
      if (prevTitle) document.title = prevTitle;
    };
  }, [title, description, url, image, type, noindex, structuredData]);

  return null;
}
