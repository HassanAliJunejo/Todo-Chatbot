"use client";

export type TaskFilter = "all" | "pending" | "completed";

export function FilterTabs({
  value,
  onChange,
}: {
  value: TaskFilter;
  onChange?: (next: TaskFilter) => void;
}) {
  const items: Array<{ key: TaskFilter; label: string }> = [
    { key: "all", label: "All Tasks" },
    { key: "pending", label: "Active" },
    { key: "completed", label: "Completed" },
  ];

  return (
    <div className="inline-flex rounded-xl glass-effect p-1 gap-1">
      {items.map((it) => (
        <button
          key={it.key}
          type="button"
          onClick={() => onChange?.(it.key)}
          className={
            it.key === value
              ? "rounded-lg bg-gradient-to-r from-accent-primary to-accent-secondary px-4 py-2 text-sm font-medium text-white transition-all duration-300 shadow-lg hover:shadow-xl"
              : "rounded-lg px-4 py-2 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all duration-300"
          }
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
