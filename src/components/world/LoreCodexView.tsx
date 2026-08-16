import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Lock, 
  Eye, 
  Sparkles, 
  Tag, 
  Plus, 
  X,
  FileText,
  UserCheck
} from 'lucide-react';
import { LoreEntry, LoreCategory } from '../../types';
import { useCreateLoreEntry } from '../../hooks/useWorldBuildingData';

interface LoreCodexViewProps {
  loreEntries: LoreEntry[];
  isCreateModalOpen: boolean;
  onCloseCreateModal: () => void;
}

export const LoreCodexView: React.FC<LoreCodexViewProps> = ({
  loreEntries,
  isCreateModalOpen,
  onCloseCreateModal
}) => {
  const createLore = useCreateLoreEntry();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLoreDetail, setActiveLoreDetail] = useState<LoreEntry | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<LoreCategory>('Magic System');
  const [summary, setSummary] = useState('');
  const [detailedContent, setDetailedContent] = useState('');
  const [secrecyLevel, setSecrecyLevel] = useState<'Public Knowledge' | 'Guarded Secret' | 'Forbidden Knowledge' | 'Classified'>('Public Knowledge');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Magic', 'Lore', 'Studio']);

  const categories = [
    { id: 'all', label: 'All Lore' },
    { id: 'Magic System', label: 'Magic Systems' },
    { id: 'Technology', label: 'Cyber Tech' },
    { id: 'Relic', label: 'Ancient Relics' },
    { id: 'Religion', label: 'Religions & Myths' },
    { id: 'Culture', label: 'Cultural Traditions' },
  ];

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
    setTagInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    createLore.mutate(
      {
        title: title.trim(),
        category,
        summary: summary.trim(),
        detailedContent: detailedContent.trim() || summary.trim(),
        tags,
        secrecyLevel,
        associatedCharacters: []
      },
      {
        onSuccess: () => {
          setTitle('');
          setSummary('');
          setDetailedContent('');
          onCloseCreateModal();
        }
      }
    );
  };

  const getSecrecyBadge = (level: string) => {
    switch (level) {
      case 'Forbidden Knowledge': return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      case 'Guarded Secret': return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'Classified': return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'Public Knowledge': default: return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
    }
  };

  const filtered = loreEntries.filter((entry) => {
    const matchesCategory = selectedCategory === 'all' || entry.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery.trim() || 
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      entry.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Search & Category Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-3 shadow-md backdrop-blur-sm">
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search lore, magic, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>
      </div>

      {/* Lore Entries Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((lore) => (
          <div
            key={lore.id}
            onClick={() => setActiveLoreDetail(lore)}
            className="group bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-4 space-y-3 shadow-lg backdrop-blur-sm transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {lore.category}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono border ${getSecrecyBadge(lore.secrecyLevel)}`}>
                  {lore.secrecyLevel}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                {lore.title}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                {lore.summary}
              </p>
            </div>

            {/* Tags & Action Footer */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {lore.tags.slice(0, 3).map((t, idx) => (
                  <span key={idx} className="text-[9px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                    #{t}
                  </span>
                ))}
              </div>

              <span className="text-[10px] font-semibold text-indigo-400 group-hover:text-indigo-300 flex items-center space-x-1">
                <span>Inspect</span>
                <Eye className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lore Entry Detail Drawer / Modal */}
      {activeLoreDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setActiveLoreDetail(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {activeLoreDetail.category}
                </span>
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono border ${getSecrecyBadge(activeLoreDetail.secrecyLevel)}`}>
                  {activeLoreDetail.secrecyLevel}
                </span>
              </div>

              <h2 className="text-xl font-bold text-white">{activeLoreDetail.title}</h2>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs text-slate-300">
              <strong className="text-slate-100 block font-mono">Summary Pitch:</strong>
              <p>{activeLoreDetail.summary}</p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <strong className="text-slate-100 block font-mono">Detailed Lore Specifications & Mechanics:</strong>
              <p className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl leading-relaxed">
                {activeLoreDetail.detailedContent}
              </p>
            </div>

            {activeLoreDetail.associatedCharacters.length > 0 && (
              <div className="space-y-1 text-xs">
                <strong className="text-slate-400 font-mono block">Associated Characters:</strong>
                <div className="flex flex-wrap gap-1.5">
                  {activeLoreDetail.associatedCharacters.map((char, i) => (
                    <span key={i} className="text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveLoreDetail(null)}
                className="px-4 py-1.5 bg-slate-800 text-slate-200 rounded-xl text-xs font-bold"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Creating New Lore Entry */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={onCloseCreateModal}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <span>New Lore & Magic Entry</span>
              </h2>
              <p className="text-xs text-slate-400">
                Register magic system rules, technological artifacts, ancient relics, or religious myths.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Lore Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Mana-Neural Link Core"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as LoreCategory)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                  >
                    <option value="Magic System">Magic System</option>
                    <option value="Technology">Technology</option>
                    <option value="Relic">Relic</option>
                    <option value="Religion">Religion</option>
                    <option value="Culture">Culture</option>
                    <option value="Species">Species</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Secrecy Classification</label>
                <select
                  value={secrecyLevel}
                  onChange={(e) => setSecrecyLevel(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                >
                  <option value="Public Knowledge">Public Knowledge</option>
                  <option value="Guarded Secret">Guarded Secret</option>
                  <option value="Forbidden Knowledge">Forbidden Knowledge</option>
                  <option value="Classified">Classified</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Summary Pitch *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Short summary of what this magic/tech/relic does..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Detailed Specifications & Mechanics</label>
                <textarea
                  rows={3}
                  placeholder="In-depth rule mechanics, activation triggers, side effects, and origin story..."
                  value={detailedContent}
                  onChange={(e) => setDetailedContent(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={onCloseCreateModal}
                  className="px-4 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLore.isPending || !title.trim() || !summary.trim()}
                  className="px-5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30"
                >
                  {createLore.isPending ? 'Saving...' : 'Add Lore Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
