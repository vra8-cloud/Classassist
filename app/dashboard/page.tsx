"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type DbLessonPlan = {
  id: string;
  subject: string;
  grade: string;
  duration: number;
  goals: string;
  created_at: string;
};

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<DbLessonPlan[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const total = plans.length;

  const latest = useMemo(() => {
    if (!plans.length) return null;
    return plans[0];
  }, [plans]);

  async function loadPlans() {
    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase
      .from("lesson_plans")
      .select("id, subject, grade, duration, goals, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMsg(error.message);
      setPlans([]);
      setLoading(false);
      return;
    }

    setPlans((data ?? []) as DbLessonPlan[]);
    setLoading(false);
  }

  async function handleClearAll() {
    const ok = window.confirm("Delete ALL lesson plans? This cannot be undone.");
    if (!ok) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase
        .from("lesson_plans")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (error) throw error;

      await loadPlans();
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Failed to clear.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteOne(id: string) {
    const ok = window.confirm("Delete this lesson plan?");
    if (!ok) return;

    setDeletingId(id);
    setErrorMsg(null);

    try {
      const { error } = await supabase
        .from("lesson_plans")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setPlans((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Failed to delete.");
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    loadPlans();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">
            Teacher workspace
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back 👋
          </h1>

          <p className="max-w-xl text-gray-600">
            Create, organize and manage your AI-assisted lesson plans in one
            place.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/new"
            className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            + New Lesson
          </Link>

          <button
            onClick={loadPlans}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Refresh
          </button>

          <button
            onClick={handleClearAll}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total lesson plans" value={String(total)} />
        <StatCard
          label="Latest subject"
          value={latest ? latest.subject : "—"}
        />
        <StatCard
          label="Latest created"
          value={
            latest
              ? new Date(latest.created_at).toLocaleDateString()
              : "—"
          }
        />
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="rounded-2xl border bg-white p-6 text-sm text-gray-600 shadow-sm">
            Loading lesson plans…
          </div>
        ) : plans.length === 0 ? (
          <div className="rounded-2xl border bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold">
              No lesson plans yet
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Create your first AI-assisted lesson plan to get started.
            </p>

            <Link
              href="/new"
              className="mt-5 inline-flex rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Create Lesson Plan
            </Link>
          </div>
        ) : (
          plans.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border bg-white p-5 shadow-sm transition hover:border-gray-300"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/plan/details?id=${p.id}`}
                      className="text-lg font-semibold hover:underline"
                    >
                      {p.subject}
                    </Link>

                    <span className="rounded-full border px-2 py-1 text-xs text-gray-700">
                      {p.duration} min
                    </span>

                    <span className="rounded-full border px-2 py-1 text-xs text-gray-700">
                      {p.grade}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm text-gray-700">
                    {p.goals}
                  </p>
                </div>

                <div className="flex flex-col items-start gap-3 sm:items-end">
                  <div className="text-xs text-gray-500">
                    {new Date(p.created_at).toLocaleString()}
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/plan/preview?id=${p.id}`}
                      className="rounded-lg border px-3 py-2 text-xs font-medium hover:bg-gray-50"
                    >
                      Preview
                    </Link>

                    <button
                      onClick={() => handleDeleteOne(p.id)}
                      disabled={deletingId === p.id}
                      className="rounded-lg border px-3 py-2 text-xs font-medium hover:bg-gray-50 disabled:opacity-60"
                    >
                      {deletingId === p.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="text-sm text-gray-500">{label}</div>

      <div className="mt-2 text-2xl font-semibold tracking-tight">
        {value}
      </div>
    </div>
  );
}