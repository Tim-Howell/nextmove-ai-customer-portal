## ADDED Requirements

### Requirement: Document upload
The system SHALL allow internal users to upload documents to contracts.

#### Scenario: Upload document
- **WHEN** internal user uploads a file to a contract
- **THEN** system stores the file in Supabase storage and creates document record

#### Scenario: File size limit
- **WHEN** internal user uploads a file larger than 10MB
- **THEN** system rejects the upload with error message

#### Scenario: Allowed file types
- **WHEN** internal user uploads PDF, DOC, DOCX, XLS, XLSX, or image file
- **THEN** system accepts the upload

### Requirement: Document list
The system SHALL display documents attached to a contract.

#### Scenario: View contract documents
- **WHEN** user views contract detail page
- **THEN** system displays list of attached documents with name, size, and upload date

#### Scenario: No documents
- **WHEN** contract has no documents
- **THEN** system displays "No documents attached" message

### Requirement: Document download
The system SHALL allow authorized users to download contract documents.

#### Scenario: Internal user downloads document
- **WHEN** internal user clicks download on a document
- **THEN** system provides the file for download

#### Scenario: Customer downloads document
- **WHEN** customer user clicks download on their contract's document
- **THEN** system provides the file for download

### Requirement: Document deletion
The system SHALL allow internal users to delete contract documents.

#### Scenario: Delete document
- **WHEN** internal user confirms document deletion
- **THEN** system removes the file from storage and deletes the record

### Requirement: Document access control
The system SHALL restrict document access based on user role.

#### Scenario: Customer cannot upload
- **WHEN** customer user attempts to upload a document
- **THEN** system denies the action

#### Scenario: Customer cannot delete
- **WHEN** customer user attempts to delete a document
- **THEN** system denies the action
