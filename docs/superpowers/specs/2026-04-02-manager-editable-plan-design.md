# Manager Editable Plan — Design Spec

## Context
The manager dashboard generates an AI onboarding plan but currently displays it as read-only. Managers need full editing control before dispatching to demonstrate meaningful human-in-the-loop oversight — the core value prop of Springboard.io.

## Scope
Editable plan UI on `/manager` page. All edits are client-side (mutate React state). No new API routes. No database.

## Editable Sections

### 1. Welcome Message
- Inline `<textarea>` replacing the current read-only `<p>`
- Auto-resizes to content height
- Editable immediately after AI generation

### 2. Buddy Assignment
- Dropdown `<select>` populated from `MOCK_BUDDIES` (imported from `@/lib/mcp/mockData`)
- On change: updates `plan.buddyName` and auto-generates a new `plan.buddyReason` (template string like "{name} is a {role} who will help you get up to speed")
- Manager can also edit the reason text inline

### 3. First Week Goals
- Each goal is an editable text input
- Delete button (X) on each goal
- "Add Goal" button at the bottom
- Minimum 1 goal enforced (disable delete when only 1 remains)

### 4. Agentic Tasks (Full CRUD)
- Each task card displays: type badge, title (editable input), description (editable input)
- Delete button on each card
- "Add Task" button opens an inline form (not a modal) with:
  - Type dropdown: email | permission | calendar | document
  - Title input
  - Description input
  - "Add" button to append to task list
- New tasks get auto-generated IDs (`task_{timestamp}`)
- No minimum task count enforced

### 5. Dispatch
- "Approve & Dispatch" button stays at the bottom
- Serializes the current (edited) plan state to the URL payload
- Passes the full plan object including any `newHireTasks` if present in the AI response

## Files to Modify
- `src/app/manager/page.tsx` — main editing logic and state management
- `src/app/manager/manager.module.css` — styles for editable inputs, add forms, delete buttons
- `src/lib/mcp/mockData.ts` — export `MOCK_BUDDIES` (already exported)

## State Management
All edits mutate a single `plan` state object via `setPlan`. Each section handler creates a shallow copy with the updated field. No form library needed.

## Verification
1. `npm run build` passes
2. Generate a plan → edit welcome message, swap buddy, add/remove goals, add/remove/edit tasks → dispatch → new-hire page renders the edited plan correctly
