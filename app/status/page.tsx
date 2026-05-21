"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useLinks } from "@/hooks/useLinks";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart3, TrendingUp, MousePointerClick, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StatusPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const { data: links = [], isLoading: isLoadingLinks } = useLinks(user?.uid || null);

  const totalClicks = useMemo(() => {
    return links.reduce((sum, link) => sum + (link.clickCount || 0), 0);
  }, [links]);

  const chartData = useMemo(() => {
    return links.map((link) => ({
      title: link.title,
      clicks: link.clickCount || 0,
    }));
  }, [links]);

  const chartConfig = {
    clicks: {
      label: "클릭 수",
      color: "var(--color-primary)",
    },
  };

  if (loading || isLoadingLinks) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-1000">
          <Activity className="w-10 h-10 text-primary animate-pulse" />
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">분석 데이터 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center pt-32 pb-24 px-6 bg-background selection:bg-primary/10">
      <div className="relative z-10 w-full max-w-4xl flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* 헤더 영역 */}
        <div className="flex flex-col items-center text-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-3xl bg-muted/50 flex items-center justify-center text-primary border border-border/40 shadow-soft mb-2">
            <BarChart3 className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">인사이트 및 통계</h1>
          <p className="text-lg text-muted-foreground font-medium">내 링크들의 트래픽과 반응을 한눈에 확인하세요.</p>
        </div>

        {/* 요약 카드 */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="shadow-soft border-border/50 bg-background/50 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-300">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">총 클릭 수</CardTitle>
              <MousePointerClick className="w-4 h-4 text-primary opacity-70" />
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-black tracking-tighter">{totalClicks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-2 font-medium">모든 링크의 누적 합산입니다</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-border/50 bg-background/50 backdrop-blur-sm md:col-span-2 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -right-10 -top-10 opacity-[0.03] text-primary">
              <TrendingUp className="w-48 h-48" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">활동 상태</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 relative z-10">
              <div className="text-2xl font-bold">
                {links.length > 0 ? (
                  <>현재 <span className="text-primary">{links.length}개</span>의 활성 링크가 있습니다</>
                ) : (
                  <span className="text-muted-foreground">생성된 링크가 없습니다.</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground/80 font-medium leading-relaxed">
                계속해서 멋진 콘텐츠를 추가하고 사람들과 공유해 보세요.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 차트 영역 */}
        <Card className="shadow-soft border-border/50 bg-card overflow-hidden">
          <CardHeader className="border-b border-border/40 bg-muted/10 pb-6 pt-8 px-8">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              링크별 클릭 수 비교
            </CardTitle>
            <CardDescription className="text-sm font-medium mt-1">각 링크에 얼마나 많은 트래픽이 발생했는지 확인합니다.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {links.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center opacity-50">
                  <BarChart3 className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="text-muted-foreground font-medium">표시할 통계 데이터가 없습니다.</div>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 20 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="title"
                    tickLine={false}
                    tickMargin={15}
                    axisLine={false}
                    className="text-xs font-semibold"
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={15}
                    className="text-xs font-semibold text-muted-foreground"
                  />
                  <ChartTooltip
                    cursor={{ fill: 'var(--color-muted)', opacity: 0.3 }}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="clicks"
                    fill="var(--color-clicks)"
                    radius={[6, 6, 0, 0]}
                    barSize={48}
                    className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
