"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

import { InvitationDraft, Participant } from "@/app/types/type"
import { Send, VerifiedIcon } from "lucide-react"

type InvitationHeroCardProps = {
  draft: InvitationDraft
  participants: Participant[]
  heroImageUrl?: string
  onMessageClick?: () => void
}

export default function InvitationHeroCard({
  draft,
  participants,
  heroImageUrl,
  onMessageClick,
}: InvitationHeroCardProps) {
  const organizer = participants.find(
    (p) => p.role === "organizer"
  )

  const remainingDays = draft.settings.deadline
    ? Math.max(
        0,
        Math.ceil(
          (new Date(draft.settings.deadline).getTime() -
            Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : null

  return (
    <Card className="overflow-hidden rounded-[2rem] shadow-lg">
      {/* Hero */}
      <div className="relative h-44 w-full overflow-hidden">
        {/* Background layer */}
        {heroImageUrl ? (
          <div
            className="absolute -inset-8 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImageUrl})` }}
          />
        ) : (
          <div
            className="
              absolute 
              -inset-100
              bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.55),rgba(239,68,68,0.45),transparent_65%)]
            "
          />
        )}

        
          <div className="absolute top-4 right-4">
            <Badge
              variant="secondary"
              className="bg-black/40 text-white border-white/10 text-[10px]"
            >
              {remainingDays ? "残り{remainingDays}日" : "期限なし"}
            </Badge>
          </div>
        

        <div className="absolute bottom-4 left-4 right-4 space-y-1.5">
          <Badge className="w-fit uppercase tracking-wider text-[10px] bg-red-500">
            Invite
          </Badge>
          <h1 className="text-2xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
            {draft.title}
          </h1>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 pt-4 space-y-5">
        {/* Organizer */}
        {organizer && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-fit">
                <Avatar>
                  <AvatarImage alt="@dovazencot" src={organizer.avatar} />
                  <AvatarFallback>
                    {organizer.name.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <span className="-bottom-1 -right-1 absolute flex size-4 items-center justify-center rounded-full bg-background">
                  <VerifiedIcon className="size-full fill-blue-500 text-white" />
                </span>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Organizer
                </p>
                <p className="text-sm font-bold">
                  {organizer.name}
                </p>
              </div>
            </div>

            {onMessageClick && (
              <button
                onClick={onMessageClick}
                className="w-10 h-10 rounded-full bg-primary/5 hover:bg-primary/10 flex items-center justify-center transition-colors"
              >
                <Send className=""/>
              </button>
            )}
          </div>
        )}

        {/* Tags */}
        {draft.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {draft.tags.map((tag, i) => (
              <Badge
                key={i}
                variant="secondary"
                className={cn(
                  "text-[11px] font-bold gap-1",
                    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
                    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                )}
              >
                {tag.label}
              </Badge>
            ))}
          </div>
        )}

        {/* Description */}
        <div className="pt-4 border-t space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed font-medium whitespace-pre-line">
            {draft.description}
          </p>

          {draft.locationUrl && (
            <a
              href={draft.locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                📍
              </span>
              <span className="underline underline-offset-2">
                場所を見る
              </span>
            </a>
          )}
        </div>
      </div>
    </Card>
  )
}
