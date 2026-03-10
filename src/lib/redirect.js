import { supabase } from "./supabase";

export async function handleRedirect() {
  const slug = window.location.pathname.slice(1);

  // Don't intercept app routes
  if (!slug || ["login", "signup", "dashboard", "links", "analytics", "settings"].includes(slug)) {
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
  await supabase.from("clicks").insert({
    link_id: data.id,
    clicked_at: new Date().toISOString(),
  });

  // Redirect
  let redirectUrl = data.original_url;
  if (!redirectUrl.startsWith("http://") && !redirectUrl.startsWith("https://")) {
    redirectUrl = "https://" + redirectUrl;
  }
  window.location.href = redirectUrl;
  return true;
}