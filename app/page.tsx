"use client";

import { useState, useEffect } from "react";
import { securityTopics } from "@/data/siteData";
import AboutSection from "@/app/components/AboutSection";
import Link from "next/link";
import { createClient } from "./utils/supabase/client";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkAuth();
  }, [supabase]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % securityTopics.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden"></div>
      <div className="relative flex flex-col min-h-screen">
        <main className="flex-1 flex flex-col items-center pt-32 pb-16 px-4 max-w-5xl mx-auto w-full">
          {/* Hero Section */}
          <div className="text-center mb-20 w-full">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold leading-tight tracking-tight mb-6">
              <span className="font-extrabold transition-all duration-500">
                One platform for
              </span>{" "}
              <br />
              <div className="h-[1.2em] relative overflow-hidden my-2">
                {securityTopics.map((topic, index) => (
                  <div
                    key={topic.id}
                    className={`absolute w-full transition-all duration-700 ease-in-out ${
                      index === activeIndex
                        ? "translate-y-0 opacity-100"
                        : index ===
                          (activeIndex - 1 + securityTopics.length) %
                            securityTopics.length
                        ? "-translate-y-14 opacity-0"
                        : "translate-y-14 opacity-0"
                    }`}
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500 font-black">
                      {topic.name}
                    </span>
                  </div>
                ))}
              </div>
            </h1>

            <div className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto font-light mb-8">
              No notes? No problem!
              <br className="hidden md:block" />
              <p className="italic text-purple-400">
                Made by a student for students.
              </p>
            </div>

            {!isLoggedIn && (
              <Link
                href="/login"
                className="inline-flex px-8 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 rounded-lg font-medium text-white transition-all duration-300 transform hover:scale-[1.02]"
              >
                Get Started!
              </Link>
            )}
          </div>

          {/* About Section */}
          <AboutSection />

          {/* College Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Your College Section */}
            <div className="p-6 rounded-xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 shadow-xl">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <h2 className="text-xl font-semibold text-white">Your College</h2>
                </div>
                <p className="text-zinc-400">
                  Join your college community to access shared resources and collaborate with peers.
                </p>
                <Link
                  href={isLoggedIn ? "/colleges" : "/login"}
                  className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 hover:from-purple-500 hover:to-cyan-500 border border-purple-500/50 hover:border-transparent rounded-lg font-medium text-purple-400 hover:text-white transition-all duration-300 text-center"
                >
                  {isLoggedIn ? "Find Your College" : "Get Started"}
                </Link>
              </div>
            </div>

            {/* Study Together Section */}
            <div className="p-6 rounded-xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 shadow-xl">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h2 className="text-xl font-semibold text-white">Study Together</h2>
                </div>
                <p className="text-zinc-400">
                  Share notes, papers, and discuss with your classmates in real-time.
                </p>
                <Link
                  href={isLoggedIn ? "/colleges" : "/login"}
                  className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 hover:from-purple-500 hover:to-cyan-500 border border-purple-500/50 hover:border-transparent rounded-lg font-medium text-purple-400 hover:text-white transition-all duration-300 text-center"
                >
                  {isLoggedIn ? "Get Started" : "Join Now"}
                </Link>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
