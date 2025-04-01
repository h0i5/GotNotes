"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface Course {
  id: number;
  title: string;
  description: string;
  college_id: number;
  created_at: string;
  created_by: string;
  creator: {
    first_name: string;
    last_name: string;
  };
}

interface CourseListProps {
  collegeId: number;
  refreshTrigger: number;
  searchQuery: string;
}

export default function CourseList({ collegeId, refreshTrigger, searchQuery }: CourseListProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('courses')
          .select(`
            *,
            creator:users!created_by (
              first_name,
              last_name
            )
          `)
          .eq('college_id', collegeId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCourses(data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [collegeId, refreshTrigger, supabase]); // Only fetch when collegeId changes or when refreshTrigger updates

  const filteredCourses = courses.filter(course => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-6 rounded-xl bg-black/30 border border-zinc-800 animate-pulse">
            <div className="h-6 bg-zinc-800 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-zinc-800 rounded w-full mb-2"></div>
            <div className="h-4 bg-zinc-800 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredCourses.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-400">
        {searchQuery ? (
          <p>No courses found matching your search.</p>
        ) : (
          <p>No courses available yet. Be the first to create one!</p>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filteredCourses.map((course) => (
        <div
          key={course.id}
          onClick={() => router.push(`/course/${course.id}`)}
          className="p-6 rounded-xl bg-black/30 border border-zinc-800 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group"
        >
          <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-purple-400 transition-colors">
            {course.title}
          </h3>
          <p className="text-zinc-400 line-clamp-2 mb-2">{course.description}</p>
          <div className="flex justify-between items-center text-sm">
            <p className="text-zinc-500">
              Created {formatDistanceToNow(new Date(course.created_at), { addSuffix: true })}
            </p>
            <p className="text-zinc-400">
              by {course.creator?.first_name} {course.creator?.last_name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
} 