"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

interface Resource {
  id: string;
  title: string;
  description: string;
  file_path: string;
  uploadedat: string;
  user_id: string;
}

interface ResourceListProps {
  type: "note" | "paper";
  courseId: string;
  refreshTrigger?: number;
}

export default function ResourceList({ type, courseId, refreshTrigger = 0 }: ResourceListProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data, error } = await supabase
          .from(type === 'note' ? 'notes' : 'papers')
          .select('*')
          .eq('course_id', courseId)
          .order('uploadedat', { ascending: false });

        if (error) throw error;
        setResources(data || []);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [courseId, type, refreshTrigger, supabase]);

  const handleDownload = async (resource: Resource) => {
    try {
      const response = await fetch(`/api/${type}s/download?path=${resource.file_path}`);
      if (!response.ok) throw new Error('Failed to get download URL');
      
      const { url } = await response.json();
      
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to download file');
    }
  };

  const handleDelete = async (resource: Resource) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    try {
      const response = await fetch(`/api/${type}s/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: resource.id,
          file_path: resource.file_path
        }),
      });

      if (!response.ok) throw new Error('Failed to delete');
      
      // Refresh the list
      setResources(resources.filter(r => r.id !== resource.id));
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete resource');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-6 rounded-xl bg-black/30 border border-zinc-800 animate-pulse">
            <div className="h-6 bg-zinc-800 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-zinc-800 rounded w-full mb-2"></div>
            <div className="h-4 bg-zinc-800 rounded w-2/3"></div>
            <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-end gap-2">
              <div className="h-9 w-9 bg-zinc-800 rounded-lg"></div>
              <div className="h-9 w-9 bg-zinc-800 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400">No {type}s available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {resources.map((resource) => (
        <div
          key={resource.id}
          onClick={() => router.push(`/${type}s/${resource.id}`)}
          className="p-6 rounded-xl bg-black/30 border border-zinc-800 hover:border-purple-500/50 transition-all duration-300 group hover:cursor-pointer"
        >
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                {type === 'paper' ? 'Previous Year Paper: ' : ''}{resource.title}
              </h3>
              <p className="text-zinc-400 mt-1 text-sm line-clamp-2">{resource.description}</p>
              <p className="text-zinc-500 text-xs mt-2">
                Uploaded {formatDistanceToNow(new Date(resource.uploadedat))} ago
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-zinc-800">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(resource);
                }}
                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 border border-red-500/50 hover:border-transparent text-red-400 hover:text-white transition-all duration-300"
                title={`Delete ${type}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent navigation when clicking download
                  handleDownload(resource);
                }}
                className="ml-4 p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500 border border-purple-500/50 hover:border-transparent text-purple-400 hover:text-white transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 