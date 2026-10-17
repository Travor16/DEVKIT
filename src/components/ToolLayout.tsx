import Link from 'next/link';

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function ToolLayout({ title, description, children }: ToolLayoutProps) {
  return (
    <>
      <div className="pt-12 pb-8 border-b border-zinc-900">
        <div className="mb-4 flex items-center gap-2 text-sm text-zinc-400">
          <Link href="/" className="hover:text-zinc-300 transition-colors">
            Home
          </Link>
          <span className="text-zinc-500">{'>'}</span>
          <span className="font-medium">{title}</span>
        </div>
        <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-white">{title}</h1>
        <p className="text-zinc-400 text-base max-w-3xl leading-relaxed">{description}</p>
      </div>
      <div className="space-y-6">{children}</div>
    </>
  );
}