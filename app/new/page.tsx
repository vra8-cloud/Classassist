"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function NewLessonPage() {
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [duration, setDuration] = useState(45);
  const [goals, setGoals] = useState("");
  const [saving, setSaving] = useState(false);

  function generateStructure() {
    const text = `Learning Goals:
1. Understand key ideas in ${subject || "the topic"}
2. Develop critical thinking skills
3. Apply knowledge through activity

Activities:
• Warm-up: Short discussion or question
• Main Activity: Hands-on task or group work
• Closing: Reflection or summary

Assessment:
• Quick check for understanding or short task`;

    setGoals(text);
  }

  async function handleSave() {
    setSaving(true);

    await supabase.from("lesson_plans").insert({
      subject,
      grade,
      duration,
      goals,
    });

    setSaving(false);
    alert("Lesson saved!");
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Create a lesson plan</h1>

      <input
        className="w-full border rounded-md p-3"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          className="border rounded-md p-3"
          placeholder="Grade / Age"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        />
        <input
          type="number"
          className="border rounded-md p-3"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
      </div>

      <textarea
        className="w-full border rounded-md p-3 h-56"
        placeholder="Learning goals..."
        value={goals}
        onChange={(e) => setGoals(e.target.value)}
      />

      <div className="flex gap-3">
        <button
          onClick={generateStructure}
          className="bg-gray-900 text-white px-4 py-2 rounded-md"
        >
          Generate full lesson structure
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          className="border px-4 py-2 rounded-md"
        >
          {saving ? "Saving..." : "Save lesson"}
        </button>
      </div>
    </div>
  );
}
