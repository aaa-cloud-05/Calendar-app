export type InvitationDraft = {
  title: string
  description?: string
  location?: string
  budget?: number
  startTime?: string
  endTime?: string

  tags: Tag[]

  dateCandidates: DateCandidate[]

  settings: {
    anonymousResponse: boolean
    hideParticipants: boolean
    allowComments: boolean
    deadline?: string // ISO
  }
}

export type Tag = {
  id: string
  label: string
}

export type DateCandidate = {
  id: string
  date: Date       // "2025-10-05"
  startTime?: string  // "18:00"
  endTime?: string
  comment?: string
}

export type Participant = {
  id: string
  name: string
  avatar?: string
  role: "organizer" | "member"
}

export type InvitationFromDB = {
  id: string
  invite_token: string
  created_at: string

  title: string
  description: string | null
  location: string | null
  budget: number | null
  start_time: string | null
  end_time: string | null

  tags: Tag[] | null
  date_candidates: {
    id: string
    date: string // YYYY-MM-DD
    startTime?: string
    endTime?: string
    comment?: string
  }[]

  settings: InvitationDraft["settings"]
}
