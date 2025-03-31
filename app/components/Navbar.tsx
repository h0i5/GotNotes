"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { createClient } from "../utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { ClipLoader } from "react-spinners";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const supabase = createClient();
  const pathName = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUser(null);
      } else {
        setUser(user);
      }
      setLoading(false);
    }
    fetchUser();
  }, [supabase]);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsProfileOpen(false);
  };

  return (
    <nav className="bg-zinc-900/50 backdrop-blur-sm border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image src="/Logo.svg" className="w-9 h-9 mr-2" alt="Logo" width={32} height={32} />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
                GotNotes?
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {!loading ? (
              user ? (
                <>
                  <Link
                    href="/home"
                    className={`text-zinc-300 hover:text-white transition-colors ${
                      pathName === "/home" ? "text-white font-medium" : ""
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    href="/colleges"
                    className={`text-zinc-300 hover:text-white transition-colors ${
                      pathName === "/colleges" ? "text-white font-medium" : ""
                    }`}
                  >
                    Colleges
                  </Link>
                  
                  {/* Profile Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center focus:outline-none"
                    >
                      {user.user_metadata.avatar_url && (
                        <Image
                          src={user.user_metadata.avatar_url}
                          alt="Profile"
                          width={32}
                          height={32}
                          className="rounded-full hover:ring-2 hover:ring-purple-500 transition-all duration-200"
                        />
                      )}
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-48 py-2 bg-zinc-900 rounded-xl border border-zinc-800 shadow-xl">
                        <div className="px-4 py-2 border-b border-zinc-800">
                          <p className="text-sm text-zinc-400">Signed in as</p>
                          <p className="text-sm font-medium text-white truncate">
                            {user.email}
                          </p>
                        </div>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-white hover:bg-red-500/10 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 rounded-lg font-medium text-white transition-all duration-300 hover:cursor-pointer"
                >
                  Login
                </Link>
              )
            ) : (
              <ClipLoader color="#a855f7" size={24} />
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-zinc-900 border-t border-zinc-800">
            {!loading ? (
              user ? (
                <>
                  <Link
                    href="/home"
                    className={`block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 ${
                      pathName === "/home" ? "bg-zinc-800 text-white" : ""
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/colleges"
                    className={`block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 ${
                      pathName === "/colleges" ? "bg-zinc-800 text-white" : ""
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Colleges
                  </Link>
                  <div className="px-3 py-2 flex items-center justify-between">
                    <div className="flex items-center">
                      {user.user_metadata.avatar_url && (
                        <Image
                          src={user.user_metadata.avatar_url}
                          alt="Profile"
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      )}
                      <span className="ml-3 text-sm text-zinc-400">{user.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-white hover:bg-red-500"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-purple-500 to-cyan-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )
            ) : (
              <div className="px-3 py-2">
                <ClipLoader color="#a855f7" size={24} />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
