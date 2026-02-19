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
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Link href="/dashboard">← Back to Dashboard</Link>
      </div>

      <h1 style={{ marginTop: 16 }}>Plan details</h1>

      {loading && <p>Loading…</p>}

      {!loading && !id && (
        <p style={{ color: "crimson" }}>
          Missing <b>id</b> in URL. Example: <code>/plan/details?id=...</code>
        </p>
      )}

      {!loading && errorMsg && (
        <p style={{ color: "crimson" }}>Error: {errorMsg}</p>
      )}

      {!loading && !errorMsg && plan && (
        <div style={{ marginTop: 16, border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
          <h2 style={{ marginTop: 0 }}>{plan.subject}</h2>
          <p>
            <b>Grade:</b> {plan.grade} &nbsp;·&nbsp; <b>Duration:</b> {plan.duration} min
          </p>
          <p>
            <b>Goals:</b> {plan.goals}
          </p>
          <p style={{ color: "#666" }}>
            Created: {new Date(plan.created_at).toLocaleString()}
          </p>
        </div>
      )}

      {!loading && !errorMsg && !plan && id && <p>No plan found for this id.</p>}
    </main>
  );
}
