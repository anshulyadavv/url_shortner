import { supabase } from "./supabase";

export async function handleRedirect() {
  const slug = window.location.pathname.slice(1);

  // Don't intercept app routes
  if (
    !slug ||
    ["login", "signup", "dashboard", "links", "analytics", "settings"].includes(
      slug,
    )
  ) {
    return false;
  }

  const { data, error } = await supabase
    .from("links")
    .select("id, original_url, expires_at")
    .eq("slug", slug)
    .maybeSingle();

  // No match — let app render normally
  if (error || !data) return false;

  // Check expiry
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    alert("This link has expired.");
    window.location.href = "/";
    return true;
  }

  // Track click
  const device = /mobile|android|iphone|ipad/i.test(navigator.userAgent)
    ? "Mobile"
    : "Desktop";

  const referrer = document.referrer
    ? new URL(document.referrer).hostname
    : "Direct";

  let country = null;
  try {
    const geo = await fetch("https://ipapi.co/json/");
    const geoData = await geo.json();
    country = geoData.country_name;
  } catch {
    country = null;
  }
await supabase.from("clicks").insert({
  link_id: data.id,
  clicked_at: new Date().toISOString(),
  device,
  referrer,
  country,
});

  // Redirect
  let redirectUrl = data.original_url;
  if (
    !redirectUrl.startsWith("http://") &&
    !redirectUrl.startsWith("https://")
  ) {
    redirectUrl = "https://" + redirectUrl;
  }
  window.location.href = redirectUrl;
  return true;
}
