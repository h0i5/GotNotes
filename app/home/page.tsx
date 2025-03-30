"use client";

import { useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import Link from "next/link";
import CourseForm from "../components/CourseForm";
import CourseList from "../components/CourseList";
import Modal from "../components/Modal";

interface College {
  id: number;
  name: string;
  description: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshCourses, setRefreshCourses] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserAndCollege = async () => {
      try {
        // Get user data
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) {
          redirect("/");
        }
        setUser(user);

        // Get user's college
        const { data: userData, error: profileError } = await supabase
          .from('users')
          .select('college_id')
          .eq('id', user.id)
          .single();
        
        if (profileError) throw profileError;

        if (userData?.college_id) {
          // Get college details
          const { data: collegeData, error: collegeError } = await supabase
            .from('college')
            .select('*')
            .eq('id', userData.college_id)
            .single();
          
          if (collegeError) throw collegeError;
          setCollege(collegeData);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        redirect("/");
      }
      setUser(session?.user ?? null);
    });

    fetchUserAndCollege();

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLeaveCollege = async () => {
    try {
      const response = await fetch('/api/colleges/leave', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to leave college');
      }

      // Update local state
      setCollege(null);
      alert('Successfully left the college');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to leave college');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto flex flex-col p-6">
        <div className="text-start flex flex-col">
          <h1 className="text-4xl font-bold mb-2">
            Welcome,{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
              {user?.email?.split("@")[0]}!
            </span>
          </h1>
          
          {college ? (
            <>
              <div className="mt-4 p-6 rounded-xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 shadow-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-zinc-200">Your College</h2>
                    <p className="text-purple-400 text-lg mt-1">{college.name}</p>
                    <p className="text-zinc-400 mt-2">{college.description}</p>
                  </div>
                  <button
                    onClick={handleLeaveCollege}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500 border border-red-500/50 hover:border-transparent rounded-lg font-medium text-red-400 hover:text-white transition-all duration-300 hover:cursor-pointer"
                  >
                    Leave College
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <div className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-2xl border border-zinc-800/50 shadow-xl">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Available Courses
                    </h2>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 hover:from-purple-500 hover:to-cyan-500 border border-purple-500/50 hover:border-transparent rounded-lg font-medium text-purple-400 hover:text-white transition-all duration-300 hover:cursor-pointer flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Course
                    </button>
                  </div>
                  <CourseList 
                    collegeId={college.id} 
                    refreshTrigger={refreshCourses}
                  />
                </div>
              </div>

              {/* Course Creation Modal */}
              <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Course"
              >
                <CourseForm 
                  collegeId={college.id} 
                  onSuccess={() => {
                    setIsModalOpen(false);
                  }}
                  onCourseCreated={() => {
                    setRefreshCourses(prev => prev + 1);
                  }}
                />
              </Modal>
            </>
          ) : (
            <div className="mt-4 p-6 rounded-xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 shadow-xl">
              <p className="text-zinc-400">
                You haven't joined a college yet.{" "}
                <Link 
                  href="/colleges" 
                  className="text-purple-400 hover:text-purple-300 underline hover:cursor-pointer"
                >
                  Join one now!
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
