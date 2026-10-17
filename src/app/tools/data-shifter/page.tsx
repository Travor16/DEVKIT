'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import CopyButton from '@/components/CopyButton';

export default function DataShifter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [direction, setDirection] = useState<'json-to-csv' | 'csv-to-json'>('json-to-csv');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDirection(e.target.value as any);
    setInput('');
    setOutput('');
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setError(null);
    setOutput('');
  };

  const convertJsonToCsv = () => {
    setIsProcessing(true);
    setError(null);
    try {
      if (!input.trim()) {
        setOutput('');
        return;
      }
      const json = JSON.parse(input);
      let csv = '';
      if (Array.isArray(json)) {
        if (json.length === 0) {
          setOutput('');
          return;
        }
        // Assume array of objects
        const headers = Object.keys(json[0]);
        csv += headers.join(',') + '\n';
        for (const row of json) {
          const values = headers.map((h) => {
            const val = row[h];
            // Escape quotes and commas
            if (val === null || val === undefined) return '';
            const str = String(val);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
              return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
          });
          csv += values.join(',') + '\n';
        }
      } else {
        // Single object
        const headers = Object.keys(json);
        csv += headers.join(',') + '\n';
        const values = headers.map((h) => {
          const val = json[h];
          if (val === null || val === undefined) return '';
          const str = String(val);
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        });
        csv += values.join(',') + '\n';
      }
      setOutput(csv.trim());
    } catch (err) {
      setError(`Invalid JSON: ${(err as Error).message}`);
      setOutput('');
    } finally {
      setIsProcessing(false);
    }
  };

  const convertCsvToJson = () => {
    setIsProcessing(true);
    setError(null);
    try {
      if (!input.trim()) {
        setOutput('');
        return;
      }
      const lines = input.trim().split('\n');
      if (lines.length === 0) {
        setOutput('');
        return;
      }
      const headers = lines[0].split(',').map((h) => h.trim());
      const jsonArray = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;
        // Simple CSV split (no quoted commas handling)
        const values = line.split(',').map((v) => v.trim());
        const obj: Record<string, any> = {};
        for (let j = 0; j < headers.length; j++) {
          obj[headers[j]] = values[j] !== undefined ? values[j] : '';
        }
        jsonArray.push(obj);
      }
      setOutput(JSON.stringify(jsonArray, null, 2));
    } catch (err) {
      setError(`CSV parsing error: ${(err as Error).message}`);
      setOutput('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConvert = () => {
    if (direction === 'json-to-csv') {
      convertJsonToCsv();
    } else {
      convertCsvToJson();
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      alert('Copied to clipboard');
    });
  };

  const handleDownload = () => {
    if (!output) return;
    const extension = direction === 'json-to-csv' ? 'csv' : 'json';
    const mime = direction === 'json-to-csv' ? 'text/csv' : 'application/json';
    const blob = new Blob([output], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data-conversion.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="Data Format Shifter"
      description="Convert between JSON and CSV/Excel formats instantly in-browser. Perfect for cleaning data files without technical expertise."
    >
      <div className="space-y-6">
        {/* Direction Selector */}
        <div className="flex flex-col md:flex-row items-start gap-4">
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Conversion Direction:
          </label>
          <select
            value={direction}
            onChange={handleDirectionChange}
            className="bg-zinc-900/20 border border-zinc-800/80 rounded-xl px-3 py-1 text-zinc-400 focus:outline-none focus:ring-2 focus-ring-[#0071E3]/20"
          >
            <option value="json-to-csv">JSON → CSV/Excel</option>
            <option value="csv-to-json">CSV → JSON Array</option>
          </select>
        </div>

        {/* Input Area */}
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Input:
            </span>
            <button
              onClick={handleCopy}
              className="text-xs font-medium text-zinc-400 hover:text-[#0071E3] transition-colors"
            >
              Copy
            </button>
          </div>
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Paste JSON or CSV data here..."
            className="w-full h-40 bg-zinc-950/20 border border-zinc-800/80 rounded-xl p-4 font-mono text-sm text-zinc-400 focus:outline-none focus:ring-0 resize-none"
            style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
          />
        </div>

        {/* Convert Button */}
        <div className="flex justify-center">
          <button
            onClick={handleConvert}
            disabled={isProcessing}
            className="px-6 py-2 bg-zinc-900/20 border border-zinc-800/80 rounded-xl text-zinc-400 hover:bg-zinc-800/30 transition-colors disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Convert Data'}
          </button>
        </div>

        {/* Output Area */}
        {output || error && (
          <div className="mt-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Output:
              </span>
              <button
                onClick={handleDownload}
                className="text-xs font-medium text-zinc-400 hover:text-[#0071E3] transition-colors"
              >
                Download File
              </button>
            </div>
            {error && (
              <div className="bg-zinc-900/20 border border-zinc-800/50 text-zinc-400 rounded-lg p-4 mb-2">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
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