"use server";

import { auth } from "@clerk/nextjs/server";
import { encryptJson } from "@/lib/crypto";
import { createServiceClient } from "@/lib/supabase";

export async function createAcoProfile(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Authentication required.");
  }

  const retailEmail = String(formData.get("retailEmail") ?? "").trim();
  const displayName = String(formData.get("displayName") ?? "").trim();
  const shippingName = String(formData.get("shippingName") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!displayName || !retailEmail) {
    throw new Error("Display name and account email are required.");
  }

  const encryptedPayload = encryptJson({
    retailEmail,
    shippingName,
    notes,
  });

  const supabase = createServiceClient();
  await supabase.from("profiles").upsert({
    clerk_user_id: userId,
  });

  const { error } = await supabase.from("aco_profiles").insert({
    clerk_user_id: userId,
    display_name: displayName,
    encrypted_payload: encryptedPayload,
  });

  if (error) {
    throw new Error(error.message);
  }
}
