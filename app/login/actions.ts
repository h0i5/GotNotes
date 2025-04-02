"use server";

import { Provider } from "@supabase/supabase-js";
import { createClient } from "../utils/supabase/server";
import { redirect } from "next/navigation";

const signInWith = (provider: Provider) => async () => {
  if (!provider) {
    throw new Error("Provider is required");
  }
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      queryParams: { access_type: "offline", prompt: "consent", next: "/profile/complete" },
    },
  });

  if (error) {
    console.error("Error during sign-in:", error);
    throw new Error(error.message);
  }

  if (!data) {
    console.error("No data returned from sign-in");
    throw new Error("No data returned from sign-in");
  }

  console.log(data);

  const { url } = data;
  if (!url) {
    console.error("No URL returned from sign-in");
    throw new Error("No URL returned from sign-in");
  }

  // Redirect to the sign-in URL
  redirect(url);
};

const signInWithGoogle = signInWith("google");

export { signInWithGoogle };
