import { createClient } from "../../../utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        queryParams: { access_type: "offline", prompt: "consent", next: "/profile/complete" },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ url: data.url }, { status: 200 });
  } catch (error) {
    console.error("Error during sign-in:", error);
    // Handle the error appropriately
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
