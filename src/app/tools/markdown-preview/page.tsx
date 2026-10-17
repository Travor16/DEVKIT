'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';
import ToolLayout from '@/components/ToolLayout';

export default function MarkdownPreviewer() {
  const [input, setInput] = useState(`# Welcome to DevKit Markdown Previewer

## Features
- Live preview as you type
- Supports basic Markdown syntax
- Entirely client-side
- Fast and lightweight

### Example Code Block
\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\`>

- List item 1
- List item 2
- List item 3

**Bold text** and *italic text*

[Visit DevKit](https://devkit.vercel.app>`);

  // Simple Markdown to HTML conversion (client-side, no external library)
  const markdownToHtml = (markdown: string): string => {
    // Escape HTML
    let escaped = markdown
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    // Headers
    escaped = escaped.replace(/^# (.*)/gm, '<h1>$1</h1>');
    escaped = escaped.replace(/^## (.*)/gm, '<h2>$1</h2>');
    escaped = escaped.replace(/^### (.*)/gm, '<h3>$1</h3>');
    escaped = escaped.replace(/^#### (.*)/gm, '<h4>$1</h4>');
    escaped = escaped.replace(/^##### (.*)/gm, '<h5>$1</h5>');
    escaped = escaped.replace(/^###### (.*)/gm, '<h6>$1</h6>');

    // Bold and italic
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Links
    escaped = escaped.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Code blocks (triple backticks)
    escaped = escaped.replace(/```([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');

    // Inline code
    escaped = escaped.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Lists (simple)
    escaped = escaped.replace(/^\s*[-*+] (.*)/gm, '<li>$1</li>');
    escaped = escaped.replace(/^(\d+\.) (.*)/gm, '<li>$2</li>');
    // Wrap consecutive <li> in <ul> or <ol>
    escaped = escaped.replace(/(<li>.*<\/li>)(?:\s*<li>.*<\/li>)*/g, (match) => {
      if (match.startsWith('<li>') && !match.includes('<ol>')) {
        return `<ul>${match}</ul>`;
      }
      if (match.startsWith('<li>') && match.includes('<ol>')) {
        return `<ol>${match}</ol>`;
      }
      return match;
    });

    // Line breaks and paragraphs
    escaped = escaped.split('\n').map((line) => {
      if (line.trim() === '') return '<br />';
      if (!line.startsWith('<')) return `<p>${line}</p>`;
      return line;
    }).join('');

    return escaped;
  };

  const html = markdownToHtml(input);

  return (
    <ToolLayout
      title="Markdown Previewer"
      description="Live preview Markdown as you type. Clean, fast, and entirely client-side."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="mb-2 block text-slate-400">
            Markdown Input:
            <CopyButton text={input} size="sm" className="ml-2" />
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter Markdown here..."
            className="bg-slate-900 border border-slate-700 rounded-lg p-4 font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors text-white w-full h-96 resize-none"
          />
        </div>
        <div className="space-y-4">
          <label className="mb-2 block text-slate-400">
            HTML Output:
            <CopyButton text={html} size="sm" className="ml-2" />
          </label>
          <div
            dangerouslySetInnerHTML={{ __html: html }}
            className="bg-slate-900 border border-slate-700 rounded-lg p-4 min-h-96 prose prose-sm:prose-base prose-lg:prose-lg text-slate-300 dark:prose-invert"
          />
        </div>
      </div>
    </ToolLayout>
  );
}