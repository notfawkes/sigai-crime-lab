"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/AuthGuard";
import { getCurrentUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

type UserResults = {
  name: string;
  email: string;
  round1_score: number | null;
  round2_score: number | null;
  round3_answer: string | null;
};

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<UserResults | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchResults() {
      try {
        const user = await getCurrentUser();

        if (!user) {
          router.replace("/");
          return;
        }

        const { data, error } = await supabase
          .from("users")
          .select("name,email,round1_score,round2_score,round3_answer")
          .eq("id", user.id)
          .single();

        if (error) {
          throw error;
        }

        if (isMounted) {
          setResults(data);
        }
      } catch (error) {
        if (isMounted) {
          setMessage(
            error instanceof Error
              ? error.message
              : "Unable to load your results.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchResults();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <AuthGuard>
      <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white">
        <section className="mx-auto w-full max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#d01f5b]">
            Results
          </p>
          <h1
            className="mb-8 text-6xl leading-none"
            style={{ fontFamily: "var(--font-league-gothic)" }}
          >
            Investigation Summary
          </h1>

          {isLoading && (
            <div className="rounded-xl border border-zinc-800 bg-black px-5 py-4 text-zinc-400">
              Loading results...
            </div>
          )}

          {message && (
            <div className="rounded-xl border border-red-500/40 bg-red-950/50 px-5 py-4 text-red-200">
              {message}
            </div>
          )}

          {results && (
            <div className="grid gap-4">
              <ResultItem label="Name" value={results.name} />
              <ResultItem label="Email" value={results.email} />
              <ResultItem
                label="Round 1 Score"
                value={String(results.round1_score ?? 0)}
              />
              <ResultItem
                label="Round 2 Score"
                value={String(results.round2_score ?? 0)}
              />
              <div className="rounded-xl border border-zinc-800 bg-black p-5">
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Round 3 Answer
                </h2>
                <p className="whitespace-pre-wrap text-zinc-100">
                  {results.round3_answer || "No answer submitted."}
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </AuthGuard>
  );
}

function ResultItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-black p-5">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </h2>
      <p className="text-xl font-semibold text-white">{value}</p>
    </div>
  );
}
