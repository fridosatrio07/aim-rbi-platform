"use client";

type RouterLike = {
  push: (href: string) => void;
  replace: (href: string) => void;
};

export function isFileProtocol() {
  return typeof window !== "undefined" && window.location.protocol === "file:";
}

function getStaticOutRootHref() {
  const href = window.location.href.split("#")[0].split("?")[0].replace(/\\/g, "/");
  const marker = "/out/";
  const markerIndex = href.toLowerCase().lastIndexOf(marker);

  if (markerIndex >= 0) {
    return href.slice(0, markerIndex + marker.length);
  }

  return href.replace(/\/[^/]*$/, "/");
}

export function toStaticAssetHref(assetPath: string) {
  if (!isFileProtocol()) return assetPath;
  if (/^(https?:|data:|blob:|mailto:|tel:|#)/i.test(assetPath)) return assetPath;

  return `${getStaticOutRootHref()}${assetPath.replace(/^\/+/, "")}`;
}

export function toStaticFileHref(route: string) {
  if (!isFileProtocol()) return route;
  if (/^(https?:|mailto:|tel:|#)/i.test(route)) return route;

  const fallbackOrigin = "http://asset-integrity.local";
  const parsed = new URL(route, fallbackOrigin);
  const routeHash = `${parsed.pathname}${parsed.search}${parsed.hash}`;

  return `${getStaticOutRootHref()}index.html#${routeHash}`;
}

export function getCurrentAppRoute() {
  if (!isFileProtocol()) return window.location.pathname;

  const pathName = decodeURIComponent(window.location.pathname).replace(/\\/g, "/");
  const marker = "/out/";
  const markerIndex = pathName.toLowerCase().lastIndexOf(marker);
  const withinOut = markerIndex >= 0 ? pathName.slice(markerIndex + marker.length) : pathName.replace(/^\/+/, "");
  const route = withinOut.replace(/\/index\.html$/i, "").replace(/\.html$/i, "");

  if (!route || route === "index") return "/";
  return `/${route.replace(/^\/+|\/+$/g, "")}`;
}

export function navigateToAppRoute(router: RouterLike, route: string, mode: "push" | "replace" = "push") {
  if (isFileProtocol()) {
    window.location.href = toStaticFileHref(route);
    return;
  }

  router[mode](route);
}
