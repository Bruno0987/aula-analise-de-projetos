import React, { useState } from 'react';

/**
 * Parses WhatsApp markdown syntax into React elements:
 * *bold* -> <strong>
 * _italic_ -> <em>
 * ~strikethrough~ -> <del>
 * ```monospace``` -> <code>
 * `inline-code` -> <code>
 * > quote -> <blockquote>
 * ||spoiler|| -> interactive spoiler button
 */
export function FormattedText({ text, className = '' }: { text: string; className?: string }) {
  if (!text) return null;

  // Split lines to handle blockquotes
  const lines = text.split('\n');

  return (
    <div className={`space-y-1 break-words ${className}`}>
      {lines.map((line, lineIndex) => {
        // Blockquote
        if (line.startsWith('> ')) {
          const quoteContent = line.slice(2);
          return (
            <div
              key={lineIndex}
              className="border-l-4 border-emerald-500/80 dark:border-emerald-400/80 pl-2.5 py-0.5 my-1 bg-black/5 dark:bg-white/5 rounded-r text-sm italic"
            >
              {renderInlineMarkdown(quoteContent)}
            </div>
          );
        }

        return (
          <p key={lineIndex} className="leading-relaxed">
            {renderInlineMarkdown(line)}
          </p>
        );
      })}
    </div>
  );
}

function renderInlineMarkdown(line: string): React.ReactNode[] {
  // Regex to match markdown patterns:
  // 1: ```monospace```
  // 2: `code`
  // 3: ||spoiler||
  // 4: *bold*
  // 5: _italic_
  // 6: ~strikethrough~
  // 7: URL
  const pattern = /(```[\s\S]*?```|`[^`]+`|\|\|[\s\S]*?\|\||\*[^\s*](?:[^*]*[^\s*])?\*|_[^\s_](?:[^_]*[^\s_])?_|~[^\s~](?:[^~]*[^\s~])?~|https?:\/\/[^\s]+)/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(line.substring(lastIndex, match.index));
    }

    const token = match[0];

    // Monospace triple backtick
    if (token.startsWith('```') && token.endsWith('```')) {
      const code = token.slice(3, -3);
      parts.push(
        <code
          key={match.index}
          className="font-mono text-[0.88em] bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded text-emerald-800 dark:text-emerald-300"
        >
          {code}
        </code>
      );
    }
    // Inline code
    else if (token.startsWith('`') && token.endsWith('`')) {
      const code = token.slice(1, -1);
      parts.push(
        <code
          key={match.index}
          className="font-mono text-[0.88em] bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded text-emerald-800 dark:text-emerald-300"
        >
          {code}
        </code>
      );
    }
    // Spoiler ||text||
    else if (token.startsWith('||') && token.endsWith('||')) {
      const spoilerContent = token.slice(2, -2);
      parts.push(<SpoilerToken key={match.index} content={spoilerContent} />);
    }
    // Bold *text*
    else if (token.startsWith('*') && token.endsWith('*')) {
      const boldText = token.slice(1, -1);
      parts.push(
        <strong key={match.index} className="font-bold text-slate-900 dark:text-white">
          {boldText}
        </strong>
      );
    }
    // Italic _text_
    else if (token.startsWith('_') && token.endsWith('_')) {
      const italicText = token.slice(1, -1);
      parts.push(
        <em key={match.index} className="italic">
          {italicText}
        </em>
      );
    }
    // Strikethrough ~text~
    else if (token.startsWith('~') && token.endsWith('~')) {
      const strikeText = token.slice(1, -1);
      parts.push(
        <del key={match.index} className="line-through opacity-75">
          {strikeText}
        </del>
      );
    }
    // URL
    else if (token.startsWith('http://') || token.startsWith('https://')) {
      parts.push(
        <a
          key={match.index}
          href={token}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-600 dark:text-emerald-400 underline hover:opacity-80 break-all"
        >
          {token}
        </a>
      );
    } else {
      parts.push(token);
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < line.length) {
    parts.push(line.substring(lastIndex));
  }

  return parts;
}

function SpoilerToken({ content }: { content: string }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <span
      onClick={() => setRevealed(!revealed)}
      title={revealed ? 'Clique para ocultar' : 'Clique para ver o spoiler'}
      className={`inline-block cursor-pointer px-1.5 py-0.2 rounded transition-all duration-200 select-none ${
        revealed
          ? 'bg-black/10 dark:bg-white/10 text-inherit'
          : 'bg-zinc-800 text-transparent hover:bg-zinc-700 dark:bg-zinc-700'
      }`}
    >
      {content}
    </span>
  );
}

/**
 * Injects markdown formatting syntax around selection or at cursor position.
 */
export function applyFormatTag(
  textarea: HTMLTextAreaElement | null,
  prefix: string,
  suffix: string,
  setText: (updater: (prev: string) => string) => void
) {
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const currentText = textarea.value;

  if (start !== end) {
    // There is selected text
    const selected = currentText.substring(start, end);
    const replacement = `${prefix}${selected}${suffix}`;
    const newText = currentText.substring(0, start) + replacement + currentText.substring(end);
    setText(() => newText);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 10);
  } else {
    // Insert empty tags and place cursor in the middle
    const newText = currentText.substring(0, start) + prefix + suffix + currentText.substring(end);
    setText(() => newText);

    setTimeout(() => {
      textarea.focus();
      const newPos = start + prefix.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 10);
  }
}
