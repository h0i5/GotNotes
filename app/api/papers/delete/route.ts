import { createClient } from "@/app/utils/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const { id, file_path } = await request.json();
    const supabase = await createClient();

    // First delete from storage
    if (file_path) {
      const { error: storageError } = await supabase
        .storage
        .from('papers')
        .remove([file_path]);

      if (storageError) throw storageError;
    }

    // Then delete from database
    const { error: dbError } = await supabase
      .from('papers')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete paper' },
      { status: 500 }
    );
  }
} 