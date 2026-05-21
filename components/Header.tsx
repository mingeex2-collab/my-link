"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Copy, ExternalLink, Check, BarChart3 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";


export function Header() {
  const { user, loading: authLoading, loginWithGoogle, logout } = useAuth();
  const { data: profile } = useProfile(user?.uid ?? null, user ?? null);
  const [copied, setCopied] = useState(false);

  // Fallback to minji if there's no username, effectively making the defaults english.
  const targetUsername = profile?.username ?? "minji";

  const handleCopyLink = () => {
    const url = `${window.location.origin}/${targetUsername}`;
    navigator.clipboard.writeText(url);
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pathname = usePathname();
  const showRightMenu = pathname === '/' || pathname === '/status';

  if (authLoading) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6 bg-background/80 backdrop-blur-sm border-b border-border/40">
      <div className="w-full max-w-7xl flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.href = "/"}>
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center transition-all group-hover:bg-primary/90">
            <span className="text-primary-foreground font-bold text-xl italic tracking-tighter">M</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-foreground uppercase">My Link</span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest leading-none">Developer</span>
          </div>
        </div>

        {/* Right: Auth / Profile */}
        {showRightMenu && (
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button 
                  variant="outline"
                  onClick={() => window.open(`/${targetUsername}`, '_blank')}
                  className="hidden sm:flex px-4 rounded-none font-bold shadow-soft transition-all gap-2"
                >
                  내 페이지
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <Menu>
                  <MenuTrigger render={
                  <button className="flex items-center gap-2 p-0.5 pr-3 rounded-full hover:bg-muted transition-colors border border-transparent hover:border-border outline-none group/trigger">
                    <Avatar className="w-8 h-8 border border-border shadow-sm">
                      {user.photoURL ? (
                        <AvatarImage src={user.photoURL} alt={user.displayName || ""} />
                      ) : (
                        <AvatarFallback className="bg-muted text-[10px] font-bold text-muted-foreground">
                          {user.displayName?.[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="text-sm font-semibold text-foreground hidden xs:block">
                      {user.displayName}님
                    </span>
                  </button>
                } />
                
                <MenuContent className="w-64 animate-in fade-in-0 zoom-in-95">
                  {/* Account Summary */}
                  <div className="px-3 py-3 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">내 계정</span>
                    <div className="flex items-center gap-3 mt-1">
                      <Avatar className="w-10 h-10 border border-border/60">
                        <AvatarImage src={user.photoURL || ""} />
                        <AvatarFallback className="bg-muted">{user.displayName?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-foreground truncate">
                          {user.displayName}
                        </span>
                        <span className="text-xs font-semibold text-muted-foreground/70 truncate">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  <MenuSeparator />

                  {/* Actions */}
                  <MenuItem className="gap-3" onClick={() => window.open(`/${targetUsername}`, '_blank')}>
                    <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-foreground border border-border/40 group-hover:bg-muted transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs">내 페이지 미리보기</span>
                  </MenuItem>

                  <MenuItem className="gap-3" onClick={handleCopyLink}>
                    <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-foreground border border-border/40 group-hover:bg-muted transition-colors">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </div>
                    <span className="font-bold text-xs">{copied ? "복사되었습니다!" : "내 링크 복사"}</span>
                  </MenuItem>

                  <MenuItem className="gap-3" onClick={() => window.location.href = '/status'}>
                    <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-foreground border border-border/40 group-hover:bg-muted transition-colors">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs">통계 확인하기</span>
                  </MenuItem>

                  <MenuSeparator />

                  {/* Logout */}
                  <MenuItem 
                    className="gap-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600"
                    onClick={logout}
                    disabled={authLoading}
                  >
                    <div className="w-8 h-8 rounded-lg bg-destructive/5 flex items-center justify-center text-destructive border border-destructive/10 group-hover:bg-destructive/10 transition-colors">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs">로그아웃</span>
                  </MenuItem>
                </MenuContent>
              </Menu>
              </>
            ) : (
              <Button 
                onClick={loginWithGoogle}
                className="px-6 rounded-full gap-2 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
              >
                <LogIn className="w-4 h-4" />
                Google로 시작하기
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
