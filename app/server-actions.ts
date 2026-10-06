"use server";

import { createClient } from "../lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function login(f: FormData) {
  const email = String(f.get("email") || "").trim();
  const password = String(f.get("password") || "");

  if (!email || !password) redirect("/login?error=Please%20enter%20your%20email%20and%20password");

  const s = await createClient();
  const { error } = await s.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/login?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function register(f: FormData) {
  const email = String(f.get("email") || "").trim();
  const password = String(f.get("password") || "");
  const artist = String(f.get("artist") || "").trim();

  const s = await createClient();
  const { data, error } = await s.auth.signUp({
    email,
    password,
    options: { data: { artist_name: artist } },
  });

  if (error || !data.user) {
    redirect("/register?error=" + encodeURIComponent(error?.message || "Unable to create account"));
  }

  // The database trigger creates the artist profile. Do not insert it again here.
  if (!data.session) {
    redirect("/login?error=" + encodeURIComponent("Account created. Please confirm your email, then sign in."));
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
