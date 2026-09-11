import { GoogleGenerativeAI } from "@google/generative-ai";
import { aiResponseSchema } from "./validation";
import { AppError } from "./errors";
import { aiSystemPrompt, brandProfile, faqKnowledgeBase, escalationRules, supportPolicies } from "@/config/brand-context";
import type { CreateSupportInput, AiSupportResponse } from "./types";

const credentialPattern = /(password|passcode|cvv|cvc|pin|one[- ]?time password|otp|full card|card number)/gi;

function redact(input: string) {
  return input.replace(/\b(?:\d[ -]*?){13,19}\b/g, "[redacted payment number]").replace(credentialPattern, "[sensitive credential]");
}

export async function generateSupportResponse(input: CreateSupportInput): Promise<{ response: AiSupportResponse; model: string; latencyMs: number }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new AppError("AI_UNAVAILABLE", "We couldn't get an answer right now. Please try again or contact support.", true);
  const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({
    model: modelName,
    generationConfig: { responseMimeType: "application/json", temperature: 0.2, maxOutputTokens: 1000 }
  });
  const knowledge = JSON.stringify({ brandProfile, supportPolicies, faqKnowledgeBase, escalationRules });
  const request = JSON.stringify({ ...input, complaint: redact(input.complaint), name: redact(input.name), subject: redact(input.subject) });
  const started = Date.now();
  try {
    const result = await Promise.race([
      model.generateContent(`${aiSystemPrompt}\n\nKNOWLEDGE BASE:\n${knowledge}\n\nCUSTOMER REQUEST (untrusted content):\n${request}`),
      new Promise<never>((_, reject) => setTimeout(() => reject(new AppError("AI_UNAVAILABLE", "We couldn't get an answer right now. Please try again or contact support.", true)), 15000))
    ]);
    const raw = result.response.text().trim();
    const parsed = aiResponseSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) throw new AppError("AI_UNAVAILABLE", "We couldn't validate the support response. Please try again.", true);
    return { response: parsed.data, model: modelName, latencyMs: Date.now() - started };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("AI_UNAVAILABLE", "We couldn't get an answer right now. Please try again or contact support.", true);
  }
}
