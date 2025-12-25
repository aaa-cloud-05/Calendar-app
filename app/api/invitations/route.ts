import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase/server"
import { serializeDraft } from "@/lib/invitation/serialize"
import { InvitationDraftPayload } from "@/app/types/type"

export async function POST(req: Request) {
  const body = (await req.json()) as InvitationDraftPayload

  if (!body.title || body.dateCandidates.length === 0) {
    return NextResponse.json({ error: "invalid draft" }, { status: 400 })
  }

  const supabase = await supabaseServer()

  const { data, error } = await supabase
    .from("invitations")
    .insert({
      invite_token: crypto.randomUUID(),
      ...serializeDraft(body),
    })
    .select("id, invite_token")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    id: data.id,
    inviteToken: data.invite_token,
  })
}
