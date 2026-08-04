import { auth, clerkClient } from "@clerk/nextjs/server";
import { planFromPublicMetadata, type Plan } from "@/lib/plans";

export interface CurrentUser {
  userId: string;
  plan: Plan;
}

/** Devuelve null si no hay sesión iniciada. */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const plan = planFromPublicMetadata(user.publicMetadata);

  return { userId, plan };
}
