# Phase 7.3 — Projects Workspace & Multi-Format Pipelines Documentation

## Overview
Phase 7.3 delivers a comprehensive **Projects Workspace & Multi-Format Pipelines Engine** for **AI Anime Studio**. It provides creators and studio leads with a centralized workspace to manage, filter, duplicate, and transition multi-format anime projects across pre-production, scripting, storyboarding, 4K keyframe animation, and published release.

---

## Key Features & Architecture

1. **Multi-Format Support**:
   - **Anime Series**: Multi-episode 4K animated productions with voice dubbing and keyframe interpolation.
   - **Light Novels**: Prose chapter authoring powered by Gemini AI scene beat suggestions.
   - **Manga / Comics**: Multi-panel layouts with dialogue bubbles, camera angles, and SFX styling.
   - **YouTube Shorts**: Vertical 9:16 high-fps viral animation rigs.

2. **3 Flexible View Layout Modes**:
   - **Grid View**: Visual card layout with cover image overlays, progress meters, format badges, team avatars, favorite pins, and quick launch triggers.
   - **Table View**: High-density studio table displaying format, pipeline stage, completion %, episode/character metrics, team members, and actions.
   - **Kanban Board View**: Column-based pipeline view organizing projects into 5 stages (`Pre-Production` → `Scripting` → `Storyboarding` → `4K Animation` → `Release`). Includes 1-click stage advancement controls.

3. **Production Telemetry Bar**:
   - Live metrics summary displaying Active Series Rigs, Episode & Character counts, Published Releases, and Average Studio Completion percentage.

4. **New Project Creation Modal**:
   - Custom drawer modal for initializing new studio rigs with format selection, genre archetype presets (Cyberpunk, Dark Fantasy, Action/Shonen, Slice of Life, Mecha, Supernatural, Isekai), lore synopsis, custom tags, and initial asset defaults.

---

## API Endpoints Reference

| Endpoint | Method | Description | Response Schema |
| :--- | :--- | :--- | :--- |
| `/api/projects` | `GET` | Returns filtered projects list | `{ success: true, projects: WorkspaceProject[], totalCount: number }` |
| `/api/projects/stats` | `GET` | Returns workspace pipeline summary stats | `{ success: true, stats: WorkspaceProjectStats }` |
| `/api/projects` | `POST` | Creates a new multi-format project rig | `{ success: true, project: WorkspaceProject }` |
| `/api/projects/:id` | `PUT` | Updates project properties or pipeline stage | `{ success: true, project: WorkspaceProject }` |
| `/api/projects/:id/clone` | `POST` | Duplicates an existing project rig | `{ success: true, project: WorkspaceProject }` |
| `/api/projects/:id` | `DELETE` | Archives/removes a project rig | `{ success: true, message: string, id: string }` |

---

## Component Structure

```
src/components/studios/ProjectsWorkspaceView.tsx
 ├── ProjectsHeader.tsx (Format tabs, search, status & sort dropdowns, view switcher, CTA)
 ├── ProjectCardGrid.tsx (Grid of rich project cards with cover overlays & sub-studio links)
 ├── ProjectTableView.tsx (Dense table layout for team management)
 ├── ProjectKanbanBoard.tsx (5-column pipeline stage board with stage step controls)
 └── CreateProjectModal.tsx (Creation modal with format specs, genre presets & tags)
```

---

## Verification & Testing

- Unit & logic test runner in `/src/__tests__/projects_workspace.test.ts`.
- Linter verification passed cleanly (`npm run lint`).
- Full applet compilation verified via `compile_applet`.
