import React, { useState } from 'react';
import { 
  Mic, 
  Play, 
  Pause, 
  Sparkles, 
  Volume2, 
  Plus, 
  Trash2, 
  Radio, 
  Sliders, 
  CheckCircle2 
} from 'lucide-react';
import { Project, VoiceTrack } from '../../types';
import { useDetailedCharacters } from '../../hooks/useCharacterStudioData';

interface VoiceDubbingRigTabProps {
  project: Project;
  onUpdateProject: (updatedProject: Project) => void;
  preselectedCharacterName?: string;
}

export const VoiceDubbingRigTab: React.FC<VoiceDubbingRigTabProps> = ({
  project,
  onUpdateProject,
  preselectedCharacterName
}) => {
  const detailedCharsQuery = useDetailedCharacters();
  const characterList = detailedCharsQuery.data || [];

  const [selectedVoice, setSelectedVoice] = useState('Kore');
  const [emotion, setEmotion] = useState<'heroic' | 'dramatic' | 'tsundere' | 'whisper' | 'energetic' | 'calm'>('heroic');
  const [characterName, setCharacterName] = useState(preselectedCharacterName || characterList[0]?.name || 'Ren Kurogane');
  const [dialogueText, setDialogueText] = useState('Target acquired! OmniCorp enforcers step back if you value your neural cores!');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  const voiceOptions = [
    { name: 'Kore', label: 'Kore (Female - Fierce / Heroic Protagonist)', gender: 'Female' },
    { name: 'Puck', label: 'Puck (Male - Witty Netrunner / Energetic)', gender: 'Male' },
    { name: 'Fenrir', label: 'Fenrir (Male - Deep Villain / Corporate Lord)', gender: 'Male' },
    { name: 'Zephyr', label: 'Zephyr (Female - Elegant Mage / Calm)', gender: 'Female' },
    { name: 'Charon', label: 'Charon (Male - Stoic Mentor / Narrator)', gender: 'Male' }
  ];

  const handleSynthesizeVoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dialogueText.trim()) return;

    setIsSynthesizing(true);
    try {
      const response = await fetch('/api/gemini/tts-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: dialogueText,
          voiceName: selectedVoice,
          emotion: emotion
        })
      });

      const data = await response.json();
      if (data.success && data.audioBase64) {
        const newTrack: VoiceTrack = {
          id: `vt-${Date.now()}`,
          characterName: characterName,
          voiceName: selectedVoice,
          emotion: emotion,
          text: dialogueText,
          audioBase64: data.audioBase64,
          createdAt: new Date().toISOString()
        };

        const updatedTracks = [newTrack, ...(project.voiceTracks || [])];
        onUpdateProject({ ...project, voiceTracks: updatedTracks });

        // Auto play generated audio
        playBase64Audio(data.audioBase64, newTrack.id);
      }
    } catch (err) {
      console.error('TTS Dubbing synthesis error:', err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const playBase64Audio = (base64String: string, trackId: string) => {
    if (audioRef) {
      audioRef.pause();
    }
    const audio = new Audio(`data:audio/mp3;base64,${base64String}`);
    setAudioRef(audio);
    setActivePlayingId(trackId);

    audio.play().catch((err) => console.log('Audio playback error:', err));
    audio.onended = () => {
      setActivePlayingId(null);
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Voice Synthesis Panel */}
      <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl backdrop-blur-sm">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <h2 className="text-sm font-bold text-white tracking-wide uppercase">
            SYNTHESIZE NEURAL VOICE DUB
          </h2>
        </div>

        <form onSubmit={handleSynthesizeVoice} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">TARGET ANIME CHARACTER</label>
            <select
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {characterList.map((c) => (
                <option key={c.id} value={c.name}>{c.name} ({c.role})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">GEMINI VOICE MODEL</label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {voiceOptions.map((v) => (
                <option key={v.name} value={v.name}>{v.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">EMOTION & INTENSIFIER</label>
            <div className="grid grid-cols-3 gap-2">
              {(['heroic', 'tsundere', 'dramatic', 'whisper', 'energetic', 'calm'] as const).map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setEmotion(em)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold capitalize border transition-all cursor-pointer ${
                    emotion === em
                      ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">DIALOGUE SCRIPT LINE *</label>
            <textarea
              value={dialogueText}
              onChange={(e) => setDialogueText(e.target.value)}
              placeholder="Type character line for neural dubbing..."
              className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSynthesizing || !dialogueText.trim()}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSynthesizing ? 'Synthesizing Neural Voice...' : 'Synthesize Voice Track'}</span>
          </button>
        </form>
      </div>

      {/* Right Column: Audio Library */}
      <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span>DUBBED VOICE TRACK LIBRARY ({(project.voiceTracks || []).length})</span>
          </h2>
        </div>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {(project.voiceTracks || []).map((track) => {
            const isPlaying = activePlayingId === track.id;
            return (
              <div
                key={track.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-500/40 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">{track.characterName}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-emerald-300 rounded uppercase">
                      {track.voiceName} • {track.emotion}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 italic">"{track.text}"</p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {track.audioBase64 && (
                    <button
                      onClick={() => playBase64Audio(track.audioBase64!, track.id)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                        isPlaying
                          ? 'bg-emerald-600 text-white animate-pulse'
                          : 'bg-slate-800 hover:bg-slate-700 text-emerald-300'
                      }`}
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isPlaying ? 'Playing...' : 'Play Audio'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      const updated = (project.voiceTracks || []).filter((t) => t.id !== track.id);
                      onUpdateProject({ ...project, voiceTracks: updated });
                    }}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {(project.voiceTracks || []).length === 0 && (
            <div className="text-center py-12 text-slate-500 text-xs">
              No voice tracks generated yet. Use the synthesizer on the left to produce voice dialogue!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
