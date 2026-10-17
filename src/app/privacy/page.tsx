'use client';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="mb-6 text-4xl font-bold tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-zinc-400 text-base leading-relaxed mb-6">
          Data Collection: Because all code executes locally on client devices, zero private information, string buffers, file fragments, or audio recordings are scraped or collected.
        </p>
        <p className="text-zinc-400 text-base leading-relaxed mb-6">
          Programmatic Advertisements: Standard cookies are utilized purely by trusted upstream advertising partners (e.g., Google AdSense) to serve context-appropriate commercial layouts safely.
        </p>
        <p className="text-zinc-400 text-base leading-relaxed mb-6">
          User Data Rights: DevKit fully complies with modern internet privacy acts (GDPR, CCPA) as no personal user telemetry records exist within the environment platform shell.
        </p>
        <p className="text-zinc-400 text-base leading-relaxed">
          Since no personal data is collected, stored, or transmitted, there is nothing to delete, export, or anonymize. Your privacy is preserved by design.
        </p>
      </div>
    </div>
  );
}