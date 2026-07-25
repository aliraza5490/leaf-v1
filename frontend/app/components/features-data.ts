import {
  MessageCircle,
  Phone,
  Package,
  Upload,
  Brain,
  Sparkles,
  LayoutDashboard,
  BarChart3,
  Building2,
  Shield,
} from "lucide-react";

export const features = [
  {
    label: "01",
    title: "Dual Interface Mode",
    description:
      "Let your customers choose how they want to interact — through a rich text chat or a live voice call, right from their browser.",
    bullets: [
      "Real-time text conversation with product cards, images, and prices",
      "Voice calling with voice-to-text and text-to-speech",
      "Chat history and session management",
      "Responsive design for mobile and desktop",
    ],
    icons: [MessageCircle, Phone],
  },
  {
    label: "02",
    title: "Product Management",
    description:
      "Import your entire catalog in minutes and keep it synced across every customer interaction automatically.",
    bullets: [
      "Bulk upload via CSV, JSON, or API",
      "Link products with descriptions, FAQs, and attributes",
      "Organize by category, tags, and custom attributes",
      "Automatic image optimization and display",
    ],
    icons: [Package, Upload],
  },
  {
    label: "03",
    title: "Intelligence & Personalization",
    description:
      "Leaf understands context, learns preferences, and delivers recommendations that feel personal — in over 50 languages.",
    bullets: [
      "AI-driven product suggestions from conversation context",
      "Custom knowledge base trained on your store data",
      "Multi-language support across 50+ languages",
      "Conversation analytics to understand customer needs",
    ],
    icons: [Brain, Sparkles],
  },
  {
    label: "04",
    title: "Store Owner Dashboard",
    description:
      "A centralized command center for managing your AI assistant, tracking performance, and understanding your customers.",
    bullets: [
      "Real-time analytics and visitor insights",
      "Product catalog and knowledge base editor",
      "Conversation logs and full transcripts",
      "Team member management and permissions",
    ],
    icons: [LayoutDashboard, BarChart3],
  },
  {
    label: "05",
    title: "Enterprise Features",
    description:
      "Scale with confidence using custom branding, API access, and enterprise-grade integrations built for growing businesses.",
    bullets: [
      "Custom branding to match your store identity",
      "Conversation routing to human agents",
      "API access for CRM, inventory, and order systems",
      "Webhooks and white-label options for resellers",
    ],
    icons: [Building2, Shield],
  },
];
