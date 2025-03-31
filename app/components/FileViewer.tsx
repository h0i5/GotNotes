"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { formatDistanceToNow } from "date-fns";
import PDFViewer from "./PDFViewer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import Image from 'next/image';

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
  const supabase = createClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();

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
        // First get the resource details including file_path
        const { data: resource, error: resourceError } = await supabase
          .from(type === 'note' ? 'notes' : 'papers')
          .select('*, course:courses(*)')
          .eq('id', id)
          .single();

        if (resourceError) throw resourceError;
        if (!resource) throw new Error('Resource not found');
        setResource(resource);

        // Then get the download URL using the file_path
        if (resource.file_path) {
          const response = await fetch(`/api/${type}s/download?path=${resource.file_path}`);
          if (!response.ok) throw new Error('Failed to get download URL');
          const { url } = await response.json();
          setFileUrl(url);
        } else {
          throw new Error('No file path found');
        }
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

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/${type}s/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          file_path: resource?.file_path
        }),
      });

      if (!response.ok) throw new Error('Failed to delete');
      router.push(`/course/${resource?.course.id}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete resource');
    } finally {
      setDeleteLoading(false);
    }
  };


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
            {type === 'paper' ? 'Previous Year Paper: ' : ''}{resource.title}
          </span>
        </nav>
        
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {type === 'paper' ? 'Previous Year Paper: ' : ''}{resource.title}
            </h1>
            <p className="text-zinc-400 mb-2">{resource.description}</p>
            <p className="text-zinc-500 text-sm">
              Uploaded {formatDistanceToNow(new Date(resource.uploadedat))} ago
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500 border border-red-500/50 hover:border-transparent rounded-lg font-medium text-red-400 hover:text-white transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
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
      </div>

      <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-8">
        {isPDF(fileExtension) ? (
          <PDFViewer url={fileUrl} />
        ) : isImage(fileExtension) ? (
          <div>
            <Image
              src={fileUrl}
              alt={resource.title}
              width={800}
              height={600}
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

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={`Delete ${type === 'paper' ? 'Previous Year Paper' : 'Note'}`}
      >
        <div className="space-y-4">
          <p className="text-zinc-400">
            Are you sure you want to delete this {type}? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 rounded-lg font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500 border border-red-500/50 hover:border-transparent rounded-lg font-medium text-red-400 hover:text-white transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
            >
              {deleteLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 