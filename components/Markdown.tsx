import React from 'react';

export const Markdown = ({ content, className = '' }: { content: string; className?: string }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  
  let currentList: React.ReactNode[] = [];
  let key = 0;

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${key++}`} className="list-disc pl-5 space-y-1 mb-4">
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  const parseInline = (text: string) => {
    // Split by bold syntax **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      flushList();
      continue;
    }

    if (line.startsWith('- ')) {
      currentList.push(
        <li key={`item-${i}`} className="text-slate-600 leading-relaxed pl-1">
          {parseInline(line.substring(2))}
        </li>
      );
    } else {
      flushList();
      elements.push(
        <div key={`p-${key++}`} className="mb-4 text-slate-600 leading-relaxed">
          {parseInline(line)}
        </div>
      );
    }
  }
  flushList();

  return <div className={`text-sm ${className}`}>{elements}</div>;
};