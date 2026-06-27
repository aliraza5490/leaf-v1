"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal, MessageSquare } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRecentConversations } from "@/hooks/use-conversation-stats";
import { updateConversation } from "@/lib/conversations/api";
import { formatRelativeTime } from "@/lib/time-utils";

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-chart-1/20 text-chart-1 border-chart-1/30";
    case "resolved":
      return "bg-chart-2/20 text-chart-2 border-chart-2/30";
    case "waiting":
      return "bg-chart-4/20 text-chart-4 border-chart-4/30";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function RecentConversations() {
  const router = useRouter();
  const { conversations, loading, error, refetch } = useRecentConversations(5, 30000);

  const handleResolve = async (id: string) => {
    try {
      await updateConversation(id, { status: "resolved" });
      toast.success("Conversation resolved.");
      refetch();
    } catch {
      toast.error("Failed to resolve conversation.");
    }
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Conversations</CardTitle>
            <CardDescription>
              Latest visitor interactions and chat sessions
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/conversations")}
          >
            View all
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Visitor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Message</TableHead>
              <TableHead className="text-right">Messages</TableHead>
              <TableHead className="text-right">Time</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-destructive">
                  {error}
                </TableCell>
              </TableRow>
            ) : conversations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No conversations yet
                </TableCell>
              </TableRow>
            ) : (
              conversations.map((conversation) => {
                const lastMessage = conversation.messages[conversation.messages.length - 1];
                return (
                  <TableRow
                    key={conversation.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/dashboard/conversations/${conversation.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {conversation.visitor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{conversation.visitor.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {conversation.visitor.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {conversation.status !== "active" && (
                        <Badge
                          variant="outline"
                          className={getStatusColor(conversation.status)}
                        >
                          {conversation.status}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                      {lastMessage?.content || "No messages"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                        <MessageSquare className="h-3 w-3" />
                        {conversation.messages.length}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {formatRelativeTime(conversation.lastActivity)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/conversations/${conversation.id}`)}
                          >
                            View conversation
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleResolve(conversation.id)}
                          >
                            Mark as resolved
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/conversations/${conversation.id}`)}
                          >
                            Assign to agent
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
