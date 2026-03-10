import { supabase } from "./supabase";

export async function handleRedirect() {
  const slug = window.location.pathname.slice(1);

  // Don't intercept app routes
  if (!slug || ["login", "signup", "dashboard", "links", "analytics", "settings"].includes(slug)) {
    return false;
  }

  console.log("Slug detected:", slug);

  const { data, error } = await supabase
    .from("links")
    .select("id, original_url, expires_at")
    .eq("slug", slug)
    .maybeSingle();

    console.log("slug being queried:", slug);
console.log("data:", JSON.stringify(data));
console.log("error:", JSON.stringify(error));

  console.log("Supabase result:", data, error);

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
  window.location.href = data.original_url;
  return true;
}