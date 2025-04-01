import { createClient } from "@/app/utils/supabase/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { title, description, course_id, file_path } = await request.json();

    const { data, error } = await supabase
      .from('notes')
      .insert({
        title,
        description,
        course_id,
        file_path,
        created_by: user.id
      })
      .select(`
        *,
        creator:users!created_by (
          first_name,
          last_name
        )
      `)
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 