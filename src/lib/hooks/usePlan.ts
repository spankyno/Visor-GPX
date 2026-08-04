"use client";

import { useUser } from "@clerk/nextjs";
import { planFromPublicMetadata, type Plan } from "@/lib/plans";

interface UsePlanResult {
  plan: Plan;
  isLoaded: boolean;
  isSignedIn: boolean;
}

export function usePlan(): UsePlanResult {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return { plan: "anonymous", isLoaded: false, isSignedIn: false };
  if (!isSignedIn || !user) return { plan: "anonymous", isLoaded: true, isSignedIn: false };

  return {
    plan: planFromPublicMetadata(user.publicMetadata),
    isLoaded: true,
    isSignedIn: true,
  };
}
