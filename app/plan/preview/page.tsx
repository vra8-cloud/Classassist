"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type Suggestion = {
  overview?: string;
  steps?: string[];
  differentiation?: string[];
  assessment?: string[];
  materials?: string[];
};

type DbLessonPlan = {
  id: string;
  subject: string;
  grade: string;
  duration: number;
  goals: string;
  created_at: string;
  suggestions?: Suggestion | null;
};

function Section({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold">{title}</h3>

      <ul className="mt-3 space-y-2 text-sm text-gray-700">
        {items.map((x, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-900" />
            <span>{x}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Page() {
  const sp = useSearchParams();
  const id = sp.get("id");

  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<DbLessonPlan | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const createdLabel = useMemo(() => {
    if (!plan?.created_at) return "";
    return new Date(plan.created_at).toLocaleString();
  }, [plan?.created_at]);

  async function load() {
    setLoading(true);
    setErrorMsg(null);

    if (!id) {
      setErrorMsg("Missing id in URL. Open preview like /plan/preview?id=...");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("lesson_plans")
      .select("id, subject, grade, duration, goals, created_at, suggestions")
      .eq("id", id)
      .single();

    if (error) {
      setErrorMsg(error.message);
      setPlan(null);
      setLoading(false);
      return;
    }

    setPlan(data as DbLessonPlan);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">Lesson preview</p>

          <h1 className="text-3xl font-bold tracking-tight">
            AI-generated lesson structure
          </h1>

          <p className="max-w-xl text-gray-600">
            Review the lesson overview, classroom steps, differentiation
            support and assessment ideas before using it in class.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/new"
            className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            + New Lesson
          </Link>

          <Link
            href="/dashboard"
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Dashboard
          </Link>

          <button
            onClick={load}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border bg-white p-6 text-sm text-gray-600 shadow-sm">
          Loading lesson preview…
        </div>
      ) : errorMsg ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {errorMsg}
        </div>
      ) : !plan ? (
        <div className="rounded-2xl border bg-white p-6 text-sm text-gray-600 shadow-sm">
          Lesson plan not found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <aside className="space-y-4 lg:col-span-1">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Lesson
                  </p>

                  <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                    {plan.subject}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border px-3 py-1 text-xs text-gray-700">
                    {plan.duration} min
                  </span>

                  <span className="rounded-full border px-3 py-1 text-xs text-gray-700">
                    {plan.grade}
                  </span>
                </div>

                <div className="border-t pt-4">
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="mt-1 text-sm text-gray-700">{createdLabel}</p>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold">Learning goals</h3>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                    {plan.goals}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-5 text-sm text-gray-700">
              <p className="font-medium text-slate-900">Teacher note</p>
              <p className="mt-2">
                Use this preview as a starting point. You can adapt timing,
                instructions and activities based on your classroom needs.
              </p>
            </div>
          </aside>

          <main className="space-y-4 lg:col-span-2">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    AI assistant output
                  </p>

                  <h2 className="mt-1 text-xl font-semibold">
                    Lesson overview
                  </h2>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  Mock AI
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-gray-700">
                {plan.suggestions?.overview
                  ? plan.suggestions.overview
                  : "No AI suggestions have been saved for this lesson plan yet."}
              </p>
            </div>

            <Section title="Classroom steps" items={plan.suggestions?.steps} />

            <Section
              title="Differentiation support"
              items={plan.suggestions?.differentiation}
            />

            <Section
              title="Assessment ideas"
              items={plan.suggestions?.assessment}
            />

            <Section title="Materials" items={plan.suggestions?.materials} />
          </main>
        </div>
      )}
    </div>
  );
}