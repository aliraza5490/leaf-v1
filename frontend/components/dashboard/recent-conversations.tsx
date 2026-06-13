"use client";

import { MoreHorizontal, MessageSquare } from "lucide-react";

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

const conversations = [
  {
    id: 1,
    visitor: "John Doe",
    email: "john@example.com",
    status: "active",
    lastMessage: "Looking for running shoes",
    time: "2 min ago",
    messages: 5,
  },
  {
    id: 2,
    visitor: "Sarah Smith",
    email: "sarah@example.com",
    status: "resolved",
    lastMessage: "Thanks for the help!",
    time: "15 min ago",
    messages: 8,
  },
  {
    id: 3,
    visitor: "Mike Johnson",
    email: "mike@example.com",
    status: "active",
    lastMessage: "Do you have this in blue?",
    time: "23 min ago",
    messages: 3,
  },
  {
    id: 4,
    visitor: "Emily Davis",
    email: "emily@example.com",
    status: "waiting",
    lastMessage: "What's the return policy?",
    time: "1 hour ago",
    messages: 2,
  },
  {
    id: 5,
    visitor: "Alex Wilson",
    email: "alex@example.com",
    status: "resolved",
    lastMessage: "Order confirmed, thanks!",
    time: "2 hours ago",
    messages: 12,
  },
];

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
          <Button variant="outline" size="sm">
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
            {conversations.map((conversation) => (
              <TableRow key={conversation.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {conversation.visitor
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{conversation.visitor}</span>
                      <span className="text-xs text-muted-foreground">
                        {conversation.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStatusColor(conversation.status)}
                  >
                    {conversation.status}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                  {conversation.lastMessage}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                    <MessageSquare className="h-3 w-3" />
                    {conversation.messages}
                  </div>
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {conversation.time}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View conversation</DropdownMenuItem>
                      <DropdownMenuItem>Mark as resolved</DropdownMenuItem>
                      <DropdownMenuItem>Assign to agent</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
