import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRequest } from "@/lib/store";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const owner = cookies().get("trlcs-owner")?.value;
  if (!owner) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Please submit a request first." } }, { status: 401 });
  const request = await getRequest(params.id, owner);
  if (!request) return NextResponse.json({ error: { code: "NOT_FOUND", message: "Request not found." } }, { status: 404 });
  return NextResponse.json({ request }, { headers: { "Cache-Control": "no-store" } });
}
