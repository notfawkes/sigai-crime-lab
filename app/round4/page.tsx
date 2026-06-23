"use client";

import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/AuthGuard";
import { getCurrentUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

type Clue = {
  id: number;
  name: string;
};

type Suspect = {
  id: number;
  name: string;
  role: string;
  image: string;
};

export default function Round4() {
  const router = useRouter();
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [foundClues, setFoundClues] = useState<Clue[]>([]);
  const [accusedSuspects, setAccusedSuspects] = useState<Suspect[]>([]);

  useEffect(() => {
    // Load discovered clues and accused suspects from localStorage
    const storedClues = localStorage.getItem("found_clues");
    const storedSuspects = localStorage.getItem("selected_suspects");

    if (storedClues) {
      try {
        setFoundClues(JSON.parse(storedClues));
      } catch (error) {
        console.error("Failed to parse stored clues:", error);
      }
    }

    if (storedSuspects) {
      try {
        setAccusedSuspects(JSON.parse(storedSuspects));
      } catch (error) {
        console.error("Failed to parse accused suspects:", error);
      }
    }
  }, []);

  const submitAnswer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedAnswer = answer.trim();

    if (!trimmedAnswer) {
      setMessage("Please write your investigation paragraph before submitting.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const user = await getCurrentUser();

      if (!user) {
        router.replace("/");
        return;
      }

      // Update round3_answer in Supabase users table (keeping column compatibility)
      const { error } = await supabase
        .from("users")
        .update({
          round3_answer: trimmedAnswer,
        })
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      router.replace("/results");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to save your Round 4 report.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AuthGuard>
      <div className="flex h-screen w-screen bg-black text-white overflow-hidden select-none">
        
        {/* Sidebar displaying clues & accused suspects */}
        <aside className="w-80 h-full bg-zinc-950 border-r border-zinc-800 flex flex-col p-6 overflow-y-auto">
          <h2 
            className="text-xl font-bold uppercase tracking-wider mb-6 flex items-center gap-2 text-zinc-100 border-b border-zinc-800 pb-3"
            style={{ fontFamily: "var(--font-league-gothic)" }}
          >
            <span className="h-2 w-2 rounded-full bg-[#d01f5b] animate-pulse" />
            Case Dossier
          </h2>

          {/* Section 1: Primary Accused */}
          <div className="mb-6">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 font-mono">
              Primary Accused
            </h3>
            {accusedSuspects.length === 0 ? (
              <p className="text-xs text-zinc-600 italic font-sans">No suspects accused.</p>
            ) : (
              <div className="space-y-3">
                {accusedSuspects.map((suspect) => (
                  <div key={suspect.id} className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                    <div className="w-9 h-12 rounded overflow-hidden bg-black border border-zinc-800 flex-shrink-0">
                      <img src={suspect.image} className="w-full h-full object-cover grayscale mix-blend-screen" alt="" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-zinc-200 text-xs" style={{ fontFamily: "var(--font-montserrat)" }}>
                        {suspect.name}
                      </h4>
                      <p className="text-[9px] text-[#d01f5b] font-mono uppercase tracking-wider mt-0.5">
                        {suspect.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Evidence */}
          <div>
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 font-mono">
              Evidence Folder
            </h3>
            {foundClues.length === 0 ? (
              <p className="text-xs text-zinc-600 italic font-sans">No clues found.</p>
            ) : (
              <div className="space-y-2">
                {foundClues.map((clue) => (
                  <div key={clue.id} className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                    <div className="font-medium text-zinc-300 text-xs" style={{ fontFamily: "var(--font-montserrat)" }}>
                      {clue.name}
                    </div>
                    <div className="text-[9px] text-zinc-500 font-mono mt-1 uppercase tracking-wider">
                      Evidence #{clue.id}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Main report section */}
        <main className="flex-1 h-full flex items-center justify-center bg-black px-6 text-white overflow-y-auto">
          <section className="w-full max-w-2xl py-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#d01f5b] font-mono">
              Round 3
            </p>
            <h1
              className="mb-4 text-6xl leading-none"
              style={{ fontFamily: "var(--font-league-gothic)" }}
            >
              Final Report
            </h1>
            <p className="mb-8 text-zinc-400 font-light">
              Review your accused suspects and discovered evidence in the dossier. Write one paragraph explaining your final conclusion of the investigation.
            </p>

            <form onSubmit={submitAnswer}>
              <label className="mb-2 block text-sm font-medium text-zinc-200">
                Investigation Paragraph
              </label>
              <textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                rows={9}
                className="mb-5 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-white font-sans text-sm leading-relaxed"
                placeholder="Write your analysis here..."
                disabled={isSaving}
              />

              {message && (
                <div className="mb-5 rounded-xl border border-red-500/40 bg-red-950/50 px-4 py-3 text-sm text-red-200">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-500 cursor-pointer"
              >
                {isSaving ? "Submitting..." : "Submit Final Report"}
              </button>
            </form>
          </section>
        </main>
      </div>
    </AuthGuard>
  );
}
