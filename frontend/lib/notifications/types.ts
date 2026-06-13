export type NotificationType = "conversation" | "visitor" | "escalation" | "team" | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
}
