"use client"

import { useState, useEffect } from "react"
import { dummyLinks, type LinkItem } from "@/data/links"
import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { useToast } from "@/lib/toast-context"
import { AddLinkDialog } from "@/components/AddLinkDialog"
import { LinkCard } from "@/components/LinkCard"
import { 
  Share2,
  Sparkles,
  Heart,
  Lock,
  ArrowRight,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  const { user, loading: authLoading, loginWithGoogle } = useAuth()
  const { showToast } = useToast()
  const [links, setLinks] = useState<LinkItem[]>([])
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    if (!user) {
      setLinks([])
      return
    }

    const linksRef = collection(db, `users/${user.uid}/links`);
    const q = query(linksRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LinkItem[];
      
      setLinks(fetchedData);

      // Firestore가 완전히 비어있고, 앱이 처음 로드되는 상황에서만 마이그레이션 수행
      if (snapshot.empty && isInitialLoad && user.uid) {
        setIsInitialLoad(false); 
        const currentSnapshot = await getDocs(q);
        if (currentSnapshot.empty) {
          for (const item of dummyLinks) {
            const { id, ...dataToSave } = item;
            await addDoc(collection(db, `users/${user.uid}/links`), {
              ...dataToSave,
              createdAt: new Date().toISOString()
            });
          }
        }
      }
    }, (error) => {
      console.error("Failed to listen to links:", error);
    });

    return () => unsubscribe();
  }, [user, isInitialLoad]);

  const handleAddLink = async (newLink: Omit<LinkItem, 'id' | 'createdAt'>) => {
    if (!user) return;
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const newDocObj = {
        ...newLink,
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(db, `users/${user.uid}/links`), newDocObj);
    } catch (error) {
      console.error("Error adding link:", error);
      showToast("링크 추가 중 오류가 발생했습니다.", "error");
    }
  }

  const handleUpdateLink = async (id: string, updatedData: { title: string; url: string }) => {
    if (!user) return;
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const linkRef = doc(db, `users/${user.uid}/links`, id);
      await updateDoc(linkRef, updatedData);
    } catch (error) {
      console.error("Error updating link:", error);
      showToast("링크 수정 중 오류가 발생했습니다.", "error");
    }
  }

  const handleDeleteLink = async (id: string) => {
    if (!user) return;
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const linkRef = doc(db, `users/${user.uid}/links`, id);
      await deleteDoc(linkRef);
    } catch (error) {
      console.error("Error deleting link:", error);
      showToast("링크 삭제 중 오류가 발생했습니다.", "error");
    }
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center pt-32 pb-24 px-6 bg-background selection:bg-primary/10">
      
      {/* 중앙 정렬되는 래퍼 요소 */}
      <div className="relative z-10 w-full max-w-xl flex flex-col gap-16">
        
        {/* 프로필 이미지 및 사용자 정보 */}
        <div className="flex flex-col items-center text-center gap-8">
          <div className="relative">
            <Avatar className="w-32 h-32 border-2 border-border shadow-soft rounded-3xl overflow-hidden transition-all duration-500 hover:rounded-2xl">
              {user?.photoURL ? (
                <AvatarImage src={user.photoURL} alt={user.displayName || "Avatar"} />
              ) : (
                <AvatarFallback className="bg-muted font-bold text-5xl text-muted-foreground uppercase">
                  {user?.displayName ? user.displayName[0] : "M"}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-background border-2 border-border rounded-2xl flex items-center justify-center shadow-soft">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
              {user ? `@${user.displayName?.replace(/\s+/g, '').toLowerCase()}` : "My Link"}
            </h1>
            
            <p className="text-lg font-medium text-muted-foreground max-w-md mx-auto leading-relaxed">
              {user ? `${user.displayName}님의 모든 링크를 한 곳에서.` : "가장 간결하고 아름다운 멀티 링크 서비스."}
            </p>

            <div className="flex justify-center gap-3 mt-2">
              {user ? (
                <>
                  <span className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-[11px] font-bold tracking-widest uppercase shadow-soft">
                    Member
                  </span>
                  <span className="px-4 py-1.5 rounded-xl bg-muted text-muted-foreground text-[11px] font-bold tracking-widest uppercase">
                    Space
                  </span>
                </>
              ) : (
                <span className="px-4 py-1.5 rounded-xl bg-muted text-muted-foreground text-[11px] font-bold tracking-widest uppercase">
                  New Generation
                </span>
              )}
            </div>
          </div>
        </div>

        {user ? (
          /* 로그인 시 보여줄 링크 목록 */
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-center px-2 mb-2">
              <AddLinkDialog onAdd={handleAddLink} />
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {links.map((link) => (
                <LinkCard 
                  key={link.id}
                  link={link}
                  onUpdate={handleUpdateLink}
                  onDelete={handleDeleteLink}
                />
              ))}
            </div>
          </div>
        ) : (
          /* 로그아웃 시 보여줄 안내 문구 */
          <div className="flex flex-col items-center gap-10 py-16 px-10 bg-card rounded-[2.5rem] border border-border shadow-soft animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center text-primary border border-border">
              <Lock className="w-10 h-10" />
            </div>
            
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                시작해볼까요?
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                나만의 고유한 링크 페이지를 만들고 공유하세요.<br />
                몇 번의 클릭만으로 충분합니다.
              </p>
            </div>

            <Button 
              onClick={loginWithGoogle}
              size="lg"
              className="w-full h-16 gap-3 font-bold text-lg bg-primary text-primary-foreground hover:scale-[1.01] active:scale-[0.99] transition-all rounded-2xl shadow-soft"
            >
              Google로 시작하기
              <ArrowRight className="w-6 h-6" />
            </Button>
          </div>
        )}

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
