'use client';

import { useState, useRef } from 'react';
import ToolLayout from '@/components/ToolLayout';
import CopyButton from '@/components/CopyButton';

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [output, setOutput] = useState<string>('');
  const [outputType, setOutputType] = useState<'data-url' | 'json' | 'converted-file'>('data-url');
  const [isConverting, setIsConverting] = useState(false);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const droppedRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    droppedRef.current!.classList.remove('border-[#0071E3]', 'bg-zinc-900/30');
    const files = e.dataTransfer.files;
    if (files.length === 0) return;
    const imgFile = files[0];
    if (!imgFile.type.match(/image\/(png|jpeg|jpg|svg\+xml|webp)/)) {
      alert('Please upload a valid image file (PNG, JPG, SVG, WebP)');
      return;
    }
    setFile(imgFile);
    setPreviewUrl(URL.createObjectURL(imgFile));
    // Reset outputs
    setOutput('');
    setOutputType('data-url');
    setConvertedBlob(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    droppedRef.current!.classList.add('border-[#0071E3]', 'bg-zinc-900/30');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('border-[#0071E3]', 'bg-zinc-900/30');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files.length === 0) return;
    const imgFile = files[0];
    if (!imgFile.type.match(/image\/(png|jpeg|jpg|svg\+xml|webp)/)) {
      alert('Please upload a valid image file (PNG, JPG, SVG, WebP)');
      return;
    }
    setFile(imgFile);
    setPreviewUrl(URL.createObjectURL(imgFile));
    setOutput('');
    setOutputType('data-url');
    setConvertedBlob(null);
    e.target.value = ''; // reset input
  };

  const handleClickDropZone = () => {
    if (!file) {
      fileInputRef.current?.click();
    }
  };

  const convertToDataUrl = async () => {
    if (!file) return;
    setIsConverting(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Expecting data:image/png;base64,...
          resolve(result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      setOutput(base64);
      setOutputType('data-url');
      setConvertedBlob(null);
    } finally {
      setIsConverting(false);
    }
  };

  const convertToJson = async () => {
    if (!file) return;
    setIsConverting(true);
    try {
      // Create an image to get dimensions
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await img.decode();
      const { width, height } = img;
      const json = {
        width,
        height,
        size: file.size,
        type: file.type,
        name: file.name,
      };
      setOutput(JSON.stringify(json, null, 2));
      setOutputType('json');
      setConvertedBlob(null);
    } finally {
      setIsConverting(false);
    }
  };

  const convertToWebp = async () => {
    if (!file) return;
    setIsConverting(true);
    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      ctx.drawImage(img, 0, 0);
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error('Canvas toBlob returned null'));
          },
          'image/webp',
          0.92 // quality
        );
      });
      setConvertedBlob(blob);
      setOutput(URL.createObjectURL(blob));
      setOutputType('converted-file');
    } finally {
      setIsConverting(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      alert('Copied to clipboard');
    });
  };

  const handleDownload = () => {
    if (outputType === 'data-url' || outputType === 'json') {
      // Download as text file
      const blob = new Blob([output], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `image-convert-${outputType}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (outputType === 'converted-file' && convertedBlob) {
      const url = URL.createObjectURL(convertedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted.webp`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <ToolLayout
      title="Image-to-Anything Studio"
      description="Convert images to data URLs, JSON metadata, or next-gen formats entirely in-browser. Zero cost, zero setup, maximum productivity."
    >
      <div className="space-y-6">
        {/* Drop Zone */}
        <div
          ref={droppedRef}
          className="border border-zinc-800/80 rounded-xl p-12 text-center cursor-pointer hover:border-zinc-700 transition-colors relative"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClickDropZone}
        >
          {!file && (
            <>
              <div className="mb-4">
                <span className="h-8 w-8 text-zinc-400">
                  {<span className="text-zinc-600">🖼️</span>}
                </span>
              </div>
              <p className="text-zinc-400">Drop Image Here (PNG, JPG, SVG, WebP)</p>
              <p className="text-xs text-zinc-500 mt-2">
                or click to select
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                className="hidden"
                onChange={handleFileSelect}
              />
            </>
          )}
          {file && (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="rounded-lg max-w-full h-64 object-contain"
              />
              {/* Overlay file name */}
              <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-zinc-300 text-xs rounded px-2">
                {file.name}
              </div>
            </div>
          )}
        </div>

        {/* Conversion Options */}
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={convertToDataUrl}
            disabled={!file || isConverting}
            className="flex-1 px-4 py-2 bg-zinc-900/20 border border-zinc-800/80 rounded-xl text-zinc-400 hover:bg-zinc-800/30 transition-colors"
          >
            Convert to Data URL Link
          </button>
          <button
            onClick={convertToJson}
            disabled={!file || isConverting}
            className="flex-1 px-4 py-2 bg-zinc-900/20 border border-zinc-800/80 rounded-xl text-zinc-400 hover:bg-zinc-800/30 transition-colors"
          >
            Convert to JSON Color Matrix
          </button>
          <button
            onClick={convertToWebp}
            disabled={!file || isConverting}
            className="flex-1 px-4 py-2 bg-zinc-900/20 border border-zinc-800/80 rounded-xl text-zinc-400 hover:bg-zinc-800/30 transition-colors"
          >
            Convert to Next-Gen File Format (WebP)
          </button>
        </div>

        {/* Output Area */}
        {output || (outputType === 'converted-file' && convertedBlob) && (
          <div className="mt-6">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Output:
              </span>
              <div className="flex gap-2">
                {outputType !== 'converted-file' && (
                  <CopyButton text={output} size="sm" className="text-xs font-medium text-zinc-400 hover:text-[#0071E3] transition-colors" />
                )}
                <button
                  onClick={handleDownload}
                  className="text-xs font-medium text-zinc-400 hover:text-[#0071E3] transition-colors"
                >
                  Download File
                </button>
              </div>
            </div>
            {outputType === 'data-url' || outputType === 'json' ? (
              <textarea
                value={output}
                readOnly
                className="w-full h-96 bg-zinc-950/20 border border-zinc-800/80 rounded-xl p-4 font-mono text-sm text-zinc-400 focus:outline-none focus:ring-0 resize-none"
                style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              />
            ) : (
              <>
                {outputType === 'converted-file' && (
                  <div className="flex items-center space-x-2">
                    <span className="text-zinc-400">Converted to WebP:</span>
                    <a
                      href={output}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-zinc-400 hover:text-[#0071E3] underline"
                    >
                      Preview Converted Image
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Status */}
        {isConverting && (
          <p className="text-zinc-400 text-center">Processing...</p>
        )}
      </div>
    </ToolLayout>
  );
}