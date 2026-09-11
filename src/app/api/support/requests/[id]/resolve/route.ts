import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { setStatus } from "@/lib/store";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const owner = cookies().get("trlcs-owner")?.value;
  if (!owner) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Please submit a request first." } }, { status: 401 });
  const request = await setStatus(params.id, owner, "RESOLVED");
  if (!request) return NextResponse.json({ error: { code: "NOT_FOUND", message: "Request not found." } }, { status: 404 });
  return NextResponse.json({ request });
}
