import { NextResponse } from "next/server";

import { getSessionServer } from "@/lib/auth";

export async function GET() {
  const session = await getSessionServer();
  return NextResponse.json({ session });
}
