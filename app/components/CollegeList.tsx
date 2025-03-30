"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface College {
  id: number;
  name: string;
  description: string;
}

export default function CollegeList() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const response = await fetch("/api/colleges/list");
      if (!response.ok) throw new Error("Failed to fetch colleges");
      const data = await response.json();
      setColleges(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCollege = async (collegeId: number) => {
    try {
      const response = await fetch("/api/colleges/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ college_id: collegeId }),
      });

      if (!response.ok) throw new Error("Failed to join college");
      
      // Navigate to home page after successful join
      router.push('/home');
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to join college");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (colleges.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-400">
        <p>No colleges available yet. Be the first to create one!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {colleges.map((college) => (
        <div
          key={college.id}
          className="p-6 rounded-xl bg-black/30 border border-zinc-800 hover:border-purple-500/50 transition-all duration-300"
        >
          <h3 className="text-xl font-semibold mb-2 text-white">{college.name}</h3>
          <p className="text-zinc-400 mb-4 line-clamp-2">{college.description}</p>
          <button
            onClick={() => handleJoinCollege(college.id)}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 hover:from-purple-500 hover:to-cyan-500 border border-purple-500/50 hover:border-transparent rounded-lg font-medium text-purple-400 hover:text-white transition-all duration-300 hover:cursor-pointer"
          >
            Join College
          </button>
        </div>
      ))}
    </div>
  );
} 