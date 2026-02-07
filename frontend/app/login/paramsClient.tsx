"use client";

import { useSearchParams } from "next/navigation";

export function ParamsClient({ children }: { children: (next: string | null) => React.ReactNode }) {
  const params = useSearchParams();
  return children(params.get("next"));
}
