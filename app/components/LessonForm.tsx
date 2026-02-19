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
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Create a lesson plan</h1>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Subject</label>
        <input
          className="w-full rounded-md border px-3 py-2"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Math, Language, History"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Grade / Age</label>
          <input
            className="w-full rounded-md border px-3 py-2"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="e.g. 5th grade / 10 years"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Duration (min)</label>
          <input
            type="number"
            className="w-full rounded-md border px-3 py-2"
            value={duration}
            min={10}
            max={180}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Learning goals</label>
        <textarea
          className="w-full rounded-md border px-3 py-2"
          rows={5}
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          placeholder="Write 2–4 learning goals…"
        />
      </div>

      <button
        type="submit"
        className="rounded-md border px-4 py-2 font-medium hover:bg-gray-50"
      >
        Generate suggestions
      </button>
    </form>
  );
}
