import { createClient } from "../../../lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const oauthError = url.searchParams.get("error_description") || url.searchParams.get("error");

  if (oauthError) {
    return NextResponse.redirect(new URL("/login?error=" + encodeURIComponent(oauthError), request.url));
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.redirect(
      new URL("/login?error=" + encodeURIComponent(error.message), request.url)
    );
  }

  return NextResponse.redirect(
    new URL("/login?error=No%20authorization%20code%20was%20returned", request.url)
  );
}
