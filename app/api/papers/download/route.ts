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

    // Get signed URL for the file
    const { data, error } = await supabase
      .storage
      .from('papers')
      .createSignedUrl(filePath, 60); // URL valid for 60 seconds

    if (error || !data) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
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