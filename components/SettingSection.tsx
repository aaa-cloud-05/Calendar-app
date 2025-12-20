import type { InvitationDraft } from "@/app/types/type"
import ToggleRow from "./ToggleRow"

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
        <ToggleRow
          label="匿名で回答を許可"
          checked={settings.anonymousResponse}
          onToggle={(v) => onChange("anonymousResponse", v)}
        />

        {/* 参加者非表示 */}
        <ToggleRow
          label="参加者を非表示"
          checked={settings.hideParticipants}
          onToggle={(v) => onChange("hideParticipants", v)}
        />

        {/* コメント許可 */}
        <ToggleRow
          label="コメントを許可"
          checked={settings.allowComments}
          onToggle={(v) => onChange("allowComments", v)}
        />

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
