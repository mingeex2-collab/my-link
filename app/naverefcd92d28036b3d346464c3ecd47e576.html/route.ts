import { NextResponse } from "next/server";

export function GET() {
  return new NextResponse("naver-site-verification: naverefcd92d28036b3d346464c3ecd47e576.html", {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
