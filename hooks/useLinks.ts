import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchLinks, addLink, updateLink, deleteLink } from "@/lib/firebase-queries"
import type { LinkItem } from "@/data/links"

export function useLinks(uid: string | null) {
  return useQuery({
    queryKey: ["links", uid],
    queryFn: () => fetchLinks(uid!),
    enabled: !!uid,
  })
}

export function useAddLink(uid: string | null) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<LinkItem, "id" | "createdAt">) => addLink(uid!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", uid] })
    },
  })
}

export function useUpdateLink(uid: string | null) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { title: string; url: string } }) =>
      updateLink(uid!, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", uid] })
    },
  })
}

export function useDeleteLink(uid: string | null) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteLink(uid!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", uid] })
    },
  })
}
