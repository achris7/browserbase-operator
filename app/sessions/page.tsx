"use client";

import { useState } from "react";
import SessionsList from "../components/SessionsList";
import Modal from "../components/Modal";
import SessionRecording from "../components/SessionRecording";
import Image from "next/image";

export default function SessionsPage() {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <a href="/">
            <Image
              src="/quell-logo.svg"
              alt="Quell"
              width={200}
              height={50}
              className="w-48 h-auto"
              priority
              unoptimized
            />
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <SessionsList onSessionSelect={setSelectedSession} />
      </main>

      {/* Recording Modal */}
      {selectedSession && (
        <Modal onClose={() => setSelectedSession(null)}>
          <SessionRecording sessionId={selectedSession} />
        </Modal>
      )}
    </div>
  );
} 