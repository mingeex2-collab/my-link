export interface LinkItem {
  id: string;
  title: string;
  url: string; 
  icon?: string;
  createdAt: string; // 생성일시 추가
  clickCount?: number; // 클릭 수 기록
}

export const dummyLinks: LinkItem[] = [
  {
    id: 'link-1',
    title: '인스타그램',
    url: 'https://instagram.com',
    icon: 'Instagram', 
    createdAt: '2026-04-01T10:00:00Z',
    clickCount: 0,
  },
  {
    id: 'link-2',
    title: '유튜브',
    url: 'https://youtube.com',
    icon: 'Youtube',
    createdAt: '2026-04-02T11:30:00Z',
    clickCount: 0,
  },
  {
    id: 'link-3',
    title: '블로그',
    url: 'https://velog.io',
    createdAt: '2026-04-03T14:15:00Z',
    clickCount: 0,
  },
  {
    id: 'link-4',
    title: 'GitHub',
    url: 'https://github.com',
    icon: 'Github',
    createdAt: '2026-04-04T09:45:00Z',
    clickCount: 0,
  },
  {
    id: 'link-5',
    title: '포트폴리오',
    url: 'https://your-portfolio.com',
    createdAt: '2026-04-05T16:20:00Z',
    clickCount: 0,
  },
];
