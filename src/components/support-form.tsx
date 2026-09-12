"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { uiGuidelines } from "@/config/brand-context";
import { Icon } from "./icon";
import { StatusBadge, UrgencyBadge } from "./status-badge";
import type { Category, SupportRequest } from "@/lib/types";

type FormState = { name: string; email: string; subject: string; complaint: string; category: Category | ""; orderNumber: string };
const initial: FormState = { name: "", email: "", subject: "", complaint: "", category: "", orderNumber: "" };

export function SupportForm() {
  const [form, setForm] = useState(initial);
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<SupportRequest | null>(null);
  const [error, setError] = useState("");
  const responseHeading = useRef<HTMLHeadingElement>(null);
  const update = (key: keyof FormState, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("loading"); setError("");
    try {
      const response = await fetch("/api/support/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, category: form.category || undefined }) });
      const data = await response.json();
      if (!response.ok || data.error) {
        setResult(data.request ?? null);
        setError(data.error?.message || "Please check your details and try again.");
        setState("error"); return;
      }
      setResult(data.request); setState("success");
      setTimeout(() => responseHeading.current?.focus(), 0);
    } catch { setError("We couldn't get an answer right now. Please try again."); setState("error"); }
  };
  if (state === "success" && result) return <section aria-labelledby="response-heading" className="rise rounded-3xl border border-[#cfdcc7] bg-[#f8fbf4] p-5 sm:p-8">
    <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-[#dfead9] text-xs font-bold text-[#4f6845]">TR</div><div><p className="font-semibold">The Racket Lifestyle team</p><p className="text-xs text-[#70746d]">Just now</p></div><span className="ml-auto grid h-9 w-9 place-items-center rounded-full bg-[#d9f94a]"><Icon name="check" /></span></div>
    <h2 id="response-heading" ref={responseHeading} tabIndex={-1} className="sr-only">Reply from The Racket Lifestyle team</h2>
    <div className="mt-5 flex justify-end"><div className="max-w-[90%] rounded-2xl rounded-tr-sm bg-[#171916] px-4 py-3 text-sm leading-6 text-white"><p>{form.complaint}</p></div></div>
    <div className="mt-4 flex items-start gap-3"><div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#dfead9] text-[10px] font-bold text-[#4f6845]">TR</div><div className="max-w-[90%] rounded-2xl rounded-tl-sm border border-[#dfe8d9] bg-white px-4 py-3"><p className="mb-2 text-xs font-semibold text-[#4f6845]">The Racket Lifestyle team</p><p className="whitespace-pre-line text-[15px] leading-7 text-[#31352e]">{result.aiResponse}</p></div></div>
    <div className="ml-11 mt-4 rounded-xl bg-[#eef3e8] px-4 py-3"><p className="eyebrow">What to do next</p><p className="mt-1 text-sm leading-6 text-[#50564d]">{result.safeNextStep}</p></div>
    {result.needsEscalation && <div className="mt-4 flex gap-3 rounded-xl border border-[#e6d7bb] bg-[#fffaf0] p-4 text-sm leading-6 text-[#765a28]"><Icon name="alert" size={19} /><p><strong>We’ve passed this to the right people.</strong> Someone from our team may need to take a closer look.</p></div>}
    <div className="mt-6 flex flex-wrap gap-3"><Link href={`/dashboard/${result.id}`} className="focus-ring inline-flex min-h-11 items-center justify-center rounded-full bg-[#171916] px-5 text-sm font-semibold text-white hover:bg-[#3f4936]">Keep this conversation <span className="ml-2"><Icon name="arrow" size={15} /></span></Link><button className="focus-ring min-h-11 rounded-full border border-[#cdd4c7] px-5 text-sm font-semibold hover:bg-white" onClick={() => { setForm(initial); setResult(null); setState("idle"); }}>Send another message</button></div>
  </section>;
  return <form onSubmit={submit} noValidate aria-busy={state === "loading"} className="rounded-3xl border border-[#dedfd9] bg-white p-5 shadow-[0_16px_50px_rgba(24,32,20,.05)] sm:p-8">
    <div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Write to our team</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">What can we help with?</h2></div><span className="hidden rounded-full bg-[#eef3e8] px-3 py-1 text-xs font-semibold text-[#4f6845] sm:block">Replies in a moment</span></div>
    <div className="mt-7 grid gap-5 sm:grid-cols-2">
      <Field label="Your name" id="name" value={form.name} onChange={(v) => update("name", v)} placeholder="Alex Morgan" required />
      <Field label="Email address" id="email" type="email" value={form.email} onChange={(v) => update("email", v)} placeholder="alex@example.com" required />
      <div className="sm:col-span-2"><Field label="Subject" id="subject" value={form.subject} onChange={(v) => update("subject", v)} placeholder="What can we help with?" required /></div>
      <div className="sm:col-span-2"><label htmlFor="category" className="mb-2 block text-sm font-semibold">Topic <span className="font-normal text-[#8a8e85]">(optional)</span></label><select id="category" value={form.category} onChange={(e) => update("category", e.target.value)} className="focus-ring min-h-12 w-full rounded-xl border border-[#d9ddd5] bg-[#fbfcfa] px-4 text-sm"><option value="">Choose a topic</option>{uiGuidelines.categories.map((item) => <option value={item.key} key={item.key}>{item.label}</option>)}<option value="OTHER">Something else</option></select></div>
      <div className="sm:col-span-2"><label htmlFor="complaint" className="mb-2 block text-sm font-semibold">Your message <span className="font-normal text-[#a03d32]">*</span></label><textarea id="complaint" required minLength={10} maxLength={5000} value={form.complaint} onChange={(e) => update("complaint", e.target.value)} placeholder="Type your message here..." aria-describedby="complaint-help" className="focus-ring min-h-36 w-full resize-y rounded-2xl border border-[#d9ddd5] bg-[#fbfcfa] px-4 py-3 text-sm leading-6 placeholder:text-[#9a9d96]" /><div id="complaint-help" className="mt-2 flex justify-between gap-3 text-xs text-[#858a80]"><span>Please don’t include passwords or payment credentials.</span><span>{form.complaint.length}/5000</span></div></div>
      <Field label="Order reference" id="orderNumber" value={form.orderNumber} onChange={(v) => update("orderNumber", v)} placeholder="TRL-10482 (if relevant)" optional />
    </div>
    <div aria-live="polite" className="mt-5">{state === "loading" && <p className="flex items-center gap-2 text-sm font-medium text-[#4f6845]"><span className="pulse-dot h-2 w-2 rounded-full bg-[#6b893e]" />One of our team is reading your message…</p>}{state === "error" && <div role="alert" className="flex items-start gap-2 rounded-xl border border-[#edceca] bg-[#fff5f3] p-3 text-sm leading-6 text-[#923d34]"><Icon name="alert" size={18} /><span>{error}{result ? " Your message is saved and can be tried again from your conversation history." : ""}</span></div>}</div>
    <button disabled={state === "loading"} className="focus-ring mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#171916] px-6 text-sm font-bold text-white transition hover:bg-[#3f4936] disabled:cursor-wait disabled:opacity-60 sm:w-auto">{state === "loading" ? "Checking…" : "Get support"} {!state && <Icon name="arrow" size={16} />}</button>
  </form>;
}

function Field({ label, id, value, onChange, placeholder, type = "text", required = false, optional = false }: { label: string; id: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string; required?: boolean; optional?: boolean }) {
  return <div><label htmlFor={id} className="mb-2 block text-sm font-semibold">{label} {required && <span className="font-normal text-[#a03d32]">*</span>}{optional && <span className="font-normal text-[#8a8e85]"> (optional)</span>}</label><input id={id} type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="focus-ring min-h-12 w-full rounded-xl border border-[#d9ddd5] bg-[#fbfcfa] px-4 text-sm placeholder:text-[#9a9d96]" /></div>;
}
