export const categories = ["ORDERS", "SHIPPING", "RETURNS", "PRODUCTS", "PAYMENTS", "ACCOUNT", "OTHER"] as const;
export const urgencies = ["LOW", "NORMAL", "HIGH"] as const;
export const statuses = ["PENDING", "AI_RESPONDED", "RESOLVED"] as const;

export type Category = (typeof categories)[number];
export type Urgency = (typeof urgencies)[number];
export type Status = (typeof statuses)[number];

export type SupportRequest = {
  id: string;
  ownerKey: string;
  name: string;
  email: string;
  subject: string;
  complaint: string;
  customerCategory?: Category;
  category: Category;
  urgency: Urgency;
  summary?: string;
  aiResponse?: string;
  safeNextStep?: string;
  needsEscalation: boolean;
  status: Status;
  orderReference?: string;
  providerModel?: string;
  providerLatencyMs?: number;
  failureCode?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
};

export type CreateSupportInput = {
  name: string;
  email: string;
  subject: string;
  complaint: string;
  category?: Category;
  orderNumber?: string;
};

export type AiSupportResponse = {
  message: string;
  category: Category;
  urgency: Urgency;
  summary: string;
  needsEscalation: boolean;
  safeNextStep: string;
};
