import Link from 'next/link';
import { LucideIcon, Search } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-black/80 backdrop-blur-sm border-b border-zinc-800/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand on the left */}
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity">
            DevKit
          </Link>
        </div>

        {/* Centered navigation links */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              All Tools
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              About Platform
            </Link>
          </div>
        </div>

        {/* Right-side icons: Search and GitHub */}
        <div className="flex items-center gap-6 text-zinc-400 hover:text-white transition-colors">
          <button
            className="p-2 rounded-md"
            title="Search tools"
          >
            <Search className="h-4 w-4" />
          </button>
          <Link
            href="https://github.com/yourusername/devkit"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* GitHub icon placeholder - install lucide-react@latest for GitHub icon */}
            <span className="h-4 w-4">GH</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}