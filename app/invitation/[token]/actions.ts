import { supabaseServer } from "@/lib/supabase/server"
import { InvitationDraft } from "@/app/types/type"

export type InvitationResponse = {
  id: string
  invitation_id: string
  guest_id: string
  availability: unknown
  selected_tags: unknown
  comment: string | null
  created_at: string
}

export async function getInvitationDraft(
  token: string
): Promise<(InvitationDraft & { id: string }) | null> {
  const supabase = await supabaseServer()

  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("invite_token", token)
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    title: data.title,
    description: data.description || "",
    location: data.location || "",
    budget: data.budget || undefined,
    startTime: data.start_time || "",
    endTime: data.end_time || "",
    tags: data.tags || [],
    settings: data.settings || {},
    dateCandidates: (data.date_candidates || []).map((dc: { id: string; date: string; startTime?: string; endTime?: string; comment?: string }) => ({
      ...dc,
      date: new Date(dc.date),
    })),
  }
}

export async function getInvitationResponses(
  invitationId: string
): Promise<InvitationResponse[]> {
  const supabase = await supabaseServer()

  const { data, error } = await supabase
    .from("responses")
    .select("id, invitation_id, guest_id, availability, selected_tags, comment, created_at")
    .eq("invitation_id", invitationId)
    .order("created_at", { ascending: false })

  if (error || !data) return []

  return data
}