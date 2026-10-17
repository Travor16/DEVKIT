'use client';

import { useState, useEffect, useRef } from 'react';
import ToolLayout from '@/components/ToolLayout';
import CopyButton from '@/components/CopyButton';

export default function AudioToText() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check if we are in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Initialize SpeechRecognition if available
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError(
        'Web Speech API is not supported in this browser. Please try Chrome, Edge, or Safari.'
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript((prev) => prev + finalTranscript);
    };

    recognition.onend = () => {
      // Simply set to false, no auto-restart to avoid conflicts with manual stop
      setIsListening(false);
    };

    recognition.onerror = (event: SpeechRecognitionError) => {
      // Suppress 'aborted' errors as they are expected when stopping manually
      if (event.error === 'aborted') {
        return;
      }
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setError(
          'Microphone access was denied. Please allow microphone access in your browser settings and refresh the page.'
        );
      } else if (event.error === 'audio-capture') {
        setError(
          'No microphone was found. Please ensure a microphone is connected and not muted.'
        );
      } else if (event.error === 'network') {
        setError(
          'Network error occurred. Please check your internet connection and try again.'
        );
      } else {
        setError(`Speech recognition error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, []); // Empty deps because we only want to run once on mount

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (err) {
        console.log("Recognition already stopped:", err);
      }
    } else {
      try {
        setError(null);
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.log("Recognition already running, restarting gracefully:", err);
      }
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setError(null);
  };

  const exportToTxt = () => {
    if (!transcript.trim()) return;
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcription.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToJson = () => {
    if (!transcript.trim()) return;
    const json = {
      transcript: transcript,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcription.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="Speech-to-Text Audio Dictator"
      description="Dictate speech to text in real-time using your browser's built-in Web Speech API. 100% serverless, zero cost."
    >
      <div className="space-y-6">
        {/* Recording Controller */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <button
              id="mic-btn"
              onClick={toggleListening}
              disabled={!!error}
              className={`w-20 h-20 rounded-full border border-zinc-800/80 flex items-center justify-center transition-all duration-200 ${
                isListening ? 'animate-ping bg-emerald-500/20' : ''
              }`}
            >
              🎤
            </button>
          </div>
          <p className="mt-2 text-zinc-400">
            {isListening ? 'Listening... Speak now' : 'Click to start recording'}
          </p>
          <button
            onClick={clearTranscript}
            className="mt-2 text-xs font-medium text-zinc-400 hover:text-[#0071E3] transition-colors"
          >
            Clear Transcript
          </button>
        </div>

        {/* Transcript Display */}
        <div className="mt-4">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Transcription:
            </span>
            <button
              onClick={exportToTxt}
              className="text-xs font-medium text-zinc-400 hover:text-[#0071E3] transition-colors"
            >
              Export to Plain Text (.txt)
            </button>
            <button
              onClick={exportToJson}
              className="text-xs font-medium text-zinc-400 hover:text-[#0071E3] transition-colors ml-2"
            >
              Convert to Structured JSON Layout
            </button>
          </div>
          <div className="bg-black/50 border border-zinc-800/80 rounded-xl p-4 min-h-24">
            <textarea
              value={transcript}
              readOnly
              className="w-full h-full bg-black/50 border-none font-mono text-sm text-zinc-400 focus:outline-none focus:ring-0 resize-none p-0"
              style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
            />
          </div>
        </div>
      </div>

      {/* Floating Error Panel */}
      {error && (
        <div className="fixed bottom-2 right-2 z-50 bg-zinc-900/20 border border-zinc-800/50 text-zinc-400 rounded-lg p-4 max-w-xs">
          <p className="font-medium mb-1">Audio Error</p>
          <p className="text-sm font-mono">{error}</p>
        </div>
      )}
    </ToolLayout>
  );
}