import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold text-gray-900 leading-tight">
          Plan better lessons.
          <br />
          <span className="text-blue-600">Teach with clarity.</span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          ClassAssist helps teachers design structured, goal-oriented lesson plans
          in minutes — not hours.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/new"
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
          >
            Create a Lesson Plan
          </Link>

          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-lg border bg-white font-medium hover:bg-gray-100 transition"
          >
            View Dashboard
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-20 border-t">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
          <Feature
            title="Structured Plans"
            text="Organize subject, grade level, duration and learning goals in one place."
          />
          <Feature
            title="Fast Creation"
            text="Create professional lesson plans in under a minute."
          />
          <Feature
            title="Always Accessible"
            text="View, edit and preview all your plans anytime."
          />
        </div>
      </section>
    </main>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div className="p-6 rounded-xl border bg-gray-50 hover:shadow-md transition">
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-3 text-gray-600">{text}</p>
    </div>
  );
}
