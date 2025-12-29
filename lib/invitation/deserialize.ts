import { InvitationFromDB, Invitation } from "@/app/types/type"

export function deserializeInvitation(db: InvitationFromDB): Invitation {
  return {
    id: db.id,
    inviteToken: db.invite_token,
    createdAt: db.created_at,

    title: db.title,
    description: db.description ?? undefined,
    location: db.location ?? undefined,
    budget: db.budget ?? undefined,

    tags: db.tags,

    dateCandidates: db.date_candidates.map(dc => ({
      ...dc,
      date: new Date(dc.date),
    })),

    settings: db.settings,
  }
}
