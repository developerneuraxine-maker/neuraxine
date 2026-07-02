import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Error: Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const SERVICES = [
  {
    title: "WhatsApp Automation",
    description: "Automated conversations, lead qualification, and follow-ups on WhatsApp 24/7.",
    icon: "💬",
    enabled: true,
    sortOrder: 1,
  },
  {
    title: "AI Chatbot",
    description: "Intelligent chatbots that understand context and convert visitors into leads.",
    icon: "🤖",
    enabled: true,
    sortOrder: 2,
  },
  {
    title: "AI Voice Agent",
    description: "Natural voice AI that handles calls, bookings, and customer support.",
    icon: "🎙️",
    enabled: true,
    sortOrder: 3,
  },
  {
    title: "Lead Generation",
    description: "Automated lead capture, scoring, and routing to your sales pipeline.",
    icon: "📊",
    enabled: true,
    sortOrder: 4,
  },
  {
    title: "CRM Automation",
    description: "Sync leads, automate workflows, and keep your CRM always updated.",
    icon: "⚡",
    enabled: true,
    sortOrder: 5,
  },
  {
    title: "Digital Marketing",
    description: "AI-powered campaigns with automated funnels from ad to conversion.",
    icon: "📈",
    enabled: true,
    sortOrder: 6,
  },
  {
    title: "Website AI Integration",
    description: "Embed AI assistants directly into your website for instant engagement.",
    icon: "🌐",
    enabled: true,
    sortOrder: 7,
  },
  {
    title: "Appointment Booking",
    description: "Smart scheduling that books meetings without human intervention.",
    icon: "📅",
    enabled: true,
    sortOrder: 8,
  },
  {
    title: "Custom Automation",
    description: "Bespoke AI systems tailored to your unique business workflows.",
    icon: "🔧",
    enabled: true,
    sortOrder: 9,
  },
];

async function seed() {
  console.log("Seeding database...");

  // 1. Seed Admin
  const email = process.env.ADMIN_EMAIL || "socialsprouts1@gmail.com";
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    console.error("Error: Set ADMIN_PASSWORD in your .env.local before running seed");
    process.exit(1);
  }
  const hashedPassword = await bcrypt.hash(password, 12);

  // Check if admin already exists
  const { data: existingAdmin } = await supabaseAdmin
    .from("admins")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingAdmin) {
    console.log("Admin user already exists. Updating password...");
    const { error: updateError } = await supabaseAdmin
      .from("admins")
      .update({ password: hashedPassword })
      .eq("email", email);

    if (updateError) {
      console.error("Failed to update admin:", updateError);
    } else {
      console.log("Admin password updated successfully!");
    }
  } else {
    const { error: insertError } = await supabaseAdmin
      .from("admins")
      .insert({
        email,
        password: hashedPassword,
      });

    if (insertError) {
      console.error("Failed to seed admin:", insertError);
    } else {
      console.log("Admin user seeded successfully!");
    }
  }

  // 2. Seed Services
  console.log("Checking services...");
  const { data: existingServices, error: fetchError } = await supabaseAdmin
    .from("services")
    .select("title");

  if (fetchError) {
    console.error("Failed to fetch existing services:", fetchError);
    return;
  }

  if (existingServices && existingServices.length > 0) {
    console.log(`Services table already has ${existingServices.length} records. Skipping service seed to prevent duplication.`);
  } else {
    console.log(`Inserting ${SERVICES.length} default services...`);
    const { error: insertServicesError } = await supabaseAdmin
      .from("services")
      .insert(SERVICES);

    if (insertServicesError) {
      console.error("Failed to seed services:", insertServicesError);
    } else {
      console.log("Services seeded successfully!");
    }
  }

  console.log("Seeding process completed!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
