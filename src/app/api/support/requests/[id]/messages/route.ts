import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { appendCustomerMessage, getRequest, markFailed, updateWithAi } from "@/lib/store";
import { conversationMessageSchema } from "@/lib/validation";
import { generateSupportResponse } from "@/lib/ai";
import { AppError, publicError } from "@/lib/errors";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const owner = cookies().get("trlcs-owner")?.value;
  if (!owner) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Please submit a request first." } }, { status: 401 });
  const current = await getRequest(params.id, owner);
  if (!current) return NextResponse.json({ error: { code: "NOT_FOUND", message: "Conversation not found." } }, { status: 404 });
  try {
    const parsed = conversationMessageSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: parsed.error.flatten().fieldErrors.message?.[0] || "Please check your message." } }, { status: 400 });
    const saved = await appendCustomerMessage(current.id, owner, parsed.data.message);
    if (!saved) return NextResponse.json({ error: { code: "NOT_FOUND", message: "Conversation not found." } }, { status: 404 });
    const ai = await generateSupportResponse({ name: saved.name, email: saved.email, subject: saved.subject, complaint: saved.complaint, category: saved.customerCategory, orderNumber: saved.orderReference }, saved.messages);
    return NextResponse.json({ request: await updateWithAi(saved.id, owner, ai.response, ai.latencyMs, ai.model) });
  } catch (error) {
    const appError = error instanceof AppError ? error : new AppError("AI_UNAVAILABLE", "We couldn't get an answer right now. Please try again.", true);
    await markFailed(current.id, owner, appError.code);
    return NextResponse.json({ error: publicError(appError) }, { status: 503 });
  }
}
