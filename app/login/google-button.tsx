"use client";

import { createClient } from "../../lib/supabase/client";

export default function GoogleButton() {
  async function signInWithGoogle() {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      window.location.href = "/login?error=google";
    }
  }

  return (
    <button type="button" className="outline" onClick={signInWithGoogle}>
      Continue with Google
    </button>
  );
}
