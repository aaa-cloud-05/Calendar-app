import { notFound } from "next/navigation"
import InvitationHeroCard from "@/components/HeroCard"
import { getInvitationDraft, getInvitationResponses } from "./actions"
import Link from "next/link"
import ResponseStatusChart from "@/components/ResponseStatusChart"
import DateCandidateRanking from "@/components/DateCandidateRanking"
import InvitationShareDialog from "@/components/InvitationShareDialog"
import { Button } from "@/components/ui/button"
import InvitationRecentTracker from "@/components/InvitationRecentTracker"

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
  const commentResponses = responses.filter(
    (response) => response.comment && response.comment.trim().length > 0
  )

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

  const isDeadlinePassed = invitation.settings.deadline
    ? new Date(invitation.settings.deadline) < new Date()
    : false

  return (
    <div className="max-w-md mx-auto p-4">
      <InvitationRecentTracker token={token} title={invitation.title} />
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
        <div className="mt-4 space-y-2">
          <h2 className="text-sm font-semibold">コメント({commentResponses.length})</h2>
          {commentResponses.length === 0 ? (
            <p className="text-sm text-muted-foreground">コメントはまだありません。</p>
          ) : (
            <ul className="space-y-2">
              {commentResponses.map((response) => (
                <li key={response.id} className="rounded-md border p-3">
                  {!invitation.settings.anonymousResponse && response.name?.trim() && (
                    <p className="text-xs text-muted-foreground">{response.name.trim()}</p>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{response.comment}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <div className="flex flex-col items-start gap-2">
        <Button asChild disabled={isDeadlinePassed}>
          <Link
            href={isDeadlinePassed ? "#" : `/answer/${token}`}
            aria-disabled={isDeadlinePassed}
            tabIndex={isDeadlinePassed ? -1 : 0}
          >
            Answer
          </Link>
        </Button>
        {isDeadlinePassed && (
          <p className="text-xs text-muted-foreground">
            ※締め切りを過ぎているため回答できません。
          </p>
        )}
        <InvitationShareDialog token={token} defaultOpen={isShareOpen} />
      </div>
    </div>
  )
}