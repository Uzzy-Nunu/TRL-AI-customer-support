import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getRequest } from "@/lib/store";
import { Icon } from "@/components/icon";
import { StatusBadge, UrgencyBadge } from "@/components/status-badge";
import { RequestActions } from "@/components/request-actions";
import { RequestThread } from "@/components/request-thread";

export const dynamic = "force-dynamic";

export default async function RequestDetailPage({ params }: { params: { id: string } }) {
  const owner = cookies().get("trlcs-owner")?.value;
  const request = owner ? await getRequest(params.id, owner) : null;
  if (!request) notFound();
  return <main className="mx-auto min-h-[calc(100vh-73px)] max-w-[760px] px-4 py-8 lg:px-8 lg:py-12"><Link href="/dashboard" className="focus-ring inline-flex items-center gap-2 text-sm font-semibold text-[#5f744a]"><Icon name="arrow" size={15} /> <span className="rotate-180">Back to conversations</span></Link><div className="mt-7 flex items-center gap-3 border-b border-[#dedfd9] pb-6"><div className="grid h-11 w-11 place-items-center rounded-full bg-[#dfead9] text-xs font-bold text-[#4f6845]">AM</div><div><p className="font-semibold">Amara · The Racket Lifestyle</p><p className="text-xs text-[#70746d]">{request.subject}</p></div><div className="ml-auto flex flex-wrap justify-end gap-2"><StatusBadge status={request.status} /><UrgencyBadge urgency={request.urgency} /></div></div><div className="mt-8 space-y-5">{(request.messages || [{ role: "customer" as const, content: request.complaint, createdAt: request.createdAt }, ...(request.aiResponse ? [{ role: "team" as const, content: request.aiResponse, createdAt: request.updatedAt }] : [])]).map((message, index) => message.role === "customer" ? <div key={`${message.createdAt}-${index}`} className="ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-[#171916] p-4 text-white sm:max-w-[75%]"><p className="text-xs font-semibold text-[#b8cba6]">You</p><p className="mt-2 whitespace-pre-line text-sm leading-7">{message.content}</p></div> : <div key={`${message.createdAt}-${index}`} className="flex items-start gap-3"><div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#dfead9] text-[10px] font-bold text-[#4f6845]">AM</div><div className="max-w-[88%] rounded-2xl rounded-tl-sm border border-[#dedfd9] bg-white p-4 sm:max-w-[75%]"><p className="text-xs font-semibold text-[#4f6845]">Amara · The Racket Lifestyle</p><p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#31352e]">{message.content}</p></div></div>)}</div>{request.needsEscalation && <div className="mt-5 flex gap-3 rounded-2xl border border-[#e6d7bb] bg-[#fffaf0] p-5 text-sm leading-6 text-[#765a28]"><Icon name="alert" size={19} /><p><strong>We’ve passed this to the right people.</strong> Someone from our team should take a closer look.</p></div>}<RequestThread request={request} /><RequestActions request={request} /></main>;
}
