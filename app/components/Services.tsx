import { servicesList } from "@/data/siteData";

export default function Services() {
  return (
    <section
      id="services"
      className="px-6 py-20 bg-zinc-900/50 backdrop-blur-sm border-y border-zinc-800"
    >
      <h2 className="text-3xl font-bold text-center mb-16">
        Our{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
          Services
        </span>
      </h2>
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {servicesList.map((service, i) => (
          <div
            key={i}
            className="p-8 rounded-xl bg-black/40 border border-zinc-800 hover:border-purple-500/50 transition flex flex-col items-center text-center"
          >
            <div className="text-purple-400 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={service.iconPath}
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-purple-300">
              {service.title}
            </h3>
            <p className="text-zinc-400">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
