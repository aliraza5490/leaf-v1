"use client";

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import { Check, Copy } from 'lucide-react';

interface MarkdownProps {
  content: string;
  className?: string;
}

interface PreBlockProps {
  code: string;
  language: string;
}

function PreBlock({ code, language }: PreBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative my-3 rounded-lg overflow-hidden border border-border bg-zinc-950 dark:bg-zinc-900 shadow-sm group">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900/50 dark:bg-zinc-950/40 text-zinc-400 text-[10px] font-mono border-b border-zinc-800/40">
        <span className="uppercase tracking-wider font-semibold">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-2.5 w-2.5 text-emerald-400" />
              <span className="font-sans font-medium text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-2.5 w-2.5" />
              <span className="font-sans font-medium">Copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code Area */}
      <pre className="p-3 overflow-x-auto text-xs font-mono text-zinc-200 leading-normal scrollbar-hide">
        <code>{code}</code>
      </pre>
    </div>
  );
}

const components: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed text-sm">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  h1: ({ children }) => (
    <h1 className="text-sm font-bold mb-2 mt-4 first:mt-0 text-primary">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xs font-bold mb-1.5 mt-3 first:mt-0 text-primary">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xs font-semibold mb-1 mt-2.5 first:mt-0 text-foreground">
      {children}
    </h3>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-5 mb-2.5 space-y-1 last:mb-0 marker:text-primary">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-5 mb-2.5 space-y-1 last:mb-0 marker:text-primary">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-0.5 text-sm leading-relaxed">{children}</li>,
  code: ({ children }) => {
    return (
      <code className="bg-muted text-destructive font-mono rounded px-1.5 py-0.5 text-[11px] font-medium border border-border/40">
        {children}
      </code>
    );
  },
  pre: ({ children }) => {
    const child = React.Children.toArray(children)[0];
    if (React.isValidElement(child) && child.type === 'code') {
      const codeProps = child.props as any;
      const codeText = String(codeProps.children || '').replace(/\n$/, '');
      const className = codeProps.className || '';
      const match = /language-(\w+)/.exec(className);
      const language = match ? match[1] : 'code';
      return <PreBlock code={codeText} language={language} />;
    }
    return (
      <pre className="bg-muted text-foreground rounded-md p-3 my-2 overflow-x-auto text-xs font-mono">
        {children}
      </pre>
    );
  },
  blockquote: ({ children }) => (
    <blockquote
      className="border-l-4 border-primary/40 pl-3.5 italic text-muted-foreground my-2.5 bg-muted/30 py-1.5 pr-2 rounded-r"
    >
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline font-medium text-primary hover:opacity-80 transition-opacity"
    >
      {children}
    </a>
  ),
  hr: () => <hr className="border-border my-3.5" />,
  table: ({ children }) => (
    <div className="overflow-x-auto my-3 rounded-lg border border-border shadow-sm">
      <table className="text-xs border-collapse w-full">{children}</table>
    </div>
  ),
  tr: ({ children }) => (
    <tr className="even:bg-muted/30 hover:bg-muted/50 transition-colors">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="border-b border-border bg-muted/50 px-3.5 py-2 font-semibold text-left text-foreground">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-border/40 px-3.5 py-2 text-muted-foreground last:border-0">
      {children}
    </td>
  ),
};

export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
