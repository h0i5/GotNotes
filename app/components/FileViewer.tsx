"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { formatDistanceToNow } from "date-fns";
import PDFViewer from "./PDFViewer";
import Link from "next/link";

interface Resource {
  id: string;
  title: string;
  description: string;
  file_path: string;
  uploadedat: string;
  user_id: string;
  course: {
    id: number;
    name: string;
  };
}

interface FileViewerProps {
  type: "note" | "paper";
  id: string;
}

export default function FileViewer({ type, id }: FileViewerProps) {
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const supabase = createClient();

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const isImage = (extension: string) => {
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
  };

  const isPDF = (extension: string) => {
    return extension === 'pdf';
  };

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const { data, error } = await supabase
          .from(type === 'note' ? 'notes' : 'papers')
          .select('*, course:courses(*)')
          .eq('id', id)
          .single();

        if (error) throw error;
        setResource(data);

        // Get file URL
        const response = await fetch(`/api/${type}s/download?path=${data.file_path}`);
        if (!response.ok) throw new Error('Failed to get download URL');
        const { url } = await response.json();
        setFileUrl(url);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load resource');
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [id, type, supabase]);

  const handleDownload = async () => {
    if (!resource || !fileUrl) return;
    window.open(fileUrl, '_blank');
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !resource || !fileUrl) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-red-400">{error || 'Resource not found'}</p>
        <a href="/home" className="text-purple-400 hover:text-purple-300 transition-colors">
          Go back home
        </a>
      </div>
    );
  }

  const fileExtension = getFileExtension(resource.file_path);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link 
            href="/home" 
            className="text-zinc-400 hover:text-purple-400 transition-colors"
          >
            Home
          </Link>
          <span className="text-zinc-600">/</span>
          <Link 
            href={`/course/${resource.course.id}`}
            className="text-zinc-400 hover:text-purple-400 transition-colors"
          >
            Course
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300">
            {resource.title}
          </span>
        </nav>
        
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{resource.title}</h1>
            <p className="text-zinc-400 mb-2">{resource.description}</p>
            <p className="text-zinc-500 text-sm">
              Uploaded {formatDistanceToNow(new Date(resource.uploadedat))} ago
            </p>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 rounded-lg font-medium text-white transition-all duration-300 whitespace-nowrap"
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
            Download
          </button>
        </div>
      </div>

      <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-8">
        {isPDF(fileExtension) ? (
          <PDFViewer url={fileUrl} />
        ) : isImage(fileExtension) ? (
          <div>
            <img
              src={fileUrl}
              alt={resource.title}
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-purple-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            <p className="text-zinc-400">
              This file type cannot be previewed in the browser
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 