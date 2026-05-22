"use client"

import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"
import { findUidByUsername } from "@/lib/firebase-queries"
import { useProfile } from "@/hooks/useProfile"
import { useLinks } from "@/hooks/useLinks"

import { LinkCard } from "@/components/LinkCard"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Sparkles } from "lucide-react"

export default function DynamicProfilePage() {
  const params = useParams()
  // App Router params contains strings
  const displayNameParam = Array.isArray(params.displayName) ? params.displayName[0] : params.displayName

  const [uid, setUid] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (!displayNameParam) return
    
    // Check if it starts string with @ and remove it if so
    const nameToSearch = displayNameParam.startsWith('%40') || displayNameParam.startsWith('@') 
      ? decodeURIComponent(displayNameParam).replace('@', '') 
      : decodeURIComponent(displayNameParam)

    findUidByUsername(nameToSearch).then((foundUid) => {
      if (foundUid) {
        setUid(foundUid)
      } else {
        setIsError(true)
      }
    }).catch((error) => {
      console.error("Failed to find user:", error)
      setIsError(true)
    }).finally(() => {
      setLoading(false)
    })
  }, [displayNameParam])

  const { data: profile } = useProfile(uid, null)
  const { data: links = [] } = useLinks(uid)


  if (isError) {
    notFound()
  }

  if (loading || !uid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent flex-shrink-0 animate-spin rounded-full"></div>
      </div>
    );
  }

  // The rest of the UI (read-only version of the ProfilePage)
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center pt-32 pb-24 px-6 bg-gradient-to-br from-sky-50 to-amber-100 dark:from-slate-950 dark:to-slate-900 selection:bg-primary/20 overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute -top-48 -left-48 w-[800px] h-[800px] opacity-60 pointer-events-none">
        <div className="absolute inset-0 bg-white/60 dark:bg-purple-500/10 blur-[100px] rounded-full" />
      </div>
      <div className="absolute top-[20%] -right-24 w-[1000px] h-[1000px] opacity-60 pointer-events-none">
        <div className="absolute inset-0 bg-white/70 dark:bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-xl flex flex-col gap-16">
        {/* Profile Info */}
        <div className="flex flex-col items-center text-center gap-8">
          <div className="relative">
            <Avatar className="w-32 h-32 border-2 border-border shadow-soft rounded-3xl overflow-hidden">
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
            <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl text-center">
              {profile ? profile.displayName : "My Link"}
            </h1>
            <span className="text-lg font-bold text-primary tracking-tight opacity-70">
              {profile ? `@${profile.username}` : ""}
            </span>
            <p className="text-lg font-medium text-muted-foreground text-center leading-relaxed">
              {profile?.bio || ""}
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4">
            {links.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                uid={uid!}
                readOnly
/>
            ))}
            {links.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                등록된 링크가 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center gap-10 mt-12 pb-12">
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
