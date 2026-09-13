import { SupportForm } from "@/components/support-form";

export default function HomePage() {
  return <main className="min-h-[calc(100vh-73px)] px-4 py-6 sm:px-6 sm:py-10">
    <section className="mx-auto max-w-[760px]">
      <div className="mb-7 flex items-center gap-3 px-2">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#dfead9] text-sm font-bold text-[#4f6845]">AM</div>
        <div><p className="font-semibold">Amara · The Racket Lifestyle</p><p className="mt-0.5 text-sm text-[#70746d]">Usually replies in a moment</p></div>
        <span className="ml-auto hidden rounded-full bg-[#e8f2e2] px-3 py-1 text-xs font-semibold text-[#527149] sm:block">Online now</span>
      </div>
      <div className="overflow-hidden rounded-[2rem] border border-[#dedfd9] bg-[#fbfcfa] shadow-[0_18px_60px_rgba(24,32,20,.06)]">
        <div className="grid gap-6 border-b border-[#e6e9e2] px-5 py-7 sm:px-10 md:grid-cols-[1fr_180px] md:items-center">
          <div><p className="eyebrow">Customer support</p><h1 className="mt-3 font-display text-4xl font-bold tracking-[-.05em] sm:text-5xl">How can we help?</h1><p className="mt-3 max-w-md text-sm leading-6 text-[#70746d]">Send us a message about your order, products, shipping, returns, payments, or account. We’re ready when you are.</p></div>
          <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full bg-[#dfead9] ring-8 ring-[#eef3e8]"><div className="absolute bottom-0 left-7 h-20 w-26 rounded-t-[45px] bg-[#6b865d]" /><div className="absolute left-10 top-8 h-16 w-16 rounded-full bg-[#c98967]" /><div className="absolute left-9 top-5 h-12 w-20 rounded-[50%] bg-[#3d302a]" /><div className="absolute left-[68px] top-[58px] h-1.5 w-1.5 rounded-full bg-[#39251e]" /><div className="absolute left-[91px] top-[58px] h-1.5 w-1.5 rounded-full bg-[#39251e]" /><div className="absolute left-[76px] top-[72px] h-2 w-8 rounded-b-full border-b-2 border-[#7e4939]" /><span className="absolute bottom-3 right-3 grid h-7 w-7 place-items-center rounded-full bg-[#d9f94a] text-[10px] font-bold text-[#171916]">AM</span></div>
        </div>
        <div className="p-3 sm:p-6"><SupportForm /></div>
      </div>
      <p className="mt-5 text-center text-xs text-[#858a80]">Please keep passwords and payment details out of messages.</p>
    </section>
  </main>;
}
