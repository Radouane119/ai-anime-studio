import React, { useState } from 'react';
import { Project } from '../types';
import { Download, CheckCircle2, Sparkles, X, FileText, Image as ImageIcon, Mic, Film } from 'lucide-react';

interface ExportModalProps {
  project: Project;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ project, onClose }) => {
  const [exportingType, setExportingType] = useState<string | null>(null);
  const [completedType, setCompletedType] = useState<string | null>(null);

  const handleDownloadAsset = (type: string, filename: string, contentStr: string) => {
    setExportingType(type);
    setTimeout(() => {
      const blob = new Blob([contentStr], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportingType(null);
      setCompletedType(type);
      setTimeout(() => setCompletedType(null), 3000);
    }, 1200);
  };

  const generateProjectJSON = () => JSON.stringify(project, null, 2);

  const generateMangaScriptTXT = () => {
    let text = `=== ${project.title.toUpperCase()} ===\nFormat: ${project.format}\nGenre: ${project.genre}\n\n`;
    text += `SYNOPSIS:\n${project.synopsis}\n\n`;
    text += `=== CHARACTERS ===\n`;
    project.characters.forEach((c) => {
      text += `- ${c.name} (${c.role}): ${c.personality}\n  Signature Move: ${c.signatureMove}\n`;
    });
    text += `\n=== MANGA PANELS ===\n`;
    project.mangaPanels.forEach((p) => {
      text += `[Panel #${p.panelNumber} - ${p.cameraAngle}]\nPrompt: ${p.prompt}\nSFX: ${p.sfx}\n`;
      p.dialogueBubbles.forEach((b) => {
        text += `  ${b.characterName}: "${b.text}"\n`;
      });
      text += `\n`;
    });
    return text;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-violet-400" />
            <h2 className="text-lg font-bold text-white">Export Commercial Studio Package</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Option 1: Full Project JSON */}
          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-violet-500/10 text-violet-400 rounded-lg">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Complete Project Manifest (.json)</p>
                <p className="text-[10px] text-slate-400">Includes all characters, panels, scripts, and video metadata</p>
              </div>
            </div>
            <button
              onClick={() => handleDownloadAsset('json', `${project.title.toLowerCase().replace(/\s+/g, '-')}-manifest.json`, generateProjectJSON())}
              disabled={exportingType === 'json'}
              className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold cursor-pointer"
            >
              {exportingType === 'json' ? 'Bundling...' : completedType === 'json' ? 'Downloaded!' : 'Export JSON'}
            </button>
          </div>

          {/* Option 2: Manga & Script TXT */}
          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Manga & Anime Production Script (.txt)</p>
                <p className="text-[10px] text-slate-400">Formatted scene beats, camera cues, and Katakana SFX</p>
              </div>
            </div>
            <button
              onClick={() => handleDownloadAsset('script', `${project.title.toLowerCase().replace(/\s+/g, '-')}-script.txt`, generateMangaScriptTXT())}
              disabled={exportingType === 'script'}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold cursor-pointer"
            >
              {exportingType === 'script' ? 'Bundling...' : completedType === 'script' ? 'Downloaded!' : 'Export Script'}
            </button>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
