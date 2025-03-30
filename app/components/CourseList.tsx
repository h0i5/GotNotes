"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Course {
  id: number;
  title: string;
  description: string;
  college_id: number;
  created_at: string;
}

interface CourseListProps {
  collegeId: number;
  refreshTrigger?: number;
}

export default function CourseList({ collegeId, refreshTrigger = 0 }: CourseListProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCourses = async () => {
    try {
      const response = await fetch(`/api/courses/list?college_id=${collegeId}`);
      if (!response.ok) throw new Error("Failed to fetch courses");
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [collegeId, refreshTrigger]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-400">
        <p>No courses available yet. Be the first to create one!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {courses.map((course) => (
        <div
          key={course.id}
          onClick={() => router.push(`/course/${course.id}`)}
          className="p-6 rounded-xl bg-black/30 border border-zinc-800 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group"
        >
          <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-purple-400 transition-colors">
            {course.title}
          </h3>
          <p className="text-zinc-400 line-clamp-2">{course.description}</p>
        </div>
      ))}
    </div>
  );
} 