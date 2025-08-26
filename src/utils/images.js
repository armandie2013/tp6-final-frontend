export function safeImage(url) {
  if (!url) return "";
  const clean = url.trim().replace(/^https?:\/\//,"");
  // Proxy: https://wsrv.nl/
  return `https://images.weserv.nl/?url=${encodeURIComponent(clean)}&w=800&h=600&fit=contain&we=1`;
}