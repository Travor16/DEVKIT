import './globals.css';
import type { Metadata } from 'next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'DevKit - Free Developer Utilities',
  description: 'A collection of fast, client-side developer tools that run entirely in the browser. Zero cost, zero setup, maximum productivity.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="bg-black min-h-flex flex-col text-white antialiased font-sans">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}