"use client";

import { useState } from "react";
import { createClient } from "@/app/utils/supabase/client";

interface ResourceUploadFormProps {
  type: "note" | "paper";
  courseId: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function ResourceUploadForm({ type, courseId, onSuccess, onClose }: ResourceUploadFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    
    setLoading(true);

    try {
      // 1. Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).slice(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${courseId}/${fileName}`;

      const { error: uploadError } = await supabase
        .storage
        .from(type === 'note' ? 'notes' : 'papers')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Create database entry
      const response = await fetch(`/api/${type}s/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          course_id: courseId,
          file_path: filePath,
        }),
      });

      if (!response.ok) {
        // If database entry fails, delete the uploaded file
        await supabase
          .storage
          .from(type === 'note' ? 'notes' : 'papers')
          .remove([filePath]);
        throw new Error("Failed to create resource");
      }

      // Clear form
      setTitle("");
      setDescription("");
      setFile(null);
      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error("Error:", error);
      alert(`Failed to upload ${type}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          placeholder={`Enter ${type} title`}
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
          className="w-full p-3 rounded-lg bg-black/30 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none text-white min-h-[100px]"
          placeholder={`Describe your ${type}...`}
          required
        />
      </div>
      <div>
        <label htmlFor="file" className="block text-sm font-medium text-zinc-300 mb-2">
          File
        </label>
        <input
          type="file"
          id="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full p-3 rounded-lg bg-black/30 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/10 file:text-purple-400 hover:file:bg-purple-500 hover:file:text-white"
          required
        />
      </div>
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg font-medium text-zinc-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 rounded-lg font-medium text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? `Uploading ${type}...` : `Upload ${type}`}
        </button>
      </div>
    </form>
  );
} 