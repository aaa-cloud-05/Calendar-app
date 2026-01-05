"use server"

import { supabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { DateResponse } from "@/app/types/type"

type SubmitPayload = {
  invitationId: string
  guestId: string
  guestName: string
  comment: string
  availabilities: DateResponse[]
}

export async function submitResponse(token: string, payload: SubmitPayload) {
  const supabase = await supabaseServer()

  const { error } = await supabase
    .from("responses")
    .upsert(
      {
        invitation_id: payload.invitationId,
        guest_id: payload.guestId,
        guest_name: payload.guestName,
        comment: payload.comment,
        availabilities: payload.availabilities,
      },
      { onConflict: "invitation_id, guest_id" }
    )

  if (error) {
    console.error(error)
    throw new Error("Failed to submit response")
  }

  revalidatePath(`/invitation/${token}`)
  revalidatePath(`/answer/${token}`)
}