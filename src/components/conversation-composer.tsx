"use client";

import { useState } from "react";
import { Icon } from "./icon";
import type { SupportRequest } from "@/lib/types";

export function ConversationComposer({ request, onSent }: { request: SupportRequest; onSent: (request: SupportRequest) => void }) {
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim()) return;
    setState("loading");
    setError("");
    try {
      const response = await fetch(`/api/support/requests/${request.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });
      const data = await response.json();
      if (!response.ok || !data.request) {
        setError(data.error?.message || "We couldn't send that message. Please try again.");
        setState("error");
        return;
      }
      setMessage("");
      setState("idle");
      onSent(data.request);
    } catch {
      setError("We couldn't send that message. Please try again.");
      setState("error");
    }
  }

  return <form onSubmit={submit} className="mt-6 border-t border-[#e6e9e2] pt-5">
    <label htmlFor={`reply-${request.id}`} className="sr-only">Write a message</label>
    <div className="flex items-end gap-2 rounded-2xl border border-[#d9ddd5] bg-white p-2 shadow-sm focus-within:border-[#9db28f]">
      <textarea id={`reply-${request.id}`} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write a message..." maxLength={5000} rows={1} className="min-h-11 flex-1 resize-none bg-transparent px-3 py-2 text-sm leading-6 outline-none placeholder:text-[#9a9d96]" disabled={state === "loading"} />
      <button type="submit" aria-label="Send message" disabled={state === "loading" || !message.trim()} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#171916] text-white transition hover:bg-[#3f4936] disabled:cursor-not-allowed disabled:opacity-40"><Icon name="arrow" size={16} /></button>
    </div>
    {state === "loading" && <p className="mt-2 flex items-center gap-2 text-xs font-medium text-[#4f6845]" aria-live="polite"><span className="pulse-dot h-2 w-2 rounded-full bg-[#6b893e]" />One of our team is reading your message…</p>}
    {state === "error" && <p className="mt-2 text-xs text-[#a03d32]" role="alert">{error}</p>}
  </form>;
}
