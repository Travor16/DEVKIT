'use client';

export default function Terms() {
  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="mb-6 text-4xl font-bold tracking-tight">
          Terms of Service
        </h1>
        <p className="text-zinc-400 text-base leading-relaxed mb-6">
          Acceptable Use: Users are fully authorized to process arbitrary data payloads, text strings, and multimedia assets for personal or enterprise commercial development workflows free of charge.
        </p>
        <p className="text-zinc-400 text-base leading-relaxed mb-6">
          Disclaimer of Warranties: The tools are provided "as is" without tracking guarantees or runtime liabilities if client-side browser calculations encounter structural validation timeouts.
        </p>
        <p className="text-zinc-400 text-base leading-relaxed">
          By using DevKit, you acknowledge that all processing occurs client-side and that the service does not guarantee error-free operation under all browser environments. You assume full responsibility for the suitability of the tools for your specific use case.
        </p>
      </div>
    </div>
  );
}