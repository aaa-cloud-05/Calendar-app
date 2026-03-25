import { notFound } from "next/navigation"
import { getInvitationDraft, getInvitationResponses } from "./actions"
import InvitationRecentTracker from "@/components/InvitationRecentTracker"
import InvitationMobileDashboard from "@/components/InvitationMobileDashboard"

type AvailabilityItem = {
  candidateId: string
  status: "yes" | "maybe" | "no"
  badges?: {
    id?: string
    label?: string
  }[]
}

type CandidateResponder = {
  id: string
  displayName: string
  status: "yes" | "maybe" | "no"
  badges: string[]
  comment?: string
}

function isAvailabilityItem(value: unknown): value is AvailabilityItem {
  if (!value || typeof value !== "object") return false

  const item = value as Record<string, unknown>
  return (
    typeof item.candidateId === "string" &&
    (item.status === "yes" || item.status === "maybe" || item.status === "no")
  )
}

function isAvailabilityArray(value: unknown): value is AvailabilityItem[] {
  return Array.isArray(value) && value.every(isAvailabilityItem)
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>
  searchParams: Promise<{ share?: string }>
}) {
  const { token } = await params
  const { share } = await searchParams
  const isShareOpen = share === "1"
  
  const invitation = await getInvitationDraft(token)

  if (!invitation) {
    return notFound()
  }

  const responses = await getInvitationResponses(invitation.id)
  const commentResponses = responses.filter(
    (response) => response.comment && response.comment.trim().length > 0
  )

  const candidateSummaries = invitation.dateCandidates.map((candidate) => {
    const summary = {
      yes: 0,
      maybe: 0,
      no: 0,
    }

    const tagMap = new Map<string, number>()
    const responders: CandidateResponder[] = []

    responses.forEach((response, index) => {
      if (!isAvailabilityArray(response.availability)) return

      const availability = response.availability.find(
        (item) => item?.candidateId === candidate.id
      )

      if (!availability) return

      if (availability.status === "yes") summary.yes += 1
      if (availability.status === "maybe") summary.maybe += 1
      if (availability.status === "no") summary.no += 1

      const badges = availability.badges
        ?.map((badge) => badge?.label?.trim())
        .filter((label): label is string => Boolean(label)) ?? []

      badges.forEach((label) => {
        tagMap.set(label, (tagMap.get(label) ?? 0) + 1)
      })

      const defaultName = `参加者${responses.length - index}`

      responders.push({
        id: response.id,
        displayName: invitation.settings.anonymousResponse
          ? defaultName
          : response.name?.trim() || defaultName,
        status: availability.status,
        badges,
        comment: response.comment?.trim() || undefined,
      })
    })

    const dateLabel = new Date(candidate.date).toLocaleDateString("ja-JP", {
      month: "numeric",
      day: "numeric",
      weekday: "short",
    })

    return {
      candidateId: candidate.id,
      dateLabel,
      date: new Date(candidate.date).toLocaleDateString("ja-JP", {
        month: "numeric",
        day: "numeric",
      }),
      timeLabel:
        candidate.startTime && candidate.endTime
          ? `${candidate.startTime} - ${candidate.endTime}`
          : candidate.startTime || candidate.endTime || undefined,
      comment: candidate.comment,
      tags: Array.from(tagMap.entries())
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "ja")),
      responders,
      ...summary,
    }
  })

  const rankingData = candidateSummaries
    .map(({ date, timeLabel, yes, maybe, no }) => ({
      date,
      timeLabel,
      yes,
      maybe,
      no,
      score: yes + maybe * 0.6 - no * 0.8,
    }))
    .sort((a, b) => b.score - a.score)

  const isDeadlinePassed = invitation.settings.deadline
    ? new Date(invitation.settings.deadline) < new Date()
    : false

  return (
    <div className="max-w-md mx-auto p-4">
      <InvitationRecentTracker token={token} title={invitation.title} />
      <InvitationMobileDashboard
        token={token}
        invitation={invitation}
        participants={invitation.creatorName
          ? [{ id: "organizer", name: invitation.creatorName, role: "organizer" }]
          : []}
        rankingData={rankingData}
        candidateSummaries={candidateSummaries}
        commentResponses={commentResponses.map((response) => ({
          id: response.id,
          name:
            !invitation.settings.anonymousResponse && response.name?.trim()
              ? response.name.trim()
              : undefined,
          comment: response.comment!.trim(),
        }))}
        responsesCount={responses.length}
        isDeadlinePassed={isDeadlinePassed}
        isShareOpen={isShareOpen}
      />

    </div>
  )
}