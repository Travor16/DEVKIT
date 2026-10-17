# DevKit

A hyper-fast, client-side developer utility platform built with Next.js, Tailwind CSS, and deployed entirely on the client for zero hosting costs.

## Features

- **JSON Formatter & Validator**: Format, beautify, and validate JSON data instantly
- **Base64 Encoder & Decoder**: Convert strings to and from Base64 format
- **Markdown Previewer**: Live preview Markdown as you type
- **100% Client-Side**: All tools run in the browser - no server required
- **Zero Cost**: Deploy to Vercel, Netlify, or Cloudflare Pages for free
- **Fast & Lightweight**: Optimized for performance with minimal dependencies
- **Privacy Focused**: No data leaves your browser

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/) for icons

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

### Building for Production

```bash
npm run build
npm run start
```

### Deployment

This application is configured for static export (`output: 'export'` in next.config.js). To deploy:

1. Build the application: `npm run build`
2. The output will be in the `out` directory
3. Deploy the `out` directory to any static hosting service (Vercel, Netlify, Cloudflare Pages, etc.)

## Project Structure

```
devkit/
├── public/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Global layout with metadata
│   │   ├── page.tsx           # Home dashboard
│   │   └── tools/
│   │       ├── json-formatter/page.tsx
│   │       ├── base64-converter/page.tsx
│   │       └── markdown-preview/page.tsx
│   ├── components/
│   │   ├── Navbar.tsx         # Navigation bar
│   │   ├── Footer.tsx         # Footer
│   │   ├── ToolLayout.tsx     # Standard tool wrapper
│   │   └── CopyButton.tsx     # Copy-to-clipboard component
│   └── utils/
│       └── helpers.ts         # Utility functions
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── next.config.js             # Configured with output: 'export'
```

## Customization

### Adding New Tools

Follow the system prompt guidelines:

> "Act as a specialized engineering node running on DevKit layout design guidelines. Build a new completely functional file-scoped route directory component under standard directory locations matching current color hex values, text styles, input block layout rules and interactive structures. Return pure component code implementation wrapped tightly in standard typescript typings without relying on third-party cloud engines."

### Styling

The design system uses:
- **Background Primary**: `#0B0F19` (Deep Slate)
- **Background Secondary**: `#1E293B` (Dark Gray)
- **Accent / Interactive Color**: `#10B981` (Emerald Green)
- **Text Primary**: `#FFFFFF` (Pure White)
- **Text Secondary**: `#94A3B8` (Muted Gray)
- **Borders**: `#334155` (Low-contrast Line)

## License

MIT