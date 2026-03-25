"use client"

import { useState } from "react"

import TagSection from "@/components/TagSection"
import DateCandidateSection from "@/components/DateCandidateSection"
import SettingSection from "@/components/SettingSection"
import { InvitationDraft, Tag } from "@/app/types/type"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "lucide-react"

const CreateInvitationPage = () => {
  const router = useRouter()
  const [draft, setDraft] = useState<InvitationDraft>({
    creatorName: "",
    title: "",
    description: "",
    location: "",
    budget: undefined,
    startTime: "",
    endTime: "",
    tags: [],
    dateCandidates: [],
    settings: {
      anonymousResponse: false,
      allowComments: false,
      deadline: undefined,
    },
  })

  const createInvitation = async () => {
    const sortedDateCandidates = [...draft.dateCandidates].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    )

    const payload = {
      ...draft,
      dateCandidates: sortedDateCandidates.map(dc => ({
        ...dc,
        date: dc.date.toISOString(),
      })),
    }

    const res = await fetch("/api/invitation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
    
    if (!res.ok) return

    const data = await res.json()

    if (!data.inviteToken) return

    router.push(`/invitation/${data.inviteToken}?share=1`)
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
      <Input
        className="w-full outline-none"
        placeholder="作成者名 (必須)"
        value={draft.creatorName}
        onChange={(e) =>
          setDraft((prev) => ({ ...prev, creatorName: e.target.value }))
        }
      />

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

      <Input
        className="w-full outline-none"
        type="number"
        inputMode="numeric"
        min={0}
        placeholder="予算"
        value={draft.budget ?? ""}
        onChange={(e) =>
          setDraft((prev) => ({
            ...prev,
            budget:
              e.target.value === ""
                ? undefined
                : Number(e.target.value),
          }))
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          className="w-full outline-none"
          type="time"
          value={draft.startTime ?? ""}
          onChange={(e) =>
            setDraft((prev) => ({
              ...prev,
              startTime: e.target.value,
            }))
          }
        />

        <Input
          className="w-full outline-none"
          type="time"
          value={draft.endTime ?? ""}
          onChange={(e) =>
            setDraft((prev) => ({
              ...prev,
              endTime: e.target.value,
            }))
          }
        />
      </div>

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
          <Card className="overflow-hidden rounded-3x p-5 shadow-lg">

          </Card>
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
      {/* <pre className="text-xs bg-muted p-3 rounded-lg">
        {JSON.stringify(draft, null, 2)}
      </pre> */}
    </div>
  )
}

export default CreateInvitationPage
