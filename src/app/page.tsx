'use client';

import {
  Search,
  ImagePlus,
  Shapes,
  Code,
  Terminal,
  Lock,
  Zap,
  Mic,
  BarChart2,
  FileText,
  Hash,
  Download,
  Link as LinkIcon,
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [search, setSearch] = useState('');

  // List of tools we have built (present in src/app/tools)
  const builtTools = new Set([
    'json-formatter',
    'base64-converter',
    'markdown-preview',
    'image-converter',
    'audio-to-text',
    'data-shifter',
    'url-transmuter',
    'xml-beautifier',
    'sql-formatter',
    'css-optimizer',
    'jwt-decoder',
    'uuid-generator',
    'password-generator',
    'hash-calculator',
    'regex-tester',
    'html-entity-swapper',
  ]);

  // Define the categories and tools as per the instruction
  const categories = [
    {
      title: 'Converters & Data Shifters',
      tools: [
        {
          name: 'Image-to-Anything Studio',
          href: '/tools/image-converter',
          description: 'Convert image data arrays to WebP, data URLs, or raw JSON color matrices.',
          icon: ImagePlus,
          built: true,
        },
        {
          name: 'Data Format Shifter',
          href: '/tools/data-shifter',
          description: 'Seamless translation from JSON to CSV format, or CSV text blocks back into a pure JSON Array layout.',
          icon: Shapes,
          built: true,
        },
        {
          name: 'Base64 String Encoder/Decoder',
          href: '/tools/base64-converter',
          description: 'Translate plain text scripts back and forth into Base64 format strings.',
          icon: Code,
          built: true,
        },
        {
          name: 'URL Syntax Transmuter',
          href: '/tools/url-transmuter',
          description: 'Instantly encode or decode query parameters and URI symbols safely.',
          icon: LinkIcon,
          built: true,
        },
      ],
    },
    {
      title: 'Formatters & Validators',
      tools: [
        {
          name: 'JSON Engine Validator',
          href: '/tools/json-formatter',
          description: 'Instant multi-line tree beautifier, minifier, and lint-check inspector.',
          icon: Code,
          built: true,
        },
        {
          name: 'XML Code Beautifier',
          href: '/tools/xml-beautifier',
          description: 'Organize tag layers and validate strict XML schema integrity rules.',
          icon: Code,
          built: true,
        },
        {
          name: 'SQL Script Formatter',
          href: '/tools/sql-formatter',
          description: 'Clean up nested database queries, capitalizing syntax flags like SELECT, JOIN, and WHERE automatically.',
          icon: Terminal,
          built: true,
        },
        {
          name: 'CSS Architecture Optimizer',
          href: '/tools/css-optimizer',
          description: 'Minify loose stylesheet templates or organize rules with clean indentations.',
          icon: Code,
          built: true,
        },
      ],
    },
    {
      title: 'Security & Generator Components',
      tools: [
        {
          name: 'JWT Cryptography Decoder',
          href: '/tools/jwt-decoder',
          description: 'Safely unpack cryptographic JSON Web Tokens to preview header and payload structures entirely browser-side.',
          icon: Lock,
          built: true,
        },
        {
          name: 'UUID / GUID Batch Generator',
          href: '/tools/uuid-generator',
          description: 'Instantly generate randomized version-4 identity keys with quick clip-copy buttons.',
          icon: Zap,
          built: true,
        },
        {
          name: 'Secure Password Matrix',
          href: '/tools/password-generator',
          description: 'Generate complex passwords with precise parameter toggles (length, digits, special symbols).',
          icon: Lock,
          built: true,
        },
        {
          name: 'Hash/Checksum Calculator',
          href: '/tools/hash-calculator',
          description: 'Generate instant security checksum hashes (MD5, SHA-1, SHA-256) from raw input text blocks.',
          icon: Hash,
          built: true,
        },
      ],
    },
    {
      title: 'Text & Development Utilities',
      tools: [
        {
          name: 'Speech-to-Text Audio Dictator',
          href: '/tools/audio-to-text',
          description: 'Serverless, instant web microphone dictation module typing files continuously.',
          icon: Mic,
          built: true,
        },
        {
          name: 'Live Markdown Documentation Workspace',
          href: '/tools/markdown-preview',
          description: 'Side-by-side rich text render preview window for markdown writing sheets.',
          icon: FileText,
          built: true,
        },
        {
          name: 'Regex Testing Environment',
          href: '/tools/regex-tester',
          description: 'Type raw regular expression strings to test matches against text inputs with immediate color highlighting.',
          icon: Search,
          built: true,
        },
        {
          name: 'HTML Entity Entity Swapper',
          href: '/tools/html-entity-swapper',
          description: 'Convert special characters into clean HTML entity codes or escape tags safely.',
          icon: Code,
          built: true,
        },
      ],
    },
  ];

  // Filter categories and tools based on search
  const filteredCategories = categories
    .map(category => ({
      ...category,
      tools: category.tools
        .filter(tool =>
          tool.name.toLowerCase().includes(search.toLowerCase()) ||
          tool.description.toLowerCase().includes(search.toLowerCase())
        )
    }))
    .filter(category => category.tools.length > 0);

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-0">
          DevKit
        </h1>
        <div className="relative flex items-center gap-3 w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search tools... [Ctrl + K]"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-zinc-900/30 border border-zinc-800/80 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus-ring-[#0071E3]/20"
          />
        </div>
      </div>

      <p className="text-zinc-400 text-lg md:text-xl font-normal max-w-2xl">
        A collection of fast, client-side developer tools that run entirely in the browser.
        Zero cost, zero setup, maximum productivity.
      </p>

      {filteredCategories.map(category => (
        <div key={category.title} className="space-y-6">
          <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
            {category.title}
            <span className="text-xs bg-[#0071E3]/20 text-[#0071E3] rounded-full px-2 py-0.5">
              {category.tools.length}
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {category.tools.map(tool => (
              <Link
                key={tool.name}
                href={tool.href}
                className={`block group hover:border-zinc-700 transition-colors`}
              >
                <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl overflow-hidden p-4 hover:border-zinc-700 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <tool.icon className="h-5 w-5 text-[#0071E3]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{tool.name}</h3>
                      <p className="mt-1 text-zinc-400 line-clamp-2">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <span className="text-zinc-400 hover:text-[#0071E3] transition-colors font-medium">
                      Launch Tool →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      {filteredCategories.length === 0 && (
        <p className="text-zinc-400 text-center py-8">
          No tools match your search. Try a different query.
        </p>
      )}
    </div>
  );
}