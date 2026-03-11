import { InvitationDraft } from "@/app/types/type"

type DbDateCandidate = {
  id: string
  date: string | Date
  startTime?: string
  endTime?: string
  comment?: string
}

type DbInvitationDraft = {
  creator_name?: string
  title: string
  description?: string
  location?: string
  budget?: number
  start_time?: string
  end_time?: string
  tags?: InvitationDraft["tags"]
  settings?: InvitationDraft["settings"]
  date_candidates?: DbDateCandidate[]
}

export const mapDBToDraft = (data: DbInvitationDraft): InvitationDraft => {

  return {
    creatorName: data.creator_name || "",
    title: data.title,
    description: data.description || "",
    location: data.location || "",
    budget: data.budget || undefined,
    
    startTime: data.start_time || "", 
    endTime: data.end_time || "",

    tags: data.tags || [],
    settings: data.settings || {
      anonymousResponse: false,
      allowComments: false,
    },

    dateCandidates: Array.isArray(data.date_candidates)
      ? data.date_candidates.map((dc) => ({
          id: dc.id,
          date: new Date(dc.date),
          startTime: dc.startTime,
          endTime: dc.endTime,
          comment: dc.comment,
        }))
      : [],
  }
}