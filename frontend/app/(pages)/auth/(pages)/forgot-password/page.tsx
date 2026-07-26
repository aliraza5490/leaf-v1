"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forgotPasswordAction } from "@/app/actions/auth";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/auth/validation";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setIsLoading(true);
    try {
      const res = await forgotPasswordAction(values);
      if (!res.success || !res.data) {
        toast.error(res.error || "Failed to send reset instructions");
        return;
      }
      toast.success(res.data.message ?? "Password reset instructions sent");
      setIsSubmitted(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-border/80 dark:border-zinc-800/80 bg-card/95 backdrop-blur-md relative z-10">
      <CardHeader className="space-y-1.5 text-center pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Reset password
        </CardTitle>
        <CardDescription className="text-sm">
          Enter your email and we&apos;ll send you reset instructions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSubmitted ? (
          <div className="flex flex-col items-center rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              If an account exists for{" "}
              <span className="font-medium text-foreground">
                {form.getValues("email")}
              </span>
              , you will receive password reset instructions shortly.
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="name@example.com"
                          autoComplete="email"
                          disabled={isLoading}
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full font-semibold shadow-md shadow-emerald-500/10" disabled={isLoading}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Send instructions
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t border-border/60 dark:border-zinc-800/80 pt-6 text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          href="/auth/login"
          className="ml-1 font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 underline-offset-4 hover:underline transition-colors"
        >
          Sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
