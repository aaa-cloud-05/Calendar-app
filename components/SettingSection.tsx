import type { InvitationDraft } from "@/app/types/type"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import { ChevronDownIcon } from "lucide-react"
import { Calendar } from "./ui/calendar"
import { useState } from "react"
import { ja } from "date-fns/locale"

type SettingSectionProps = {
  settings: InvitationDraft["settings"]
  onChange: (
    key: keyof InvitationDraft["settings"],
    value: boolean | string | undefined
  ) => void
}

const SettingSection = ({ settings, onChange }: SettingSectionProps) => {
  const [open, setOpen] = useState(false)
  const selectedDate = settings.deadline
    ? new Date(settings.deadline)
    : undefined


  return (
    <section className="space-y-3">
      <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-widest ml-1">
        詳細設定
      </label>

      <div className="p-4 rounded-xl bg-card border border-border space-y-4">

        {/* 匿名回答 */}
        <div className="flex items-center justify-between">
          <Label htmlFor="anonymous" className="text-sm font-medium">
            匿名で回答を許可
          </Label>
          <Switch
            id="anonymous"
            checked={settings.anonymousResponse}
            onCheckedChange={(v) => onChange("anonymousResponse", v)}
          />
        </div>

        {/* 参加者非表示 */}
        <div className="flex items-center justify-between">
          <Label htmlFor="hide-participants" className="text-sm font-medium">
            参加者を非表示
          </Label>
          <Switch
            id="hide-participants"
            checked={settings.hideParticipants}
            onCheckedChange={(v) => onChange("hideParticipants", v)}
          />
        </div>

        {/* コメント許可 */}
        <div className="flex items-center justify-between">
          <Label htmlFor="allow-comments" className="text-sm font-medium">
            コメントを許可
          </Label>
          <Switch
            id="allow-comments"
            checked={settings.allowComments}
            onCheckedChange={(v) => onChange("allowComments", v)}
          />
        </div>

        {/* 締切 */}
        <div className="space-y-1">
          <div className="flex gap-3 items-center justify-between">
            <Label htmlFor="date" className="px-1">
              回答締切（任意）
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-48 justify-between font-normal"
                >
                  {settings.deadline
                    ? new Date(settings.deadline).toLocaleDateString("ja-JP")
                    : "選択してください"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  locale={ja}
                  selected={selectedDate}
                  captionLayout="dropdown"
                  onSelect={(date) =>
                    onChange(
                      "deadline",
                      date ? date.toISOString() : undefined
                    )
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SettingSection
