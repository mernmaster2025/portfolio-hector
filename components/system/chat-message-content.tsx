import type { ReactNode } from "react";

function renderInlineMarkdown(text: string): ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];

    if (token.startsWith("**")) {
      nodes.push(<strong key={`${match.index}-bold`}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("`")) {
      nodes.push(
        <code
          key={`${match.index}-code`}
          className="rounded bg-black/10 px-1 py-0.5 text-[0.92em] light:bg-slate-900/10"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else {
      nodes.push(<em key={`${match.index}-italic`}>{token.slice(1, -1)}</em>);
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}

export function ChatMessageContent({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return null;
        }

        const listMatch = trimmed.match(/^[-*]\s+(.+)$/);

        return (
          <p key={`${index}-${trimmed}`} className={listMatch ? "pl-1" : undefined}>
            {listMatch ? (
              <>
                <span aria-hidden="true">• </span>
                {renderInlineMarkdown(listMatch[1])}
              </>
            ) : (
              renderInlineMarkdown(trimmed)
            )}
          </p>
        );
      })}
    </div>
  );
}
