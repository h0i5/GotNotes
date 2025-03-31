"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
export default function CompleteProfile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [step, setStep] = useState(1);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setUsername(user.email?.split('@')[0] || '');

      // Only check if profile exists for initial signup
      
    };

    checkProfile();
  }, [router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('users')
        .update({
          first_name: firstName,
          last_name: lastName,
          roll_number: rollNumber || null,
        })
        .eq('id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
      router.push('/home');
      toast.success('Profile updated successfully');
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName && lastName) {
      setStep(2);
    }
  };


  return (
    <div className="mt-12 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-2xl border border-zinc-800/50 shadow-xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Complete Your Profile</h1>
            <p className="text-zinc-400">
              Hey{" "}
              <span className="text-purple-400">
                {username}
              </span>
              , please complete your profile to continue.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center w-full">
              <div className="flex items-center justify-center w-8 h-8 bg-purple-500 rounded-full">
                <span className="text-white text-sm">1</span>
              </div>
              <div className="flex-1 h-1 mx-2 bg-zinc-800">
                <div className={`h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300 ${step === 2 ? 'w-full' : 'w-0'}`} />
              </div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 2 ? 'bg-purple-500' : 'bg-zinc-800'}`}>
                <span className="text-white text-sm">2</span>
              </div>
            </div>
          </div>

          {step === 1 ? (
            <form onSubmit={handleNext} className="space-y-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-zinc-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-3 rounded-lg bg-black/30 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none text-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-zinc-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-3 rounded-lg bg-black/30 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none text-white"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 rounded-lg font-medium text-white transition-all duration-200 transform hover:scale-[1.02]"
              >
                Next
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="rollNumber" className="block text-sm font-medium text-zinc-300 mb-2">
                  Roll Number <span className="text-zinc-500">(optional)</span>
                </label>
                <input
                  type="text"
                  id="rollNumber"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full p-3 rounded-lg bg-black/30 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none text-white"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-medium text-zinc-300 transition-all duration-200"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 rounded-lg font-medium text-white transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? "Saving..." : "Complete"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 