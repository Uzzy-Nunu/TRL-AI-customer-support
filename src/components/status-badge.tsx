import type { Status, Urgency } from "@/lib/types";

export function StatusBadge({ status }: { status: Status }) {
  const styles = { PENDING: "bg-[#fff3d7] text-[#825b09]", AI_RESPONDED: "bg-[#e4f0df] text-[#3f6334]", RESOLVED: "bg-[#e9e9e4] text-[#5d6259]" };
  const labels = { PENDING: "Pending", AI_RESPONDED: "AI responded", RESOLVED: "Resolved" };
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${styles[status]}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{labels[status]}</span>;
}

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  const styles = { LOW: "text-[#5d6259]", NORMAL: "text-[#3f6334]", HIGH: "text-[#a03d32]" };
  return <span className={`text-[11px] font-semibold ${styles[urgency]}`}>{urgency === "HIGH" ? "High priority" : urgency === "LOW" ? "Low priority" : "Normal priority"}</span>;
}
