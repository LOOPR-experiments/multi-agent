'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isActive: boolean;
}

// Mock participants for demo
const MOCK_PARTICIPANTS: Participant[] = [
  {
    id: '1',
    name: 'John Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    isActive: true,
  },
  {
    id: '2',
    name: 'Jane Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    isActive: true,
  },
  {
    id: '3',
    name: 'Bob Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    isActive: false,
  },
];

export default function CollaborativeSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  const startSession = () => {
    const newSessionId = Math.random().toString(36).substring(7);
    setSessionId(newSessionId);
    setIsSharing(true);
    // Add mock participants after a delay
    setTimeout(() => {
      setParticipants(MOCK_PARTICIPANTS);
    }, 1000);
  };

  const copyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/session/${sessionId}`);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel p-4 shadow-xl border border-[var(--panel-border)]"
      >
        {!isSharing ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="btn-primary flex items-center gap-2"
            onClick={startSession}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Start Collaborative Session
          </motion.button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[var(--text-primary)] font-semibold">Live Session</h3>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse"></span>
                <span className="text-sm text-[var(--text-secondary)]">Active</span>
              </span>
            </div>
            
            <div className="flex -space-x-2 overflow-hidden py-2">
              {participants.map((participant) => (
                <motion.div
                  key={participant.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative inline-block"
                  title={participant.name}
                >
                  <Image
                    src={participant.avatar}
                    alt={participant.name}
                    width={32}
                    height={32}
                    className="rounded-full border-2 border-[var(--panel)]"
                  />
                  {participant.isActive && (
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-[var(--primary)] rounded-full ring-2 ring-[var(--panel)]"></span>
                  )}
                </motion.div>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="w-8 h-8 rounded-full bg-[var(--panel)] border-2 border-[var(--panel-border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors relative -ml-1"
                title="Invite more participants"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </motion.button>
            </div>

            <div className="relative">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={sessionId ? `${typeof window !== 'undefined' ? window.location.origin : ''}/session/${sessionId}` : ''}
                  readOnly
                  className="input-field text-sm flex-1 pr-20"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="btn-secondary text-sm absolute right-1 top-1 bottom-1"
                  onClick={copyLink}
                >
                  {showCopied ? 'Copied!' : 'Copy'}
                </motion.button>
              </div>
            </div>

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="text-sm text-[var(--accent)] hover:text-[var(--primary)] transition-colors"
                onClick={() => setIsSharing(false)}
              >
                End Session
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
} 