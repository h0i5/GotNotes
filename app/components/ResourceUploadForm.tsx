"use client";

import { useState } from "react";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/dropzone';
import { useSupabaseUpload } from '@/hooks/use-supabase-upload';
import toast from 'react-hot-toast';

interface ResourceUploadFormProps {
  type: "note" | "paper";
  courseId: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function ResourceUploadForm({ type, courseId, onSuccess, onClose }: ResourceUploadFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const uploadProps = useSupabaseUpload({
    bucketName: type === 'note' ? 'notes' : 'papers',
    path: courseId,
    allowedMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    maxFiles: 1,
    maxFileSize: 1000 * 1000 * 10, // 10MB
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadProps.files.length === 0) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      setIsSubmitting(true);
      // First upload the file using the hook
      await uploadProps.onUpload();

      // After successful upload, create the database entry
      const filePath = `${courseId}/${uploadProps.files[0].name}`;
      
      const { error } = await fetch(`/api/${type}s/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          course_id: courseId,
          file_path: filePath,
        }),
      }).then(res => res.json());

      if (error) throw error;

      toast.success(`${type[0].toUpperCase() + type.slice(1)} uploaded successfully!`);
      setTitle("");
      setDescription("");
      uploadProps.setFiles([]);
      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Failed to upload ${type[0].toUpperCase() + type.slice(1)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded-lg bg-black/30 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none text-white"
          placeholder={`Enter ${type} title...`}
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 rounded-lg bg-black/30 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none text-white min-h-[120px]"
          placeholder={`Describe your ${type}...`}
          rows={4}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          File
        </label>
        <Dropzone {...uploadProps} className="bg-black/30 border-zinc-700 hover:border-purple-500">
          <DropzoneEmptyState className="text-zinc-400" />
          <DropzoneContent className="text-zinc-400" />
        </Dropzone>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onClose}
          disabled={uploadProps.loading || isSubmitting}
          className="px-4 py-2 rounded-lg font-medium text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={uploadProps.loading || isSubmitting || uploadProps.files.length === 0}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 rounded-lg font-medium text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploadProps.loading ? (
            `Uploading file...`
          ) : isSubmitting ? (
            `Creating ${type}...`
          ) : (
            `Upload ${type}`
          )}
        </button>
      </div>
    </form>
  );
} 