## 1. Database Schema

- [ ] 1.1 Create migration for internal_notes table with columns: id, entity_type, entity_id, note_text, created_by, created_at
- [ ] 1.2 Add CHECK constraint for entity_type IN ('customer', 'priority', 'request')
- [ ] 1.3 Add foreign key constraint on created_by to profiles(id)
- [ ] 1.4 Add index on (entity_type, entity_id) for efficient lookups
- [ ] 1.5 Enable RLS on internal_notes table

## 2. RLS Policies

- [ ] 2.1 Create SELECT policy allowing only admin and staff roles
- [ ] 2.2 Create INSERT policy allowing only admin and staff roles
- [ ] 2.3 Verify no UPDATE policy exists (append-only)
- [ ] 2.4 Verify no DELETE policy exists (append-only)

## 3. TypeScript Types

- [ ] 3.1 Add InternalNote interface to types/database.ts
- [ ] 3.2 Add InternalNoteWithAuthor interface (includes author profile info)
- [ ] 3.3 Add EntityType type ('customer' | 'priority' | 'request')

## 4. Server Actions

- [ ] 4.1 Create getInternalNotes(entityType, entityId) action in app/actions/internal-notes.ts
- [ ] 4.2 Create createInternalNote(entityType, entityId, noteText) action
- [ ] 4.3 Add Zod validation schema for note creation
- [ ] 4.4 Add role check to ensure only admin/staff can create notes

## 5. UI Components

- [ ] 5.1 Create InternalNotesSection component in components/internal-notes/
- [ ] 5.2 Create InternalNoteCard component to display individual note
- [ ] 5.3 Create AddNoteForm component with textarea and submit button
- [ ] 5.4 Style notes list with scrollable container if many notes
- [ ] 5.5 Format timestamps using relative time (e.g., "2 hours ago")

## 6. Customer Page Integration

- [ ] 6.1 Add InternalNotesSection to customer detail page
- [ ] 6.2 Pass entityType='customer' and entityId to component
- [ ] 6.3 Conditionally render only for admin/staff roles
- [ ] 6.4 Remove internal_notes field from CustomerForm
- [ ] 6.5 Remove internal_notes from customer Zod schema

## 7. Priority Page Integration

- [ ] 7.1 Add InternalNotesSection to priority detail page
- [ ] 7.2 Pass entityType='priority' and entityId to component
- [ ] 7.3 Conditionally render only for admin/staff roles
- [ ] 7.4 Remove internal_notes field from PriorityForm
- [ ] 7.5 Remove internal_notes from priority Zod schema

## 8. Request Page Integration

- [ ] 8.1 Add InternalNotesSection to request detail page
- [ ] 8.2 Pass entityType='request' and entityId to component
- [ ] 8.3 Conditionally render only for admin/staff roles
- [ ] 8.4 Remove internal_notes field from RequestForm
- [ ] 8.5 Remove internal_notes from request Zod schema

## 9. Column Removal

- [ ] 9.1 Create migration to drop internal_notes column from customers table
- [ ] 9.2 Create migration to drop internal_notes column from priorities table
- [ ] 9.3 Create migration to drop internal_notes column from requests table

## 10. Testing

- [ ] 10.1 Test adding notes as admin user
- [ ] 10.2 Test adding notes as staff user
- [ ] 10.3 Verify customer_user cannot see notes section
- [ ] 10.4 Verify notes display in correct order (newest first)
- [ ] 10.5 Verify author name and timestamp display correctly
- [ ] 10.6 Verify new notes can be added and displayed correctly
