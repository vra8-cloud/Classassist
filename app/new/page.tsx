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

  function buildSuggestions() {
    return {
      overview: `This lesson is designed to help students engage with ${subject || "the topic"} through a clear structure, active participation and short assessment moments.`,
      steps: [
        "Start with a short warm-up question to activate prior knowledge.",
        "Introduce the main concept using simple examples.",
        "Guide students through a short classroom activity.",
        "Allow students to work individually or in pairs.",
        "Close with a quick reflection or exit ticket.",
      ],
      differentiation: [
        "Provide visual instructions for students who benefit from extra structure.",
        "Break tasks into smaller steps for students with attention difficulties.",
        "Offer a quiet working option for students who may feel overstimulated.",
        "Use clear, concrete language and repeat key instructions.",
        "Allow alternative ways of responding, such as drawing, speaking or short written answers.",
      ],
      assessment: [
        "Use a quick exit ticket to check understanding.",
        "Ask students to explain one key idea in their own words.",
        "Observe participation during the activity.",
      ],
      materials: [
        "Whiteboard or slides",
        "Student worksheet",
        "Visual prompts or examples",
        "Exit ticket",
      ],
    };
  }

  async function handleSave() {
    if (!subject.trim() || !grade.trim() || !goals.trim()) {
      alert("Please fill Subject, Grade and Goals.");
      return;
    }

    setSaving(true);

    const { data, error } = await supabase
      .from("lesson_plans")
      .insert({
        subject,
        grade,
        duration,
        goals,
        suggestions: buildSuggestions(),
      })
      .select()
      .single();

    setSaving(false);

    if (error) {
      console.error("Save error:", error);
      alert(`Save failed: ${error.message}`);
      return;
    }

    console.log("Saved lesson:", data);
    alert("Lesson saved with inclusive classroom support!");
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
          className="border px-4 py-2 rounded-md disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save lesson"}
        </button>
      </div>
    </div>
  );
}