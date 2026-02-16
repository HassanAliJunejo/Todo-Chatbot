# Data Model: AI Todo Chatbot

**Feature**: `004-ai-todo-chatbot`
**Date**: 2026-02-14

## Entity Relationship Diagram

```
User (1) ──── (*) AI Task          [ai_tasks]
User (1) ──── (*) Conversation     [ai_conversations]
Conversation (1) ──── (*) Message  [ai_messages]
```

## Entities

### User (existing — not modified)

| Field | Type | Constraints |
|-------|------|-------------|
| id | int | PK, auto-increment |
| email | string | unique, indexed |
| hashed_password | string | bcrypt hash |
| full_name | string? | optional |
| created_at | datetime | auto |

### AI Task (`ai_tasks`)

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | int | PK, auto-increment | |
| user_id | int | FK → user.id, indexed | User isolation |
| title | string | 1–255 chars, required | |
| description | string? | max 1000 chars | |
| completed | bool | default: false | |
| priority | string? | default: "medium" | low/medium/high |
| due_date | datetime? | optional | ISO 8601 |
| created_at | datetime | auto, default: utcnow | |
| updated_at | datetime | auto, default: utcnow | Updated on mutation |

**Relationships**: belongs to User (many-to-one)
**Indexes**: user_id, created_at DESC

### Conversation (`ai_conversations`)

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | int | PK, auto-increment | |
| user_id | int | FK → user.id, indexed | User isolation |
| title | string? | default: "New Conversation", max 255 | |
| created_at | datetime | auto, default: utcnow | |
| updated_at | datetime | auto, default: utcnow | |

**Relationships**: belongs to User (many-to-one), has many Messages
**Indexes**: user_id, created_at DESC

### Message (`ai_messages`)

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | int | PK, auto-increment | |
| role | string | max 20 chars | "user", "assistant", "system" |
| content | string | min 1 char, required | |
| conversation_id | int | FK → ai_conversations.id | |
| created_at | datetime | auto, default: utcnow | |

**Relationships**: belongs to Conversation (many-to-one)
**Indexes**: conversation_id, created_at ASC

## Validation Rules

| Entity | Rule | Source |
|--------|------|--------|
| AI Task | title: 1–255 chars, non-blank | FR-011 |
| AI Task | priority: one of low/medium/high | Skill definition |
| AI Task | user_id: must reference existing user | Constitution I |
| Conversation | user_id: must reference existing user | Constitution I |
| Message | role: one of user/assistant/system | FR-005 |
| Message | content: non-empty | FR-005 |
| Message | conversation_id: must reference existing conversation | FK constraint |

## State Transitions

### AI Task Lifecycle

```
Created (completed=false)
  │
  ├── complete_task → Completed (completed=true)
  │     │
  │     └── complete_task(completed=false) → Pending (completed=false)
  │
  ├── update_task → Modified (same completed state)
  │
  └── delete_task → Deleted (removed from DB)
```

### Conversation Lifecycle

```
New (created via first message or explicit creation)
  │
  ├── message added → Active (messages appended)
  │
  └── (no explicit close — conversations persist indefinitely)
```
