import { InvitationDraft } from "@/app/types/type"

export const mapDBToDraft = (data: any): InvitationDraft => {

  return {
    title: data.title,
    description: data.description || "",
    location: data.location || "",
    budget: data.budget || undefined,
    
    startTime: data.start_time || "", 
    endTime: data.end_time || "",

    tags: data.tags || [],
    settings: data.settings || {
      anonymousResponse: false,
      hideParticipants: false,
      allowComments: false,
    },

    dateCandidates: Array.isArray(data.date_candidates)
      ? data.date_candidates.map((dc: any) => ({
          id: dc.id,
          date: new Date(dc.date),
          startTime: dc.startTime,
          endTime: dc.endTime,
          comment: dc.comment,
        }))
      : [],
  }
}