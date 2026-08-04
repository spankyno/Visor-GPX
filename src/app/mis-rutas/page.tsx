import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { listUserFiles } from "@/lib/gpx/store-server";
import { MyRoutesClient } from "./MyRoutesClient";

export default async function MyRoutesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const files = await listUserFiles(user.userId);

  return <MyRoutesClient initialFiles={files} plan={user.plan} />;
}
