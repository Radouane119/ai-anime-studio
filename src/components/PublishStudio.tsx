import React, { useState } from 'react';
import { Project } from '../types';
import { 
  Share2, 
  Download, 
  BookOpen, 
  Film, 
  Image as ImageIcon, 
  CheckCircle2, 
  Sparkles,
  Layers,
  Globe,
  FileCheck
} from 'lucide-react';

interface PublishStudioProps {
  project: Project;
  onOpenExportModal: () => void;
}

export const PublishStudio: React.FC<PublishStudioProps> = ({ project, onOpenExportModal }) => {
  const [publisherNotes, setPublisherNotes] = useState(
    `Official commercial submission package for "${project.title}". Formatted according to global publishing standards for Webtoon, Crunchyroll, and Shonen Jump digital platforms.`
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-violet-400" />
            <h1 className="text-xl font-bold text-white">Commercial Publishing & Distribution Hub</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Package and export your project for Webtoon, Amazon KDP, YouTube Shorts, Crunchyroll, and PDF formats.
          </p>
        </div>

        <button
          onClick={onOpenExportModal}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-violet-600/20 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Full Production Package</span>
        </button>
      </div>

      {/* Target Distribution Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
              WEB
            </div>
            <h3 className="text-sm font-bold text-white">LINE Webtoon & Tapas Pack</h3>
            <p className="text-xs text-slate-400">
              Auto-slices manga panels into 800px vertical scrolling images ready for Webtoon upload.
            </p>
          </div>
          <button
            onClick={onOpenExportModal}
            className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-emerald-300 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Webtoon Slices</span>
          </button>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-sm">
              PDF
            </div>
            <h3 className="text-sm font-bold text-white">Tankobon Manga & Novel PDF</h3>
            <p className="text-xs text-slate-400">
              High-resolution 300 DPI printable PDF layout complete with chapter headers and cover page.
            </p>
          </div>
          <button
            onClick={onOpenExportModal}
            className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-cyan-300 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Printable PDF</span>
          </button>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm">
              MP4
            </div>
            <h3 className="text-sm font-bold text-white">YouTube Shorts & Anime Trailer Bundle</h3>
            <p className="text-xs text-slate-400">
              Combines voice tracks, keyframes, and video cuts into a ready-to-upload anime teaser video.
            </p>
          </div>
          <button
            onClick={onOpenExportModal}
            className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-amber-300 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Video Package</span>
          </button>
        </div>
      </div>

      {/* Production Metadata Editor */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <FileCheck className="w-4 h-4 text-violet-400" />
          <span>PRODUCTION MANIFEST & COPYRIGHT METADATA</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-400 mb-1">SERIES TITLE</label>
            <input
              type="text"
              readOnly
              value={project.title}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-300 font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-400 mb-1">PUBLISHING GENRE</label>
            <input
              type="text"
              readOnly
              value={project.genre.replace('_', ' ').toUpperCase()}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-300 font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1">PUBLISHER RELEASE NOTES</label>
          <textarea
            value={publisherNotes}
            onChange={(e) => setPublisherNotes(e.target.value)}
            className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>
    </div>
  );
};
