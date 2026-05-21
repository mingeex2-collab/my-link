# 🚀 My Link

My Link는 개발자와 크리에이터를 위한 단일 페이지 기반의 멀티 링크 프로필 서비스입니다. 여러 개의 링크를 하나의 페이지에 모아 쉽고 깔끔하게 공유하고 관리할 수 있습니다.

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Backend & Auth:** Firebase (Auth, Firestore)

## ✨ Key Features

- **Google 소셜 로그인:** 간편하고 안전한 사용자 인증 시스템
- **링크 관리 (CRUD):** 나만의 링크 추가, 수정, 삭제 기능 제공
- **드래그 앤 드롭 정렬:** 직관적인 UI를 통한 손쉬운 링크 순서 변경
- **동적 프로필 페이지:** `/[username]` 형태의 직관적인 경로로 개별 프로필 페이지 제공

## 🚀 Getting Started

프로젝트를 로컬 환경에서 실행하기 위한 안내입니다.

### Prerequisites

- Node.js
- npm

### Installation & Run

1. 저장소를 클론하고 디렉토리로 이동합니다.
   ```bash
   git clone <repository-url>
   cd my-link
   ```
2. 패키지를 설치합니다.
   ```bash
   npm install
   ```
3. 환경 변수를 설정합니다. 프로젝트 루트에 `.env.local` 파일을 생성하고 Firebase 관련 환경 변수를 추가하세요.
4. 개발 서버를 실행합니다.
   ```bash
   npm run dev
   ```
브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 결과를 확인할 수 있습니다.

## 📜 Development Commands

- `npm run dev`: 개발 서버 실행 (Turbopack 적용)
- `npm run build`: 프로덕션 빌드 생성
- `npm run start`: 프로덕션 빌드 서버 실행
- `npm run format`: Prettier 코드 포맷팅
- `npm run typecheck`: TypeScript 타입 검사
- `npm run lint`: ESLint 코드 검사
