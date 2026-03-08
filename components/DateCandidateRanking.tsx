import { Card } from "@/components/ui/card"

type RankingItem = {
  date: string
  yes: number
  maybe: number
  no: number
  score: number
}

type Props = {
  items: RankingItem[]
}

export default function DateCandidateRanking({ items }: Props) {
  const topItems = items.slice(0, 3)

  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold">候補日ランキング</h2>
      {topItems.map((item, index) => {
        const total = item.yes + item.maybe + item.no
        const yesWidth = total > 0 ? (item.yes / total) * 100 : 0
        const maybeWidth = total > 0 ? (item.maybe / total) * 100 : 0
        const noWidth = total > 0 ? (item.no / total) * 100 : 0

        return (
          <Card key={`${item.date}-${index}`} className="space-y-2 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{index + 1}位: {item.date}</span>
              <span className="text-muted-foreground">score {item.score.toFixed(1)}</span>
            </div>

            <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="bg-green-500" style={{ width: `${yesWidth}%` }} />
              <div className="bg-amber-500" style={{ width: `${maybeWidth}%` }} />
              <div className="bg-red-500" style={{ width: `${noWidth}%` }} />
            </div>

            <div className="text-xs text-muted-foreground">
              Yes {item.yes} / Maybe {item.maybe} / No {item.no}
            </div>
          </Card>
        )
      })}
    </div>
  )
}