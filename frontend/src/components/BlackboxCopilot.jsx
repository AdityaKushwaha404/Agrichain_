import React, { useRef, useState } from 'react';
import { useAuth, SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { aiChat } from '../api';

export default function BlackboxCopilot({ open, onClose, batchId, txHash }) {
  const { getToken, isSignedIn } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! Ask me about batches, transfers, or pricing.' }
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef(null);

  const canSend = input.trim() && isSignedIn && !busy;

  const send = async () => {
    if (!canSend) return;
    const next = [...messages, { role: 'user', content: input.trim() }];
    setMessages(next);
    setInput('');
    setBusy(true);
    try {
      const token = await getToken();
      const data = await aiChat({ messages: next.slice(-6), batchId, txHash, token });
      const answer = data?.answer || 'No answer.';
      setMessages((m) => [...m, { role: 'assistant', content: answer }]);
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Sorry, AI service failed.' }]);
    } finally {
      setBusy(false);
      setTimeout(() => scrollRef.current?.scrollTo({ top: 999999, behavior: 'smooth' }), 50);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed bottom-3 left-2 right-2 sm:left-auto sm:right-6 sm:bottom-6 z-[100] w-auto sm:w-[420px] max-w-[calc(100vw-1rem)] sm:max-w-[420px]">
      <div className="rounded-2xl shadow-2xl overflow-hidden bg-white/85 backdrop-blur-xl border border-white/50">
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-600 via-teal-500 to-green-400 text-white">
          <div className="font-semibold">AgriChain Copilot</div>
          <button onClick={onClose} className="opacity-90 hover:opacity-100">✕</button>
        </div>
        <div ref={scrollRef} className="max-h-[50vh] overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={m.role === 'assistant' ? 'text-gray-800' : 'text-gray-900'}>
              <div className={`inline-block rounded-2xl px-3 py-2 shadow-sm ${m.role === 'assistant' ? 'bg-gray-50' : 'bg-emerald-50'}`}>
                {m.content}
              </div>
            </div>
          ))}
          <SignedOut>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              Please <SignInButton mode="modal"><button className="underline text-emerald-700">log in</button></SignInButton> to use the copilot.
            </div>
          </SignedOut>
        </div>
        <SignedIn>
          <div className="flex items-center gap-2 p-3 border-t bg-white/70">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask about a batch, transfer, or price…"
              className="flex-1 rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white/80"
            />
            <button
              onClick={send}
              disabled={!canSend}
              className="rounded-xl px-4 py-2 font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 disabled:opacity-40"
            >
              {busy ? '…' : 'Send'}
            </button>
          </div>
        </SignedIn>
      </div>
    </div>
  );
}
