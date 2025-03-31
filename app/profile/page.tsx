"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserProfile {
  first_name: string;
  last_name: string;
  roll_number: string;
  email: string;
  college: {
    name: string;
  } | null;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const { data, error } = await supabase
          .from('users')
          .select(`
            first_name,
            last_name,
            roll_number,
            email,
            college:college(name)
          `)
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-2xl border border-zinc-800/50 shadow-xl">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <Link
            href="/profile/complete"
            className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 hover:from-purple-500 hover:to-cyan-500 border border-purple-500/50 hover:border-transparent rounded-lg font-medium text-purple-400 hover:text-white transition-all duration-300"
          >
            Edit Profile
          </Link>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-medium text-zinc-400">Full Name</h2>
            <p className="text-white mt-1">{profile?.first_name} {profile?.last_name}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-zinc-400">Roll Number</h2>
            <p className="text-white mt-1">{profile?.roll_number}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-zinc-400">Email</h2>
            <p className="text-white mt-1">{profile?.email}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-zinc-400">College</h2>
            <p className="text-white mt-1">{profile?.college?.name || 'Not joined any college yet'}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 