"use client";

import { useMemo, useState } from "react";

import type { Task } from "@/types/task";

type TaskDraft = Pick<Task, "title" | "description" | "dueDate" | "priority">;

export function TaskForm({
  mode,
  initialValues,
  onSubmit,
  onCancel,
}: {
  mode: "create" | "edit";
  initialValues?: TaskDraft;
  onSubmit?: (draft: TaskDraft) => Promise<void> | void;
  onCancel?: () => void;
}) {
  const initial = useMemo<TaskDraft>(
    () => ({
      title: initialValues?.title ?? "",
      description: initialValues?.description ?? "",
      dueDate: initialValues?.dueDate ?? "",
      priority: initialValues?.priority ?? "",
    }),
    [initialValues],
  );

  const [draft, setDraft] = useState<TaskDraft>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!draft.title.trim()) {
      setError("Title is required.");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit?.({
        title: draft.title.trim(),
        description: draft.description?.trim() || undefined,
        dueDate: draft.dueDate || undefined,
        priority: draft.priority || undefined,
      });
      if (mode === "create") setDraft({ title: "", description: "", dueDate: "", priority: "" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="glass-card p-8 rounded-xl">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          {mode === "create" ? "Create New Task" : "Edit Task"}
        </h2>
        <p className="text-white/60">
          {mode === "create" ? "Add a new task to your list" : "Update your task details"}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/90">
            Task Title
          </label>
          <input
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            className="w-full h-12 rounded-xl glass-input px-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all"
            placeholder="What needs to be done?"
          />
        </div>

        {/* Due date and Priority */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/90">
              Due Date
            </label>
            <input
              type="date"
              value={draft.dueDate ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, dueDate: e.target.value }))}
              className="w-full h-12 rounded-xl glass-input px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/90">
              Priority
            </label>
            <select
              value={draft.priority ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, priority: e.target.value }))}
              className="w-full h-12 rounded-xl glass-input px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all"
            >
              <option value="" className="bg-gray-900 text-white">Select priority</option>
              <option value="low" className="bg-gray-900 text-white">Low</option>
              <option value="medium" className="bg-gray-900 text-white">Medium</option>
              <option value="high" className="bg-gray-900 text-white">High</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/90">
            Description
          </label>
          <textarea
            value={draft.description ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            className="w-full min-h-24 rounded-xl glass-input px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all resize-y"
            placeholder="Add some details about this task..."
            rows={3}
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 h-12 rounded-xl glass-button text-white font-medium hover:bg-white/10 transition-all duration-300"
            >
              Cancel
            </button>
          )}
          <button
            disabled={submitting}
            type="submit"
            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-medium hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {submitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {mode === "create" ? "Creating..." : "Saving..."}
              </div>
            ) : (
              <span>
                {mode === "create" ? "Create Task" : "Save Changes"}
              </span>
            )}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
            <p className="text-red-200 text-sm font-medium">Error: {error}</p>
          </div>
        )}
      </form>
    </div>
  );
}
