"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Edit2, Trash2 } from "lucide-react"
import { useUpdateLink, useDeleteLink } from "@/hooks/useLinks";
import type { LinkItem } from "@/data/links"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  FaGithub,
  FaInstagram,
  FaYoutube,
  FaBlog,
  FaBriefcase,
  FaGlobe,
  FaGoogle,
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  FaDiscord,
  FaTiktok,
  FaTwitch
} from "react-icons/fa"
import { incrementClickCount } from "@/lib/firebase-queries";
import { FaEye } from "react-icons/fa"
import { useQueryClient } from "@tanstack/react-query";

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

const getIcon = (title: string, url?: string) => {
  const t = title.toLowerCase();
  const u = url?.toLowerCase() || "";

  // URL 기반 감지 (가장 정확함)
  if (u.includes("github.com")) return <FaGithub className="w-6 h-6 text-[#181717] dark:text-white" />;
  if (u.includes("instagram.com")) return <FaInstagram className="w-6 h-6 text-[#E4405F]" />;
  if (u.includes("youtube.com") || u.includes("youtu.be")) return <FaYoutube className="w-6 h-6 text-[#FF0000]" />;
  if (u.includes("google.com")) return <FaGoogle className="w-5 h-5 text-[#4285F4]" />;
  if (u.includes("facebook.com")) return <FaFacebook className="w-6 h-6 text-[#1877F2]" />;
  if (u.includes("linkedin.com")) return <FaLinkedin className="w-6 h-6 text-[#0A66C2]" />;
  if (u.includes("twitter.com") || u.includes("x.com")) return <FaTwitter className="w-5 h-5 text-[#1DA1F2] dark:text-white" />;
  if (u.includes("discord.com") || u.includes("discord.gg")) return <FaDiscord className="w-5 h-5 text-[#5865F2]" />;
  if (u.includes("tiktok.com")) return <FaTiktok className="w-5 h-5 text-[#000000] dark:text-white" />;
  if (u.includes("twitch.tv")) return <FaTwitch className="w-5 h-5 text-[#9146FF]" />;
  if (u.includes("blog.naver.com") || u.includes("tistory.com")) return <FaBlog className="w-5 h-5 text-[#00ABA9]" />;

  // 제목 기반 감지 (URL에서 못 찾았을 경우)
  if (t.includes("github")) return <FaGithub className="w-6 h-6 text-[#181717] dark:text-white" />;
  if (t.includes("인스타그램") || t.includes("instagram")) return <FaInstagram className="w-6 h-6 text-[#E4405F]" />;
  if (t.includes("유튜브") || t.includes("youtube")) return <FaYoutube className="w-6 h-6 text-[#FF0000]" />;
  if (t.includes("구글") || t.includes("google")) return <FaGoogle className="w-5 h-5 text-[#4285F4]" />;
  if (t.includes("페이스북") || t.includes("facebook")) return <FaFacebook className="w-6 h-6 text-[#1877F2]" />;
  if (t.includes("링크드인") || t.includes("linkedin")) return <FaLinkedin className="w-6 h-6 text-[#0A66C2]" />;
  if (t.includes("트위터") || t.includes("twitter") || t === "x") return <FaTwitter className="w-5 h-5 text-[#1DA1F2] dark:text-white" />;
  if (t.includes("디스코드") || t.includes("discord")) return <FaDiscord className="w-5 h-5 text-[#5865F2]" />;
  if (t.includes("블로그") || t.includes("blog")) return <FaBlog className="w-5 h-5 text-[#00ABA9]" />;
  if (t.includes("포트폴리오") || t.includes("portfolio")) return <FaBriefcase className="w-5 h-5 text-[#F25022]" />;

  return <FaGlobe className="w-5 h-5 text-slate-400 dark:text-slate-300" />;
};

interface LinkCardProps {
  link: LinkItem;
  uid: string;
  readOnly?: boolean;
  showClickCount?: boolean;
}

export function LinkCard({ link, uid, readOnly = false }: LinkCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const updateLink = useUpdateLink(uid)
  const deleteLink = useDeleteLink(uid)

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
    try {
      await updateLink.mutateAsync({ id: link.id, data })
      setIsEditing(false)
    } catch {
      // silent fail
    }
  }

  const handleCancelEdit = () => {
    reset()
    setIsEditing(false)
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteLink.mutateAsync(link.id)
      setIsDeleteDialogOpen(false)
    } catch {
      // silent fail
    }
  }

  if (isEditing) {
    return (
      <Card className="p-6 relative overflow-hidden bg-card border border-border rounded-2xl shadow-soft">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="grid gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              링크 제목
            </label>
            <Input
              placeholder="예: 내 개인 블로그"
              {...register("title")}
              aria-invalid={!!errors.title}
              className="rounded-xl border-border focus:ring-1 focus:ring-primary h-12 text-base font-medium"
            />
            {errors.title && (
              <p className="text-xs font-bold text-destructive ml-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              URL 주소
            </label>
            <Input
              placeholder="https://example.com"
              {...register("url")}
              aria-invalid={!!errors.url}
              className="rounded-xl border-border focus:ring-1 focus:ring-primary h-12 text-base font-medium"
            />
            {errors.url && (
              <p className="text-xs font-bold text-destructive ml-1">
                {errors.url.message}
              </p>
            )}
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancelEdit}
              className="rounded-xl font-bold px-6"
            >
              취소
            </Button>
            <Button
              type="submit"
              className="rounded-xl font-bold px-8 flex items-center"
              disabled={updateLink.isPending}
            >
              저장하기
            </Button>
          </div>
        </form>
      </Card>
    )
  }

  return (
    <>
      <div className="group block relative">
        <Card className="relative overflow-hidden bg-card border border-border/60 transition-all duration-300 hover:border-primary/30 hover:shadow-soft rounded-2xl">
          <div className="p-5 flex items-center justify-between w-full">
            <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-5 flex-1 w-full"
            onClick={async (e) => {
                e.preventDefault();
                try {
                  if (uid && readOnly) {
                    await incrementClickCount(uid, link.id);
                    // Manually update cache for immediate UI refresh
                    queryClient.setQueryData(["links", uid], (old: LinkItem[] | undefined) => {
                      if (!old) return old;
                      return old.map((item: LinkItem) =>
                        item.id === link.id
                          ? { ...item, clickCount: (item.clickCount ?? 0) + 1 }
                          : item
                      );
                    });
                  }
                } catch (err) {
                  console.error('Click count increment failed:', err);
                } finally {
                  window.open(link.url, "_blank");
                }
              }}
            >
              <div className="w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center bg-muted text-foreground border border-border/40 group-hover:scale-105 transition-transform duration-500">
                {getIcon(link.title, link.url)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-xl tracking-tight text-foreground truncate transition-colors duration-300 group-hover:text-primary">
                  {link.title}
                </span>
                {!readOnly && (
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <FaEye className="w-4 h-4 mr-1" />
                    {link.clickCount ?? 0}
                  </div>
                )}
              </div>
            </a>

            <div className="flex items-center gap-2 ml-4 relative z-10 shrink-0">
              {!readOnly && (
                <>
                  <button
                      onClick={(e) => { e.preventDefault(); setIsEditing(true); }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300"
                      title="수정"
                    >
                      <Edit2 className="w-4.5 h-4.5" />
                    </button>
                  <button
                    onClick={(e) => { e.preventDefault(); setIsDeleteDialogOpen(true); }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all duration-300"
                    title="삭제"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </>
              )}
              
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>정말 삭제 하시겠습니까?</DialogTitle>
            <DialogDescription className="mt-2 text-slate-500 dark:text-slate-400">
              <span className="font-bold text-slate-800 dark:text-slate-200">&quot;{link.title}&quot;</span> 링크를 삭제합니다.
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
              disabled={deleteLink.isPending}
              className="rounded-xl font-bold flex-1 sm:flex-none flex items-center justify-center gap-2"
            >
              삭제하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
