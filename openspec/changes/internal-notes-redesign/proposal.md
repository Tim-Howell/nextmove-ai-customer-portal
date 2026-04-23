## Why

Internal notes are currently stored as a single text field on customers, priorities, and requests. This limits staff to one note per record with no history, attribution, or timestamps. Staff need to track multiple interactions, decisions, and updates over time with clear accountability of who wrote what and when.

## What Changes

- Create a new `internal_notes` table to store notes as separate records linked to parent entities
- Add "Internal Notes" section to Customer, Priority, and Request detail pages
- Display notes in reverse chronological order with author name and timestamp
- Provide "Add Note" functionality with a simple form (note text only, author/date auto-populated)
- Remove the single `internal_notes` text field from customer, priority, and request forms
- Migrate existing internal notes to the new system as initial notes

## Capabilities

### New Capabilities

- `internal-notes`: Multi-note system for customers, priorities, and requests with author tracking and timestamps

### Modified Capabilities

(None - this is additive functionality that doesn't change existing spec requirements)

## Impact

- **Database**: New `internal_notes` table with polymorphic reference (entity_type + entity_id)
- **UI Components**: New InternalNotesSection component, AddNoteForm component
- **Server Actions**: New createInternalNote action
- **Pages**: Customer detail, Priority detail, Request detail pages updated
- **Forms**: CustomerForm, PriorityForm, RequestForm - remove internal_notes field
- **Migration**: Data migration for existing internal_notes content
