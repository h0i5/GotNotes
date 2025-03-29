"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { securityTopics } from "@/data/siteData";
import AboutSection from "@/components/AboutSection";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % securityTopics.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-zinc-900 via-purple-900/20 to-black text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="clouds-1 absolute inset-0 opacity-10 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 animate-cloud-drift-1"></div>
        <div className="clouds-2 absolute inset-0 opacity-10 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 animate-cloud-drift-2"></div>
      </div>
      <div className="relative flex flex-col min-h-screen">
        <Navbar />
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
              <span className="font-bold"></span>
            </h1>

            <div className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto font-light">
              No notes? No problem!
              <br className="hidden md:block" />
              <p className="italic text-purple-400">
                Made by students for students.
              </p>
            </div>
          </div>

          {/* About Section */}
          <AboutSection />
        </main>
      </div>
    </div>
  );
}
