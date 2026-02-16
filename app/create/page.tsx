"use client"

import { useState } from "react"

import TagSection from "@/components/TagSection"
import DateCandidateSection from "@/components/DateCandidateSection"
import SettingSection from "@/components/SettingSection"
import { InvitationDraft, Participant, Tag } from "@/app/types/type"
import InvitationHeroCard from "@/components/HeroCard"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const CreateInvitationPage = () => {
  const [draft, setDraft] = useState<InvitationDraft>({
    title: "",
    description: "",
    location: "",
    startTime: "",
    endTime: "",
    tags: [],
    dateCandidates: [],
    settings: {
      anonymousResponse: false,
      hideParticipants: false,
      allowComments: false,
      deadline: undefined,
    },
  })

  const participants: Participant[] = [
    {
      id: "f",
      name: "j",
      role: "member"
    },
    {
      id: "p_2",
      name: "ユウタ",
      avatar: "/avatar-1.png",
      role: "organizer",
    },
  ]

  const createInvitation = async () => {
    const payload = {
      ...draft,
      dateCandidates: draft.dateCandidates.map(dc => ({
        ...dc,
        date: dc.date.toISOString(),
      })),
    }

    await fetch("/api/invitation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
  }

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
      <Input
        className="w-full outline-none"
        placeholder="イベントタイトル (必須)"
        value={draft.title}
        onChange={(e) =>
          setDraft((prev) => ({ ...prev, title: e.target.value }))
        }
      />

      <Input
        className="w-full outline-none"
        placeholder="場所"
        value={draft.location}
        onChange={(e) =>
          setDraft((prev) => ({ ...prev, location: e.target.value }))
        }
      />

      <Textarea
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


      {/* プレビュー */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="w-full rounded-xl"
          >
            プレビュー
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>招待カードのプレビュー</DialogTitle>
            <DialogDescription>
              この内容で招待カードを作成しますか？
            </DialogDescription>
          </DialogHeader>
          <InvitationHeroCard
            draft={draft}
            participants={participants}
            heroImageUrl={undefined}
            onMessageClick={() => console.log("message")}
          />
          <DialogFooter>
            <Button
              type="submit"
              onClick={createInvitation}
            >
              作成する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* デバッグ */}
      <pre className="text-xs bg-muted p-3 rounded-lg">
        {JSON.stringify(draft, null, 2)}
      </pre>
    </div>
  )
}

export default CreateInvitationPage
