import { NextRequest, NextResponse } from "next/server";
import {
  capabilities,
  contactMethods,
  education,
  profile,
  projects,
  skillCategories,
  socialLinks,
  stats,
  timeline,
} from "@/lib/portfolio-data";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const ANTHROPIC_MESSAGES_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";
const TELEGRAM_MESSAGE_LIMIT = 3900;
const SESSION_COOKIE = "portfolio_chat_session";
const MAX_HISTORY_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 1400;
const MAX_SESSION_MESSAGES = 50;
const DIRECT_CONTACT_MESSAGE =
  "This chat session has reached its message limit. Please contact Hector directly by email at mern2025@outlook.com, WhatsApp at +1 (856) 495-1739, Telegram at @yesteru, or Microsoft Teams on request.";

function withoutIcon<T extends { icon?: unknown }>(item: T) {
  const data = { ...item };
  delete data.icon;

  return data;
}

function buildPortfolioContext() {
  return JSON.stringify(
    {
      profile,
      stats,
      capabilities: capabilities.map(withoutIcon),
      skills: skillCategories.map(withoutIcon),
      workHistory: timeline,
      projects,
      education: withoutIcon(education),
      contact: contactMethods.map(withoutIcon),
      socialLinks: socialLinks.map(withoutIcon),
    },
    null,
    2,
  );
}

function normalizeMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((message): message is ChatMessage => {
      if (!message || typeof message !== "object") {
        return false;
      }

      const candidate = message as Partial<ChatMessage>;
      return (candidate.role === "user" || candidate.role === "assistant") && typeof candidate.content === "string";
    })
    .slice(-MAX_HISTORY_MESSAGES)
    .map((message) => ({
      role: message.role,
      content: message.content.slice(0, MAX_MESSAGE_LENGTH),
    }));
}

function createSystemPrompt() {
  return `You are Hector's Assistant for Hector Rosales Ortiz.

Represent Hector professionally in first person or as "Hector" depending on the user's wording.
Answer only from the portfolio context below. If a user asks about something not covered, say you do not have that detail and offer a relevant contact path.
Be concise, warm, and direct. Give the shortest useful answer first.
Use plain text only. Do not use markdown, bold, italics, bullet symbols, numbered lists, or headings.
For simple questions, reply in 1-2 short sentences. For broader questions, use at most 4 short sentences.
Prioritize Hector's full-stack, mobile, cloud, project, experience, education, and contact information.
Do not answer unrelated topics, including general technical questions, coding help, homework, news, entertainment, or advice that is not specifically about Hector, his services, or his portfolio.
Never invent employers, dates, links, credentials, or private personal details.
Tell users that their chat messages are sent directly to Hector.
If the conversation reaches the session limit, tell the user to contact Hector directly by email, WhatsApp, Telegram, or Microsoft Teams on request.

Portfolio context:
${buildPortfolioContext()}`;
}

function escapeTelegramHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getVisitorIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  return (
    forwardedFor ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-client-ip") ||
    "unknown"
  );
}

function formatTelegramExchange({
  userMessage,
  reply,
  visitorIp,
}: {
  userMessage: ChatMessage;
  reply: string;
  visitorIp: string;
}) {
  const transcript = [
    `<b>Visitor (${escapeTelegramHtml(visitorIp)})</b>\n${escapeTelegramHtml(userMessage.content)}`,
    `<b>Hector&apos;s Assistant</b>\n${escapeTelegramHtml(reply)}`,
  ].join("\n\n");

  return transcript.slice(0, TELEGRAM_MESSAGE_LIMIT);
}

async function sendTelegramExchange({
  userMessage,
  reply,
  visitorIp,
}: {
  userMessage: ChatMessage;
  reply: string;
  visitorIp: string;
}) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return;
  }

  const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: formatTelegramExchange({ userMessage, reply, visitorIp }),
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  if (!telegramResponse.ok && process.env.NODE_ENV === "development") {
    console.warn("Telegram transcript forwarding failed", await telegramResponse.text());
  }
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error: "Anthropic is not configured yet. Add ANTHROPIC_API_KEY to your environment variables.",
      },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as
    | { messages?: unknown; sessionId?: unknown; messageCount?: unknown }
    | null;
  const messages = normalizeMessages(body?.messages);
  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user");

  if (!latestUserMessage?.content.trim()) {
    return NextResponse.json({ error: "Please send a message first." }, { status: 400 });
  }

  const existingSessionId = request.cookies.get(SESSION_COOKIE)?.value;
  const bodySessionId = typeof body?.sessionId === "string" ? body.sessionId : undefined;
  const sessionId = existingSessionId || bodySessionId || crypto.randomUUID();
  const messageCount = typeof body?.messageCount === "number" ? body.messageCount : undefined;
  const model = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";
  const visitorIp = getVisitorIp(request);

  if (messageCount && messageCount > MAX_SESSION_MESSAGES) {
    await sendTelegramExchange({ userMessage: latestUserMessage, reply: DIRECT_CONTACT_MESSAGE, visitorIp }).catch(() => undefined);

    const response = NextResponse.json({ reply: DIRECT_CONTACT_MESSAGE, sessionId });
    response.cookies.set(SESSION_COOKIE, sessionId, {
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  }

  const anthropicResponse = await fetch(ANTHROPIC_MESSAGES_URL, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": ANTHROPIC_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 220,
      temperature: 0.25,
      system: createSystemPrompt(),
      messages,
    }),
  });

  if (!anthropicResponse.ok) {
    const errorText = await anthropicResponse.text();

    return NextResponse.json(
      {
        error: "Hector's Assistant is unavailable right now. Please try again shortly.",
        detail: process.env.NODE_ENV === "development" ? errorText : undefined,
      },
      { status: 502 },
    );
  }

  const data = (await anthropicResponse.json()) as {
    content?: { type: string; text?: string }[];
  };
  const reply = data.content?.find((block) => block.type === "text")?.text?.trim();

  if (!reply) {
    return NextResponse.json({ error: "Hector's Assistant returned an empty response." }, { status: 502 });
  }

  await sendTelegramExchange({ userMessage: latestUserMessage, reply, visitorIp }).catch(() => undefined);

  const response = NextResponse.json({ reply, sessionId });
  response.cookies.set(SESSION_COOKIE, sessionId, {
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
