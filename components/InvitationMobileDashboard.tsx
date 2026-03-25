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
  VerifiedIcon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { ReactNode } from "react"

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

function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <Card className="space-y-4 rounded-2xl p-5 shadow-sm">
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {children}
    </Card>
  )
}

function OverviewItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border bg-background p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-2 text-sm font-medium leading-relaxed">{value}</p>
    </div>
  )
}

function CandidateScore({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border p-3 text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
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
          <Card className="space-y-4 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-2xl font-bold leading-tight">{invitation.title || "イベントタイトル未設定"}</h1>
              <Badge variant="outline">{remainingDays != null ? `残り${remainingDays}日` : "期限なし"}</Badge>
          </div>
          {organizer ? (
            <div className="flex items-center gap-3 rounded-xl border p-3">
              <div className="relative w-fit">
                <Avatar>
                  <AvatarImage alt={organizer.name} src={organizer.avatar} />
                  <AvatarFallback>{organizer.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <span className="absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full bg-background">
                  <VerifiedIcon className="size-full fill-blue-500 text-white" />
                </span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">主催者</p>
                <p className="text-sm font-semibold">{organizer.name}</p>
              </div>
            </div>
          ) : null}
        
          <p className="text-sm text-muted-foreground leading-relaxed">
            {invitation.description?.trim() || "参加者へのメッセージはまだありません。"}
          </p>
        </Card>
          <SectionCard title="招待の概要" subtitle={`回答 ${responsesCount} 件`}>
            <div className="grid grid-cols-2 gap-3">
              <OverviewItem
                icon={<CalendarClock className="size-4" />}
                label="締め切り"
                value={formatDeadline(invitation.settings.deadline)}
              />
              <OverviewItem
                icon={<Clock3 className="size-4" />}
                label="基本時刻"
                value={formatTimeRange(invitation.startTime, invitation.endTime)}
              />
              <OverviewItem icon={<MapPin className="size-4" />} label="場所" value={invitation.location || "未設定"} />
              <OverviewItem
                icon={<CircleDollarSign className="size-4" />}
                label="予算"
                value={formatBudget(invitation.budget)}
              />
            </div>
          </SectionCard>
          <SectionCard title="有力な候補日" subtitle="上位候補を比較できます。">
          {topCandidate ? (
            <div className="rounded-xl border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">1位</p>
                  <p className="mt-1 text-lg font-semibold">{topCandidate.date}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{topCandidate.timeLabel || "時刻未設定"}</p>
                </div>
                <Badge>Best</Badge>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <CandidateScore label="Yes" value={topCandidate.yes} />
                <CandidateScore label="Maybe" value={topCandidate.maybe} />
                <CandidateScore label="No" value={topCandidate.no} />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">候補日がまだありません。</p>
          )}

          {nextCandidates.length > 0 ? (
            <div className="space-y-2">
              {nextCandidates.map((item, index) => (
                <div
                  key={`${item.date}-${index}`}
                  className="flex items-center justify-between rounded-xl border px-4 py-3"
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
        ) : null}
        </SectionCard>

        <SectionCard title="参加判断に必要な情報">
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
        </SectionCard>
      </TabsContent>

      <TabsContent value="responses" className="mt-0 space-y-4">
        <DateCandidateSummaryList items={candidateSummaries} />

        <Card className="space-y-3 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <MessageSquareText className="size-4 text-violet-500" />
            <h2 className="text-base font-semibold">コメント ({commentResponses.length})</h2>
          </div>
          {commentResponses.length === 0 ? (
            <p className="text-sm text-muted-foreground">コメントはまだありません。</p>
          ) : (
            <ul className="space-y-2">
              {commentResponses.map((response) => (
                <li key={response.id} className="rounded-xl border p-3">
                  {response.name ? <p className="text-xs text-muted-foreground">{response.name}</p> : null}
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
            <p className="text-center text-xs text-muted-foreground">※締め切りを過ぎているため回答できません。</p>
          ) : null}
          <div className="flex items-center gap-2">
            <TabsList className="grid h-12 w-full grid-cols-2 rounded-2xl p-1">
              <TabsTrigger value="overview" className="rounded-xl">
                概要
              </TabsTrigger>
              <TabsTrigger value="responses" className="rounded-xl">
                回答状況
              </TabsTrigger>
            </TabsList>
            <InvitationShareDialog token={token} defaultOpen={isShareOpen} />
          </div>
        </div>
      </div>
    </Tabs>
  )
}