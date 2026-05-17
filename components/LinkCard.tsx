"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ExternalLink, Edit2, Trash2, Loader2 } from "lucide-react"
import type { LinkItem } from "@/data/links"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FaGithub, FaInstagram, FaYoutube, FaBlog, FaBriefcase, FaGlobe } from "react-icons/fa"

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

const getIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("github")) return <FaGithub className="w-6 h-6 text-[#181717] dark:text-white" />;
  if (t.includes("인스타그램") || t.includes("instagram")) return <FaInstagram className="w-6 h-6 text-[#E4405F]" />;
  if (t.includes("유튜브") || t.includes("youtube")) return <FaYoutube className="w-6 h-6 text-[#FF0000]" />;
  if (t.includes("블로그") || t.includes("blog")) return <FaBlog className="w-5 h-5 text-[#00ABA9]" />;
  if (t.includes("포트폴리오") || t.includes("portfolio")) return <FaBriefcase className="w-5 h-5 text-[#F25022]" />;
  return <FaGlobe className="w-5 h-5 text-slate-400 dark:text-slate-300" />;
};

interface LinkCardProps {
  link: LinkItem;
  onUpdate: (id: string, data: { title: string; url: string }) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
}

export function LinkCard({ link, onUpdate, onDelete }: LinkCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: link.title,
      url: link.url,
    },
  })

  const onSubmit = async (data: LinkFormValues) => {
    setIsSaving(true)
    try {
      await onUpdate(link.id, data)
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    reset()
    setIsEditing(false)
  }

  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      await onDelete(link.id)
      setIsDeleteDialogOpen(false)
    } finally {
      setIsDeleting(false)
    }
  }

  if (isEditing) {
    return (
      <Card className="p-5 relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem]">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
              링크 제목
            </label>
            <Input
              placeholder="예: 내 개인 블로그"
              {...register("title")}
              aria-invalid={!!errors.title}
              className="rounded-2xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary transition-all h-10"
            />
            {errors.title && (
              <p className="text-xs font-medium text-destructive ml-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
              URL 주소
            </label>
            <Input
              placeholder="https://example.com"
              {...register("url")}
              aria-invalid={!!errors.url}
              className="rounded-2xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary transition-all h-10"
            />
            {errors.url && (
              <p className="text-xs font-medium text-destructive ml-1">
                {errors.url.message}
              </p>
            )}
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelEdit}
              className="rounded-xl font-bold"
            >
              취소
            </Button>
            <Button
              type="submit"
              className="rounded-xl font-bold flex items-center"
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              저장
            </Button>
          </div>
        </form>
      </Card>
    )
  }

  return (
    <>
      <div className="group block relative">
        <Card className="relative overflow-hidden bg-white dark:bg-slate-900 border-none transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1 rounded-[2.5rem]">
          <div className="p-5 flex items-center justify-between w-full">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-5 flex-1 w-full"
            >
              <div className="w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-300 shadow-inner group-hover:scale-110 transition-transform duration-300 border border-slate-100 dark:border-slate-700">
                {getIcon(link.title)}
              </div>
              
              <span className="font-bold text-lg truncate text-slate-700 dark:text-slate-200 transition-colors duration-300 group-hover:text-slate-900 dark:group-hover:text-white">
                {link.title}
              </span>
            </a>

            <div className="flex items-center gap-2 ml-4 relative z-10 shrink-0">
              <button
                onClick={(e) => { e.preventDefault(); setIsEditing(true); }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300"
                title="수정"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => { e.preventDefault(); setIsDeleteDialogOpen(true); }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-300"
                title="삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 ml-1"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>정말 삭제 하시겠습니까?</DialogTitle>
            <DialogDescription className="mt-2 text-slate-500 dark:text-slate-400">
              <span className="font-bold text-slate-800 dark:text-slate-200">"{link.title}"</span> 링크를 삭제합니다.
              <br />
              <span className="text-red-500 mt-2 block font-medium">이 작업은 되돌릴 수 없습니다.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex gap-3 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="rounded-xl font-bold flex-1 sm:flex-none"
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="rounded-xl font-bold flex-1 sm:flex-none flex items-center justify-center gap-2"
            >
              {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
              삭제하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
