"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Task } from "@/types/task";
import { TasksClient } from "./tasksClient";

export default function TasksPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "all";
  const q = searchParams.get("q") ?? "";
  
  return <TasksClient initialTasks={[]} initialStatus={status} initialQuery={q} />;
}
