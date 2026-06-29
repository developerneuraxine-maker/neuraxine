"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";

const RESPONSES: Record<string, string> = {
  default:
    "I'm Neuraxine AI, your intelligent automation assistant. I can help automate WhatsApp, chatbots, voice agents, and more. What would you like to automate?",
  whatsapp:
    "Our WhatsApp automation handles lead qualification, appointment booking, and follow-ups 24/7. Average response time: under 3 seconds.",
  pricing:
    "We create fully custom solutions tailored to your business. Book a free consultation and we'll design the perfect automation plan for you.",
  demo: "Great! I can schedule a free consultation for you. Just share your business name and we'll set up a personalized walkthrough.",
};

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatbotDemo() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: RESPONSES.default },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length <= 1) return; // don't scroll on initial mount
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const getResponse = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes("whatsapp")) return RESPONSES.whatsapp;
    if (lower.includes("price") || lower.includes("cost")) return RESPONSES.pricing;
    if (lower.includes("demo")) return RESPONSES.demo;
    return "That's a great question! Our AI systems can automate that workflow. Let me connect you with our team for a custom solution.";
  };

  const send = () => {
    if (!input.trim() || typing) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setTyping(true);

    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", content: getResponse(userMsg) }]);
      setTyping(false);
    }, 1200 + Math.random() * 800);
  };

  return (
    <GlassPanel className="flex flex-col h-[420px]">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <div className="h-3 w-3 rounded-full bg-neon animate-pulse" />
        <span className="text-sm font-medium text-white">Neuraxine AI Chatbot</span>
        <span className="ml-auto text-xs text-silver/40">Live Demo</span>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-neon/20 text-neon border border-neon/20"
                  : "bg-white/5 text-silver/90 border border-white/5"
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}
        {typing && (
          <div className="flex gap-1 px-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="h-2 w-2 rounded-full bg-neon/60"
              />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-white/10 p-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about automation..."
          className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-silver/30 focus:outline-none focus:border-neon/40"
        />
        <button
          onClick={send}
          className="px-5 py-2.5 rounded-full bg-neon text-black text-sm font-medium hover:shadow-[0_0_20px_rgba(198,255,0,0.3)] transition-shadow"
        >
          Send
        </button>
      </div>
    </GlassPanel>
  );
}
