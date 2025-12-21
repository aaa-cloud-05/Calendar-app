"use client"

import { useState } from "react"

import TagSection from "@/components/TagSection"
import DateCandidateSection from "@/components/DateCandidateSection"
import SettingSection from "@/components/SettingSection"
import { InvitationDraft, Tag } from "@/app/types/type"

const CreateInvitationPage = () => {
  const [draft, setDraft] = useState<InvitationDraft>({
    title: "",
    description: "",
    locationUrl: "",
    tags: [],
    dateCandidates: [],
    settings: {
      anonymousResponse: false,
      hideParticipants: false,
      allowComments: false,
      deadline: undefined,
    },
  })

  /* ===== タグ ===== */

  const addTag = (tag: Tag) => {
    setDraft((prev) => ({
      ...prev,
      tags: prev.tags.some((t) => t.id === tag.id)
        ? prev.tags
        : [...prev.tags, tag],
    }))
  }

  const removeTag = (tagId: string) => {
    setDraft((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t.id !== tagId),
    }))
  }

  /* ===== 設定 ===== */

  const updateSettings = (
    key: keyof InvitationDraft["settings"],
    value: boolean | string | undefined
  ) => {
    setDraft((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: value,
      },
    }))
  }

  /* ===== 表示 ===== */

  return (
    <div className="max-w-xl mx-auto space-y-6 p-4">
      {/* タイトル */}
      <input
        className="w-full text-lg font-bold border-b outline-none"
        placeholder="イベントタイトル"
        value={draft.title}
        onChange={(e) =>
          setDraft((prev) => ({ ...prev, title: e.target.value }))
        }
      />

      <textarea
        className="w-full text-sm border rounded-lg p-3 resize-none"
        placeholder="参加者へのメッセージ（任意）"
        rows={3}
        value={draft.description ?? ""}
        onChange={(e) =>
          setDraft((prev) => ({
            ...prev,
            description: e.target.value,
          }))
        }
      />

      {/* タグ */}
      <TagSection
        tags={draft.tags}
        onAdd={addTag}
        onRemove={removeTag}
      />

      {/* 日程候補 */}
      <DateCandidateSection
        dateCandidates={draft.dateCandidates}
        onChange={(candidates) =>
          setDraft((prev) => ({
            ...prev,
            dateCandidates: candidates,
          }))
        }
      />

      {/* 設定 */}
      <SettingSection
        settings={draft.settings}
        onChange={updateSettings}
      />

      {/* デバッグ */}
      <pre className="text-xs bg-muted p-3 rounded-lg">
        {JSON.stringify(draft, null, 2)}
      </pre>
    </div>
  )
}

export default CreateInvitationPage
