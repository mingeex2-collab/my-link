"use client"

import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"
import { findUidByUsername } from "@/lib/firebase-queries"
import { useProfile } from "@/hooks/useProfile"
import { useLinks } from "@/hooks/useLinks"
import { LinkCard } from "@/components/LinkCard"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Sparkles, Share2, Check } from "lucide-react"

export default function DynamicProfilePage() {
  const params = useParams()
  // App Router params contains strings
  const displayNameParam = Array.isArray(params.displayName) ? params.displayName[0] : params.displayName

  const [uid, setUid] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
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

  if (loading || (!profile && uid)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent flex-shrink-0 animate-spin rounded-full"></div>
      </div>
    )
  }

  // The rest of the UI (read-only version of the ProfilePage)
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center pt-32 pb-24 px-6 bg-background selection:bg-primary/10">
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
          <button 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="group flex items-center gap-3 px-10 py-5 rounded-2xl bg-foreground text-background font-bold text-base shadow-soft hover:-translate-y-1 transition-all cursor-pointer"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-400 font-bold" />
            ) : (
              <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            )}
            {copied ? "클립보드에 복사되었습니다" : "프로필 복사하기"}
          </button>
        </div>
      </div>
    </div>
  )
}
