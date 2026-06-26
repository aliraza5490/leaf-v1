import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

interface MarkdownProps {
  content: string;
  primaryColor?: string;
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
    <div className="relative my-3 rounded-lg overflow-hidden border border-gray-200/80 bg-gray-900 shadow-sm group">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-950/40 text-gray-400 text-[10px] font-mono border-b border-gray-800/50">
        <span className="uppercase tracking-wider font-semibold">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="font-sans font-medium text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span className="font-sans font-medium">Copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code Area */}
      <pre className="p-3 overflow-x-auto text-xs font-mono text-gray-200 leading-normal scrollbar-hide">
        <code>{code}</code>
      </pre>
    </div>
  );
}

const components: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  h1: ({ children }) => (
    <h1 className="text-base font-bold mb-2 mt-4 first:mt-0" style={{ color: 'var(--leaf-primary)' }}>
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-sm font-bold mb-1.5 mt-3 first:mt-0" style={{ color: 'var(--leaf-primary)' }}>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-semibold mb-1 mt-2.5 first:mt-0 text-gray-800">
      {children}
    </h3>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-5 mb-2.5 space-y-1 last:mb-0 marker:text-[var(--leaf-primary)]">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-5 mb-2.5 space-y-1 last:mb-0 marker:text-[var(--leaf-primary)]">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-0.5 text-sm leading-relaxed">{children}</li>,
  code: ({ children }) => {
    return (
      <code className="bg-gray-100 text-pink-600 font-mono rounded px-1.5 py-0.5 text-xs font-medium border border-gray-200/50">
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
      <pre className="bg-gray-900 text-gray-100 rounded-md p-3 my-2 overflow-x-auto text-xs">
        {children}
      </pre>
    );
  },
  blockquote: ({ children }) => (
    <blockquote
      className="border-l-4 pl-3.5 italic text-gray-600 my-2.5 bg-gray-50 py-1.5 pr-2 rounded-r"
      style={{ borderLeftColor: 'var(--leaf-primary)' }}
    >
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline font-medium hover:opacity-80 transition-opacity"
      style={{ color: 'var(--leaf-primary)' }}
    >
      {children}
    </a>
  ),
  hr: () => <hr className="border-gray-200 my-3.5" />,
  table: ({ children }) => (
    <div className="overflow-x-auto my-3 rounded-lg border border-gray-200/80 shadow-sm">
      <table className="text-xs border-collapse w-full">{children}</table>
    </div>
  ),
  tr: ({ children }) => (
    <tr className="even:bg-gray-50/50 hover:bg-gray-50/30 transition-colors">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="border-b border-gray-200 bg-gray-50/80 px-3.5 py-2 font-semibold text-left text-gray-700">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-gray-100 px-3.5 py-2 text-gray-600 last:border-0">
      {children}
    </td>
  ),
};

export function Markdown({ content, primaryColor = '#10b981' }: MarkdownProps) {
  return (
    <div style={{ '--leaf-primary': primaryColor } as React.CSSProperties}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
