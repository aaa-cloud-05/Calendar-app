import { notFound } from "next/navigation"
import InvitationHeroCard from "@/components/HeroCard"
import { getInvitationDraft, getInvitationResponses } from "./actions"
import Link from "next/link"
import ResponseStatusChart from "@/components/ResponseStatusChart"
import DateCandidateRanking from "@/components/DateCandidateRanking"
import InvitationShareDialog from "@/components/InvitationShareDialog"

type AvailabilityItem = {
  candidateId: string
  status: "yes" | "maybe" | "no"
}

function isAvailabilityArray(value: unknown): value is AvailabilityItem[] {
  return Array.isArray(value)
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

  const chartData = invitation.dateCandidates.map((candidate) => {
    const summary = {
      yes: 0,
      maybe: 0,
      no: 0,
    }

    responses.forEach((response) => {
      if (!isAvailabilityArray(response.availability)) return

      const availability = response.availability.find(
        (item) => item?.candidateId === candidate.id
      )

      if (!availability) return

      if (availability.status === "yes") summary.yes += 1
      if (availability.status === "maybe") summary.maybe += 1
      if (availability.status === "no") summary.no += 1
    })

    return {
      date: new Date(candidate.date).toLocaleDateString("ja-JP", {
        month: "numeric",
        day: "numeric",
      }),
      ...summary,
    }
  })

  const rankingData = [...chartData]
    .map((item) => ({
      ...item,
      score: item.yes + item.maybe * 0.6 - item.no * 0.8,
    }))
    .sort((a, b) => b.score - a.score)

  return (
    <div className="max-w-md mx-auto p-4">
      <InvitationHeroCard
        draft={invitation}
        participants={invitation.creatorName
          ? [{ id: "organizer", name: invitation.creatorName, role: "organizer" }]
          : []}
      />

      <div>
        <DateCandidateRanking items={rankingData} />
        <br />
        <ResponseStatusChart data={chartData} />
        <div>回答数: {responses.length}</div>
      </div>
      
      <div className="flex items-center gap-3">
        <Link href={`/answer/${token}`}>Answer Button (CTA)</Link>
        <InvitationShareDialog token={token} defaultOpen={isShareOpen} />
      </div>
    </div>
  )
}