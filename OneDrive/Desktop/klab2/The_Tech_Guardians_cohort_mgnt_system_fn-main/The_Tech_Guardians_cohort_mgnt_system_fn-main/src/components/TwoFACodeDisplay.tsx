'use client'

import { CheckCircle, Copy } from 'lucide-react';
import { useState } from 'react';

interface TwoFACodeDisplayProps {
  code: string;
  onCopy?: () => void;
}

export default function TwoFACodeDisplay({ code, onCopy }: TwoFACodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy?.();
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">Development 2FA Code</h3>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
        >
          <Copy size={14} />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="text-center py-3">
        <div className="text-3xl font-mono font-bold text-blue-800 tracking-widest">
          {code}
        </div>
      </div>
      <p className="text-sm text-blue-700 text-center">
        Use this code for 2FA verification (Email delivery disabled in development)
      </p>
    </div>
  );
}
