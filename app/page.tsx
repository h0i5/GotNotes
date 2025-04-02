"use client";

import { useState, useEffect } from "react";
import { securityTopics } from "@/data/siteData";
import AboutSection from "@/app/components/AboutSection";
import Link from "next/link";
import { createClient } from "./utils/supabase/client";
import { Gitlab } from "lucide-react";
import Image from "next/image";
import ImageModal from "@/app/components/ImageModal";

const showcaseImages = [
  {
    src: "/screenshots/Dashboard.jpg",
    alt: "Dashboard",
    title: "Modern Dashboard",
    description: "Clean and intuitive interface for managing your courses and resources."
  },
  {
    src: "/screenshots/Notes.jpg",
    alt: "Notes View",
    title: "Notes Management",
    description: "Easy-to-use notes organization and sharing system."
  },
  {
    src: "/screenshots/PYQ.jpg",
    alt: "Previous Year Question Papers",
    title: "Previous Year Question Papers",
    description: "Access previous year question papers for your courses."
  },
 
];

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabase = createClient();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageAlt, setSelectedImageAlt] = useState<string>("");

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
              College centric notes and resources sharing platform.
              <br className="hidden md:block" />
              <p className="italic text-zinc-400 mt-4">
                  Answering the infamous question every college students asks each semester. <span className=" text-purple-400">Got Notes?</span>
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
          
        </main>
          {/* About Section */}
          <AboutSection />

          
          {/* College Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 mx-[10%]">
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
              <div className="flex flex-col gap-4 h-full">
                <div className="flex items-center gap-3 h-full">
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
                  className="mt-auto w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 hover:from-purple-500 hover:to-cyan-500 border border-purple-500/50 hover:border-transparent rounded-lg font-medium text-purple-400 hover:text-white transition-all duration-300 text-center"
                >
                  {isLoggedIn ? "Get Started" : "Join Now"}
                </Link>
              </div>
            </div>
          </div>


         {/* Add this showcase section before the footer */}
         <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Everything you need to
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 ml-2">
                ace your semester
              </span>
            </h2>
            <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
              From course materials to previous year papers, GotNotes has got you covered!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {showcaseImages.map((image) => (
                <div
                  key={image.title}
                  className="group relative bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800/50 overflow-hidden transition-all duration-300 hover:border-purple-500/50"
                >
                  <div 
                    className="relative h-48 sm:h-56 md:h-64 cursor-pointer overflow-hidden"
                    onClick={() => {
                      setSelectedImage(image.src);
                      setSelectedImageAlt(image.alt);
                    }}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transform transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white group-hover:text-purple-400 transition-colors">
                      {image.title}
                    </h3>
                    <p className="text-sm sm:text-base text-zinc-400">
                      {image.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Add this footer section before the closing div */}
        <footer className="mt-4 pb-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-purple-500">
              <p className="text-sm text-zinc-400 hover:text-white transition-colors">
                © {new Date().getFullYear()} GotNotes. All rights reserved.
              </p>
              <a
                href="https://github.com/h0i5/gotnotes"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <Gitlab className="h-4 w-4" />
                <span>Source Code!</span>
              </a>
            </div>
          </div>
        </footer>
      </div>
      

      {/* Add the ImageModal component */}
      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        src={selectedImage || ""}
        alt={selectedImageAlt}
      />
    </div>
  );
}
