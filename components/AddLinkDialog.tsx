"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Loader2 } from "lucide-react"

// Zod 스키마 정의
const linkSchema = z.object({
  title: z
    .string()
    .min(1, "제목을 입력해 주세요")
    .max(50, "제목은 50자 이내로 입력해 주세요"),
  url: z
    .string()
    .url("올바른 URL 형식이 아닙니다")
    .refine((val) => val.startsWith("https://"), {
      message: "https:// 로 시작하는 보안 링크만 등록 가능합니다",
    }),
})

type LinkFormValues = z.infer<typeof linkSchema>

interface AddLinkDialogProps {
  onAdd: (link: { title: string; url: string }) => Promise<void> | void
}

export function AddLinkDialog({ onAdd }: AddLinkDialogProps) {
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  })

  const [isSaving, setIsSaving] = useState(false)

  const onSubmit = async (data: LinkFormValues) => {
    setIsSaving(true)
    try {
      await onAdd(data)
      reset()
      setOpen(false)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog 
      open={open} 
      onOpenChange={(val) => {
        setOpen(val)
        if (!val) reset()
      }}
    >
      <DialogTrigger
        render={
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2 py-6 rounded-[2rem] border-dashed border-2 bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 transition-all duration-300 group"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
              <Plus className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-500 dark:text-slate-400">새로운 링크 추가하기</span>
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl overflow-hidden mt-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">링크 추가</DialogTitle>
          <DialogDescription>
            프로필에 표시될 새로운 링크의 제목과 URL을 입력해 주세요.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
              링크 제목
            </label>
            <Input
              id="title"
              placeholder="예: 내 개인 블로그"
              {...register("title")}
              aria-invalid={!!errors.title}
              className="rounded-2xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary transition-all h-12"
            />
            {errors.title && (
              <p className="text-xs font-medium text-destructive ml-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <label htmlFor="url" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
              URL 주소
            </label>
            <Input
              id="url"
              placeholder="https://example.com"
              {...register("url")}
              aria-invalid={!!errors.url}
              className="rounded-2xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary transition-all h-12"
            />
            {errors.url && (
              <p className="text-xs font-medium text-destructive ml-1">
                {errors.url.message}
              </p>
            )}
          </div>
          <DialogFooter className="mt-4">
            <Button 
              type="submit" 
              className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              링크 저장하기
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
