"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ChatMessageContent } from "@/components/system/chat-message-content";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const SESSION_KEY = "portfolio_chat_session";
const MESSAGES_KEY = "portfolio_chat_messages";
const MESSAGE_COUNT_KEY = "portfolio_chat_message_count";
const MAX_SESSION_MESSAGES = 50;
const DIRECT_CONTACT_MESSAGE =
  "This chat session has reached its message limit. Please contact Hector directly by email at mern2025@outlook.com, WhatsApp at +1 (856) 495-1739, Telegram at @yesteru, or Microsoft Teams on request.";
const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi, I am Hector's Assistant. Ask me anything about Hector, his experience, or ordering a service. All messages in this chat will be sent directly to Hector. If you want to contact him directly, use email at mern2025@outlook.com, WhatsApp at +1 (856) 495-1739, Telegram at @yesteru, or Microsoft Teams on request.",
};

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readCookie(name: string) {
  if (typeof document === "undefined") {
    return "";
  }

  return document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split("=")[1];
}

function writeSessionCookie(sessionId: string) {
  document.cookie = `${SESSION_KEY}=${sessionId}; max-age=${60 * 60 * 24 * 30}; path=/; samesite=lax`;
}

export function FloatingActionButton() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedSessionId = localStorage.getItem(SESSION_KEY) || readCookie(SESSION_KEY) || createId();
    const storedMessages = localStorage.getItem(MESSAGES_KEY);
    const storedMessageCount = Number(localStorage.getItem(MESSAGE_COUNT_KEY));

    setSessionId(storedSessionId);
    writeSessionCookie(storedSessionId);
    setUserMessageCount(Number.isFinite(storedMessageCount) ? storedMessageCount : 0);

    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages) as ChatMessage[];

        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages);
        }
      } catch {
        localStorage.removeItem(MESSAGES_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages.slice(-20)));
  }, [messages]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    };

    const animationFrame = requestAnimationFrame(scrollToBottom);
    const timeout = window.setTimeout(scrollToBottom, 180);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.clearTimeout(timeout);
    };
  }, [open, messages, loading]);

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem(SESSION_KEY, sessionId);
      writeSessionCookie(sessionId);
    }
  }, [sessionId]);

  useEffect(() => {
    localStorage.setItem(MESSAGE_COUNT_KEY, String(userMessageCount));
  }, [userMessageCount]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = input.trim();

    if (!content || loading) {
      return;
    }

    if (userMessageCount >= MAX_SESSION_MESSAGES) {
      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: "assistant",
          content: DIRECT_CONTACT_MESSAGE,
        },
      ]);
      setInput("");
      return;
    }

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content,
    };
    const nextMessages = [...messages, userMessage];
    const nextUserMessageCount = userMessageCount + 1;

    setInput("");
    setMessages(nextMessages);
    setUserMessageCount(nextUserMessageCount);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          messageCount: nextUserMessageCount,
          messages: nextMessages.map(({ role, content: messageContent }) => ({ role, content: messageContent })),
        }),
      });
      const data = (await response.json()) as { reply?: string; sessionId?: string; error?: string };

      if (!response.ok || !data.reply) {
        throw new Error(data.error || "Hector's Assistant is unavailable right now.");
      }

      const reply = data.reply;

      if (data.sessionId) {
        setSessionId(data.sessionId);
      }

      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: "assistant",
          content: reply,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: "assistant",
          content: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-24 z-50">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="mb-4 flex h-[34rem] w-[calc(100vw-7rem)] max-w-sm flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-background/95 shadow-2xl shadow-black/30 backdrop-blur-2xl light:border-slate-200 light:bg-white/95 sm:w-[calc(100vw-2rem)]"
          >
            <div className="flex items-center justify-between border-b border-white/10 p-4 light:border-slate-200">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-amber-300 text-slate-950 shadow-[0_0_18px_rgba(251,191,36,0.28)]">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-sora text-sm font-semibold text-foreground">Hector&apos;s Assistant</p>
                  <p className="text-xs text-muted-foreground">Messages go directly to Hector</p>
                </div>
              </div>
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition hover:text-foreground light:border-slate-200 light:bg-slate-900/5"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
              {messages.map((message) => (
                <div key={message.id} className={message.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={
                      message.role === "user"
                        ? "max-w-[82%] rounded-3xl rounded-br-lg bg-amber-300 px-4 py-3 text-sm leading-6 text-slate-950"
                        : "max-w-[86%] rounded-3xl rounded-bl-lg border border-white/10 bg-white/10 px-4 py-3 text-sm leading-6 text-muted-foreground light:border-slate-200 light:bg-slate-900/5"
                    }
                  >
                    {message.role === "assistant" ? <ChatMessageContent content={message.content} /> : message.content}
                  </div>
                </div>
              ))}
              {loading ? (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-3 text-sm text-muted-foreground light:border-slate-200 light:bg-slate-900/5">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking
                  </div>
                </div>
              ) : null}
              <div ref={messagesEndRef} />
            </div>

            <form className="border-t border-white/10 p-4 light:border-slate-200" onSubmit={handleSubmit}>
              <div className="flex items-end gap-2 rounded-3xl border border-white/10 bg-white/5 p-2 light:border-slate-200 light:bg-slate-900/5">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      event.currentTarget.form?.requestSubmit();
                    }
                  }}
                  rows={1}
                  placeholder="Ask about projects, skills, or contact..."
                  className="no-scrollbar max-h-24 min-h-10 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-300 text-slate-950 transition hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50"
                  aria-label="Send message"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        className="ml-auto grid h-14 w-14 place-items-center rounded-full bg-amber-300 text-slate-950 shadow-[0_0_22px_rgba(251,191,36,0.36)]"
        aria-label={open ? "Close Hector's Assistant" : "Open Hector's Assistant"}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.45 }}
        whileHover={{ y: -4, scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>
    </div>
  );
}
