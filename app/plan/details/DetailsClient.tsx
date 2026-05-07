"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type LessonPlan = {
  id: string;
  subject: string;
  grade: string;
  duration: number;
  goals: string;
  created_at: string;
};

export default function DetailsClient() {
  const sp = useSearchParams();
  const id = sp.get("id");

  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<LessonPlan | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setErrorMsg(null);

      if (!id) {
        setPlan(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("lesson_plans")
        .select("id, subject, grade, duration, goals, created_at")
        .eq("id", id)
        .maybeSingle();

      if (error) setErrorMsg(error.message);
      setPlan(data ?? null);
      setLoading(false);
    }

    load();
  }, [id]);

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← Back to dashboard
          </Link>

          <div>
            <p className="text-sm font-medium text-gray-500">Lesson details</p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              Review lesson plan
            </h1>

            <p className="mt-2 max-w-xl text-gray-600">
              View the lesson information, learning goals and basic classroom
              structure before opening the full preview.
            </p>
          </div>
        </div>

        {plan && (
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/plan/preview?id=${plan.id}`}
              className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Open Preview
            </Link>

            <Link
              href="/new"
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              + New Lesson
            </Link>
          </div>
        )}
      </div>

      {loading && (
        <div className="rounded-2xl border bg-white p-6 text-sm text-gray-600 shadow-sm">
          Loading lesson details…
        </div>
      )}

      {!loading && !id && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Missing <b>id</b> in URL. Example: <code>/plan/details?id=...</code>
        </div>
      )}

      {!loading && errorMsg && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Error: {errorMsg}
        </div>
      )}

      {!loading && !errorMsg && plan && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <section className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Subject</p>

                <h2 className="mt-1 text-3xl font-semibold tracking-tight">
                  {plan.subject}
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border px-3 py-1 text-xs text-gray-700">
                  {plan.grade}
                </span>

                <span className="rounded-full border px-3 py-1 text-xs text-gray-700">
                  {plan.duration} min
                </span>
              </div>
            </div>

            <div className="mt-6 border-t pt-6">
              <h3 className="text-base font-semibold">Learning goals</h3>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                {plan.goals}
              </p>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Created</p>

              <p className="mt-2 text-sm text-gray-700">
                {new Date(plan.created_at).toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-5 text-sm text-gray-700">
              <p className="font-medium text-slate-900">Next step</p>

              <p className="mt-2">
                Open the preview to see the AI-assisted lesson structure,
                activities and assessment ideas.
              </p>
            </div>
          </aside>
        </div>
      )}

      {!loading && !errorMsg && !plan && id && (
        <div className="rounded-2xl border bg-white p-6 text-sm text-gray-600 shadow-sm">
          No plan found for this id.
        </div>
      )}
    </main>
  );
}