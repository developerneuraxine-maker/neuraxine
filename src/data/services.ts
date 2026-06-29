import { SERVICES, SERVICE_DETAILS } from "@/lib/constants";

export const SLUG_MAP: Record<string, string> = {
  whatsapp: "whatsapp-automation",
  chatbot: "ai-chatbot",
  voice: "ai-voice-agent",
  leads: "lead-generation",
  crm: "crm-automation",
  marketing: "digital-marketing",
  website: "website-ai-integration",
  booking: "appointment-booking",
  custom: "custom-automation",
};

const ID_FROM_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(SLUG_MAP).map(([id, slug]) => [slug, id])
);

export function getServiceBySlug(slug: string) {
  const id = ID_FROM_SLUG[slug];
  if (!id) return null;
  const base = SERVICES.find((s) => s.id === id);
  const details = SERVICE_DETAILS[id];
  if (!base || !details) return null;
  return { ...base, ...details, slug };
}

export function getAllServiceSlugs() {
  return Object.values(SLUG_MAP);
}
