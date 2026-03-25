"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import InvitationShareDialog from "@/components/InvitationShareDialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { InvitationDraft, Participant } from "@/app/types/type"
import {
  CalendarCheck2,
  ChartNoAxesColumn,
  CheckCircle2,
  Clock,
  DollarSign,
  MapPinCheck,
  MessageSquareText,
} from "lucide-react"
import DateCandidateSummaryList from "./DateCandidateSummaryList"

type RankingItem = {
  date: string
  yes: number
  maybe: number
  no: number
  score: number
  timeLabel?: string
}

type CandidateResponder = {
  id: string
  displayName: string
  status: "yes" | "maybe" | "no"
  badges: string[]
  comment?: string
}

type SummaryItem = {
  candidateId: string
  dateLabel: string
  timeLabel?: string
  comment?: string
  yes: number
  maybe: number
  no: number
  tags: Array<{
    label: string
    count: number
  }>
  responders: CandidateResponder[]
}

type CommentItem = {
  id: string
  name?: string
  comment: string
}

type Props = {
  token: string
  invitation: InvitationDraft
  participants: Participant[]
  rankingData: RankingItem[]
  candidateSummaries: SummaryItem[]
  commentResponses: CommentItem[]
  responsesCount: number
  isDeadlinePassed: boolean
  isShareOpen: boolean
}

function formatDateTime(deadline?: string) {
  if (!deadline) return "期限なし"

  return new Date(deadline).toLocaleString("ja-JP", {
    month: "short",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatBudget(budget?: number) {
  if (budget == null) return "未設定"
  return `¥${budget.toLocaleString("ja-JP")}`
}

function formatTimeRange(startTime?: string, endTime?: string) {
  if (startTime && endTime) return `${startTime} - ${endTime}`
  return startTime || endTime || "未設定"
}

function getRemainingDays(deadline?: string) {
  if (!deadline) return null

  return Math.max(
    0,
    Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  )
}

export default function InvitationMobileDashboard({
  token,
  invitation,
  participants,
  rankingData,
  candidateSummaries,
  commentResponses,
  responsesCount,
  isDeadlinePassed,
  isShareOpen,
}: Props) {
  const [activeTab, setActiveTab] = useState("overview")

  const organizer = participants.find((participant) => participant.role === "organizer")
  const rankingByScore = useMemo(() => [...rankingData].sort((a, b) => b.score - a.score), [rankingData])
  const topCandidate = rankingByScore[0]

  const participantLabels = useMemo(() => {
    const names = participants.map((participant) => participant.name)
    return names.slice(0, 11)
  }, [participants])

  const overflowCount = Math.max(0, participants.length - participantLabels.length)
  const remainingDays = getRemainingDays(invitation.settings.deadline)

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="min-h-screen bg-gray-50 pb-32">
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <TabsList className="grid h-12 w-full grid-cols-2 rounded-none bg-transparent p-0">
          <TabsTrigger
            value="overview"
            className="h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:text-red-500 data-[state=active]:shadow-none"
          >
            overview
          </TabsTrigger>
          <TabsTrigger
            value="responses"
            className="h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:text-red-500 data-[state=active]:shadow-none"
          >
            responses
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="overview" className="mt-0 space-y-0">
        <div className="bg-white">
          <div className="px-5 pb-4 pt-6">
            <div className="mb-4 flex size-16 items-center justify-center rounded-2xl shadow-sm">
              <span className="text-3xl">☺</span>
            </div>

            <div className="mb-2 flex items-center justify-between gap-2">
              <h1 className="text-2xl font-semibold leading-tight">{invitation.title || "イベントタイトル未設定"}</h1>
              <Badge variant="outline" className="shrink-0">
                {remainingDays != null ? `残り${remainingDays}日` : "期限なし"}
              </Badge>
            </div>

            {organizer ? (
              <div className="mb-4 flex items-center gap-2">
                {/* <Avatar className="size-6 border border-gray-200">
                  <AvatarImage src={organizer.avatar} alt={organizer.name} />
                  <AvatarFallback className="bg-gray-100 text-xs text-gray-600">{organizer.name.slice(0, 1)}</AvatarFallback>
                </Avatar> */}
                <p className="text-sm text-gray-600">by {organizer.name}</p>
              </div>
            ) : null}

            <p className="text-sm leading-relaxed text-gray-600">
              {invitation.description?.trim() || "参加者へのメッセージはまだありません。"}
            </p>
          </div>

          <div className="flex items-center gap-4 px-5 pb-5 text-sm">
            <div className="flex items-center gap-1.5 text-gray-600">
              <Clock className="size-4" />
              <span>{formatTimeRange(invitation.startTime, invitation.endTime)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              <DollarSign className="size-4" />
              <span>{formatBudget(invitation.budget)}</span>
            </div>
            
          </div>
        </div>

        <div className="mb-6 px-5 bg-white">
          <div className="flex flex-wrap gap-2">
            {invitation.tags.length > 0 ? (
              invitation.tags.map((tag) => (
                <Badge
                  key={tag.id}
                  className="rounded-full border  bg-gray-50 px-2.5 py-1 text-xs font-normal text-gray-700"
                >
                  <CheckCircle2 className="mr-1 size-3" />
                  {tag.label}
                </Badge>
              ))
            ) : (
              <Badge className="rounded-full border  bg-gray-50 px-2.5 py-1 text-xs font-normal text-gray-700">
                <CheckCircle2 className="mr-1 size-3" />
                参加条件なし
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-3 px-5 py-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <CalendarCheck2 className="size-4" />
                    <p className="text-xs opacity-90">Best Date</p>
                  </div>
                  <p className="text-lg font-semibold">{topCandidate?.date || "候補日未設定"}</p>
                  <p className="text-xs opacity-90">{topCandidate?.timeLabel || formatTimeRange(invitation.startTime, invitation.endTime)}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs opacity-90">
                    <span>Yes {topCandidate?.yes ?? 0}</span>
                    <span>Maybe {topCandidate?.maybe ?? 0}</span>
                    <span>No {topCandidate?.no ?? 0}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-light opacity-90">{topCandidate?.yes ?? 0}</div>
                <div className="text-xs opacity-75">available</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white shadow-none">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <MapPinCheck className="size-4 text-gray-700" />
                    <p className="text-xs text-gray-600">Best Location</p>
                  </div>
                  <p className="text-lg font-semibold">{invitation.location || "未設定"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 px-5">
          <Card className="border border-gray-200 bg-white shadow-none">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center gap-2">
                <MessageSquareText className="size-4 text-gray-700" />
                <p className="text-xs text-gray-600">Comment</p>
                <span className="text-xs text-gray-500">({commentResponses.length})</span>
              </div>
              {commentResponses.length === 0 ? (
                <p className="text-sm text-gray-500">コメントはまだありません。</p>
              ) : (
                <ul className="space-y-2">
                  {commentResponses.slice(0, 3).map((response) => (
                    <li key={response.id} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                      {response.name ? <p className="text-xs text-gray-500">{response.name}</p> : null}
                      <p className="text-sm text-gray-700 line-clamp-2">{response.comment}</p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 px-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm text-gray-700">Who&apos;s answering</h3>
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <ChartNoAxesColumn className="size-4" />
              <span>{responsesCount} responses</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {participantLabels.map((name, idx) => (
              <Badge
                key={`${name}-${idx}`}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-normal text-gray-700 hover:bg-gray-50"
              >
                {name}
              </Badge>
            ))}
            {overflowCount > 0 ? (
              <Badge className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-normal text-gray-700 hover:bg-gray-50">
                +{overflowCount} more
              </Badge>
            ) : null}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="responses" className="mt-0 space-y-4 px-5 py-5">
        <DateCandidateSummaryList items={candidateSummaries} />
      </TabsContent>

      <div className="fixed bottom-0 left-0 right-0 border-none border-gray-200 bg-white px-5 pb-6 pt-4">
        <div className="flex items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="h-12 w-2xs rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600"
            disabled={isDeadlinePassed}
          >
            <Link
              href={isDeadlinePassed ? "#" : `/answer/${token}`}
              aria-disabled={isDeadlinePassed}
              tabIndex={isDeadlinePassed ? -1 : 0}
            >
              Answer
            </Link>
          </Button>
          <InvitationShareDialog token={token} defaultOpen={isShareOpen} />
        </div>
        {isDeadlinePassed ? (
          <p className="pt-2 text-center text-xs text-muted-foreground">※締め切りを過ぎているため回答できません。</p>
        ) : null}
      </div>
    </Tabs>
  )
}