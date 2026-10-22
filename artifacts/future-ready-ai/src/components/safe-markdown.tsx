import type { ReactNode } from 'react';

type MarkdownBlock =
  | { type: 'heading'; level: number; content: string }
  | { type: 'paragraph'; content: string }
  | { type: 'list'; ordered: boolean; items: string[] };

function parseBlocks(markdown: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | undefined;

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: 'paragraph', content: paragraph.join(' ') });
    paragraph = [];
  };
  const flushList = () => {
    if (list) blocks.push({ type: 'list', ...list });
    list = undefined;
  };

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = /^(#{1,6})\s+(.+)$/.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', level: heading[1].length, content: heading[2] });
      continue;
    }

    const item = /^(?:[-*+]\s+(\S.*)|\d+[.)]\s+(\S.*))$/.exec(line);
    if (item) {
      flushParagraph();
      const ordered = item[2] !== undefined;
      if (list && list.ordered !== ordered) flushList();
      list ??= { ordered, items: [] };
      list.items.push(item[1] ?? item[2]);
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  return blocks;
}

function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export function SafeMarkdown({ content }: { content: string }) {
  return (
    <div className="flex flex-col gap-2">
      {parseBlocks(content).map((block, index) => {
        if (block.type === 'heading') {
          const Tag = `h${Math.min(6, block.level + 1)}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
          return <Tag className="text-[14px] font-bold mt-2 mb-0" key={index}>{renderInline(block.content)}</Tag>;
        }
        if (block.type === 'list') {
          const Tag = block.ordered ? 'ol' : 'ul';
          return (
            <Tag className={block.ordered ? 'list-decimal pl-5 my-1' : 'list-disc pl-5 my-1'} key={index}>
              {block.items.map((item, itemIndex) => <li className="pl-1 mb-1" key={itemIndex}>{renderInline(item)}</li>)}
            </Tag>
          );
        }
        return <p className="m-0" key={index}>{renderInline(block.content)}</p>;
      })}
    </div>
  );
}
