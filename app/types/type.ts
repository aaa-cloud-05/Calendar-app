export type InvitationDraft = {
  title: string
  description?: string
  locationUrl?: string

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
  date: Date        // "2025-10-05"
  startTime?: string  // "18:00"
  endTime?: string
  comment?: string
}