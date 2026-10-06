"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";

async function requireOwner() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Owner login required");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || profile?.role !== "owner") {
    throw new Error("Owner access required");
  }

  return { supabase, user };
}

export async function approveRelease(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const releaseId = String(formData.get("releaseId") || "");

  if (!releaseId) throw new Error("Missing release ID");

  const { error } = await supabase
    .from("releases")
    .update({
      status: "approved",
      rejection_reason: null,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", releaseId);

  if (error) throw new Error(error.message);

  revalidatePath("/owner");
  revalidatePath("/dashboard");
}

export async function rejectRelease(formData: FormData) {
  const { supabase, user } = await requireOwner();
  const releaseId = String(formData.get("releaseId") || "");
  const reason = String(formData.get("reason") || "").trim();

  if (!releaseId) throw new Error("Missing release ID");
  if (!reason) throw new Error("Please provide a rejection reason");

  const { error } = await supabase
    .from("releases")
    .update({
      status: "rejected",
      rejection_reason: reason,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", releaseId);

  if (error) throw new Error(error.message);

  revalidatePath("/owner");
  revalidatePath("/dashboard");
}
