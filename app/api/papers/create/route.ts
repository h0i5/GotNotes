import { createClient } from "@/app/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { title, description, course_id } = await request.json();
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's college_id
    const { data: userData, error: userDataError } = await supabase
      .from('users')
      .select('college_id')
      .eq('id', user.id)
      .single();

    if (userDataError || !userData?.college_id) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('papers')
      .insert([{ 
        title,
        description,
        college_id: userData.college_id,
        course_id,
        user_id: user.id,
        uploadedat: new Date().toISOString(),
        updatedat: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error creating paper:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 