# Phase 7.4 — World Builder & Lore Database Studio Documentation

## Overview
Phase 7.4 delivers a complete **World Builder & Lore Database Studio** for **AI Anime Studio**. It equips creators, writers, and world designers with an interactive suite to design world maps, political faction hierarchies, magic system rulebooks, historical timeline eras, and Gemini-assisted lore generators.

---

## Key Modules & Architecture

1. **Interactive World Map Canvas**:
   - Tactical map grid with pin placement (`mapX`, `mapY`), danger level classifications (`Safe Zone` → `Extinction Level`), regional population stats, controlling factions, and points of interest.

2. **Faction Hierarchy Rigs**:
   - Visual faction relationship matrices with political archetypes (`Syndicate`, `Megacorp`, `Magic Order`, `Rebellion`, `Empire`, `Guild`), power level ratings (1-100), leader profiles, headquarters, allies, and rivals.

3. **Lore Codex & Magic Systems**:
   - Wiki-style categorized database for magic systems, cyber technology, ancient relics, religions, and cultural traditions. Features secrecy level tags (`Public Knowledge`, `Guarded Secret`, `Forbidden Knowledge`, `Classified`) and keyword search filters.

4. **Historical Timeline Engine**:
   - Chronological event timeline detailing eras, major conflicts, cataclysms, discoveries, impact scores (1-10), key factions, and character involvement.

5. **Gemini 1.5 Pro Lore Generator**:
   - AI assistant modal enabling creators to prompt Gemini 1.5 Pro for synthesized lore concepts, magic rules, faction backgrounds, or territory locations with 1-click database commit.

---

## API & Data Layer Reference

- React Query Data Hook: `src/hooks/useWorldBuildingData.ts`
  - `useWorldFactions()`: Fetches & manages factions list
  - `useWorldLoreEntries()`: Fetches & filters lore codex entries
  - `useWorldLocations()`: Fetches world map locations
  - `useWorldTimelineEvents()`: Fetches chronological history events
  - `useWorldBuildingStats()`: Calculates aggregate world telemetry
  - Mutations: `useCreateFaction`, `useCreateLoreEntry`, `useCreateWorldLocation`, `useCreateTimelineEvent`

---

## Component Structure

```
src/components/studios/WorldBuilderStudioView.tsx
 ├── WorldBuilderHeader.tsx (Sub-tabs for Map, Factions, Codex, Timeline + Gemini CTA)
 ├── FactionHierarchyView.tsx (Faction cards, power meters, relationship webs & creation form)
 ├── LoreCodexView.tsx (Wiki-style categorized database with secrecy tags & detail drawer)
 ├── WorldMapCanvasView.tsx (Tactical map canvas with pins, region POIs & location forms)
 ├── TimelineEngineView.tsx (Chronological history track with impact ratings & event forms)
 └── AiLoreGeneratorModal.tsx (Gemini 1.5 Pro lore synthesis modal)
```

---

## Verification & Testing

- Unit & logic test suite: `/src/__tests__/world_builder.test.ts`.
- Linter validation: `npm run lint` passed cleanly with 0 errors.
- Build verification: `compile_applet` compiled successfully.
