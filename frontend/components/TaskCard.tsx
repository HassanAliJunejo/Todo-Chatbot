"use client";

import type { Task } from "@/types/task";

export function TaskCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}: {
  task: Task;
  onToggleComplete?: (taskId: number | string, nextCompleted: boolean) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: number | string) => void;
}) {
  const isCompleted = task.completed;

  return (
    <div className="group glass-card rounded-xl p-5 interactive-elevated floating">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <button
              aria-label={isCompleted ? "Mark task as incomplete" : "Mark task as complete"}
              onClick={() => onToggleComplete?.(task.id, !isCompleted)}
              className={`flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${
                isCompleted 
                  ? "bg-gradient-to-r from-accent-primary to-accent-secondary border-transparent shadow-lg" 
                  : "border-white/30 hover:border-accent-primary hover:shadow-glow"
              }`}
            >
              {isCompleted && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <h3 className={`font-semibold text-base break-words transition-all duration-300 ${isCompleted ? "line-through text-white/50" : "text-white"}`}>
              {task.title}
            </h3>
          </div>

          {task.description ? (
            <p className="mt-3 text-sm text-white/70 break-words leading-relaxed">{task.description}</p>
          ) : null}
          
          {/* Priority and Due Date */}
          <div className="mt-4 flex flex-wrap gap-2">
            {task.priority && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                task.priority === 'high' ? 'bg-red-500/20 text-red-200 border border-red-400/30' :
                task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-200 border border-yellow-400/30' :
                'bg-green-500/20 text-green-200 border border-green-400/30'
              }`}>
                {task.priority.toUpperCase()}
              </span>
            )}
            {task.dueDate && (
              <span className="px-3 py-1 rounded-full text-xs bg-white/10 text-white/90 border border-white/20">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex sm:flex-col lg:flex-row items-center gap-2 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit?.(task)}
            className="flex-1 sm:flex-none glass-button rounded-lg px-4 py-2 text-sm text-white font-medium hover:bg-accent-primary/30 transition-all duration-200"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(task.id)}
            className="flex-1 sm:flex-none glass-button rounded-lg px-4 py-2 text-sm text-red-200 font-medium hover:bg-red-500/30 transition-all duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
