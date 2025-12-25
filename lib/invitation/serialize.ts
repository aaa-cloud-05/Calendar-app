import { InvitationDraftPayload } from "@/app/types/type"

export function serializeDraft(draft: InvitationDraftPayload) {
  return {
    title: draft.title,
    description: draft.description ?? null,
    location: draft.location ?? null,
    budget: draft.budget ?? null,
    start_time: draft.startTime ?? null,
    end_time: draft.endTime ?? null,

    tags: draft.tags,

    date_candidates: draft.dateCandidates.map(dc => ({
      ...dc,
      date: dc.date.slice(0, 10),
    })),

    settings: draft.settings,
  }
}
