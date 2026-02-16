import { supabaseServer } from "@/lib/supabase/server"
import { InvitationDraft } from "@/app/types/type"

export async function getInvitationDraft(token: string): Promise<InvitationDraft | null> {
  const supabase = await supabaseServer()

  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("invite_token", token)
    .single()

  if (error || !data) return null

  return {
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