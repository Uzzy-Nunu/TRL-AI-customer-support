"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "./icon";
import type { SupportRequest } from "@/lib/types";

export function RequestActions({ request }: { request: SupportRequest }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const run = async (path: string) => {
    setLoading(true); setError("");
    try {
      const response = await fetch(path, { method: "POST" });
      if (!response.ok) {
        const data = await response.json();
        setError(data.error?.message || "Something went wrong. Please try again.");
      } else router.refresh();
    } catch { setError("Something went wrong. Please try again."); } finally { setLoading(false); }
  };
  return <div className="mt-7 flex flex-wrap items-center gap-3">{request.status === "PENDING" && <button disabled={loading} onClick={() => run(`/api/support/requests/${request.id}/retry`)} className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full bg-[#171916] px-5 text-sm font-semibold text-white hover:bg-[#3f4936] disabled:opacity-50">{loading ? "Trying again…" : "Try again"} <Icon name="arrow" size={15} /></button>}{request.status === "AI_RESPONDED" && <button disabled={loading} onClick={() => run(`/api/support/requests/${request.id}/resolve`)} className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border border-[#cdd4c7] px-5 text-sm font-semibold hover:bg-white disabled:opacity-50">{loading ? "Saving…" : "Mark resolved"} <Icon name="check" size={15} /></button>}<a href="mailto:support@theracketlifestyle.com" className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-[#4f6845] hover:bg-[#eef3e8]">Contact support <Icon name="external" size={14} /></a>{error && <p role="alert" className="basis-full text-sm text-[#a03d32]">{error}</p>}</div>;
}
