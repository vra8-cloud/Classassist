"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function DetailsClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
        Plan Details
      </h1>

      {!id ? (
        <p>No id found in URL. Open: <code>/plan/details?id=...</code></p>
      ) : (
        <p>
          Showing details for id: <code>{id}</code>
        </p>
      )}

      <div style={{ marginTop: 16 }}>
        <Link href="/dashboard">← Back to Dashboard</Link>
      </div>
    </main>
  );
}
