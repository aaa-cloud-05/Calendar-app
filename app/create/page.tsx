"use client"

import { useState } from "react"
import { ArrowLeft, Clock, DollarSign, MapPin, MessageSquare, UserRound } from "lucide-react"

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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Spinner } from "@/components/ui/spinner"

const CreateInvitationPage = () => {
  const router = useRouter()
  const [showOptionalFields, setShowOptionalFields] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [createError, setCreateError] = useState("")
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
    if (isCreating || isNavigating) return

    setIsCreating(true)
    setCreateError("")

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

    try {
      const res = await fetch("/api/invitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      
      if (!res.ok) {
        setCreateError("作成に失敗しました。時間をおいて再度お試しください。")
        return
      }

      const data = await res.json()

      if (!data.inviteToken) {
        setCreateError("作成に失敗しました。時間をおいて再度お試しください。")
        return
      }

      setIsNavigating(true)
      router.push(`/invitation/${data.inviteToken}?share=1`)
    } catch {
      setCreateError("作成に失敗しました。時間をおいて再度お試しください。")
    } finally {
      setIsCreating(false)
    }
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
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-xl mx-auto flex items-center justify-between px-5 py-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 hover:bg-transparent"
            onClick={() => router.back()}
            aria-label="戻る"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <h1 className="text-base font-medium">イベント作成</h1>
          <div className="size-5" />
        </div>
      </div>

      <div className="max-w-xl mx-auto px-5 py-6 space-y-6">
        <div className="space-y-5">
          <p className="text-xs text-red-500">* 必須項目</p>

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm text-gray-700">
              イベントタイトル <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              className="h-11 border-gray-300 bg-white"
              placeholder="例: 週末ランチ会"
              value={draft.title}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          <DateCandidateSection
            dateCandidates={draft.dateCandidates}
            onChange={(candidates) =>
              setDraft((prev) => ({
                ...prev,
                dateCandidates: candidates,
              }))
            }
          />
        </div>

        <Accordion
          type="single"
          collapsible
          value={showOptionalFields ? "optional" : ""}
          onValueChange={(value) => setShowOptionalFields(value === "optional")}
          className="rounded-lg border border-gray-200 bg-white px-4"
        >
          <AccordionItem value="optional" className="border-b-0">
            <AccordionTrigger className="py-4 hover:no-underline">
              <span className="text-sm text-gray-800">任意項目を追加</span>
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <div className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="space-y-2">
              <label htmlFor="creatorName" className="text-sm text-gray-700 flex items-center gap-2">
                <UserRound className="size-4" />
                作成者名
              </label>
              <Input
                id="creatorName"
                className="h-11 border-gray-300 bg-white"
                placeholder="あなたの名前（任意）"
                value={draft.creatorName}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, creatorName: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-sm text-gray-700 flex items-center gap-2">
                <MapPin className="size-4" />
                場所
              </label>
              <Input
                id="location"
                className="h-11 border-gray-300 bg-white"
                placeholder="例: 渋谷駅周辺"
                value={draft.location}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, location: e.target.value }))
                }
              />
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-700 flex items-center gap-2">
                <Clock className="size-4" />
                時間
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">開始</p>
                  <Input
                    className="h-11 border-gray-300 bg-white"
                    type="time"
                    value={draft.startTime ?? ""}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        startTime: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">終了</p>
                  <Input
                    className="h-11 border-gray-300 bg-white"
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
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="budget" className="text-sm text-gray-700 flex items-center gap-2">
                <DollarSign className="size-4" />
                予算（1人あたり）
              </label>
              <Input
                id="budget"
                className="h-11 border-gray-300 bg-white"
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="例: 3000"
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
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm text-gray-700 flex items-center gap-2">
                <MessageSquare className="size-4" />
                参加者へのメッセージ
              </label>
              <Textarea
                id="description"
                className="min-h-24 border-gray-300 bg-white resize-none"
                placeholder="任意メッセージを入力"
                value={draft.description ?? ""}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            <TagSection
              tags={draft.tags}
              onAdd={addTag}
              onRemove={removeTag}
            />

            <SettingSection
              settings={draft.settings}
              onChange={updateSettings}
            />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 pb-6 pt-4">
        <div className="max-w-xl mx-auto">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="w-full h-12 rounded-full bg-red-500 hover:bg-red-600 text-white disabled:bg-gray-300 disabled:text-gray-500"
                disabled={!draft.title || draft.dateCandidates.length === 0 || isCreating}
              >
                {isCreating ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner className="size-4" />
                    作成中...
                  </span>
                ) : (
                  "作成内容を確認"
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>招待カードのプレビュー</DialogTitle>
                <DialogDescription>
                  この内容で招待カードを作成しますか？
                </DialogDescription>
              </DialogHeader>
              <Card className="overflow-hidden rounded-3xl p-5 shadow-lg" />
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={createInvitation}
                  disabled={isCreating || isNavigating}
                >
                  {isCreating ? (
                    <span className="inline-flex items-center gap-2">
                      <Spinner className="size-4" />
                      作成中...
                    </span>
                  ) : (
                    "作成する"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {createError && (
            <p className="text-xs text-center text-red-500 mt-3">{createError}</p>
          )}
          <p className="text-xs text-center text-gray-500 mt-3">
            {!draft.title || draft.dateCandidates.length === 0
              ? "必須項目を入力してください"
              : "作成準備ができました"}
          </p>
        </div>
      </div>

      {isNavigating && (
        <div className="fixed inset-0 z-60 bg-white/90 backdrop-blur-sm">
          <div className="h-full w-full flex flex-col items-center justify-center gap-3 text-gray-700">
            <Spinner className="size-6" />
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateInvitationPage