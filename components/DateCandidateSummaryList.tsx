import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CalendarDays, Clock3, MessageSquareText, Tags } from "lucide-react"

type Responder = {
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
  responders: Responder[]
}

type Props = {
  items: SummaryItem[]
}

const STATUS_META = [
  {
    key: "yes",
    label: "Yes",
    dotClassName: "bg-emerald-500",
    textClassName: "text-emerald-600",
    badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/70 dark:bg-emerald-950/40 dark:text-emerald-200",
    avatarClassName: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
  },
  {
    key: "maybe",
    label: "Maybe",
    dotClassName: "bg-amber-500",
    textClassName: "text-amber-600",
    badgeClassName: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/70 dark:bg-amber-950/40 dark:text-amber-200",
    avatarClassName: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
  },
  {
    key: "no",
    label: "No",
    dotClassName: "bg-rose-500",
    textClassName: "text-rose-600",
    badgeClassName: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800/70 dark:bg-rose-950/40 dark:text-rose-200",
    avatarClassName: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200",
  },
] as const

function getStatusMeta(status: Responder["status"]) {
  return STATUS_META.find((item) => item.key === status) ?? STATUS_META[1]
}

export default function DateCandidateSummaryList({ items }: Props) {
  if (items.length === 0) {
    return null
  }

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-base font-semibold">日程ごとの回答状況</h2>
        <p className="text-sm text-muted-foreground">
          各候補日の集計に加えて、誰がどの回答とタグを選んだか確認できます。
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const total = item.yes + item.maybe + item.no
          const yesWidth = total > 0 ? (item.yes / total) * 100 : 0
          const maybeWidth = total > 0 ? (item.maybe / total) * 100 : 0
          const noWidth = total > 0 ? (item.no / total) * 100 : 0

          return (
            <Card key={item.candidateId} className="space-y-4 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="size-4" />
                    <span>{item.dateLabel}</span>
                    {item.timeLabel ? (
                      <>
                        <span className="text-border">•</span>
                        <Clock3 className="size-4" />
                        <span>{item.timeLabel}</span>
                      </>
                    ) : null}
                  </div>
                  {item.comment ? (
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      <MessageSquareText className="mt-0.5 size-4 shrink-0" />
                      <p className="leading-relaxed">{item.comment}</p>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="bg-emerald-500" style={{ width: `${yesWidth}%` }} />
                  <div className="bg-amber-500" style={{ width: `${maybeWidth}%` }} />
                  <div className="bg-rose-500" style={{ width: `${noWidth}%` }} />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {STATUS_META.map((status) => (
                    <div
                      key={status.key}
                      className="rounded-xl border bg-muted/30 px-3 py-2"
                    >
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className={`size-2 rounded-full ${status.dotClassName}`} />
                        <span>{status.label}</span>
                      </div>
                      <div className={`mt-1 text-lg font-semibold ${status.textClassName}`}>
                        {item[status.key]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Tags className="size-4" />
                  <span>タグ集計</span>
                </div>

                {item.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <Badge
                        key={`${item.candidateId}-${tag.label}`}
                        variant="outline"
                        className="rounded-full border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-semibold text-orange-700 dark:border-orange-800/70 dark:bg-orange-950/40 dark:text-orange-200"
                      >
                        {tag.label}
                        <span className="ml-1 text-[10px] text-orange-600/80 dark:text-orange-200/80">
                          {tag.count}
                        </span>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">この日程に紐づくタグはまだありません。</p>
                )}
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={`responders-${item.candidateId}`} className="border-none">
                  <AccordionTrigger className="rounded-xl border-none px-3 py-3 hover:no-underline">
                    <div className="text-sm font-medium">回答者を見る</div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-3">
                    <div className="space-y-3">
                      {item.responders.map((responder) => {
                        const status = getStatusMeta(responder.status)

                        return (
                          <div
                            key={responder.id}
                            className="rounded-xl border bg-muted/20 p-3"
                          >
                            <div className="flex items-start gap-3">
                              {/* <Avatar className="size-10 border">
                                <AvatarFallback className={status.avatarClassName}>
                                  {getInitials(responder.displayName)}
                                </AvatarFallback>
                              </Avatar> */}

                              <div className="min-w-0 flex-1 space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${status.badgeClassName}`}
                                  >
                                    {status.label}
                                  </Badge>
                                  <p className="text-sm font-medium">{responder.displayName}</p>
                                </div>

                                {responder.badges.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {responder.badges.map((badge) => (
                                      <Badge
                                        key={`${responder.id}-${badge}`}
                                        variant="outline"
                                        className="rounded-full border-orange-200 bg-orange-50 px-2.5 py-0.5 text-[11px] font-medium text-orange-700 dark:border-orange-800/70 dark:bg-orange-950/40 dark:text-orange-200"
                                      >
                                        {badge}
                                      </Badge>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-xs text-muted-foreground">タグなし</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          )
        })}
      </div>
    </section>
  )
}