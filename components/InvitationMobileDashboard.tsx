"use client"

import Link from "next/link"
import DateCandidateSummaryList from "@/components/DateCandidateSummaryList"
import InvitationShareDialog from "@/components/InvitationShareDialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { InvitationDraft, Participant } from "@/app/types/type"
import {
  CalendarClock,
  CircleDollarSign,
  Clock3,
  MapPin,
  MessageSquareText,
  Sparkles,
  Users,
  VerifiedIcon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"

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

function formatDeadline(deadline?: string) {
  if (!deadline) return "期限なし"

  return new Date(deadline).toLocaleString("ja-JP", {
    month: "numeric",
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
  const topCandidate = rankingData[0]
  const nextCandidates = rankingData.slice(1, 3)
  const organizer = participants.find((participant) => participant.role === "organizer")
  const remainingDays = getRemainingDays(invitation.settings.deadline)

  return (
    <Tabs defaultValue="overview" className="pb-28">
      <TabsContent value="overview" className="mt-0 space-y-4">
        <Card className="overflow-hidden rounded-3xl border-none bg-liner-to-br from-orange-400 via-rose-400 to-red-500 p-5 text-white shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <Badge className="border-white/20 bg-black/20 text-white hover:bg-black/20">
              {remainingDays != null ? `残り${remainingDays}日` : "期限なし"}
            </Badge>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Invite</p>
            <h1 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight">
              {invitation.title || "イベントタイトル未設定"}
            </h1>
          </div>
          {organizer ? (
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-black/15 p-3">
              <div className="relative w-fit">
                <Avatar>
                  <AvatarImage alt={organizer.name} src={organizer.avatar} />
                  <AvatarFallback>{organizer.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <span className="-bottom-1 -right-1 absolute flex size-4 items-center justify-center rounded-full bg-background">
                  <VerifiedIcon className="size-full fill-blue-500 text-white" />
                </span>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-white/70">Organizer</p>
                <p className="text-sm font-bold">{organizer.name}</p>
              </div>
            </div>
          ) : null}
        </Card>

        <Card className="space-y-4 rounded-3xl border-none bg-blue-400 p-5 text-white shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                Overview
              </p>
              <h2 className="mt-1 text-lg font-bold">招待の概要</h2>
            </div>
            <Badge className="border-white/20 bg-white/15 text-white">回答 {responsesCount} 件</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs text-white/80">
                <CalendarClock className="size-4" />
                <span>締め切り</span>
              </div>
              <p className="mt-2 text-sm font-semibold leading-relaxed">{formatDeadline(invitation.settings.deadline)}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs text-white/80">
                <Clock3 className="size-4" />
                <span>基本時刻</span>
              </div>
              <p className="mt-2 text-sm font-semibold">{formatTimeRange(invitation.startTime, invitation.endTime)}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs text-white/80">
                <MapPin className="size-4" />
                <span>場所</span>
              </div>
              <p className="mt-2 text-sm font-semibold leading-relaxed">{invitation.location || "未設定"}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs text-white/80">
                <CircleDollarSign className="size-4" />
                <span>予算</span>
              </div>
              <p className="mt-2 text-sm font-semibold">{formatBudget(invitation.budget)}</p>
            </div>
          </div>
        </Card>

        <Card className="space-y-4 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-orange-500" />
            <div>
              <h2 className="text-base font-semibold">有力な候補日</h2>
              <p className="text-sm text-muted-foreground">上位候補をすぐ比較できます。</p>
            </div>
          </div>

          {topCandidate ? (
            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-900/60 dark:bg-orange-950/30">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-300">
                    1位
                  </p>
                  <p className="mt-1 text-lg font-bold">{topCandidate.date}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{topCandidate.timeLabel || "時刻未設定"}</p>
                </div>
                <Badge className="bg-orange-500 text-white hover:bg-orange-500">Best</Badge>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-2xl bg-background/80 p-3">
                  <p className="text-xs text-muted-foreground">Yes</p>
                  <p className="mt-1 text-lg font-semibold text-emerald-600">{topCandidate.yes}</p>
                </div>
                <div className="rounded-2xl bg-background/80 p-3">
                  <p className="text-xs text-muted-foreground">Maybe</p>
                  <p className="mt-1 text-lg font-semibold text-amber-600">{topCandidate.maybe}</p>
                </div>
                <div className="rounded-2xl bg-background/80 p-3">
                  <p className="text-xs text-muted-foreground">No</p>
                  <p className="mt-1 text-lg font-semibold text-rose-600">{topCandidate.no}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">候補日がまだありません。</p>
          )}

          {nextCandidates.length > 0 && (
            <div className="space-y-2">
              {nextCandidates.map((item, index) => (
                <div
                  key={`${item.date}-${index}`}
                  className="flex items-center justify-between rounded-2xl border px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{index + 2}位: {item.date}</p>
                    <p className="text-xs text-muted-foreground">{item.timeLabel || "時刻未設定"}</p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>Yes {item.yes}</p>
                    <p>Maybe {item.maybe}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="space-y-4 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-sky-500" />
            <div>
              <h2 className="text-base font-semibold">参加判断に必要な情報</h2>
              <p className="text-sm text-muted-foreground">タグやメッセージをまとめて確認できます。</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">条件タグ</p>
              {invitation.tags.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {invitation.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary" className="rounded-full px-3 py-1">
                      {tag.label}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">タグは設定されていません。</p>
              )}
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground">メッセージ</p>
              <div className="mt-2 rounded-2xl bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">
                {invitation.description?.trim() || "参加者へのメッセージはまだありません。"}
              </div>
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="responses" className="mt-0 space-y-4">

        <DateCandidateSummaryList items={candidateSummaries} />

        <Card className="space-y-3 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <MessageSquareText className="size-4 text-violet-500" />
            <h2 className="text-base font-semibold">コメント ({commentResponses.length})</h2>
          </div>
          {commentResponses.length === 0 ? (
            <p className="text-sm text-muted-foreground">コメントはまだありません。</p>
          ) : (
            <ul className="space-y-2">
              {commentResponses.map((response) => (
                <li key={response.id} className="rounded-2xl border p-3">
                  {response.name ? (
                    <p className="text-xs text-muted-foreground">{response.name}</p>
                  ) : null}
                  <p className="mt-1 text-sm whitespace-pre-wrap">{response.comment}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </TabsContent>

      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md border-t bg-background/95 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-3 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="space-y-3">
          <Button asChild className="h-11 w-full rounded-2xl" disabled={isDeadlinePassed}>
            <Link
              href={isDeadlinePassed ? "#" : `/answer/${token}`}
              aria-disabled={isDeadlinePassed}
              tabIndex={isDeadlinePassed ? -1 : 0}
            >
              回答する
            </Link>
          </Button>
          {isDeadlinePassed ? (
            <p className="text-center text-xs text-muted-foreground">
              ※締め切りを過ぎているため回答できません。
            </p>
          ) : null}
          <div className="flex items-center gap-2">
            <TabsList className="grid h-12 w-full grid-cols-2 rounded-2xl p-1">
              <TabsTrigger value="overview" className="rounded-xl">概要</TabsTrigger>
              <TabsTrigger value="responses" className="rounded-xl">回答状況</TabsTrigger>
            </TabsList>
            <InvitationShareDialog token={token} defaultOpen={isShareOpen} />
          </div>
        </div>
      </div>
    </Tabs>
  )
}