"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { Task } from "@/types/task";

import { FilterTabs, type TaskFilter } from "@/components/FilterTabs";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { useToast } from "@/components/ToastHost";
import { apiFetch } from "@/lib/api";

export function TasksClient({
  initialTasks,
  initialStatus,
  initialQuery,
}: {
  initialTasks: Task[];
  initialStatus: string;
  initialQuery: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [query, setQuery] = useState(initialQuery);
  const [editing, setEditing] = useState<Task | null>(null);

  const filterValue: TaskFilter = useMemo(() => {
    const normalized = initialStatus === "all" ? "" : initialStatus;
    if (normalized === "completed") return "completed";
    if (normalized === "pending") return "pending";
    return "all";
  }, [initialStatus]);

  const visibleTasks = useMemo(() => {
    const status = initialStatus === "all" ? "" : initialStatus;
    return tasks.filter((t) => {
      if (status === "completed" && !t.completed) return false;
      if (status === "pending" && t.completed) return false;
      if (initialQuery && initialQuery.trim()) {
        const q = initialQuery.trim().toLowerCase();
        const hay = `${t.title} ${t.description ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [tasks, initialStatus, initialQuery]);


  useEffect(() => {
    // keep query input in sync with the URL-reflected value
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    // if URL filter changes and we're editing an item that is now hidden, exit edit mode
    if (editing && !visibleTasks.some((t) => t.id === editing.id)) setEditing(null);
  }, [editing, visibleTasks]);

  async function refetchFromServer() {
    const qs = new URLSearchParams();
    if (initialStatus && initialStatus !== "all") qs.set("status", initialStatus);
    if (initialQuery) qs.set("q", initialQuery);

    const next = await apiFetch<{ items: Task[] }>(`/api/proxy/api/me/tasks?${qs.toString()}`, {
      method: "GET",
    });

    setTasks(next.items ?? []);
  }

  useEffect(() => {
    // Refetch if URL-reflected filter/search changes.
    void refetchFromServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialStatus, initialQuery]);

  function updateUrl(next: { status?: string; q?: string }) {
    const sp = new URLSearchParams(params.toString());
    if (next.status) sp.set("status", next.status);
    else sp.delete("status");
    if (next.q !== undefined) {
      if (next.q) sp.set("q", next.q);
      else sp.delete("q");
    }
    router.replace(`/tasks?${sp.toString()}`);
  }

  async function createTask(draft: { title: string; description?: string; dueDate?: string; priority?: string }) {
    const optimistic: Task = {
      id: `tmp-${Date.now()}`,
      title: draft.title,
      description: draft.description,
      dueDate: draft.dueDate,
      priority: draft.priority,
      completed: false,
      ownerId: 0, // Placeholder value for optimistic update
    };

    setTasks((prev) => [optimistic, ...prev]);

    try {
      const created = await apiFetch<Task>("/api/proxy/api/me/tasks", {
        method: "POST",
        body: draft,
      });
      setTasks((prev) => prev.map((t) => (t.id === optimistic.id ? created : t)));
      toast.success("Task created.");
    } catch (e: unknown) {
      setTasks((prev) => prev.filter((t) => t.id !== optimistic.id));
      toast.error(e instanceof Error ? e.message : "Failed to create task.");
    }
  }

  async function toggleComplete(taskId: number | string, nextCompleted: boolean) {
    const prev = tasks;
    setTasks((list) =>
      list.map((t) =>
        t.id === taskId ? { ...t, completed: nextCompleted } : t,
      ),
    );

    try {
      const updated = await apiFetch<Task>(`/api/proxy/api/me/tasks/${taskId}/complete`, {
        method: "PATCH",
        body: { completed: nextCompleted },
      });
      setTasks((list) => list.map((t) => (t.id === taskId ? updated : t)));
    } catch (e: unknown) {
      setTasks(prev);
      toast.error(e instanceof Error ? e.message : "Failed to update task.");
    }
  }

  async function deleteTask(taskId: number | string) {
    const prev = tasks;
    setTasks((list) => list.filter((t) => t.id !== taskId));

    try {
      await apiFetch<void>(`/api/proxy/api/me/tasks/${encodeURIComponent(taskId)}`, {
        method: "DELETE",
      });
      toast.success("Task deleted.");
    } catch (e: unknown) {
      setTasks(prev);
      toast.error(e instanceof Error ? e.message : "Failed to delete task.");
    }
  }

  async function saveEdit(draft: { title: string; description?: string; dueDate?: string; priority?: string }) {
    if (!editing) return;
    const taskId = editing.id;

    const prev = tasks;
    setTasks((list) => list.map((t) => (t.id === taskId ? { ...t, ...draft } : t)));

    try {
      const updated = await apiFetch<Task>(`/api/proxy/api/me/tasks/${encodeURIComponent(taskId)}`, {
        method: "PUT",
        body: draft,
      });
      setTasks((list) => list.map((t) => (t.id === taskId ? updated : t)));
      setEditing(null);
      toast.success("Task updated.");
    } catch (e: unknown) {
      setTasks(prev);
      toast.error(e instanceof Error ? e.message : "Failed to update task.");
    }
  }

  return (
    <div className="min-h-screen bg-pattern">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Premium Header */}
          <div className="text-center mb-12">
            <div className="glass-effect rounded-3xl p-8 floating">
              <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                ✨ Task Manager Pro
              </h1>
              <p className="text-white/80 text-lg">
                Organize your life with style and efficiency
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center mb-8">
            <div className="glass-card rounded-2xl p-2">
              <FilterTabs
                value={filterValue}
                onChange={(next) => updateUrl({ status: next === "all" ? "all" : next, q: query })}
              />
            </div>
          </div>

          {/* Search Bar */}
          <div className="glass-card rounded-2xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") updateUrl({ status: initialStatus, q: query });
                  }}
                  placeholder="🔍 Search your tasks..."
                  className="w-full h-12 rounded-xl glass-input px-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                />
              </div>
              <button
                type="button"
                onClick={() => updateUrl({ status: initialStatus, q: query })}
                className="h-12 px-6 rounded-xl glass-button text-white font-medium hover:scale-105 transition-all duration-300"
              >
                Search ✨
              </button>
            </div>
          </div>

          {/* Task Form */}
          <div className="glass-card rounded-2xl p-6 mb-8">
            <TaskForm
              mode={editing ? "edit" : "create"}
              initialValues={
                editing
                  ? {
                      title: editing.title,
                      description: editing.description,
                      dueDate: editing.dueDate,
                      priority: editing.priority,
                    }
                  : undefined
              }
              onSubmit={(draft) => (editing ? saveEdit(draft) : createTask(draft))}
              onCancel={editing ? () => setEditing(null) : undefined}
            />
          </div>

          {/* Task List */}
          <div className="glass-card rounded-2xl p-6">
            <TaskList
              tasks={visibleTasks}
              onToggleComplete={toggleComplete}
              onEdit={(t) => setEditing(t)}
              onDelete={deleteTask}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
