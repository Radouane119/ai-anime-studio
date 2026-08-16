import React, { useEffect, useMemo, useState } from 'react';
import { Check, Clipboard, Library, Loader2, Plus, Sparkles, Trash2, Wand2 } from 'lucide-react';
import { Project, PromptLibraryItem, PromptTarget } from '../../types';

interface PromptStudioViewProps {
  project: Project;
}

const STORAGE_KEY = 'studio_prompt_library';

const TARGETS: { value: PromptTarget; label: string; hint: string }[] = [
  { value: 'character', label: 'Character', hint: 'Consistent design sheet or key art' },
  { value: 'manga', label: 'Manga panel', hint: 'Composition, dialogue space, and ink detail' },
  { value: 'storyboard', label: 'Storyboard', hint: 'Camera direction and scene blocking' },
  { value: 'video', label: 'Video shot', hint: 'Motion, lens, and transition direction' }
];

const STYLE_PRESETS = [
  'Cinematic anime',
  'Ink-wash manga',
  'Neon cyberpunk',
  'Dreamy shoujo',
  'High-energy shonen'
];

export const PromptStudioView: React.FC<PromptStudioViewProps> = ({ project }) => {
  const [target, setTarget] = useState<PromptTarget>('character');
  const [concept, setConcept] = useState(`A pivotal scene from ${project.title}`);
  const [style, setStyle] = useState(STYLE_PRESETS[0]);
  const [aspectRatio, setAspectRatio] = useState<PromptLibraryItem['aspectRatio']>('16:9');
  const [negativePrompt, setNegativePrompt] = useState('blurry, distorted anatomy, unreadable text, watermark');
  const [result, setResult] = useState('');
  const [notes, setNotes] = useState<string[]>([]);
  const [library, setLibrary] = useState<PromptLibraryItem[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setLibrary(JSON.parse(saved));
    } catch {
      setLibrary([]);
    }
  }, []);

  const targetHint = useMemo(() => TARGETS.find((item) => item.value === target)?.hint, [target]);

  const updateLibrary = (items: PromptLibraryItem[]) => {
    setLibrary(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const handleOptimize = async () => {
    if (!concept.trim()) return;
    setIsOptimizing(true);
    setError('');
    setNotes([]);
    try {
      const response = await fetch('/api/gemini/optimize-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept, target, style, aspectRatio, negativePrompt })
      });
      const payload = await response.json();
      if (!response.ok || !payload.success || !payload.result?.prompt) {
        throw new Error(payload.error || 'The prompt service did not return an optimized prompt.');
      }
      setResult(payload.result.prompt);
      setNegativePrompt(payload.result.negativePrompt || negativePrompt);
      setNotes(payload.result.creativeNotes || []);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to optimize this prompt right now.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(`${result}\n\nNegative prompt: ${negativePrompt}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const handleSave = () => {
    if (!result) return;
    const item: PromptLibraryItem = {
      id: `prompt_${Date.now()}`,
      name: concept.trim().slice(0, 48) || 'Untitled prompt',
      target,
      prompt: result,
      negativePrompt,
      style,
      aspectRatio,
      createdAt: new Date().toISOString()
    };
    updateLibrary([item, ...library]);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 text-slate-100 md:p-6">
      <section className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-6 shadow-2xl md:p-8">
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="rounded-md border border-indigo-400/30 bg-indigo-500/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-200">Prompt Studio</span>
            <h1 className="mt-3 flex items-center gap-2 text-2xl font-black tracking-tight"><Wand2 className="h-6 w-6 text-indigo-300" /> Direct the frame before you generate it</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">Turn a rough idea into a structured, reusable prompt for {project.title}. Your saved prompt library stays in this browser.</p>
          </div>
          <div className="rounded-2xl border border-slate-700/80 bg-slate-950/50 px-4 py-3 text-right">
            <p className="text-[10px] font-mono uppercase text-slate-500">Saved prompts</p>
            <p className="text-xl font-black text-indigo-300">{library.length}</p>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <section className="space-y-5 rounded-3xl border border-slate-800 bg-slate-900/65 p-5 shadow-xl md:p-6">
          <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-indigo-400" /><div><h2 className="font-bold">Create a production prompt</h2><p className="text-xs text-slate-400">Choose the output, then describe the creative moment.</p></div></div>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {TARGETS.map((item) => <button key={item.value} onClick={() => setTarget(item.value)} className={`rounded-2xl border p-3 text-left transition ${target === item.value ? 'border-indigo-400 bg-indigo-500/15 text-white' : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-600'}`}><span className="block text-xs font-bold">{item.label}</span><span className="mt-1 block text-[10px] leading-snug">{item.hint}</span></button>)}
          </div>

          <div className="space-y-2"><label className="text-xs font-bold text-slate-300">Creative brief <span className="font-normal text-slate-500">— {targetHint}</span></label><textarea value={concept} onChange={(event) => setConcept(event.target.value)} rows={5} placeholder="Describe the subject, action, setting, mood, and key visual details..." className="w-full resize-y rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm leading-relaxed text-white outline-none transition focus:border-indigo-500" /></div>

          <div className="grid gap-3 sm:grid-cols-2"><div><label className="mb-1 block text-xs font-bold text-slate-300">Style direction</label><select value={style} onChange={(event) => setStyle(event.target.value)} className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-indigo-500">{STYLE_PRESETS.map((preset) => <option key={preset}>{preset}</option>)}</select></div><div><label className="mb-1 block text-xs font-bold text-slate-300">Frame</label><select value={aspectRatio} onChange={(event) => setAspectRatio(event.target.value as PromptLibraryItem['aspectRatio'])} className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-indigo-500"><option value="16:9">16:9 — cinematic</option><option value="9:16">9:16 — vertical</option><option value="1:1">1:1 — key art</option></select></div></div>
          <div><label className="mb-1 block text-xs font-bold text-slate-300">Avoid</label><input value={negativePrompt} onChange={(event) => setNegativePrompt(event.target.value)} className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-indigo-500" /></div>
          <button onClick={handleOptimize} disabled={isOptimizing || !concept.trim()} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-950/60 transition hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-50">{isOptimizing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}{isOptimizing ? 'Directing the prompt…' : 'Optimize with AI'}</button>
          {error && <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">{error}</p>}
        </section>

        <section className="flex min-h-[480px] flex-col rounded-3xl border border-slate-800 bg-slate-900/65 p-5 shadow-xl md:p-6">
          <div className="flex items-center justify-between"><div><h2 className="font-bold">Prompt output</h2><p className="text-xs text-slate-400">Review it before sending it to an art or video tool.</p></div><span className="rounded-lg bg-slate-800 px-2 py-1 text-[10px] font-mono text-indigo-300">{aspectRatio}</span></div>
          {result ? <div className="mt-5 flex flex-1 flex-col gap-4"><div className="flex-1 rounded-2xl border border-indigo-500/30 bg-slate-950 p-4"><p className="whitespace-pre-wrap text-sm leading-7 text-slate-200">{result}</p></div><div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Negative prompt</p><p className="mt-1 text-xs leading-relaxed text-slate-300">{negativePrompt}</p></div>{notes.length > 0 && <ul className="space-y-1.5 text-xs text-slate-400">{notes.map((note, index) => <li key={index} className="flex gap-2"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />{note}</li>)}</ul>}<div className="grid grid-cols-2 gap-3"><button onClick={handleCopy} className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-bold hover:bg-slate-700">{copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Clipboard className="h-4 w-4 text-indigo-300" />}{copied ? 'Copied' : 'Copy prompt'}</button><button onClick={handleSave} className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold hover:bg-indigo-500"><Plus className="h-4 w-4" />Save to library</button></div></div> : <div className="flex flex-1 flex-col items-center justify-center text-center"><div className="rounded-full border border-indigo-500/20 bg-indigo-500/10 p-4"><Sparkles className="h-7 w-7 text-indigo-400" /></div><h3 className="mt-4 text-sm font-bold">Your directed prompt will appear here</h3><p className="mt-2 max-w-xs text-xs leading-relaxed text-slate-500">Include a clear subject, what happens in the frame, and the emotion you want the viewer to feel.</p></div>}
        </section>
      </div>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/65 p-5 shadow-xl md:p-6"><div className="flex items-center gap-2"><Library className="h-5 w-5 text-indigo-400" /><div><h2 className="font-bold">Prompt library</h2><p className="text-xs text-slate-400">Reusable creative directions saved on this device.</p></div></div>{library.length ? <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{library.map((item) => <article key={item.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-mono uppercase text-indigo-300">{item.target} · {item.aspectRatio}</p><h3 className="mt-1 truncate text-sm font-bold">{item.name}</h3></div><button onClick={() => updateLibrary(library.filter((entry) => entry.id !== item.id))} aria-label={`Delete ${item.name}`} className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-500/10 hover:text-rose-300"><Trash2 className="h-4 w-4" /></button></div><p className="mt-3 line-clamp-3 text-xs leading-relaxed text-slate-400">{item.prompt}</p><button onClick={() => { setTarget(item.target); setStyle(item.style); setAspectRatio(item.aspectRatio); setNegativePrompt(item.negativePrompt); setResult(item.prompt); }} className="mt-4 text-xs font-bold text-indigo-300 hover:text-indigo-200">Load prompt</button></article>)}</div> : <p className="mt-5 rounded-2xl border border-dashed border-slate-800 p-6 text-center text-xs text-slate-500">Save an optimized prompt to build your reusable production library.</p>}</section>
    </div>
  );
};
