import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase/server"
import { deserializeInvitation } from "@/lib/invitation/deserialize"
import { InvitationFromDB } from "@/app/types/type"

export async function GET(
  _: Request,
  { params }: { params: { token: string } }
) {
  const supabase = await supabaseServer()

  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("invite_token", params.token)
    .single<InvitationFromDB>()

  if (error || !data) {
    return NextResponse.json(
      { error: "not found" },
      { status: 404 }
    )
  }

  const invitation = deserializeInvitation(data)

  return NextResponse.json(invitation)
}
