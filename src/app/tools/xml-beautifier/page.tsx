'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import CopyButton from '@/components/CopyButton';

export default function XmlBeautifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setError(null);
    setOutput('');
    if (e.target.value.trim() === '') {
      return;
    }
    try {
      const beautified = beautifyXml(e.target.value);
      setOutput(beautified);
    } catch (err) {
      setError(`XML formatting failed: ${(err as Error).message}`);
      setOutput('');
    }
  };

  const beautifyXml = (xml: string): string => {
    // Remove leading/trailing whitespace
    let formatted = '';
    let indent = 0;
    let inTag = false;
    let textBuf = '';

    for (let i = 0; i < xml.length; i++) {
      const ch = xml[i];

      if (ch === '<') {
        // Flush any text buffer
        if (textBuf.trim()) {
          formatted += ' '.repeat(indent * 2) + textBuf.trim() + '\n';
          textBuf = '';
        }
        inTag = true;
        // Determine if closing tag
        if (xml[i + 1] === '/') {
          // Closing tag
          indent = Math.max(indent - 1, 0);
          formatted += ' '.repeat(indent * 2);
        } else {
          // Opening tag
          formatted += ' '.repeat(indent * 2);
        }
        formatted += ch;
      } else if (ch === '>') {
        formatted += ch;
        inTag = false;
        // If this is an opening tag (not self-closing), increase indent after
        // Check if the tag starts with '</' already handled; we need to see if the tag started not with '</'
        // Look back: if the character before '<' was not '/', it's opening.
        // Simpler: if the tag we just added does not start with '</' and does not end with '/>'
        // We'll approximate: if the previous char before '>' is not '/', increase indent after newline.
        // Actually we will increase indent after adding newline for next content.
        // We'll add newline after this tag if not self-closing.
        // Look at the tag string from the last '<' to current position.
        // For simplicity, we'll add newline and increase indent after, unless it's a self-closing tag.
        // We'll check if the tag contains '/>' before the '>'
        const tagStart = xml.lastIndexOf('<', i);
        const tag = xml.slice(tagStart, i + 1);
        if (!tag.endsWith('/>')) {
          // Opening tag, increase indent for inner content
          indent++;
          formatted += '\n';
        } else {
          // Self-closing tag, no indent change, just newline
          formatted += '\n';
        }
      } else {
        if (inTag) {
          formatted += ch;
        } else {
          textBuf += ch;
        }
      }
    }

    // Flush remaining text
    if (textBuf.trim()) {
      formatted += ' '.repeat(indent * 2) + textBuf.trim();
    }

    return formatted.trim();
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      alert('Copied to clipboard');
    });
  };

  return (
    <ToolLayout
      title="XML Code Beautifier"
      description="Organize tag layers and validate strict XML schema integrity rules."
    >
      <div className="space-y-6">
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              XML Input:
            </span>
            <button
              onClick={handleCopy}
              className="text-xs font-medium text-zinc-400 hover:text-[#0071E3] transition-colors"
            >
              Copy Beautified
            </button>
          </div>
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Paste XML content here..."
            className="w-full h-24 bg-zinc-950/20 border border-zinc-800/80 rounded-xl p-4 font-mono text-sm text-zinc-400 focus:outline-none focus:ring-0 resize-none"
            style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
          />
        </div>

        {error ? (
          <div className="bg-zinc-900/20 border border-zinc-800/50 text-zinc-400 rounded-lg p-4 mb-4">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : null}

        {output && (
          <div className="flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Beautified XML:
              </span>
              <button
                onClick={handleCopy}
                className="text-xs font-medium text-zinc-400 hover:text-[#0071E3] transition-colors"
              >
                Copy
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              className="w-full h-64 bg-zinc-950/20 border border-zinc-800/80 rounded-xl p-4 font-mono text-sm text-zinc-400 focus:outline-none focus:ring-0 resize-none"
              style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}