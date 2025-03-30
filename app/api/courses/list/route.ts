import { createClient } from "@/app/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const college_id = searchParams.get('college_id');
    
    if (!college_id) {
      return NextResponse.json({ error: "College ID is required" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('college_id', college_id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 