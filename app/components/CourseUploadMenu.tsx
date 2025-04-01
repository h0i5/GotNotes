"use client";

import { useState, useRef } from "react";
import { MoreVertical, Upload, Plus, ClipboardPaste } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Modal from "@/app/components/Modal";
import toast from "react-hot-toast";

interface Course {
  title: string;
  description: string;
}

interface CourseUploadMenuProps {
  onAddCourse: () => void;
  onCoursesCreated?: () => void;
}

export default function CourseUploadMenu({ onAddCourse, onCoursesCreated }: CourseUploadMenuProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [jsonContent, setJsonContent] = useState("");

  const handleBulkCreate = async (courses: Course[]) => {
    try {
      setIsUploading(true);

      if (!Array.isArray(courses)) {
        toast.error('Invalid JSON format. Expected an array of courses.');
        return;
      }

      const response = await fetch('/api/courses/bulk-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courses }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      toast.success(`Successfully created ${courses.length} courses`);
      onCoursesCreated?.();
      return true;
    } catch (error) {
      console.error('Error uploading courses:', error);
      toast.error('Failed to upload courses');
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      const courses = JSON.parse(content);
      
      const success = await handleBulkCreate(courses);
      if (success && fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      toast.error('Invalid JSON format');
    }
  };

  const handlePasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const courses = JSON.parse(jsonContent);
      const success = await handleBulkCreate(courses);
      if (success) {
        setJsonContent("");
        setShowPasteModal(false);
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      toast.error('Invalid JSON format');
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          onClick={onAddCourse}
          className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 hover:from-purple-500 hover:to-cyan-500 border border-purple-500/50 hover:border-transparent text-purple-400 hover:text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Course
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 hover:from-purple-500 hover:to-cyan-500 border border-purple-500/50 hover:border-transparent text-purple-400 hover:text-white">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="bg-zinc-900 border-zinc-800 animate-in fade-in-0 zoom-in-95 duration-200"
            sideOffset={5}
            align="end"
          >
            <DropdownMenuItem
              className="flex items-center gap-2 text-zinc-400 hover:text-white focus:text-white cursor-pointer hover:bg-zinc-800 transition-colors duration-200"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4" />
              Upload JSON
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 text-zinc-400 hover:text-white focus:text-white cursor-pointer hover:bg-zinc-800 transition-colors duration-200"
              onClick={() => setShowPasteModal(true)}
              disabled={isUploading}
            >
              <ClipboardPaste className="h-4 w-4" />
              Paste JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="application/json"
          className="hidden"
        />
      </div>

      <Modal
        isOpen={showPasteModal}
        onClose={() => setShowPasteModal(false)}
        title="Paste JSON Data"
      >
        <form onSubmit={handlePasteSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              JSON Content
            </label>
            <textarea
              value={jsonContent}
              onChange={(e) => setJsonContent(e.target.value)}
              className="w-full h-64 p-3 rounded-lg bg-black/30 border border-zinc-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none text-white font-mono text-sm"
              placeholder='[
  {
    "title": "Course 1",
    "description": "Description for course 1"
  },
  {
    "title": "Course 2",
    "description": "Description for course 2"
  }
]'
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              onClick={() => setShowPasteModal(false)}
              className="px-4 py-2 rounded-lg font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUploading}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 rounded-lg font-medium text-white transition-all duration-300"
            >
              {isUploading ? "Creating..." : "Create Courses"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
} 