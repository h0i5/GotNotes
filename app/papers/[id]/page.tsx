import FileViewer from "@/app/components/FileViewer";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PaperPage({ params }: PageProps) {
  const { id } = await params;
  return <FileViewer type="paper" id={id} />;
} 