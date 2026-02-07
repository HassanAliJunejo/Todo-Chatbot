"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { Task } from "@/types/task";
import { TasksClient } from "./tasksClient";

function TasksContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "all";
  const q = searchParams.get("q") ?? "";
  
  return <TasksClient initialTasks={[]} initialStatus={status} initialQuery={q} />;
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="glass-card p-8 rounded-xl text-center">
        <div className="w-12 h-12 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/60">Loading tasks...</p>
      </div>
    </div>
  );
}

export default function TasksPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TasksContent />
    </Suspense>
  );
}
