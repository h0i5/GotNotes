"use client";

import { useState } from 'react';

interface PDFViewerProps {
  url: string;
}

export default function PDFViewer({ url }: PDFViewerProps) {
  return (
    <div className="w-full h-[800px] bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-xl overflow-hidden">
      <iframe
        src={`${url}#toolbar=0&navpanes=0`}
        className="w-full h-full"
        title="PDF Viewer"
      />
    </div>
  );
} 