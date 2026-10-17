'use client';

export default function About() {
  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="mb-6 text-4xl font-bold tracking-tight">
          About DevKit
        </h1>
        <p className="text-zinc-400 text-base leading-relaxed mb-6">
          DevKit is a highly responsive compilation of zero-latency utility tools engineered natively for programmers, security experts, and non-technical asset operators.
        </p>
        <p className="text-zinc-400 text-base leading-relaxed mb-6">
          Privacy Assurance: 100% of data processing routines—including image transformations, code formats, and cryptographic token un-packing—occur strictly client-side inside the user's browser runtime memory. No data buffers are ever sent to remote server databases.
        </p>
        <p className="text-zinc-400 text-base leading-relaxed">
          All tools execute entirely in-browser, ensuring your data never leaves your device. This guarantees confidentiality, security, and instant responsiveness without any server dependency.
        </p>
      </div>
    </div>
  );
}