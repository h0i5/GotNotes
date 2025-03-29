import { securityTopics } from "@/data/siteData";

type HeroProps = {
  activeIndex: number;
};

export default function Hero({ activeIndex }: HeroProps) {
  return (
    <>
      {/* Headline with Cycling App Name */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
          Secure Your Vibe-Coded
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
                    ? "-translate-y-16 opacity-0"
                    : "translate-y-16 opacity-0"
                }`}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
                  {topic.name}
                </span>
              </div>
            ))}
          </div>
          Applications
        </h1>

        <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
          Specialized security solutions for modern web stacks. We protect what
          matters in your digital ecosystem.
        </p>
      </div>

      {/* Security Shield Illustration */}
      <SecurityShield />
    </>
  );
}

// Extract the shield into its own component
function SecurityShield() {
  return (
    <div className="relative h-80 w-80 mb-16">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full backdrop-blur-sm border border-zinc-700 flex items-center justify-center">
        <div className="w-40 h-40 relative">
          <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-2xl"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Digital Security Shield Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-24 h-24 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4M10 10h4"
                className="text-purple-300"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 14l3 3 3-3"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Animated security pulse rings */}
      <div
        className="absolute inset-0 rounded-full border border-purple-500/20 animate-ping"
        style={{ animationDuration: "3s" }}
      ></div>
      <div
        className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping"
        style={{ animationDuration: "4s", animationDelay: "0.5s" }}
      ></div>
    </div>
  );
}
