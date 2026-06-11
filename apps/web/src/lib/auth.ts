export function logout() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem("assetIntegritySession");
  window.localStorage.removeItem("assetIntegrityUser");
}