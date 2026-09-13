import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRequest, listRequests } from "@/lib/store";
import { createSupportSchema } from "@/lib/validation";
import { generateSupportResponse } from "@/lib/ai";
import { AppError, publicError } from "@/lib/errors";

export const runtime = "nodejs";

function ownerKey() {
  const jar = cookies();
  const current = jar.get("trlcs-owner")?.value;
  return current || crypto.randomUUID();
}

export async function GET() {
  try {
    const response = NextResponse.json({ requests: await listRequests(ownerKey()) });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    return NextResponse.json({ error: publicError(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const owner = ownerKey();
  try {
    const body = await request.json();
    const parsed = createSupportSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "Please check the highlighted fields.", fields: parsed.error.flatten().fieldErrors } }, { status: 400 });
    }
    const saved = await createRequest(parsed.data, owner);
    let response: NextResponse;
    try {
      const ai = await generateSupportResponse(parsed.data, saved.messages);
      const { updateWithAi } = await import("@/lib/store");
      const completed = await updateWithAi(saved.id, owner, ai.response, ai.latencyMs, ai.model);
      response = NextResponse.json({ request: completed ?? saved });
    } catch (error) {
      const appError = error instanceof AppError ? error : new AppError("AI_UNAVAILABLE", "We couldn't get an answer right now. Please try again.", true);
      const { markFailed } = await import("@/lib/store");
      await markFailed(saved.id, owner, appError.code);
      response = NextResponse.json({ request: { ...saved, failureCode: appError.code }, error: publicError(appError) }, { status: 503 });
    }
    response.cookies.set("trlcs-owner", owner, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 365, path: "/" });
    return response;
  } catch (error) {
    return NextResponse.json({ error: publicError(error) }, { status: 500 });
  }
}
