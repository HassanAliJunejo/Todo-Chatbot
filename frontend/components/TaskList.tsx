"use client";

import type { Task } from "@/types/task";

import { TaskCard } from "@/components/TaskCard";

export function TaskList({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
}: {
  tasks: Task[];
  onToggleComplete?: (taskId: string | number, nextCompleted: boolean) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string | number) => void;
}) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="glass-card rounded-3xl p-12 mx-auto max-w-md interactive-elevated">
          <div className="text-7xl mb-6 animate-float">📋</div>
          <h3 className="text-xl font-semibold text-white mb-3">
            No tasks found
          </h3>
          <p className="text-white/60">
            Create your first task to get started on your productivity journey!
          </p>
          <div className="mt-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary/20 text-accent-primary text-sm">
              <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"></span>
              Ready to start
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Your Tasks ({tasks.length})
        </h2>
        <p className="text-white/60">
          {tasks.filter(t => !t.completed).length} pending, {tasks.filter(t => t.completed).length} completed
        </p>
      </div>
      
      <div className="space-y-4">
        {tasks.map((t, index) => (
          <div key={`${t.id}-${index}`} className="transform hover:scale-[1.02] transition-all duration-300">
            <TaskCard
              task={t}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
