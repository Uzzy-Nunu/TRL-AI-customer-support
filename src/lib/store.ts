import { randomUUID } from "crypto";
import { getSupabaseAdmin } from "./supabase";
import type { AiSupportResponse, CreateSupportInput, SupportRequest, Status } from "./types";

type DbRow = Record<string, unknown>;
const localRequests = new Map<string, SupportRequest>();

function toRequest(row: DbRow): SupportRequest {
  return {
    id: String(row.id), ownerKey: String(row.owner_key ?? ""),
    name: String(row.name), email: String(row.email), subject: String(row.subject), complaint: String(row.complaint),
    customerCategory: row.customer_category as SupportRequest["customerCategory"],
    category: String(row.category ?? "OTHER") as SupportRequest["category"],
    urgency: String(row.urgency ?? "NORMAL") as SupportRequest["urgency"],
    summary: row.summary ? String(row.summary) : undefined, aiResponse: row.ai_response ? String(row.ai_response) : undefined,
    safeNextStep: row.safe_next_step ? String(row.safe_next_step) : undefined,
    needsEscalation: Boolean(row.needs_escalation), status: String(row.status ?? "PENDING") as SupportRequest["status"],
    orderReference: row.order_reference ? String(row.order_reference) : undefined,
    providerModel: row.provider_model ? String(row.provider_model) : undefined,
    providerLatencyMs: row.provider_latency_ms ? Number(row.provider_latency_ms) : undefined,
    failureCode: row.failure_code ? String(row.failure_code) : undefined,
    createdAt: String(row.created_at), updatedAt: String(row.updated_at), resolvedAt: row.resolved_at ? String(row.resolved_at) : undefined
  };
}

export async function createRequest(input: CreateSupportInput, ownerKey: string): Promise<SupportRequest> {
  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();
  const base = {
    id: randomUUID(), ownerKey, name: input.name, email: input.email.toLowerCase(), subject: input.subject,
    complaint: input.complaint, customerCategory: input.category, category: input.category ?? "OTHER",
    urgency: "NORMAL" as const, needsEscalation: false, status: "PENDING" as const,
    orderReference: input.orderNumber || undefined, createdAt: now, updatedAt: now
  };
  if (!supabase) {
    localRequests.set(base.id, base);
    return base;
  }
  const { data, error } = await supabase.from("support_requests").insert({
    id: base.id, owner_key: ownerKey, name: base.name, email: base.email, subject: base.subject, complaint: base.complaint,
    customer_category: base.customerCategory, category: base.category, urgency: base.urgency, needs_escalation: false,
    status: base.status, order_reference: base.orderReference
  }).select().single();
  if (error) throw error;
  return toRequest(data);
}

export async function updateWithAi(id: string, ownerKey: string, ai: AiSupportResponse, latencyMs: number, providerModel: string) {
  const supabase = getSupabaseAdmin();
  const updated = { category: ai.category, urgency: ai.urgency, summary: ai.summary, aiResponse: ai.message, safeNextStep: ai.safeNextStep, needsEscalation: ai.needsEscalation, status: "AI_RESPONDED" as const, providerLatencyMs: latencyMs, providerModel, updatedAt: new Date().toISOString(), failureCode: undefined };
  if (!supabase) {
    const current = localRequests.get(id);
    if (!current || current.ownerKey !== ownerKey) return null;
    const next = { ...current, ...updated };
    localRequests.set(id, next);
    return next;
  }
  const { data, error } = await supabase.from("support_requests").update({
    category: updated.category, urgency: updated.urgency, summary: updated.summary, ai_response: updated.aiResponse,
    safe_next_step: updated.safeNextStep, needs_escalation: updated.needsEscalation, status: updated.status,
    provider_latency_ms: updated.providerLatencyMs, provider_model: updated.providerModel, failure_code: null
  }).eq("id", id).eq("owner_key", ownerKey).select().single();
  if (error) throw error;
  return toRequest(data);
}

export async function markFailed(id: string, ownerKey: string, failureCode: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const current = localRequests.get(id);
    if (current?.ownerKey === ownerKey) localRequests.set(id, { ...current, failureCode, status: "PENDING", updatedAt: new Date().toISOString() });
    return;
  }
  await supabase.from("support_requests").update({ failure_code: failureCode, status: "PENDING" }).eq("id", id).eq("owner_key", ownerKey);
}

export async function listRequests(ownerKey: string): Promise<SupportRequest[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return Array.from(localRequests.values()).filter((request) => request.ownerKey === ownerKey).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const { data, error } = await supabase.from("support_requests").select("*").eq("owner_key", ownerKey).order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toRequest);
}

export async function getRequest(id: string, ownerKey: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const request = localRequests.get(id);
    return request?.ownerKey === ownerKey ? request : null;
  }
  const { data, error } = await supabase.from("support_requests").select("*").eq("id", id).eq("owner_key", ownerKey).single();
  if (error || !data) return null;
  return toRequest(data);
}

export async function setStatus(id: string, ownerKey: string, status: Status) {
  const supabase = getSupabaseAdmin();
  const resolvedAt = status === "RESOLVED" ? new Date().toISOString() : null;
  if (!supabase) {
    const current = localRequests.get(id);
    if (!current || current.ownerKey !== ownerKey) return null;
    const next = { ...current, status, resolvedAt: resolvedAt ?? undefined, updatedAt: new Date().toISOString() };
    localRequests.set(id, next);
    return next;
  }
  const { data, error } = await supabase.from("support_requests").update({ status, resolved_at: resolvedAt }).eq("id", id).eq("owner_key", ownerKey).select().single();
  if (error || !data) return null;
  return toRequest(data);
}
