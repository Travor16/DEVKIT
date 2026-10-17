'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import CopyButton from '@/components/CopyButton';

export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleTokenChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setToken(e.target.value);
    setError(null);
    setDecoded('');
    tryDecode(e.target.value);
  };

  const tryDecode = (jwt: string) => {
    if (!jwt.trim()) {
      setDecoded('');
      return;
    }
    const parts = jwt.split('.');
    if (parts.length < 2) {
      setError('Invalid JWT token: expected at least two parts separated by "."');
      setDecoded('');
      return;
    }
    try {
      const headerBase64 = parts[0];
      const payloadBase64 = parts[1];
      // Convert base64url to base64
      const base64UrlToBase64 = (str: string) =>
        str.replace(/-/g, '+').replace(/_/g, '/');
      const headerJson = JSON.parse(
        atob(base64UrlToBase64(headerBase64))
      );
      const payloadJson = JSON.parse(
        atob(base64UrlToBase64(payloadBase64))
      );
      setDecoded(
        `Header:\n${JSON.stringify(headerJson, null, 2)}\n\nPayload:\n${JSON.stringify(
          payloadJson,
          null,
 2
        )}`
      );
      setError(null);
    } catch (err) {
      setError(
        `Failed to decode JWT: ${(err as Error).message}. Ensure token is valid and properly encoded.`
      );
      setDecoded('');
    }
  };

  const handleCopy = () => {
    if (!decoded) return;
    navigator.clipboard.writeText(decoded).then(() => {
      alert('Copied to clipboard');
    });
  };

  return (
    <ToolLayout
      title="JWT Cryptography Decoder"
      description="Safely unpack cryptographic JSON Web Tokens to preview header and payload structures entirely browser-side."
    >
      <div className="space-y-6">
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              JWT Token:
            </span>
            <button
              onClick={handleCopy}
              className="text-xs font-medium text-zinc-400 hover:text-[#0071E3] transition-colors"
            >
              Copy Decoded
            </button>
          </div>
          <textarea
            value={token}
            onChange={handleTokenChange}
            placeholder="Paste JWT token here (header.payload.signature)..."
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

        {decoded && (
          <div className="flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Decoded JSON:
              </span>
              <button
                onClick={handleCopy}
                className="text-xs font-medium text-zinc-400 hover:text-[#0071E3] transition-colors"
              >
                Copy
              </button>
            </div>
            <textarea
              value={decoded}
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