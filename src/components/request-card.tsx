import Link from "next/link";
import { Icon } from "./icon";
import { StatusBadge, UrgencyBadge } from "./status-badge";
import type { SupportRequest } from "@/lib/types";

export function RequestCard({ request }: { request: SupportRequest }) {
  return <Link href={`/dashboard/${request.id}`} className="focus-ring block rounded-2xl border border-[#dedfd9] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#a7b79a] hover:shadow-[0_10px_28px_rgba(24,32,20,.06)]"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><StatusBadge status={request.status} /><span className="rounded-full bg-[#f0f2ed] px-2.5 py-1 text-[11px] font-bold text-[#5d6259]">{request.category}</span></div><span className="text-xs text-[#858a80]">{new Date(request.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span></div><h2 className="mt-4 font-semibold">{request.subject}</h2><p className="mt-2 line-clamp-2 text-sm leading-6 text-[#70746d]">{request.summary || request.complaint}</p><div className="mt-4 flex items-center justify-between border-t border-[#edf0ea] pt-3"><UrgencyBadge urgency={request.urgency} /><span className="flex items-center gap-1 text-xs font-semibold text-[#4f6845]">Open request <Icon name="arrow" size={14} /></span></div></Link>;
}
