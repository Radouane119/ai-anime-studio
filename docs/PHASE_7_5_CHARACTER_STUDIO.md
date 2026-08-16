# Phase 7.5 — Character Studio & Voice Dubbing Rig Engine Documentation

## Overview
Phase 7.5 introduces the **Character Studio & Voice Dubbing Rig Engine** to AI Anime Studio. This feature set empowers creators to design high-detail anime character sheets, generate multi-angle expression sheets, manage character stat radars, and synthesize dubbed voice lines using Gemini TTS models.

---

## Core Features

### 1. Character Roster & Sheet Management
- **Detailed Character Cards**: Displays character avatar image, Japanese name typography, elemental affinity badges, role tags, and signature ultimate moves.
- **Roster Search & Role Filters**: Instant client-side search by character name, backstory keywords, and role archetype (Protagonist, Antagonist, Mentor, Rival).
- **Radar Stats Matrix**: Tracks Combat Power, Agility, Tactics, Mana Affinity, and Defense ratings.

### 2. Multi-Angle Expression Sheets
- **Expression Sheets Grid**: Visual grid storing expression variants (`Heroic / Determined`, `Tsundere / Blushing`, `Combat Rage`, `Sly Smile`, `Melancholy`).
- **Dynamic Expression Generation**: Allows adding custom prompt-based expression sheets to any character sheet in the roster.

### 3. Gemini TTS Voice Dubbing Rig
- **Neural Voice Models**: Select from Gemini voice presets (`Kore`, `Puck`, `Fenrir`, `Zephyr`, `Charon`).
- **Emotion Intensifiers**: Tailor synthesized speech tone (`heroic`, `dramatic`, `tsundere`, `whisper`, `energetic`, `calm`).
- **Base64 Audio Player & Library**: Direct in-memory audio playback of synthesized MP3 voice tracks stored in project state.

### 4. Gemini 1.5 Pro Character Generator
- **Prompt-Based Character Synthesis**: Generates complete anime character sheets with Japanese typography, backstories, stats, and default voice profiles.

---

## Technical Architecture

- **`src/types.ts`**: Defines `DetailedCharacter`, `CharacterSheetStats`, `CharacterExpression`, `CharacterVoiceProfile`, and `CharacterStudioTelemetry`.
- **`src/hooks/useCharacterStudioData.ts`**: TanStack Query hooks for characters list, telemetry calculation, character creation, and expression addition.
- **`src/components/character/`**:
  - `CharacterStudioHeader.tsx`: Studio header & sub-tab navigation (`Roster`, `Expressions`, `Voice Rig`, `Stats`).
  - `CharacterGridCard.tsx`: Individual character roster card.
  - `CharacterDetailModal.tsx`: Comprehensive character sheet modal.
  - `AiCharacterGeneratorModal.tsx`: Gemini 1.5 Pro AI character synthesizer modal.
  - `VoiceDubbingRigTab.tsx`: Integrated TTS voice dubbing studio and track player library.
- **`src/components/studios/CharacterStudioView.tsx`**: Main container component.
- **`src/__tests__/character_studio.test.ts`**: Phase 7.5 test suite.

---

## Verification & Status
- **TypeScript**: Passed clean (`tsc --noEmit`).
- **Applet Compilation**: Succeeded via `compile_applet`.
