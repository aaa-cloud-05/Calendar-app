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
    deadline?: string
  }
}

export type Tag = {
  id: string
  label: string
}

export type DateCandidate = {
  id: string
  date: string
  startTime?: string
  endTime?: string
  comment?: string
}

export type Participant = {
  id: string
  name: string
  avatar?: string
  role: "organizer" | "member"
}

export interface Invitation extends InvitationDraft {
  id: string
  inviteToken: string
  createdAt: string
}
