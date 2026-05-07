"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LessonForm() {
  const router = useRouter();

  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [duration, setDuration] = useState(45);
  const [goals, setGoals] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!subject.trim() || !grade.trim() || !goals.trim()) {
      alert("Please fill Subject, Grade and Goals.");
      return;
    }

    const params = new URLSearchParams({
      subject,
      grade,
      duration: String(duration),
      goals,
    });

    router.push(`/plan/preview?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl p-6 space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-500">New lesson</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Create a lesson plan
        </h1>
        <p className="text-gray-600">
          Plan a structured lesson in minutes with clear goals, timing and
          classroom-ready suggestions.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-5">
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            What subject are you teaching?
          </label>
          <input
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-slate-900"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Math, Language, History"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Which grade or age group?
            </label>
            <input
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-slate-900"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="e.g. 5th grade / 10 years"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Lesson duration
            </label>
            <input
              type="number"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-slate-900"
              value={duration}
              min={10}
              max={180}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            What should students learn by the end?
          </label>
          <textarea
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-slate-900"
            rows={6}
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="Write 2–4 learning goals…"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="rounded-lg bg-slate-950 px-5 py-3 font-medium text-white hover:bg-slate-800"
          >
            Generate lesson with AI ✨
          </button>

          <button
            type="button"
            className="rounded-lg border px-5 py-3 font-medium hover:bg-gray-50"
          >
            Save draft
          </button>
        </div>
      </div>
    </form>
  );
}