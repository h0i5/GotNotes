"use client";

import { useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        redirect("/");
      }
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <div>
      <div className=" max-w-7xl mx-auto flex flex-col">
        <div className="text-start flex flex-col">
          <h1 className="text-4xl font-bold">
            Welcome,{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
              {user?.email?.split("@")[0]}!
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
}
