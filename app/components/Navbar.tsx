import Image from "next/image";
import Link from "next/link";
export default function Navbar() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg px-6 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex flex-row items-center gap-2">
          <Image src="Logo.svg" alt="VibeSec" height="32" width="32" />
          <div className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-[200%_auto] hover:bg-[100%_auto] transition-all duration-500 cursor-pointer">
            {" "}
            GotNotes?
          </div>
        </div>
        <div className="flex items-center gap-8">
          <button
            onClick={() => scrollToSection("about")}
            className="relative font-medium group"
          >
            <span className="hidden md:flex hover:cursor-pointer transition transition-all-0.5s bg-clip-text text-transparent bg-gradient-to-r from-zinc-400 to-zinc-400 group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-300">
              About
            </span>
          </button>
          <Link
            href="/signup"
            className="relative px-6 py-2 font-semibold text-white rounded-lg overflow-hidden group hover:cursor-pointer"
          >
            <span className=" absolute inset-0 w-full h-full transition-all duration-300 ease-out translate-y-full bg-gradient-to-r from-purple-600 to-cyan-600 group-hover:translate-y-0"></span>
            <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out bg-zinc-900 border border-zinc-700 rounded-lg group-hover:translate-y-[-100%]"></span>
            <span className="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out translate-y-full group-hover:translate-y-0 text-white">
              Sign Up!
            </span>
            <span className="relative group-hover:translate-y-[-200%] transition-all duration-300 ease-out inline-block">
              Get Started
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
