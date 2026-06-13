"use client";

import { TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const products = [
  { name: "Wireless Headphones Pro", views: 1245, clicks: 432, conversions: 87, rate: "20.1%" },
  { name: "Smart Watch Series 5", views: 987, clicks: 356, conversions: 62, rate: "17.4%" },
  { name: "Running Shoes Ultra", views: 876, clicks: 298, conversions: 54, rate: "18.1%" },
  { name: "Organic Face Cream", views: 754, clicks: 267, conversions: 48, rate: "18.0%" },
  { name: "Bluetooth Speaker Mini", views: 698, clicks: 234, conversions: 41, rate: "17.5%" },
  { name: "Yoga Mat Premium", views: 654, clicks: 212, conversions: 38, rate: "17.9%" },
  { name: "LED Desk Lamp", views: 587, clicks: 189, conversions: 32, rate: "16.9%" },
  { name: "Stainless Water Bottle", views: 543, clicks: 176, conversions: 28, rate: "15.9%" },
];

export function TopProductsTable() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Top Products via AI</CardTitle>
            <CardDescription>
              Products most frequently recommended and clicked through chat
            </CardDescription>
          </div>
          <Badge variant="secondary" className="gap-1">
            <TrendingUp className="h-3 w-3" />
            Last 30 days
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Chat Views</TableHead>
              <TableHead className="text-right">Clicks</TableHead>
              <TableHead className="text-right">Conversions</TableHead>
              <TableHead className="text-right">Conv. Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.name}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-right">{product.views.toLocaleString()}</TableCell>
                <TableCell className="text-right">{product.clicks.toLocaleString()}</TableCell>
                <TableCell className="text-right">{product.conversions}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary">{product.rate}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
