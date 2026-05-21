import { db } from "@/lib/firebase"
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  runTransaction,
  increment,
} from "firebase/firestore"
import type { LinkItem } from "@/data/links"

export async function findUidByUsername(username: string): Promise<string | null> {
  // SSR 환경 (generateMetadata 등)에서는 gRPC 오류 방지를 위해 REST API 사용
  if (typeof window === "undefined") {
    try {
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      const res = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/usernames/${username.toLowerCase()}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.fields?.uid?.stringValue || null;
    } catch (error) {
      return null;
    }
  }

  // 클라이언트 환경
  try {
    const docSnap = await getDoc(doc(db, "usernames", username.toLowerCase()))
    if (docSnap.exists()) {
      return docSnap.data()?.uid || null
    }
  } catch (error) {
    console.error("Error finding uid by username:", error)
  }
  return null
}

export interface UserProfile {
  displayName: string
  username: string
  bio: string
  photoURL: string
}

// ──────────────────────────────────────────────
// Fetchers
// ──────────────────────────────────────────────

export async function fetchLinks(uid: string): Promise<LinkItem[]> {
  const linksRef = collection(db, `users/${uid}/links`)
  const q = query(linksRef, orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as LinkItem[]
}

export async function fetchProfile(
  uid: string,
  fallback: Omit<UserProfile, "updatedAt">
): Promise<UserProfile> {
  // SSR 환경에서는 gRPC 오류 방지를 위해 REST API 사용
  if (typeof window === "undefined") {
    try {
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      const res = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${uid}/profile/main`);
      if (res.ok) {
        const data = await res.json();
        if (data.fields) {
          return {
            displayName: data.fields.displayName?.stringValue || fallback.displayName,
            username: data.fields.username?.stringValue || fallback.username,
            bio: data.fields.bio?.stringValue || fallback.bio,
            photoURL: data.fields.photoURL?.stringValue || fallback.photoURL,
          };
        }
      }
    } catch (error) {}
    return fallback;
  }

  // 클라이언트 환경
  const profileRef = doc(db, `users/${uid}/profile`, "main")
  const docSnap = await getDoc(profileRef)
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile
  }
  return fallback
}

export async function incrementClickCount(uid: string, id: string): Promise<void> {
  const linkRef = doc(db, `users/${uid}/links`, id);
  await runTransaction(db, async (transaction) => {
    // Use Firestore's atomic increment; works even if clickCount is missing
    transaction.update(linkRef, { clickCount: increment(1) });
  });
  console.log('Click count incremented for', id);
}

export async function addLink(
  uid: string,
  data: Omit<LinkItem, "id" | "createdAt">
): Promise<void> {
  await addDoc(collection(db, `users/${uid}/links`), {
    ...data,
    createdAt: new Date().toISOString(),
    clickCount: data.clickCount ?? 0,
  })
}

export async function updateLink(
  uid: string,
  id: string,
  data: { title: string; url: string }
): Promise<void> {
  const linkRef = doc(db, `users/${uid}/links`, id)
  await updateDoc(linkRef, data)
}

export async function deleteLink(uid: string, id: string): Promise<void> {
  const linkRef = doc(db, `users/${uid}/links`, id)
  await deleteDoc(linkRef)
}

// ──────────────────────────────────────────────
// Profile Mutation
// ──────────────────────────────────────────────

export type EditableField = "displayName" | "username" | "bio"

export interface SaveProfileParams {
  uid: string
  field: EditableField
  value: string
  currentProfile: UserProfile
}

export async function saveProfile(params: SaveProfileParams): Promise<void> {
  const { uid, field, value, currentProfile } = params

  await runTransaction(db, async (transaction) => {
    const userProfileRef = doc(db, `users/${uid}/profile`, "main")
    const updatedData = { ...currentProfile, [field]: value }

    transaction.set(
      userProfileRef,
      { ...updatedData, updatedAt: new Date().toISOString() },
      { merge: true }
    )

    if (
      field === "username" &&
      value.toLowerCase() !== currentProfile.username.toLowerCase()
    ) {
      const oldUsernameRef = doc(db, "usernames", currentProfile.username.toLowerCase())
      const newUsernameRef = doc(db, "usernames", value.toLowerCase())
      
      if (currentProfile.username) {
        const oldSnap = await transaction.get(oldUsernameRef)
        if (oldSnap.exists() && oldSnap.data()?.uid === uid) {
          transaction.delete(oldUsernameRef)
        }
      }
      transaction.set(newUsernameRef, { uid })
    }
  })
}
