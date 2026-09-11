import { z } from "zod";
import { categories, urgencies } from "./types";

export const createSupportSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100, "Name must be 100 characters or fewer."),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  subject: z.string().trim().min(3, "Add a short subject.").max(160, "Subject must be 160 characters or fewer."),
  complaint: z.string().trim().min(10, "Tell us a little more so we can help.").max(5000, "Message must be 5,000 characters or fewer."),
  category: z.enum(categories).optional(),
  orderNumber: z.string().trim().max(80, "Order reference is too long.").optional()
}).superRefine((value, ctx) => {
  const sensitive = /(password|passcode|cvv|cvc|pin|one[- ]?time password|otp|full card|card number)/i;
  if (sensitive.test(value.complaint)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["complaint"], message: "For your security, do not include passwords, card numbers, CVV, PINs, or one-time passwords." });
  }
});

export const aiResponseSchema = z.object({
  message: z.string().trim().min(1).max(4000),
  category: z.enum(categories),
  urgency: z.enum(urgencies),
  summary: z.string().trim().min(1).max(300),
  needsEscalation: z.boolean(),
  safeNextStep: z.string().trim().min(1).max(500)
}).superRefine((value, ctx) => {
  if (/(password|passcode|cvv|cvc|pin|one[- ]?time password|otp|full card|card number)/i.test(value.message)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["message"], message: "Response contains a sensitive credential request." });
  }
});

export type CreateSupportPayload = z.infer<typeof createSupportSchema>;
