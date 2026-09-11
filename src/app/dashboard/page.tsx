import Link from "next/link";
import { cookies } from "next/headers";
import { listRequests } from "@/lib/store";
import { RequestCard } from "@/components/request-card";
import { Icon } from "@/components/icon";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const owner = cookies().get("trlcs-owner")?.value;
  const requests = owner ? await listRequests(owner) : [];
  return <main className="mx-auto min-h-[calc(100vh-73px)] max-w-[1280px] px-5 py-12 lg:px-8 lg:py-20"><div className="flex flex-col justify-between gap-6 border-b border-[#dedfd9] pb-8 sm:flex-row sm:items-end"><div><p className="eyebrow">Your support space</p><h1 className="mt-3 text-4xl font-semibold tracking-tight">My requests</h1><p className="mt-3 max-w-lg text-sm leading-6 text-[#70746d]">A simple view of your conversations, responses, and next steps.</p></div><Link href="/#support" className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#171916] px-5 text-sm font-semibold text-white hover:bg-[#3f4936]">New request <Icon name="arrow" size={15} /></Link></div>{requests.length === 0 ? <div className="mx-auto flex max-w-lg flex-col items-center py-24 text-center"><span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#e8f0e2] text-[#4f6845]"><Icon name="racket" size={28} /></span><h2 className="mt-6 text-2xl font-semibold">What can we help with?</h2><p className="mt-3 text-sm leading-6 text-[#70746d]">Ask a question about your order, shipping, returns, products, payments, or account. Your conversations will appear here.</p><Link href="/#support" className="focus-ring mt-7 inline-flex min-h-11 items-center rounded-full border border-[#cdd4c7] px-5 text-sm font-semibold hover:bg-white">Ask your first question</Link></div> : <div className="mt-8 grid gap-4 md:grid-cols-2">{requests.map((request) => <RequestCard request={request} key={request.id} />)}</div>}</main>;
}
