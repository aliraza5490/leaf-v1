export interface QuickReply {
  id: string;
  label: string;
  text: string;
}

export const quickReplies: QuickReply[] = [
  {
    id: "qr1",
    label: "Greeting",
    text: "Hi! How can I help you today?",
  },
  {
    id: "qr2",
    label: "Checking",
    text: "Let me check that for you right away.",
  },
  {
    id: "qr3",
    label: "Thanks",
    text: "Thanks for your patience!",
  },
  {
    id: "qr4",
    label: "Options",
    text: "Here are some options I found:",
  },
  {
    id: "qr5",
    label: "Anything else",
    text: "Is there anything else I can help with?",
  },
  {
    id: "qr6",
    label: "Order confirmed",
    text: "Your order has been confirmed. You'll receive a confirmation email shortly.",
  },
  {
    id: "qr7",
    label: "Return policy",
    text: "Our return policy allows returns within 30 days of purchase. Items must be in original condition with tags attached.",
  },
  {
    id: "qr8",
    label: "Escalate",
    text: "Let me connect you with a specialist who can better assist you with this.",
  },
];
