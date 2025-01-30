"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import ChatFeed from "./components/ChatFeed";
import AnimatedButton from "./components/AnimatedButton";
import Image from "next/image";
import posthog from "posthog-js";

const Tooltip = ({ children, text }: { children: React.ReactNode; text: string }) => {
  return (
    <div className="relative group">
      {children}
      <span className="absolute hidden group-hover:block w-auto px-3 py-2 min-w-max left-1/2 -translate-x-1/2 translate-y-3 bg-gray-900 text-white text-xs rounded-md font-ppsupply">
        {text}
      </span>
    </div>
  );
};

export default function Home() {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [initialMessage, setInitialMessage] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle CMD+Enter to submit the form when chat is not visible
      if (!isChatVisible && (e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        const form = document.querySelector("form") as HTMLFormElement;
        if (form) {
          form.requestSubmit();
        }
      }

      // Handle CMD+K to focus input when chat is not visible
      if (!isChatVisible && (e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const input = document.querySelector(
          'input[name="message"]'
        ) as HTMLInputElement;
        if (input) {
          input.focus();
        }
      }

      // Handle ESC to close chat when visible
      if (isChatVisible && e.key === "Escape") {
        e.preventDefault();
        setIsChatVisible(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isChatVisible]);

  const startChat = useCallback(
    (finalMessage: string) => {
      setInitialMessage(finalMessage);
      setIsChatVisible(true);

      try {
        posthog.capture("submit_message", {
          message: finalMessage,
        });
      } catch (e) {
        console.error(e);
      }
    },
    [setInitialMessage, setIsChatVisible]
  );

  return (
    <AnimatePresence mode="wait">
      {!isChatVisible ? (
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* Top Navigation */}
          <nav className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Image
                src="/favicon.svg"
                alt="Open Operator"
                className="w-8 h-8"
                width={32}
                height={32}
              />
              <span className="font-ppsupply text-gray-900">Open Operator</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/browserbase/open-operator"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <button className="h-fit flex items-center justify-center px-4 py-2 rounded-md bg-[#1b2128] hover:bg-[#1d232b] gap-1 text-sm font-medium text-white border border-pillSecondary transition-colors duration-200">
                  <Image
                    src="/github.svg"
                    alt="GitHub"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  View GitHub
                </button>
              </a>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 flex flex-col items-center p-6">
            <div className="w-full max-w-[734px] flex flex-col gap-8">
              <h1 className="text-2xl font-medium text-[#1b1b1b] tracking-[-0.16px] leading-8">
                Create new query
              </h1>

              <div className="bg-white border border-[#d8d8d8] rounded-md p-3">
                <div className="flex flex-col gap-4">
                  {/* Title Input */}
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-1 px-0.5 py-1 text-base">
                      <span className="font-medium text-text-DEFAULT">Query title</span>
                      <span className="text-text-muted">- give your query a name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter a title..."
                      className="w-full px-3.5 py-1.5 border border-[#d4d4d4] rounded-md text-[15px] text-text-DEFAULT placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* URL Input */}
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-1 px-0.5 py-1 text-base">
                      <span className="font-medium text-text-DEFAULT">Production URL</span>
                      <span className="text-text-muted">- home page for your application</span>
                    </label>
                    <input
                      type="text"
                      placeholder="https://www.application.com"
                      className="w-full px-3.5 py-1.5 border border-[#d4d4d4] rounded-md text-[15px] text-text-DEFAULT placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Requirements Input */}
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-1 px-0.5 py-1 text-base">
                      <span className="font-medium text-text-DEFAULT">Requirements</span>
                      <span className="text-text-muted">- describe what you are testing</span>
                    </label>
                    <div className="relative">
                      <textarea
                        placeholder="Tell us about what you want to test or drag a file in"
                        className="w-full px-3.5 py-1.5 border border-[#d4d4d4] rounded-md text-[15px] text-text-DEFAULT placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[100px] resize-none"
                      />
                      <button className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 text-sm text-text-secondary hover:bg-gray-50 rounded">
                        <Image
                          src="/file.svg"
                          alt="Attach"
                          width={14}
                          height={14}
                          className="opacity-80"
                        />
                        <span>Attach</span>
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-4">
                    <div className="flex items-center gap-2">
                      <button className="button-secondary">
                        <Image
                          src="/file.svg"
                          alt="Save"
                          width={14}
                          height={14}
                          className="opacity-80"
                        />
                        <span>Save as draft</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-sm text-text-secondary">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Create more
                      </label>
                      <button className="button-primary px-3 py-1.5">
                        Create
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      ) : (
        <ChatFeed
          initialMessage={initialMessage}
          onClose={() => setIsChatVisible(false)}
        />
      )}
    </AnimatePresence>
  );
}
