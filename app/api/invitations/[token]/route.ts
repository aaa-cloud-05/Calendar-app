import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase/server"

export async function GET(
  _: Request,
  { params }: { params: { token: string } }
) {
  const supabase = await supabaseServer()

  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("invite_token", params.token)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "not found" }, { status: 404 })
  }

  return NextResponse.json(data)
}
