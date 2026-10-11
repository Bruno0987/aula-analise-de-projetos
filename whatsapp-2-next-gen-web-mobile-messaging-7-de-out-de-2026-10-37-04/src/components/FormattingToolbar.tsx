import React from 'react';
import { Bold, Italic, Strikethrough, Code, Quote, EyeOff, Terminal, HelpCircle } from 'lucide-react';
import { applyFormatTag } from '../utils/textFormatter';

interface FormattingToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  setText: React.Dispatch<React.SetStateAction<string>>;
  accentColor: string;
}

export const FormattingToolbar: React.FC<FormattingToolbarProps> = ({
  textareaRef,
  setText,
  accentColor,
}) => {
  const [showHelper, setShowHelper] = React.useState(false);

  const formatButtons = [
    {
      label: 'Negrito',
      icon: <Bold className="w-3.5 h-3.5" />,
      tag: '*',
      shortcut: '*texto*',
      action: () => applyFormatTag(textareaRef.current, '*', '*', setText),
    },
    {
      label: 'Itálico',
      icon: <Italic className="w-3.5 h-3.5" />,
      tag: '_',
      shortcut: '_texto_',
      action: () => applyFormatTag(textareaRef.current, '_', '_', setText),
    },
    {
      label: 'Tachado',
      icon: <Strikethrough className="w-3.5 h-3.5" />,
      tag: '~',
      shortcut: '~texto~',
      action: () => applyFormatTag(textareaRef.current, '~', '~', setText),
    },
    {
      label: 'Mono',
      icon: <Code className="w-3.5 h-3.5" />,
      tag: '```',
      shortcut: '```código```',
      action: () => applyFormatTag(textareaRef.current, '```', '```', setText),
    },
    {
      label: 'Citação',
      icon: <Quote className="w-3.5 h-3.5" />,
      tag: '> ',
      shortcut: '> texto',
      action: () => applyFormatTag(textareaRef.current, '> ', '', setText),
    },
    {
      label: 'Spoiler',
      icon: <EyeOff className="w-3.5 h-3.5" />,
      tag: '||',
      shortcut: '||oculto||',
      action: () => applyFormatTag(textareaRef.current, '||', '||', setText),
    },
    {
      label: 'Em linha',
      icon: <Terminal className="w-3.5 h-3.5" />,
      tag: '`',
      shortcut: '`código`',
      action: () => applyFormatTag(textareaRef.current, '`', '`', setText),
    },
  ];

  return (
    <div className="relative">
      <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-zinc-800/80 border-t border-slate-200/80 dark:border-zinc-800 text-xs text-slate-600 dark:text-zinc-300 overflow-x-auto select-none">
        <span className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 mr-1 flex items-center gap-1">
          Formatação:
        </span>

        {formatButtons.map((btn, index) => (
          <button
            key={index}
            type="button"
            onClick={btn.action}
            title={`${btn.label} (${btn.shortcut})`}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700/80 hover:border-slate-300 dark:hover:border-zinc-600 active:scale-95 transition-all text-xs font-medium"
          >
            {btn.icon}
            <span className="hidden sm:inline">{btn.label}</span>
          </button>
        ))}

        <div className="ml-auto pl-2 flex items-center">
          <button
            type="button"
            onClick={() => setShowHelper(!showHelper)}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition"
            title="Dicas de atalhos do WhatsApp"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Helper Floating Dropdown */}
      {showHelper && (
        <div className="absolute right-3 bottom-10 z-20 w-64 p-3 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-slate-200 dark:border-zinc-800 text-xs space-y-1.5 text-slate-600 dark:text-zinc-300 animate-in fade-in">
          <div className="font-semibold text-slate-800 dark:text-white flex items-center justify-between pb-1 border-b border-slate-100 dark:border-zinc-800">
            <span>Atalhos de Texto WhatsApp</span>
            <span className="text-[10px] text-emerald-500 font-mono">DICAS</span>
          </div>
          <div className="flex justify-between">
            <span className="font-mono text-slate-400">*palavra*</span>
            <strong>Negrito</strong>
          </div>
          <div className="flex justify-between">
            <span className="font-mono text-slate-400">_palavra_</span>
            <em>Itálico</em>
          </div>
          <div className="flex justify-between">
            <span className="font-mono text-slate-400">~palavra~</span>
            <del>Tachado</del>
          </div>
          <div className="flex justify-between">
            <span className="font-mono text-slate-400">```código```</span>
            <span className="font-mono text-[11px]">Monospace</span>
          </div>
          <div className="flex justify-between">
            <span className="font-mono text-slate-400">&gt; citação</span>
            <span>Citação</span>
          </div>
          <div className="flex justify-between">
            <span className="font-mono text-slate-400">||spoiler||</span>
            <span className="bg-zinc-700 text-white px-1 rounded text-[10px]">Oculto</span>
          </div>
        </div>
      )}
    </div>
  );
};
