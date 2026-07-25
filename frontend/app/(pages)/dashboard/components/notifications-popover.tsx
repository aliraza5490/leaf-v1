"use client";

import { useState } from "react";
import {
  Bell,
  MessageSquare,
  Users,
  AlertCircle,
  AtSign,
  Settings,
  CheckCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { mockNotifications } from "@/lib/notifications/mock-data";
import type { Notification, NotificationType } from "@/types/notification";

const notificationIcons: Record<NotificationType, React.ElementType> = {
  conversation: MessageSquare,
  visitor: Users,
  escalation: AlertCircle,
  team: AtSign,
  system: Settings,
};

const notificationIconColors: Record<NotificationType, string> = {
  conversation: "text-primary",
  visitor: "text-blue-500",
  escalation: "text-destructive",
  team: "text-purple-500",
  system: "text-muted-foreground",
};

function NotificationItem({ notification }: { notification: Notification }) {
  const Icon = notificationIcons[notification.type];
  const iconColor = notificationIconColors[notification.type];

  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50",
        !notification.read && "bg-muted/30"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted",
          iconColor
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-tight">
            {notification.title}
          </p>
          {!notification.read && (
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {notification.description}
        </p>
        <p className="text-xs text-muted-foreground">{notification.time}</p>
      </div>
    </div>
  );
}

export function NotificationsPopover() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">Notifications</TooltipContent>
      </Tooltip>

      <PopoverContent align="end" className="w-80 p-0" collisionPadding={8} sideOffset={8}>
        <div className="flex flex-col max-h-96">
          <div className="flex items-center justify-between px-4 py-3 shrink-0">
            <h4 className="text-sm font-semibold">Notifications</h4>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto px-2 py-1 text-xs"
                onClick={markAllAsRead}
              >
                <CheckCheck className="mr-1 h-3 w-3" />
                Mark all read
              </Button>
            )}
          </div>
          <Separator />
          <ScrollArea className="h-72">
            <div className="flex flex-col gap-1 p-2">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No notifications
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
          <Separator />
          <div className="p-2 shrink-0">
            <Button variant="ghost" className="w-full justify-start text-xs" size="sm">
              View all notifications
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
