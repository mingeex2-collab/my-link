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
import { Plus } from "lucide-react"
import { useAddLink } from "@/hooks/useLinks"

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
  uid: string
}

export function AddLinkDialog({ uid }: AddLinkDialogProps) {
  const [open, setOpen] = useState(false)
  const addLink = useAddLink(uid)

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

  const onSubmit = async (data: LinkFormValues) => {
    try {
      await addLink.mutateAsync(data)
      reset()
      setOpen(false)
    } catch {
      // silent fail
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
            variant="ghost"
            className="w-full h-20 flex items-center gap-4 px-6 rounded-[2rem] border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-background text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-sm">
              <Plus className="w-6 h-6" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-bold text-primary text-sm uppercase tracking-widest">새로운 링크 추가하기</span>
            </div>
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[450px] rounded-[2rem] border border-border shadow-soft overflow-hidden">
        <DialogHeader className="py-2">
          <DialogTitle className="text-3xl font-bold tracking-tight text-foreground">새로운 링크 추가하기</DialogTitle>
          <DialogDescription className="text-sm font-medium text-muted-foreground">
            나만의 고유한 링크를 추가하세요.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 py-6">
          <div className="grid gap-3">
            <label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              링크 제목
            </label>
            <Input
              id="title"
              placeholder="예: 내 개인 블로그"
              {...register("title")}
              aria-invalid={!!errors.title}
              className="rounded-xl border-border focus:ring-1 focus:ring-primary h-14 text-base font-medium"
            />
            {errors.title && (
              <p className="text-xs font-bold text-destructive ml-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="grid gap-3">
            <label htmlFor="url" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              URL 주소
            </label>
            <Input
              id="url"
              placeholder="https://example.com"
              {...register("url")}
              aria-invalid={!!errors.url}
              className="rounded-xl border-border focus:ring-1 focus:ring-primary h-14 text-base font-medium"
            />
            {errors.url && (
              <p className="text-xs font-bold text-destructive ml-1">
                {errors.url.message}
              </p>
            )}
          </div>
          <DialogFooter className="mt-4 pt-4 border-t border-border/40">
            <Button
              type="submit"
              className="w-full h-16 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 shadow-soft"
              disabled={addLink.isPending}
            >
              링크 저장하기
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
