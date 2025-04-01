import { createClient } from "@/app/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');
    
    if (!filePath) {
      return NextResponse.json({ error: "File path is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // First check if the file exists
    const { data: exists, error: existsError } = await supabase
      .storage
      .from('notes')
      .list(filePath.split('/')[0]); // Check in the folder

    if (existsError || !exists?.some(file => file.name === filePath.split('/')[1])) {
      console.error('File not found:', filePath);
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Get signed URL for the file
    const { data, error } = await supabase
      .storage
      .from('notes')
      .createSignedUrl(filePath, 60); // URL valid for 60 seconds

    if (error) {
      console.error('Error creating signed URL:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data?.signedUrl) {
      return NextResponse.json({ error: "Failed to generate download URL" }, { status: 500 });
    }

    return NextResponse.json({ url: data.signedUrl }, { status: 200 });
  } catch (error) {
    console.error("Error downloading file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 