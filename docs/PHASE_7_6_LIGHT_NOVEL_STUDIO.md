# Phase 7.6 — Light Novel Studio Integration

## Delivered

The main **Novel Studio** navigation route now opens the advanced light-novel workspace rather than the legacy chapter editor. The workspace includes:

- chapter manuscript editing with word counts and saved drafts;
- tagged dialogue nodes for speaker and emotion tracking;
- a volume outline and scene-breakdown view;
- illustration anchors tied to a chapter paragraph; and
- an AI chapter-draft flow.

## AI draft flow

The chapter generator sends the chapter premise, active project genre and format, and the active project character roster to `POST /api/gemini/story-script`. The response is normalized into a chapter draft and a key-visual illustration anchor before the creator chooses to commit it to the volume outline.

If the server or model is unavailable, the generator keeps the modal open and displays an actionable error. It no longer silently presents a fabricated draft as an AI result.

## Storage

Light-novel studio drafts are stored in browser local storage under `studio_light_novel_chapters`, using the existing TanStack Query mutations. This keeps editing usable without a database migration.
