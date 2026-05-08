import { Suspense } from "react";
import PreviewClient from "./PreviewClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border bg-white p-6 text-sm text-gray-600 shadow-sm">
          Loading lesson preview…
        </div>
      }
    >
      <PreviewClient />
    </Suspense>
  );
}