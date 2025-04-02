"use client";

import { useCallback, useEffect, useState, useDeferredValue } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import Modal from "@/app/components/Modal";
import CollegeForm from "../components/CollegeForm";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import toast from 'react-hot-toast';

interface College {
  id: string;
  name: string;
  description: string;
  created_at: string;
} 

interface UserProfile {
  college_id: string;
  college?: {
    name: string;
    description: string;
  };
}

export default function Colleges() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const COLLEGES_PER_PAGE = 12;
  const supabase = createClient();
  const deferredSearch = useDeferredValue(searchQuery);

  // Separate user fetch effect
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) {
          redirect("/");
          return;
        }
        setUser(user);

        // Get user's profile data with college details
        const { data: profileData } = await supabase
          .from('users')
          .select(`
            college_id,
            college:college_id (
              name,
              description
            )
          `)
          .eq('id', user.id)
          .single();

        setUserProfile(profileData as unknown as UserProfile);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchUser();
  }, [supabase]);

  const fetchColleges = useCallback(async (query: string = '', pageNumber: number = 0) => {
    try {
      setSearchLoading(true);
      let queryBuilder = supabase
        .from('college')
        .select('*', { count: 'exact' })
        .range(pageNumber * COLLEGES_PER_PAGE, (pageNumber + 1) * COLLEGES_PER_PAGE - 1);

      // Add search condition if query exists
      if (query) {
        queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
      }

      const { data, count, error } = await queryBuilder;

      if (error) throw error;

      if (pageNumber === 0) {
        setColleges(data || []);
      } else {
        setColleges(prev => [...prev, ...(data || [])]);
      }

      setHasMore(Boolean(count && count > (pageNumber + 1) * COLLEGES_PER_PAGE));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSearchLoading(false);
    }
  }, [supabase, COLLEGES_PER_PAGE]);

  // Effect for search
  useEffect(() => {
    setPage(0);
    fetchColleges(deferredSearch, 0);
  }, [deferredSearch, fetchColleges]);

  const handleLeaveCollege = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ college_id: null })
        .eq('id', user?.id);

      if (error) throw error;
      setUserProfile(null);
      toast.success('Successfully left the college');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to leave college');
    }
  };

  const handleJoinCollege = async (college: College) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ college_id: college.id })
        .eq('id', user?.id);

      if (error) throw error;
      setUserProfile({
        college_id: college.id,
        college: {
          name: college.name,
          description: college.description
        }
      });
      toast.success(`Successfully joined ${college.name}`);
      router.push("/home");
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to join college');
    }
  };

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  // Handle load more
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchColleges(searchQuery, nextPage);
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
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
            College Hub
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Join your college community or create a new one to share resources and collaborate with peers
          </p>
        </div>

        {userProfile ? (
          <div className="mb-12 p-6 rounded-xl bg-purple-500/5 border border-purple-500/20 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {userProfile.college_id ? (
                <div>
                  <h2 className="text-xl font-semibold text-white mb-1">Your Current College</h2>
                  <p className="text-purple-400 font-medium">{userProfile.college?.name}</p>
                  <p className="text-zinc-400 font-medium">{userProfile.college?.description}</p>
                </div>
              ) : (
                <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-1">Not Part of Any College</h2>
                    <p className="text-zinc-400">Join a college below to access shared resources and collaborate with peers.</p>
                  </div>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 rounded-lg font-medium text-white transition-all duration-300 whitespace-nowrap hover:cursor-pointer"
                  >
                    Create College
                  </button>
                </div>
              )}
              {userProfile.college_id && (
                <button
                  onClick={handleLeaveCollege}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500 border border-red-500/50 hover:border-transparent rounded-lg font-medium text-red-400 hover:text-white transition-all duration-300"
                >
                  Leave College
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-12 p-6 rounded-xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">Not In a College?</h2>
                <p className="text-zinc-400">Join an existing college or create your own</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 rounded-lg font-medium text-white transition-all duration-300 whitespace-nowrap hover:cursor-pointer"
              >
                Create College
              </button>
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-white">Available Colleges</h2>
            <div className="w-full sm:w-auto flex-1 sm:max-w-md">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search for your college..."
                  className="w-full p-3 pl-10 rounded-lg bg-black/30 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none text-white placeholder:text-zinc-500"
                />
                {searchLoading ? (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
                  </div>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {colleges.map((college) => (
              <div
                key={college.id}
                className={`p-6 rounded-xl backdrop-blur-sm border transition-all duration-300 ${
                  userProfile?.college_id === college.id
                    ? 'bg-purple-500/5 border-purple-500/20'
                    : 'bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700/50'
                }`}
              >
                <h3 className="text-xl font-semibold text-white mb-2">{college.name}</h3>
                <p className="text-zinc-400 mb-4">{college.description}</p>
                {userProfile ? (
                  userProfile.college_id ? (
                    userProfile.college_id === college.id ? (
                      <div className="flex items-center gap-2 text-purple-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm font-medium">Current Member</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-zinc-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m-4 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        <span className="text-sm">Leave current college to join</span>
                      </div>
                    )
                  ) : (
                    <button
                      onClick={() => handleJoinCollege(college)}
                      className="w-full px-4 py-2 bg-purple-500/10 hover:bg-purple-500 border border-purple-500/50 hover:border-transparent rounded-lg font-medium text-purple-400 hover:text-white transition-all duration-300 hover:cursor-pointer"
                    >
                      Join College
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => handleJoinCollege(college)}
                    className="w-full px-4 py-2 bg-purple-500/10 hover:bg-purple-500 border border-purple-500/50 hover:border-transparent rounded-lg font-medium text-purple-400 hover:text-white transition-all duration-300 hover:cursor-pointer"
                  >
                    Join College
                  </button>
                )}
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleLoadMore}
                className="hover:cursor-pointer px-6 py-3 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 hover:from-purple-500 hover:to-cyan-500 border border-purple-500/50 hover:border-transparent rounded-lg font-medium text-purple-400 hover:text-white transition-all duration-300"
              >
                Load More
              </button>
            </div>
          )}
        </div>

        {/* Create College Modal */}
        {isCreateModalOpen && (
          <Modal 
            isOpen={isCreateModalOpen} 
            onClose={() => setIsCreateModalOpen(false)}
            title="Create New College"
          >
            <CollegeForm onSuccess={() => {
              setIsCreateModalOpen(false);
              fetchColleges();
            }} />
          </Modal>
        )}
      </div>
    </div>
  );
} 