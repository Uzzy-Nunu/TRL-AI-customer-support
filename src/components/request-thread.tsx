"use client";

import { useRouter } from "next/navigation";
import { ConversationComposer } from "./conversation-composer";
import type { SupportRequest } from "@/lib/types";

export function RequestThread({ request }: { request: SupportRequest }) {
  const router = useRouter();
  return <ConversationComposer request={request} onSent={() => router.refresh()} />;
}
