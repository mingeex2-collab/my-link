"use client"

import { dummyLinks } from "@/data/links"
import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore"
import { AddLinkDialog } from "@/components/AddLinkDialog"
import { LinkCard } from "@/components/LinkCard"
import { cn } from "@/lib/utils"
import {
  Share2,
  Sparkles,
  ArrowRight,
  Edit3,
  Check,
  X,
  Zap,
  Layout,
  Smartphone,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLinks } from "@/hooks/useLinks"
import { useProfile, useSaveProfile } from "@/hooks/useProfile"
import { useEffect, useRef, useState } from "react"

type EditableField = "username" | "bio"

export default function ProfilePage() {
  const { user, loading: authLoading, loginWithGoogle } = useAuth()

  // ────────────────────────────────────────────
  // TanStack Query 훅
  // ────────────────────────────────────────────
  const { data: links = [] } = useLinks(user?.uid ?? null)
  const { data: profile } = useProfile(user?.uid ?? null, user ?? null)
  const saveProfileMutation = useSaveProfile(user?.uid ?? null)

  // ────────────────────────────────────────────
  // 초기 더미 데이터 마이그레이션 (최초 1회)
  // ────────────────────────────────────────────
  const migrated = useRef(false)
  useEffect(() => {
    if (!user || migrated.current) return
    migrated.current = true;
    (async () => {
      const linksRef = collection(db, `users/${user.uid}/links`)
      const q = query(linksRef, orderBy("createdAt", "desc"))
      const snapshot = await getDocs(q)
      if (snapshot.empty) {
        for (const item of dummyLinks) {
          const { id: _id, ...dataToSave } = item
          await addDoc(linksRef, { ...dataToSave, createdAt: new Date().toISOString() })
        }
      }
    })()
  }, [user])

  // ────────────────────────────────────────────
  // 인라인 편집 상태
  // ────────────────────────────────────────────
  const [editingField, setEditingField] = useState<EditableField | null>(null)
  const [editValue, setEditValue] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "available" | "taken">("idle")

  const handleStartEdit = (field: EditableField, currentVal: string) => {
    setEditingField(field)
    setEditValue(currentVal)
    if (field === "username") setUsernameStatus("available")
    else setUsernameStatus("idle")
  }

  const handleCancelEdit = () => {
    setEditingField(null)
    setEditValue("")
    setUsernameStatus("idle")
  }

  const handleUsernameCheck = async (val: string) => {
    if (!val || val.length < 3) { setUsernameStatus("idle"); return }
    if (profile && val === profile.username) { setUsernameStatus("available"); return }
    setIsCheckingUsername(true)
    try {
      const docSnap = await getDoc(doc(db, "usernames", val.toLowerCase()))
      setUsernameStatus(docSnap.exists() ? "taken" : "available")
    } catch {
      /* ignore */
    } finally {
      setIsCheckingUsername(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!user || !profile || !editingField) return
    if (editingField === "username" && usernameStatus !== "available" && editValue !== profile.username) return
    if (!editValue.trim() && editingField !== "bio") return

    try {
      await saveProfileMutation.mutateAsync({
        uid: user.uid,
        field: editingField,
        value: editValue,
        currentProfile: profile,
      })
      setEditingField(null)
    } catch {
      // 낙관적 업데이트가 자동으로 롤백함
    }
  }

  if (authLoading) return null

  if (!user) {
    return (
      <div className="relative min-h-screen w-full flex flex-col items-center bg-background selection:bg-primary/10 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/40 to-transparent blur-3xl rounded-full mix-blend-screen" />
        </div>

        <div className="relative z-10 w-full max-w-5xl flex flex-col items-center px-6 pt-32 pb-24 gap-32">
          
          {/* Hero Section */}
          <div className="w-full flex flex-col items-center text-center gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-bold tracking-widest uppercase mb-4 shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>새로운 멀티 링크의 시작</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
              단 하나의 링크로<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                모든 것을 연결하세요
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mt-2">
              가장 간결하고 아름다운 멀티 링크 서비스. 복잡한 과정 없이 단 몇 초만에 당신만의 멋진 프로필을 완성하고 공유해보세요.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto">
              <Button
                onClick={loginWithGoogle}
                size="lg"
                className="w-full sm:w-auto h-16 px-10 gap-3 font-bold text-lg bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98] transition-all rounded-2xl shadow-soft"
              >
                Google로 시작하기
                <ArrowRight className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Features Section */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-6 p-10 bg-card rounded-[2.5rem] border border-border shadow-soft hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">초고속 생성</h3>
                <p className="text-muted-foreground leading-relaxed">
                  클릭 몇 번이면 준비 끝! 불필요한 설정 없이 즉시 나만의 페이지를 만들 수 있습니다.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-6 p-10 bg-card rounded-[2.5rem] border border-border shadow-soft hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                <Layout className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">직관적인 관리</h3>
                <p className="text-muted-foreground leading-relaxed">
                  드래그 앤 드롭으로 링크 순서를 변경하고 한 눈에 프로필 정보를 관리하세요.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6 p-10 bg-card rounded-[2.5rem] border border-border shadow-soft hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                <Smartphone className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">반응형 디자인</h3>
                <p className="text-muted-foreground leading-relaxed">
                  스마트폰, 태블릿, PC 어디서든 완벽하게 보이는 아름다운 프로필을 제공합니다.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Area for Landing */}
          <div className="flex flex-col items-center gap-6 mt-10">
            <div className="flex items-center gap-2 py-4 px-6 rounded-full border border-border/40 bg-muted/30">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60">
                © 2026 My Link • Built with Passion
              </p>
            </div>
          </div>
          
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center pt-32 pb-24 px-6 bg-background selection:bg-primary/10">

      {/* 중앙 정렬되는 래퍼 요소 */}
      <div className="relative z-10 w-full max-w-xl flex flex-col gap-16">

        {/* 프로필 이미지 및 사용자 정보 */}
        <div className="flex flex-col items-center text-center gap-8">
          <div className="relative">
            <Avatar className="w-32 h-32 border-2 border-border shadow-soft rounded-3xl overflow-hidden transition-all duration-500 hover:rounded-2xl">
              {profile?.photoURL ? (
                <AvatarImage src={profile.photoURL} alt={profile.displayName} />
              ) : (
                <AvatarFallback className="bg-muted font-bold text-5xl text-muted-foreground uppercase">
                  {profile?.displayName ? profile.displayName[0] : "M"}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-background border-2 border-border rounded-2xl flex items-center justify-center shadow-soft">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full max-w-md mx-auto items-center">
            {/* Display Name */}
            <div className="group relative w-full flex flex-col items-center">
              <div className="group relative w-full flex flex-col items-center">
              <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl text-center">
                {profile ? profile.displayName : "My Link"}
              </h1>
            </div>
            </div>

            {/* Username / Handle */}
            <div className="group relative w-full flex flex-col items-center">
              {editingField === "username" ? (
                <div className="flex flex-col items-center gap-2 w-full animate-in fade-in zoom-in-95 duration-200">
                  <div className="relative w-full max-w-[240px]">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold text-lg">@</span>
                    <Input
                      value={editValue}
                      onChange={(e) => {
                        setEditValue(e.target.value)
                        handleUsernameCheck(e.target.value)
                      }}
                      className="text-lg font-bold text-center h-12 w-full pl-10 pr-10 rounded-xl border-primary shadow-soft bg-background"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveProfile()
                        if (e.key === "Escape") handleCancelEdit()
                      }}
                      onBlur={() => !saveProfileMutation.isPending && handleCancelEdit()}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {isCheckingUsername ? <Check className="w-4 h-4 text-muted-foreground animate-pulse" /> :
                       usernameStatus === "available" ? <Check className="w-4 h-4 text-green-500" /> :
                       usernameStatus === "taken" ? <X className="w-4 h-4 text-destructive" /> : null}
                    </div>
                  </div>
                  {usernameStatus === "taken" && <span className="text-[11px] font-bold text-destructive uppercase tracking-widest">이미 선점된 닉네임입니다</span>}
                </div>
              ) : (
                <div
                  onClick={() => user && handleStartEdit("username", profile?.username || "")}
                  className={cn(
                    "relative flex items-center gap-2 cursor-pointer transition-all duration-300 rounded-xl px-4 py-1 hover:bg-primary/5 hover:scale-105",
                    !user && "cursor-default"
                  )}
                >
                  <span className="text-lg font-bold text-primary tracking-tight opacity-70">
                    {profile ? `@${profile.username}` : ""}
                  </span>
                  {user && (
                    <Edit3 className="w-4 h-4 opacity-0 group-hover:opacity-40 transition-opacity absolute -right-6" />
                  )}
                </div>
              )}
            </div>

            {/* Bio */}
            <div className="group relative w-full flex flex-col items-center">
              {editingField === "bio" ? (
                <div className="flex items-center gap-2 w-full justify-center animate-in fade-in zoom-in-95 duration-200">
                  <div className="relative w-full max-w-sm">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="text-base font-medium text-center h-14 w-full rounded-xl border-primary shadow-soft bg-background"
                      placeholder="소개글을 입력하세요"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveProfile()
                        if (e.key === "Escape") handleCancelEdit()
                      }}
                      onBlur={() => !saveProfileMutation.isPending && handleCancelEdit()}
                    />

                  </div>
                </div>
              ) : (
                <div
                  onClick={() => user && handleStartEdit("bio", profile?.bio || "")}
                  className={cn(
                    "relative flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 rounded-2xl px-6 py-2 hover:bg-muted/30 max-w-md",
                    !user && "cursor-default"
                  )}
                >
                  <p className="text-lg font-medium text-muted-foreground text-center leading-relaxed">
                    {profile ? profile.bio : "가장 간결하고 아름다운 멀티 링크 서비스."}
                  </p>
                  {user && (
                    <Edit3 className="w-4 h-4 opacity-0 group-hover:opacity-40 transition-opacity absolute -right-4 top-1/2 -translate-y-1/2" />
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-6 mt-6">
              <div className="flex justify-center gap-3">
                {user ? (
                  <>
                    <span className="px-4 py-1.5 rounded-xl bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase border border-primary/20">
                      Member
                    </span>
                    <span className="px-4 py-1.5 rounded-xl bg-muted text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                      Space
                    </span>
                  </>
                ) : (
                  <span className="px-4 py-1.5 rounded-xl bg-muted text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                    New Generation
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 로그인 시 보여줄 링크 목록 */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center px-2 mb-2">
            <AddLinkDialog uid={user.uid} />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {links.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                uid={user.uid}
              />
            ))}
          </div>
        </div>

        {/* 푸터 영역 */}
        <div className="flex flex-col items-center gap-10 mt-12 pb-12">
          <button className="group flex items-center gap-3 px-10 py-5 rounded-2xl bg-foreground text-background font-bold text-base shadow-soft hover:-translate-y-1 transition-all cursor-pointer">
            <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            내 프로필 공유하기
          </button>

          <div className="flex items-center gap-2 py-4 px-6 rounded-full border border-border/40 bg-muted/30">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40">
              © 2026 My Link • Built with Passion
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
