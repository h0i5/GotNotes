"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { ClipLoader } from "react-spinners";
import { usePathname } from "next/navigation";
export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const supabase = createClient();
  const pathName = usePathname(); // Initialize useRouter

  useEffect(() => {
    async function fetchUser() {
      setLoading(true); // Set loading to true when fetching user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUser(null);
      } else {
        setUser(user);
        console.log("User:", user);
      }
      setLoading(false); // Set loading to false after fetching user
    }
    fetchUser();
  }, [supabase]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg px-6 py-3 mb-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex flex-row items-center gap-2">
          <Image src="Logo.svg" alt="VibeSec" height="32" width="32" />
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-[200%_auto] hover:bg-[100%_auto] transition-all duration-500 cursor-pointer"
          >
            {" "}
            GotNotes?
          </Link>
        </div>
        <div className="flex items-center gap-8">
          {pathName === "/" && ( // Show About button only on "/"
            <button
              onClick={() => scrollToSection("about")}
              className="relative font-medium group"
            >
              <span className="hidden md:flex hover:cursor-pointer transition transition-all-0.5s bg-clip-text text-transparent bg-gradient-to-r from-zinc-400 to-zinc-400 group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-300">
                About
              </span>
            </button>
          )}
          <Link
            href={user ? "/home" : "/signup"}
            className={
              user
                ? "relative hover:opacity-80 transition-opacity"
                : "relative px-6 py-2 font-semibold text-white rounded-lg overflow-hidden group hover:cursor-pointer"
            }
          >
            {loading ? ( // Show "Loading..." while loading
              <ClipLoader color="#ffffff" size={12} />
            ) : user ? (
              <Image
                src={user.user_metadata.picture.toString()}
                alt={user.user_metadata.full_name}
                width={32}
                height={32}
                className="rounded-full border border-2 hover:border-2 hover:border-purple-400 transition-all duration-300 ease-out"
              />
            ) : (
              <>
                <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out translate-y-full bg-gradient-to-r from-purple-600 to-cyan-600 group-hover:translate-y-0"></span>
                <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out bg-zinc-900 border border-zinc-700 rounded-lg group-hover:translate-y-[-100%]"></span>
                <span className="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out translate-y-full group-hover:translate-y-0 text-white">
                  Get Started!
                </span>
                <span className="relative group-hover:translate-y-[-200%] transition-all duration-300 ease-out inline-block">
                  Get Started
                </span>
              </>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
