import { Suspense } from "react";
import DetailsClient from "./DetailsClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading...</div>}>
      <DetailsClient />
    </Suspense>
  );
}
