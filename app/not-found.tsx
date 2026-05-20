export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-background text-foreground selection:bg-primary/10">
      <div className="flex flex-col items-center gap-6 max-w-md text-center px-6">
        <h1 className="text-8xl font-black text-primary tracking-tighter">404</h1>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">페이지를 찾을 수 없습니다</h2>
          <p className="text-muted-foreground">
            존재하지 않는 프로필이거나 잘못된 경로입니다.
          </p>
        </div>
      </div>
    </div>
  )
}
