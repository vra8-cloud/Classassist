export type LessonPlan = {
  id: string;
  subject: string;
  grade: string;
  duration: number;
  goals: string;
  createdAt: string;
};

const KEY = "classassist.lessonPlans";

export function getLessonPlans(): LessonPlan[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LessonPlan[];
  } catch {
    return [];
  }
}

export function saveLessonPlan(plan: LessonPlan) {
  const existing = getLessonPlans();
  const next = [plan, ...existing];
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function clearLessonPlans() {
  localStorage.removeItem(KEY);
}
export function deleteLessonPlan(id: string) {
  const existing = getLessonPlans();
  const next = existing.filter((p) => p.id !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
}
