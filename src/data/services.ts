import { SERVICES, SERVICE_DETAILS } from "@/lib/constants";

export interface ServiceData {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  image: string;
  emoji: string;
  tagline: string;
  longDescription: string;
  features: string[];
  benefits: string[];
  howItWorks: string[];
  stats: { value: string; label: string }[];
  useCases: string[];
  accent: string;
  ctaText: string;
}

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

const SERVICE_EXTRAS: Record<
  string,
  Pick<ServiceData, "benefits" | "howItWorks" | "ctaText">
> = {
  whatsapp: {
    benefits: [
      "Reply to every enquiry instantly, even outside business hours",
      "Move qualified prospects to your team without manual sorting",
      "Keep follow-ups consistent across every conversation",
    ],
    howItWorks: [
      "We map your customer questions, qualification rules, and sales flow",
      "The AI is trained on your services, tone, and WhatsApp workflows",
      "We connect your CRM and launch with monitoring and optimisation",
    ],
    ctaText: "Book Free Demo",
  },
  chatbot: {
    benefits: [
      "Turn more anonymous visitors into identifiable leads",
      "Reduce repetitive support work without reducing service quality",
      "Give customers reliable answers at any hour",
    ],
    howItWorks: [
      "We collect your website content, documents, FAQs, and brand voice",
      "We build and test conversation paths and human hand-off rules",
      "The chatbot is embedded, measured, and continuously improved",
    ],
    ctaText: "Book Free Demo",
  },
  voice: {
    benefits: [
      "Answer and place more calls without expanding the call centre",
      "Create consistent call quality and follow-up",
      "Capture transcripts, outcomes, and summaries automatically",
    ],
    howItWorks: [
      "We define call goals, scripts, escalation rules, and languages",
      "The voice agent is trained and connected to calendars or CRM tools",
      "Calls are tested, launched, and reviewed for ongoing improvement",
    ],
    ctaText: "Book Free Demo",
  },
  leads: {
    benefits: [
      "Respond while prospect intent is still high",
      "Prioritise the leads most likely to convert",
      "See the complete journey from campaign to qualified opportunity",
    ],
    howItWorks: [
      "We connect every lead source and define qualification criteria",
      "Automated scoring, segmentation, and follow-up workflows are built",
      "Qualified leads are routed to the right salesperson with full context",
    ],
    ctaText: "Book Free Demo",
  },
  crm: {
    benefits: [
      "Keep customer records accurate without repetitive data entry",
      "Ensure every opportunity receives the right next action",
      "Give teams one reliable view of the sales pipeline",
    ],
    howItWorks: [
      "We audit your CRM stages, fields, tools, and manual tasks",
      "Rules and integrations automate updates, assignments, and reminders",
      "We test the workflow with real scenarios before full deployment",
    ],
    ctaText: "Book Free Demo",
  },
  marketing: {
    benefits: [
      "Run campaigns consistently across multiple channels",
      "Reduce time spent creating, scheduling, and analysing content",
      "Use performance data to improve every stage of the funnel",
    ],
    howItWorks: [
      "We map your audience, channels, offers, and conversion journey",
      "AI content, campaign, nurturing, and reporting workflows are connected",
      "Performance is monitored and the automations are refined over time",
    ],
    ctaText: "Book Free Demo",
  },
  website: {
    benefits: [
      "Turn passive website traffic into active conversations",
      "Guide visitors toward the right service or next step",
      "Capture useful lead context before your team follows up",
    ],
    howItWorks: [
      "We train the assistant on your website, offers, FAQs, and policies",
      "The widget is styled for your brand and connected to lead channels",
      "We install, test, and optimise engagement triggers and conversations",
    ],
    ctaText: "Book Free Demo",
  },
  booking: {
    benefits: [
      "Remove scheduling back-and-forth for customers and staff",
      "Reduce missed appointments with timely confirmations and reminders",
      "Keep calendars accurate across teams and locations",
    ],
    howItWorks: [
      "We define availability, routing, buffers, and booking rules",
      "Calendars are connected to WhatsApp, chat, or your website",
      "Confirmation, reminder, rescheduling, and follow-up flows go live",
    ],
    ctaText: "Book Free Demo",
  },
  custom: {
    benefits: [
      "Automate processes that off-the-shelf tools cannot handle",
      "Connect disconnected systems into one reliable workflow",
      "Build an automation foundation that grows with the business",
    ],
    howItWorks: [
      "We audit the process and identify the highest-impact opportunities",
      "A custom architecture is designed around your tools and requirements",
      "We build, test, deploy, monitor, and improve the complete solution",
    ],
    ctaText: "Contact",
  },
};

export const SERVICE_CATALOG: ServiceData[] = SERVICES.map((service) => {
  const details = SERVICE_DETAILS[service.id];
  const slug = SLUG_MAP[service.id];
  const extras = SERVICE_EXTRAS[service.id];

  return {
    id: service.id,
    slug,
    title: service.title,
    shortDescription: service.description,
    image: `/services/${slug}.webp`,
    emoji: service.icon,
    tagline: details.tagline,
    longDescription: details.fullDescription,
    features: details.features,
    benefits: extras.benefits,
    howItWorks: extras.howItWorks,
    stats: details.stats,
    useCases: details.useCases,
    accent: details.accent,
    ctaText: extras.ctaText,
  };
});

export function getServiceById(id: string) {
  return SERVICE_CATALOG.find((service) => service.id === id) ?? null;
}

export function getServiceBySlug(slug: string) {
  return SERVICE_CATALOG.find((service) => service.slug === slug) ?? null;
}

export function getServiceByTitle(title: string) {
  return SERVICE_CATALOG.find(
    (service) => service.title.toLowerCase() === title.toLowerCase()
  ) ?? null;
}

export function getAllServiceSlugs() {
  return SERVICE_CATALOG.map((service) => service.slug);
}
