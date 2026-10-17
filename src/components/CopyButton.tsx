import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  size?: 'sm' | 'md';
  className?: string;
}

export default function CopyButton({ text, size = 'md', className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-md p-2 transition-colors ${
        size === 'sm' ? 'text-xs' : 'text-sm'
      } ${className || ''}`}
    >
      {copied ? (
        <Check className="h-4 w-4 text-emerald-400" />
      ) : (
        <Copy className="h-4 w-4 text-slate-400" />
      )}
      <span>{copied ? 'Copied!' : 'Copy'}</span>
    </button>
  );
}