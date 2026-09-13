import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRequest, markFailed, updateWithAi } from "@/lib/store";
import { generateSupportResponse } from "@/lib/ai";
import { AppError, publicError } from "@/lib/errors";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const owner = cookies().get("trlcs-owner")?.value;
  if (!owner) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Please submit a request first." } }, { status: 401 });
  const request = await getRequest(params.id, owner);
  if (!request) return NextResponse.json({ error: { code: "NOT_FOUND", message: "Request not found." } }, { status: 404 });
  try {
    const ai = await generateSupportResponse({ name: request.name, email: request.email, subject: request.subject, complaint: request.complaint, category: request.customerCategory, orderNumber: request.orderReference }, request.messages);
    return NextResponse.json({ request: await updateWithAi(request.id, owner, ai.response, ai.latencyMs, ai.model) });
  } catch (error) {
    const appError = error instanceof AppError ? error : new AppError("AI_UNAVAILABLE", "We couldn't get an answer right now. Please try again.", true);
    await markFailed(request.id, owner, appError.code);
    return NextResponse.json({ request: { ...request, failureCode: appError.code }, error: publicError(appError) }, { status: 503 });
  }
}
