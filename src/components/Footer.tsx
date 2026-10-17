import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        {/* Left: Copyright */}
        <p className="text-xs text-zinc-500">
          © {new Date().getFullYear()} DevKit. All rights reserved.
        </p>

        {/* Right: Legal links */}
        <div className="flex items-center space-x-4">
          <Link
            href="/privacy"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}