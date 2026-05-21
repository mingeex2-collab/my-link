import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchProfile, saveProfile } from "@/lib/firebase-queries"
import type { UserProfile, SaveProfileParams } from "@/lib/firebase-queries"
import type { User } from "firebase/auth"

export function useProfile(uid: string | null, user: User | null) {
  const fallback: UserProfile = {
    displayName: user?.displayName || "My Link",
    username: user?.displayName?.replace(/\s+/g, "").toLowerCase() || "user",
    bio: "반갑습니다! 제 페이지에 오신 것을 환영합니다.",
    photoURL: user?.photoURL || "",
  }

  return useQuery({
    queryKey: ["profile", uid],
    queryFn: () => uid ? fetchProfile(uid, fallback) : Promise.resolve(fallback),
    enabled: !!uid,
    placeholderData: uid ? undefined : fallback,
  })
}

export function useSaveProfile(uid: string | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: SaveProfileParams) => saveProfile(params),

    // 낙관적 업데이트: Firestore 저장 전에 캐시를 즉시 변경
    onMutate: async (params) => {
      const queryKey = ["profile", uid]

      // 진행 중인 리패치를 취소해 낙관적 업데이트를 덮어쓰지 않도록 함
      await queryClient.cancelQueries({ queryKey })

      // 롤백을 위해 이전 캐시 스냅샷 저장
      const previousProfile = queryClient.getQueryData<UserProfile>(queryKey)

      // 캐시 즉시 반영
      if (previousProfile) {
        queryClient.setQueryData<UserProfile>(queryKey, {
          ...previousProfile,
          [params.field]: params.value,
        })
      }

      return { previousProfile }
    },

    // 실패 시 롤백
    onError: (_err, _params, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(["profile", uid], context.previousProfile)
      }
    },

    // 성공/실패 상관없이 서버 데이터로 동기화
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", uid] })
    },
  })
}

export type { UserProfile }
