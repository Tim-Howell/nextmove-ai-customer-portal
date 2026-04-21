## MODIFIED Requirements

### Requirement: Notify internal users of new requests
When a customer submits a request, the system SHALL notify internal users via email.

#### Scenario: New request notification sent
- **WHEN** customer user submits a new request
- **THEN** system creates request AND sends notification email to internal staff

#### Scenario: No internal staff to notify
- **WHEN** customer user submits a request AND no internal staff emails are configured
- **THEN** system creates request AND logs warning about missing recipients

### Requirement: Notify customers of request status changes
When an internal user changes a request's status, the system SHALL notify the customer via email.

#### Scenario: Status change notification sent
- **WHEN** internal user changes request status from "New" to "In Review"
- **THEN** system updates request AND sends status update email to customer contacts with portal access

#### Scenario: Status unchanged
- **WHEN** internal user updates request without changing status
- **THEN** system updates request AND does not send status notification email
