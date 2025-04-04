"use client";

import { useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import Link from "next/link";
import CourseForm from "../components/CourseForm";
import CourseList from "../components/CourseList";
import Modal from "../components/Modal";
import Forum from "../components/Forum";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import toast from 'react-hot-toast';
import CourseUploadMenu from "../components/CourseUploadMenu";

interface College {
  id: number;
  name: string;
  description: string;
}

interface UserProfile {
  first_name: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshCourses, setRefreshCourses] = useState(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const fetchUserAndCollege = async () => {
      try {
        // Get user data
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) {
          redirect("/");
          return;
        }
        setUser(user);

        // Get user's profile data
        const { data: profileData, error: error } = await supabase
          .from('users')
          .select('first_name, college_id')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        setProfile(profileData);

        // Get college details if user has one
        if (profileData?.college_id) {
          const { data: collegeData, error: collegeError } = await supabase
            .from('college')
            .select('*')
            .eq('id', profileData.college_id)
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

    fetchUserAndCollege();

  }, [supabase]);

  const handleLeaveCollege = async () => {
    try {
      const response = await fetch('/api/colleges/leave', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to leave college');
      }

      setCollege(null);
      toast.success('Successfully left the college');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to leave college');
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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        
        <div className="text-start flex flex-col space-y-8">
          <h1 className="mb-8 text-4xl font-bold mb-2">
            Welcome,{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
              {profile?.first_name || user?.email?.split("@")[0]}!
            </span>
          </h1>
          
          {college ? (
            <>
              <div className="p-6 rounded-xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 shadow-xl">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-zinc-200 mb-1">Your College</h2>
                    <p className="text-purple-400 text-lg">{college.name}</p>
                    <p className="text-zinc-400 mt-2">{college.description}</p>
                  </div>
                  <div className="sm:flex sm:items-start">
                    <button
                      onClick={handleLeaveCollege}
                      className="hover:cursor-pointer w-full sm:w-auto px-4 py-2 bg-red-500/10 hover:bg-red-500 border border-red-500/50 hover:border-transparent rounded-lg font-medium text-red-400 hover:text-white transition-all duration-300"
                    >
                      Leave College
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-2xl border border-zinc-800/50 shadow-xl">
                <Tabs defaultValue="courses" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger 
                      value="courses"
                      className="hover:cursor-pointer hover:bg-zinc-800/50 flex items-center gap-2 data-[state=active]:bg-purple-500/10"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Courses
                    </TabsTrigger>
                    <TabsTrigger 
                      value="forum"
                      className="hover:cursor-pointer hover:bg-zinc-800/50 flex items-center gap-2 data-[state=active]:bg-purple-500/10"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                      </svg>
                      Forum
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="courses" className="mt-0">
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                      <div className="flex-1">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-2 pr-10 rounded-lg bg-black/30 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none text-white hover:border-purple-500"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <CourseUploadMenu 
                          onAddCourse={() => setIsModalOpen(true)} 
                          onCoursesCreated={() => setRefreshCourses(prev => prev + 1)}
                        />
                      </div>
                    </div>
                    <CourseList 
                      collegeId={college.id} 
                      refreshTrigger={refreshCourses}
                      searchQuery={searchQuery}
                    />
                  </TabsContent>

                  <TabsContent value="forum" className="mt-0">
                    <Forum collegeId={college.id} />
                  </TabsContent>
                </Tabs>
              </div>

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
                You haven&apos;t joined a college yet.{" "}
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
