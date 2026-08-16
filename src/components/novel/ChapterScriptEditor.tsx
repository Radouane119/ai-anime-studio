import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Save, 
  Sparkles, 
  Plus, 
  Volume2, 
  Wand2, 
  MessageSquare, 
  Image, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { LightNovelChapter, DialogueNode } from '../../types';
import { useUpdateNovelChapter } from '../../hooks/useNovelStudioData';

interface ChapterScriptEditorProps {
  chapter: LightNovelChapter;
  onSelectNextChapter?: () => void;
}

export const ChapterScriptEditor: React.FC<ChapterScriptEditorProps> = ({
  chapter,
  onSelectNextChapter
}) => {
  const updateChapter = useUpdateNovelChapter();

  const [title, setTitle] = useState(chapter.title);
  const [japaneseTitle, setJapaneseTitle] = useState(chapter.japaneseTitle || '');
  const [content, setContent] = useState(chapter.content);
  const [tone, setTone] = useState(chapter.tone);
  const [speakerName, setSpeakerName] = useState('Ren Kurogane');
  const [speakerEmotion, setSpeakerEmotion] = useState('Determined');
  const [dialogueLine, setDialogueLine] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setTitle(chapter.title);
    setJapaneseTitle(chapter.japaneseTitle || '');
    setContent(chapter.content);
    setTone(chapter.tone);
  }, [chapter]);

  const words = content.trim() ? content.trim().split(/\s+/).length : 0;

  const handleSave = () => {
    updateChapter.mutate(
      {
        ...chapter,
        title,
        japaneseTitle,
        content,
        tone,
        wordCount: words,
      },
      {
        onSuccess: () => {
          setSavedSuccess(true);
          setTimeout(() => setSavedSuccess(false), 2000);
        }
      }
    );
  };

  const handleAddDialogueNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dialogueLine.trim()) return;

    const newNode: DialogueNode = {
      id: `dn_${Date.now()}`,
      speakerName,
      emotion: speakerEmotion,
      line: dialogueLine
    };

    const formattedDialogue = `\n\n"${dialogueLine}" (${speakerName} - ${speakerEmotion})\n`;
    const updatedContent = content + formattedDialogue;
    const updatedNodes = [...(chapter.dialogueNodes || []), newNode];

    setContent(updatedContent);
    setDialogueLine('');

    updateChapter.mutate({
      ...chapter,
      content: updatedContent,
      dialogueNodes: updatedNodes,
      wordCount: updatedContent.trim().split(/\s+/).length
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Main Editor (8 cols) */}
      <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl backdrop-blur-sm">
        {/* Title Bar Inputs */}
        <div className="space-y-3 border-b border-slate-800 pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold shrink-0">
                CH. {chapter.chapterNumber}
              </span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Chapter Title..."
                className="text-lg font-black text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-purple-500 focus:outline-none w-full"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={updateChapter.isPending}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/30 flex items-center space-x-2 cursor-pointer transition-all shrink-0"
            >
              {savedSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'Saved!' : 'Save Chapter'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">Japanese Subtitle</label>
              <input
                type="text"
                value={japaneseTitle}
                onChange={(e) => setJapaneseTitle(e.target.value)}
                placeholder="e.g. ネオンの血と神経の鋼"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 font-serif"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">Genre Tone Spec</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Action / Cyberpunk">Action / Cyberpunk</option>
                <option value="Dark Fantasy">Dark Fantasy</option>
                <option value="Slice of Life / RomCom">Slice of Life / RomCom</option>
                <option value="Isekai Fantasy">Isekai Fantasy</option>
                <option value="Psychological Thriller">Psychological Thriller</option>
              </select>
            </div>
          </div>
        </div>

        {/* Script Content Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>LIGHT NOVEL CHAPTER MANUSCRIPT</span>
            </span>
            <span className="text-purple-300 font-bold">{words} words</span>
          </div>

          <textarea
            rows={14}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write light novel script paragraph prose or insert character dialogue tags..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 leading-relaxed font-sans placeholder-slate-600 focus:outline-none focus:border-purple-500 resize-y"
          />
        </div>
      </div>

      {/* Right Sidebar: Dialogue Node Injector & Telemetry (4 cols) */}
      <div className="lg:col-span-4 space-y-4">
        {/* Dialogue Injector Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl backdrop-blur-sm">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <span>Dialogue Node Injector</span>
          </h3>
          <p className="text-[11px] text-slate-400">
            Inject tagged character dialogue directly into chapter prose with speaker and emotion anchors.
          </p>

          <form onSubmit={handleAddDialogueNode} className="space-y-3">
            <div>
              <label className="text-[10px] font-mono text-slate-300 block mb-1">Speaker Character</label>
              <input
                type="text"
                value={speakerName}
                onChange={(e) => setSpeakerName(e.target.value)}
                placeholder="e.g. Ren Kurogane"
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-300 block mb-1">Emotion / Tone Anchor</label>
              <input
                type="text"
                value={speakerEmotion}
                onChange={(e) => setSpeakerEmotion(e.target.value)}
                placeholder="e.g. Sarcastic Smirk"
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-300 block mb-1">Dialogue Line *</label>
              <textarea
                rows={2}
                value={dialogueLine}
                onChange={(e) => setDialogueLine(e.target.value)}
                placeholder="Type spoken dialogue line..."
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!dialogueLine.trim()}
              className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Inject Dialogue Tag</span>
            </button>
          </form>
        </div>

        {/* Tagged Dialogue Nodes Summary */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
          <h4 className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span>Tagged Dialogue Nodes</span>
            <span className="text-[10px] font-mono text-purple-400 font-bold">
              {(chapter.dialogueNodes || []).length}
            </span>
          </h4>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {(chapter.dialogueNodes || []).map((node) => (
              <div key={node.id} className="p-2 bg-slate-950 border border-slate-800/80 rounded-xl text-xs space-y-0.5">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-purple-300 font-bold">{node.speakerName}</span>
                  <span className="text-slate-400">[{node.emotion}]</span>
                </div>
                <p className="text-slate-300 italic text-[11px]">"{node.line}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
