import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const body = await req.json()

  if (!body.title || body.dateCandidates.length === 0) {
    return NextResponse.json(
      { error: "invalid draft" },
      { status: 400 }
    )
  }

  const supabase = await supabaseServer()

  const { error } = await supabase
    .from("invitations")
    .insert({
      invite_token: crypto.randomUUID(),

      title: body.title,
      description: body.description ?? null,
      location: body.location ?? null,
      budget: body.budget ?? null,
      start_time: body.startTime ?? null,
      end_time: body.endTime ?? null,

      tags: body.tags,
      date_candidates: body.dateCandidates,
      settings: body.settings,
    })

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true })
}
