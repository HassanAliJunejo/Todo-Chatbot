"use client";

import Link from "next/link";
import { useState } from "react";

export default function DashboardPage() {
  const [tasks] = useState([
    {
      id: 1,
      title: "Sample Task 1",
      description: "This is a sample task",
      completed: false,
      ownerId: 1
    },
    {
      id: 2,
      title: "Sample Task 2",
      description: "This is another sample task",
      completed: true,
      ownerId: 1
    }
  ]);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;

  return (
    <div className="p-4 space-y-6 min-h-screen">
      <div className="glass-card p-8 rounded-xl">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-white/60 mt-2">Overview of your tasks.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-6 rounded-xl interactive-elevated">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white/60">Total Tasks</div>
              <div className="text-4xl font-bold text-white mt-2">{total}</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-accent-primary/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div className="mt-3 text-xs text-white/40">All tasks</div>
        </div>
        <div className="glass-card p-6 rounded-xl interactive-elevated">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white/60">Active</div>
              <div className="text-4xl font-bold text-white mt-2">{active}</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 text-xs text-white/40">In progress</div>
        </div>
        <div className="glass-card p-6 rounded-xl interactive-elevated">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white/60">Completed</div>
              <div className="text-4xl font-bold text-white mt-2">{completed}</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 text-xs text-white/40">Done</div>
        </div>
      </div>

      <div className="glass-card p-6 rounded-xl interactive-elevated">
        <h2 className="font-medium text-white text-lg">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/tasks"
            className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white px-5 py-3 rounded-xl hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            View Tasks
          </Link>
          <Link
            href="/tasks?compose=1"
            className="glass-button text-white px-5 py-3 rounded-xl hover:bg-accent-primary/30 transition-all duration-200"
          >
            Add New Task
          </Link>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="glass-card p-6 rounded-xl interactive-elevated">
        <h2 className="font-medium text-white text-lg mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-accent-primary/30 hover:bg-accent-primary/10 transition-all duration-300">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
            <p className="text-white/80 text-sm">Task "Sample Task 1" created</p>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-accent-primary/30 hover:bg-accent-primary/10 transition-all duration-300">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
            <p className="text-white/80 text-sm">Task "Sample Task 2" completed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
