import React, { useState } from 'react';
import { Project, LightNovelChapter } from '../../types';
import { 
  useLightNovelChapters, 
  useNovelStudioTelemetry 
} from '../../hooks/useNovelStudioData';
import { NovelStudioHeader, NovelStudioSubTab } from '../novel/NovelStudioHeader';
import { ChapterScriptEditor } from '../novel/ChapterScriptEditor';
import { IllustrationAnchorsTab } from '../novel/IllustrationAnchorsTab';
import { AiNovelGeneratorModal } from '../novel/AiNovelGeneratorModal';
import { 
  BookOpen, 
  FileText, 
  Image, 
  MessageSquare, 
  Sparkles, 
  Layers, 
  Plus, 
  Edit3 
} from 'lucide-react';

interface NovelStudioViewProps {
  project: Project;
  onUpdateProject: (updatedProject: Project) => void;
}

export const NovelStudioView: React.FC<NovelStudioViewProps> = ({
  project,
  onUpdateProject
}) => {
  const chaptersQuery = useLightNovelChapters();
  const telemetryQuery = useNovelStudioTelemetry();

  const chaptersList = chaptersQuery.data || [];
  const telemetry = telemetryQuery.data;

  const [activeSubTab, setActiveSubTab] = useState<NovelStudioSubTab>('editor');
  const [selectedChapterId, setSelectedChapterId] = useState<string>(chaptersList[0]?.id || '');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const activeChapter = chaptersList.find(c => c.id === selectedChapterId) || chaptersList[0];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Studio Header */}
      <NovelStudioHeader
        activeSubTab={activeSubTab}
        onSubTabChange={setActiveSubTab}
        onOpenAiGenerator={() => setIsAiModalOpen(true)}
        onOpenCreateChapter={() => setIsAiModalOpen(true)}
      />

      {/* Telemetry Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">TOTAL CHAPTERS</span>
            <span className="text-base font-extrabold text-white">{telemetry?.totalChapters || chaptersList.length}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">MANUSCRIPT WORDS</span>
            <span className="text-base font-extrabold text-white">{telemetry?.totalWordCount || 182}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Image className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">ILLUSTRATION ANCHORS</span>
            <span className="text-base font-extrabold text-white">{telemetry?.totalIllustrationAnchors || 2}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">DIALOGUE DENSITY</span>
            <span className="text-base font-extrabold text-white">{telemetry?.avgDialogueDensity || 42}%</span>
          </div>
        </div>
      </div>

      {/* Chapter Selector Dropdown / Pills Bar */}
      <div className="flex items-center space-x-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-3 backdrop-blur-sm overflow-x-auto scrollbar-none">
        <span className="text-xs font-mono text-slate-400 shrink-0 px-2 font-bold">Select Chapter:</span>
        {chaptersList.map((chap) => {
          const isSelected = (activeChapter?.id === chap.id);
          return (
            <button
              key={chap.id}
              onClick={() => setSelectedChapterId(chap.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                isSelected
                  ? 'bg-purple-600/30 text-purple-300 border-purple-500 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              Ch. {chap.chapterNumber}: {chap.title}
            </button>
          );
        })}
      </div>

      {/* Sub-Tab Views */}
      {activeSubTab === 'editor' && activeChapter && (
        <ChapterScriptEditor
          chapter={activeChapter}
        />
      )}

      {activeSubTab === 'scene_breakdown' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <span>Dialogue Scene Breakdown Matrix</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {chaptersList.map((c) => (
              <div key={c.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-xs font-bold text-white">Ch. {c.chapterNumber}: {c.title}</h3>
                  <span className="text-[10px] font-mono text-purple-300">{(c.dialogueNodes || []).length} Nodes</span>
                </div>
                <div className="space-y-2">
                  {(c.dialogueNodes || []).map((node) => (
                    <div key={node.id} className="p-2 bg-slate-900 rounded-lg text-xs space-y-0.5 border border-slate-800">
                      <span className="text-[10px] font-mono font-bold text-purple-300">{node.speakerName} ({node.emotion})</span>
                      <p className="text-slate-300 italic">"{node.line}"</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'illustrations' && (
        <IllustrationAnchorsTab
          chapters={chaptersList}
        />
      )}

      {activeSubTab === 'outline' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Layers className="w-5 h-5 text-purple-400" />
                <span>Light Novel Volume 1 Outline</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Sequential chapter roadmap with Japanese titles, tone tags, and visual anchor counts.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {chaptersList.map((c) => (
              <div key={c.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-purple-400">Ch. {c.chapterNumber}</span>
                    <h3 className="text-sm font-bold text-white">{c.title}</h3>
                    {c.japaneseTitle && <span className="text-xs text-slate-400 font-serif">({c.japaneseTitle})</span>}
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{c.summary}</p>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span className="text-[10px] font-mono px-2 py-1 bg-slate-900 border border-slate-800 text-purple-300 rounded">
                    {c.tone}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedChapterId(c.id);
                      setActiveSubTab('editor');
                    }}
                    className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg text-xs font-bold border border-purple-500/40 flex items-center space-x-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Script</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Generator Modal */}
      <AiNovelGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        project={project}
      />
    </div>
  );
};
