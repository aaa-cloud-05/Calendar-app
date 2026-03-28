import { NextResponse } from "next/server"
import { supabaseService } from "@/lib/supabase/service"

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 })
  }

  const title = typeof body.title === "string" ? body.title.trim() : ""
  const creatorName = typeof body.creatorName === "string" ? body.creatorName.trim() : ""
  const dateCandidates = body.dateCandidates

  if (!title || !Array.isArray(dateCandidates) || dateCandidates.length === 0) {
    return NextResponse.json(
      { error: "invalid draft" },
      { status: 400 }
    )
  }

  const supabase = supabaseService()

  const inviteToken = crypto.randomUUID()

  const { data, error } = await supabase
    .from("invitations")
    .insert({
      invite_token: inviteToken,

      title,
      creator_name: creatorName,
      description: (body.description as string | undefined) ?? null,
      location: (body.location as string | undefined) ?? null,
      budget: (body.budget as number | undefined) ?? null,
      start_time: (body.startTime as string | undefined) ?? null,
      end_time: (body.endTime as string | undefined) ?? null,

      tags: body.tags ?? [],
      date_candidates: dateCandidates,
      settings: body.settings ?? {},
    })
    .select("id, invite_token")
    .single()

  if (error) {
    console.error("[POST /api/invitation]", error.message, error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true, id: data.id, inviteToken: data.invite_token })
}
