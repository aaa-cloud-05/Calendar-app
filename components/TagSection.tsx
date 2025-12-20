"use client"

import { useState } from "react"
import type { Tag } from "@/app/types/type"
import { X } from "lucide-react"

type TagSectionProps = {
  tags: Tag[]
  onAdd: (tag: Tag) => void
  onRemove: (id: string) => void
}

const RECOMMENDED_TAGS = [
  "途中参加OK",
  "金欠OK",
  "友達もOK",
]

const TagSection = ({ tags, onAdd, onRemove }: TagSectionProps) => {
  const [open, setOpen] = useState(false)
  const [customLabel, setCustomLabel] = useState("")

  const addCustomTag = () => {
    if (!customLabel.trim()) return

    onAdd({
      id: crypto.randomUUID(),
      label: customLabel.trim(),
    })
    setCustomLabel("")
    setOpen(false)
  }

  return (
    <section className="space-y-3">
      <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-widest ml-1">
        参加条件・タグ
      </label>

      <div className="p-4 rounded-xl bg-card border border-border shadow-sm space-y-4">
        {/* タグ一覧 */}
        {tags.length === 0 && (
          <p className="text-xs text-muted-foreground">
            タグはまだ追加されていません
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                bg-orange-50 dark:bg-orange-900/20
                text-orange-600 dark:text-orange-300
                text-xs font-bold border
                border-orange-100 dark:border-orange-800/50"
            >
              {tag.label}
              <button
                onClick={() => onRemove(tag.id)}
                className="hover:bg-orange-200 dark:hover:bg-orange-800 rounded-full p-0.5"
              >
                <X className="size-4"/>
              </button>
            </span>
          ))}
        </div>

        {/* 追加ボタン */}
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center justify-center gap-2
            rounded-lg border border-dashed border-border
            py-2 text-xs font-bold text-muted-foreground
            hover:bg-muted transition"
        >
          <span className="material-symbols-outlined text-[16px]">+</span>
          タグを追加
        </button>
      </div>

      {/* ===== モーダル ===== */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-card w-80 rounded-xl p-4 space-y-4">
            <p className="text-sm font-bold">タグを追加</p>

            {/* おすすめ */}
            <div className="flex flex-wrap gap-2">
              {RECOMMENDED_TAGS.map((label) => (
                <button
                  key={label}
                  onClick={() => {
                    onAdd({
                      id: crypto.randomUUID(),
                      label,
                    })
                    setOpen(false)
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg border hover:bg-muted"
                >
                  {label}
                </button>
              ))}
            </div>

            {/* カスタム */}
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="カスタムタグ"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addCustomTag()
                }
              }}
            />

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setOpen(false)}
                className="text-xs text-muted-foreground"
              >
                キャンセル
              </button>
              <button
                onClick={addCustomTag}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-primary text-white"
              >
                追加
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default TagSection
