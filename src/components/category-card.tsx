import Link from "next/link";
import { Icon } from "./icon";
import type { Category } from "@/lib/types";

const categoryIcons: Record<string, "package" | "truck" | "rotate" | "racket" | "card" | "user"> = {
  ORDERS: "package", SHIPPING: "truck", RETURNS: "rotate", PRODUCTS: "racket", PAYMENTS: "card", ACCOUNT: "user"
};

export function CategoryCard({ category, label, description }: { category: Category; label: string; description: string }) {
  return <Link href={`/#support?category=${category}`} className="focus-ring group flex min-h-[150px] flex-col justify-between rounded-2xl border border-[#dedfd9] bg-white p-5 transition hover:-translate-y-1 hover:border-[#a7b79a] hover:shadow-[0_12px_30px_rgba(24,32,20,.07)]">
    <div className="flex items-start justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eef3e8] text-[#4f6845]"><Icon name={categoryIcons[category] || "package"} /></span><Icon name="arrow" size={17} /></div>
    <div><h3 className="font-semibold">{label}</h3><p className="mt-1 text-sm leading-5 text-[#70746d]">{description}</p></div>
  </Link>;
}
