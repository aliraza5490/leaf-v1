import type { Notification } from "./types";

export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "conversation",
    title: "New conversation started",
    description: "Sarah asked about product availability for Wireless Headphones",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    type: "visitor",
    title: "High-intent visitor detected",
    description: "Visitor from New York has viewed 8 products in the last 5 minutes",
    time: "15 min ago",
    read: false,
  },
  {
    id: "3",
    type: "escalation",
    title: "Escalation required",
    description: "Customer requesting refund for order #4892 - AI unable to resolve",
    time: "1 hr ago",
    read: false,
  },
  {
    id: "4",
    type: "team",
    title: "Mike mentioned you",
    description: "Can you review the response template for shipping inquiries?",
    time: "3 hr ago",
    read: true,
  },
  {
    id: "5",
    type: "system",
    title: "Knowledge base synced",
    description: "Product catalog updated with 24 new items",
    time: "5 hr ago",
    read: true,
  },
];
