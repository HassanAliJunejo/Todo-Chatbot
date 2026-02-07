import { redirect } from "next/navigation";

import { getSessionServer } from "@/lib/auth";

export default async function Home() {
  const session = await getSessionServer();
  redirect(session ? "/dashboard" : "/login");
}
