import { BookOpen, Share2, Award } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="py-24 w-full relative" id="about">
      <div className="absolute inset-0 "></div>
      <div className="max-w-6xl mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 mb-6">
            Why GotNotes?
          </h2>
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
            Your one-stop platform for sharing and accessing high-quality study
            materials. Connect with fellow students and excel in your academic
            journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-6 group relative overflow-hidden hover:border-purple-400/40 transition-colors duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="flex items-center gap-4 text-purple-400 relative mb-4">
                <Share2 className="w-6 h-6" />
                <h3 className="text-xl font-semibold">
                  Collaborative Learning
                </h3>
              </div>
              <p className="text-zinc-300 relative">
                Share your notes and access study materials from peers. Build a
                community of learners and help each other succeed.
              </p>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-6 group relative overflow-hidden hover:border-cyan-400/40 transition-colors duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="flex items-center gap-4 text-cyan-400 relative mb-4">
                <BookOpen className="w-6 h-6" />
                <h3 className="text-xl font-semibold">
                  Comprehensive Resources
                </h3>
              </div>
              <p className="text-zinc-300 relative">
                Access lecture notes, past exam papers, and study guides across
                various subjects and courses.
              </p>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-6 group relative overflow-hidden hover:border-purple-400/40 transition-colors duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="flex items-center gap-4 text-purple-400 relative mb-4">
                <Award className="w-6 h-6" />
                <h3 className="text-xl font-semibold">Quality Assured</h3>
              </div>
              <p className="text-zinc-300 relative">
                All shared materials are reviewed and rated by the community to
                ensure high-quality and accurate content.
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-zinc-900/50 backdrop-blur-sm rounded-lg border border-zinc-800/50 p-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold">Platform Features</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20 relative group overflow-hidden hover:border-purple-500/40 transition-colors duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="text-purple-400 relative">
                      College Resources
                    </span>
                    <span className="text-sm text-purple-400 relative">
                      Institution Specific
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20 relative group overflow-hidden hover:border-cyan-500/40 transition-colors duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="text-cyan-400 relative">Past Papers</span>
                    <span className="text-sm text-cyan-400 relative">
                      By Department & Year
                    </span>
                  </div>
                </div>
                <p className="text-sm text-zinc-400 mt-4">
                  Access organized resources specific to your college and
                  department, making exam preparation easier than ever.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
