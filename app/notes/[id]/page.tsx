import FileViewer from "@/app/components/FileViewer";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NotePage({ params }: PageProps) {
  const { id } = await params;
  return <FileViewer type="note" id={id} />;
} 