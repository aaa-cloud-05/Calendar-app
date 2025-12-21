import type { InvitationDraft } from "@/app/types/type"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"

type SettingSectionProps = {
  settings: InvitationDraft["settings"]
  onChange: (
    key: keyof InvitationDraft["settings"],
    value: boolean | string | undefined
  ) => void
}

const SettingSection = ({ settings, onChange }: SettingSectionProps) => {
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
          <p className="text-xs font-bold text-muted-foreground">
            回答締切（任意）
          </p>
          <input
            type="datetime-local"
            value={settings.deadline ?? ""}
            onChange={(e) =>
              onChange("deadline", e.target.value || undefined)
            }
            className="w-full border border-border rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>
    </section>
  )
}

export default SettingSection
