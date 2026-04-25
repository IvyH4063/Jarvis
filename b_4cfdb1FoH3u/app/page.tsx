import { WhisperFlow } from "@/components/whisper/whisper-flow";
import { Suspense } from "react";

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading J.A.R.V.I.S...</p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <WhisperFlow />
    </Suspense>
  );
}
