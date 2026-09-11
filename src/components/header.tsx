"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "./icon";

export function Header() {
  const [open, setOpen] = useState(false);
  return <header className="border-b border-[#dedfd9] bg-[#f6f7f2]/95 backdrop-blur sticky top-0 z-20">
    <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-4 lg:px-8">
      <Link href="/" className="focus-ring flex items-center gap-2 text-[11px] font-bold tracking-[.16em]"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#171916] text-[#d9f94a] text-xs">TRL</span><span>THE RACKET<br className="sm:hidden" /> LIFESTYLE</span></Link>
      <button aria-label={open ? "Close menu" : "Open menu"} className="focus-ring rounded-full p-2 lg:hidden" onClick={() => setOpen(!open)}><Icon name={open ? "close" : "menu"} /></button>
      <nav aria-label="Main navigation" className={`${open ? "absolute left-0 right-0 top-full border-b border-[#dedfd9] bg-[#f6f7f2] p-5" : "hidden"} lg:static lg:flex lg:items-center lg:gap-7 lg:bg-transparent lg:p-0`}>
        <div className="flex flex-col gap-4 text-sm font-medium lg:flex-row lg:items-center lg:gap-6">
          <a className="focus-ring hover:text-[#5f744a]" href="#shop" onClick={() => setOpen(false)}>Shop</a>
          <a className="focus-ring hover:text-[#5f744a]" href="#sports" onClick={() => setOpen(false)}>Tennis</a>
          <a className="focus-ring hover:text-[#5f744a]" href="#sports" onClick={() => setOpen(false)}>Pickleball</a>
          <a className="focus-ring hover:text-[#5f744a]" href="#sports" onClick={() => setOpen(false)}>Padel</a>
          <a className="focus-ring hover:text-[#5f744a]" href="#sports" onClick={() => setOpen(false)}>Badminton</a>
          <Link className="focus-ring hover:text-[#5f744a]" href="/dashboard" onClick={() => setOpen(false)}>My requests</Link>
          <Link className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#171916] px-5 text-[#f6f7f2] transition hover:bg-[#3f4936]" href="/#support" onClick={() => setOpen(false)}>Get support <Icon name="arrow" size={15} /></Link>
        </div>
      </nav>
    </div>
  </header>;
}
