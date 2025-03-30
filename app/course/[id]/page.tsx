"use client";

import { useEffect, useState, use } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { useRouter } from "next/navigation";
import Modal from "@/app/components/Modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import ResourceUploadForm from "@/app/components/ResourceUploadForm";
import ResourceList from "@/app/components/ResourceList";

interface Course {
  id: number;
  title: string;
  description: string;
  college_id: number;
  created_at: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CoursePage({ params }: PageProps) {
  const { id } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isUploadingNote, setIsUploadingNote] = useState(false);
  const [isUploadingPaper, setIsUploadingPaper] = useState(false);
  const [refreshNotes, setRefreshNotes] = useState(0);
  const [refreshPapers, setRefreshPapers] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setCourse(data);
      } catch (error) {
        console.error('Error:', error);
        router.push('/home');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, router, supabase]);

  const handleDelete = async () => {
    if (!course) return;
    
    if (confirmTitle !== course.title) {
      alert("Course title doesn't match");
      return;
    }

    setDeleteLoading(true);

    try {
      const response = await fetch('/api/courses/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course.id,
          title: course.title,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete course');
      }

      router.push('/home');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete course');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-2xl border border-zinc-800/50 shadow-xl">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-4">{course.title}</h1>
            <p className="text-zinc-400">{course.description}</p>
          </div>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500 border border-red-500/50 hover:border-transparent rounded-lg font-medium text-red-400 hover:text-white transition-all duration-300 hover:cursor-pointer"
          >
            Delete Course
          </button>
        </div>

        <Tabs defaultValue="notes" className="mt-8">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="papers">Previous Year Papers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="notes" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Course Notes</h2>
              <button
                onClick={() => setIsUploadingNote(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 hover:from-purple-500 hover:to-cyan-500 border border-purple-500/50 hover:border-transparent rounded-lg font-medium text-purple-400 hover:text-white transition-all duration-300 hover:cursor-pointer flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Upload Note
              </button>
            </div>
            <ResourceList type="note" courseId={course.id} refreshTrigger={refreshNotes} />
          </TabsContent>

          <TabsContent value="papers" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Previous Year Papers</h2>
              <button
                onClick={() => setIsUploadingPaper(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 hover:from-purple-500 hover:to-cyan-500 border border-purple-500/50 hover:border-transparent rounded-lg font-medium text-purple-400 hover:text-white transition-all duration-300 hover:cursor-pointer flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Upload Paper
              </button>
            </div>
            <ResourceList type="paper" courseId={course.id} refreshTrigger={refreshPapers} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Upload Note Modal */}
      <Modal
        isOpen={isUploadingNote}
        onClose={() => setIsUploadingNote(false)}
        title="Upload Note"
      >
        <ResourceUploadForm
          type="note"
          courseId={course.id}
          onSuccess={() => {
            setRefreshNotes(prev => prev + 1);
            setIsUploadingNote(false);
          }}
          onClose={() => setIsUploadingNote(false)}
        />
      </Modal>

      {/* Upload Paper Modal */}
      <Modal
        isOpen={isUploadingPaper}
        onClose={() => setIsUploadingPaper(false)}
        title="Upload Paper"
      >
        <ResourceUploadForm
          type="paper"
          courseId={course.id}
          onSuccess={() => {
            setRefreshPapers(prev => prev + 1);
            setIsUploadingPaper(false);
          }}
          onClose={() => setIsUploadingPaper(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setConfirmTitle("");
        }}
        title="Delete Course"
      >
        <div className="space-y-4">
          <p className="text-zinc-400">
            This action cannot be undone. Please type <span className="font-semibold text-white">{course.title}</span> to confirm.
          </p>
          <input
            type="text"
            value={confirmTitle}
            onChange={(e) => setConfirmTitle(e.target.value)}
            placeholder="Type course title to confirm"
            className="w-full p-3 rounded-lg bg-black/30 border border-zinc-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all outline-none text-white"
          />
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setConfirmTitle("");
              }}
              className="px-4 py-2 rounded-lg font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={confirmTitle !== course.title || deleteLoading}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500 border border-red-500/50 hover:border-transparent rounded-lg font-medium text-red-400 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleteLoading ? "Deleting..." : "Delete Course"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 