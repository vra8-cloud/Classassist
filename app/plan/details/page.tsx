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
    <div className="space-y-2">
      <div className="text-sm font-semibold">{title}</div>
      <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
        {items.map((x, i) => (
          <li key={i}>{x}</li>
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
      setErrorMsg("Missing id in URL. Open details like /plan/details?id=...");
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
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Lesson details</h1>
          <p className="text-sm text-gray-600">
            This page is public (no login required).
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard"
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Dashboard
          </Link>
          {id && (
            <Link
              href={`/plan/preview?id=${id}`}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-95"
            >
              Open Preview
            </Link>
          )}
          <Link
            href="/new"
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            New Lesson
          </Link>

          <button
            onClick={load}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border bg-white p-6 text-sm text-gray-600 shadow-sm">
          Loading…
        </div>
      ) : errorMsg ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {errorMsg}
        </div>
      ) : !plan ? (
        <div className="rounded-xl border bg-white p-6 text-sm text-gray-600 shadow-sm">
          Not found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-xl border bg-white p-5 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold">{plan.subject}</h2>
                <span className="rounded-full border px-2 py-0.5 text-xs text-gray-700">
                  {plan.duration} min
                </span>
                <span className="rounded-full border px-2 py-0.5 text-xs text-gray-700">
                  {plan.grade}
                </span>
              </div>

              <div className="text-xs text-gray-500">{createdLabel}</div>

              <div className="space-y-1">
                <div className="text-sm font-semibold">Learning goals</div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {plan.goals}
                </p>
              </div>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm text-sm text-gray-600">
              Shareable URL: /plan/details?id={plan.id}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-xl border bg-white p-6 shadow-sm space-y-5">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">Suggestions</h3>
                <p className="text-sm text-gray-600">
                  {plan.suggestions?.overview
                    ? plan.suggestions.overview
                    : "No suggestions saved for this plan."}
                </p>
              </div>

              <Section title="Steps" items={plan.suggestions?.steps} />
              <Section
                title="Differentiation"
                items={plan.suggestions?.differentiation}
              />
              <Section title="Assessment" items={plan.suggestions?.assessment} />
              <Section title="Materials" items={plan.suggestions?.materials} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
