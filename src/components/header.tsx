export function Header() {
  return <header className="border-b border-[#dedfd9] bg-[#f6f7f2]/95 backdrop-blur sticky top-0 z-20">
    <div className="mx-auto flex max-w-[980px] items-center justify-between px-5 py-4 lg:px-8">
      <div className="flex items-center gap-3 text-[11px] font-bold tracking-[.16em]"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#171916] text-[#d9f94a] text-[10px]">TRL</span><span>THE RACKET<br className="sm:hidden" /> LIFESTYLE</span></div>
      <div className="flex items-center gap-2 text-xs font-semibold text-[#5f744a]"><span className="h-2 w-2 rounded-full bg-[#6e9a55]" /> Here to help</div>
    </div>
  </header>;
}
