"use client"

import { useState, useEffect } from "react"
import { dummyLinks, type LinkItem } from "@/data/links"
import { Card } from "@/components/ui/card"
import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore"
import { AddLinkDialog } from "@/components/AddLinkDialog"
import { 
  Code, 
  Camera, 
  Play, 
  Link as LinkIcon, 
  Briefcase, 
  ExternalLink,
  Share2,
  Sparkles,
  Heart,
  Globe
} from "lucide-react"

// 아이콘 매핑 함수
const getIcon = (title: string) => {
  if (title.includes("GitHub")) return <Code className="w-5 h-5" />;
  if (title.includes("인스타그램")) return <Camera className="w-5 h-5" />;
  if (title.includes("유튜브")) return <Play className="w-5 h-5" />;
  if (title.includes("블로그")) return <LinkIcon className="w-5 h-5" />;
  if (title.includes("포트폴리오")) return <Briefcase className="w-5 h-5" />;
  return <Globe className="w-5 h-5" />;
};

export default function Page() {
  const [links, setLinks] = useState<LinkItem[]>([])

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const linksRef = collection(db, "users/anonymous/links");
        const q = query(linksRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const fetchedData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as LinkItem[];
          setLinks(fetchedData);
        } else {
          // Firestore가 비어있는 경우, 기존 dummyLinks(로컬 데이터)를 DB로 일괄 복사(마이그레이션)
          const migratedLinks = [...dummyLinks];
          for (let i = 0; i < dummyLinks.length; i++) {
            const { id, ...dataToSave } = dummyLinks[i];
            const docRef = await addDoc(collection(db, "users/anonymous/links"), dataToSave);
            migratedLinks[i] = { ...migratedLinks[i], id: docRef.id };
          }
          setLinks(migratedLinks);
        }
      } catch (error) {
        console.error("Failed to fetch links:", error);
      }
    };
    
    fetchLinks();
  }, []);

  const handleAddLink = async (newLink: Omit<LinkItem, 'id' | 'createdAt'>) => {
    try {
      const newDocObj = {
        ...newLink,
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, "users/anonymous/links"), newDocObj);
      
      const link: LinkItem = {
        id: docRef.id,
        ...newDocObj,
      };
      setLinks((prev) => [link, ...prev]);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("링크를 추가하는 중 오류가 발생했습니다.");
    }
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center py-24 px-6 bg-mesh overflow-hidden">
      
      {/* 중앙 정렬되는 래퍼 요소 */}
      <div className="relative z-10 w-full max-w-md flex flex-col gap-12">
        
        {/* 프로필 이미지 및 사용자 정보 (더욱 정갈해진 헤더) */}
        <div className="flex flex-col items-center text-center gap-6 animate-float">
          <div className="relative group">
            <div className="relative w-28 h-28 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden">
               <div className="w-full h-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-black text-4xl text-slate-300 dark:text-slate-200">
                M
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
              @mingee_link
            </h1>
            
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-[280px] leading-relaxed">
              매일의 소중한 순간들을 기록하고 공유합니다 ❤️
            </p>

            <div className="flex justify-center gap-1.5 mt-1">
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold tracking-tight uppercase">
                Life Log
              </span>
              <span className="px-3 py-1 rounded-full bg-pink-100/50 dark:bg-pink-900/20 text-pink-500 dark:text-pink-300 text-[10px] font-bold tracking-tight uppercase">
                Style & Daily
              </span>
            </div>
          </div>
        </div>

        {/* 링크 목록 (깔끔한 단색 카드 리스트) */}
        <div className="flex flex-col gap-5">
          <AddLinkDialog onAdd={handleAddLink} />
          
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <Card className="relative overflow-hidden bg-white dark:bg-slate-900 border-none transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1 rounded-[2.5rem]">
                <div className="p-5 flex items-center justify-between w-full">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-300 shadow-inner group-hover:scale-110 transition-transform duration-300 border border-slate-100 dark:border-slate-700">
                      {getIcon(link.title)}
                    </div>
                    
                    <span className="font-bold text-lg text-slate-700 dark:text-slate-200 transition-colors duration-300 group-hover:text-slate-900 dark:group-hover:text-white">
                      {link.title}
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-all duration-300">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </Card>
            </a>
          ))}
        </div>

        {/* 푸터 영역 (깔끔한 액션 버튼) */}
        <div className="flex flex-col items-center gap-6 mt-6">
          <button className="flex items-center gap-2.5 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer">
            <Share2 className="w-4 h-4" />
            공유하기
          </button>
          
          <div className="flex items-center gap-1.5 opacity-20">
            <Sparkles className="w-3 h-3 text-slate-400" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              My Link 2026
            </p>
            <Heart className="w-3 h-3 text-slate-400 fill-slate-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
