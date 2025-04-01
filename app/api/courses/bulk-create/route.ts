import { createClient } from "@/app/utils/supabase/server";
import { NextResponse } from "next/server";

interface Course {
  title: string;
  description: string;
}

export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { courses } = await request.json();

    // Validate courses array
    if (!Array.isArray(courses) || courses.length === 0) {
      return NextResponse.json(
        { error: "Invalid courses data" },
        { status: 400 }
      );
    }

    // Get user's college_id
    const { data: userData, error: error } = await supabase
      .from('users')
      .select('college_id')
      .eq('id', user.id)
      .single();

    if (error || !userData?.college_id) {
      return NextResponse.json(
        { error: "College not found" },
        { status: 404 }
      );
    }

    // Prepare courses data with college_id and created_by
    const coursesData = courses.map((course: Course) => ({
      ...course,
      college_id: userData.college_id,
      created_by: user.id,
      created_at: new Date().toISOString(),
    }));

    // Insert all courses in a single query
    const { data, error: error2 } = await supabase
      .from('courses')
      .insert(coursesData)
      .select();

    if (error2) throw error2;

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error creating courses:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 