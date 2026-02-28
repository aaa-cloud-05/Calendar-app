"use server"

import { supabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { DateResponse, Tag } from "@/app/types/type"

type SubmitPayload = {
  invitationId: string
  guestId: string
  availability: DateResponse[]
  selectedTags: Tag[]
  comment?: string
}

export async function submitResponse(token: string, payload: SubmitPayload) {
  const supabase = await supabaseServer()

  const { error } = await supabase
    .from("responses")
    .upsert(
      {
        invitation_id: payload.invitationId,
        guest_id: payload.guestId,
        availability: payload.availability,
        selected_tags: payload.selectedTags,
        comment: payload.comment ?? null,
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