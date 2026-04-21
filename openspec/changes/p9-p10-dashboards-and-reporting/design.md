# Design: Phase 9-10 Dashboards and Reporting

## Dashboard Enhancements

### Internal Dashboard (`/dashboard`)
Current: 5 summary cards (customers, contracts, hours, priorities, requests)

Add:
```
┌─────────────────────────────────────────────────────────────┐
│ [Existing 5 summary cards]                                  │
├─────────────────────────────┬───────────────────────────────┤
│ Recent Requests             │ Recent Time Entries           │
│ - Title, Customer, Status   │ - Date, Customer, Hours       │
│ - Link to /requests         │ - Link to /time-logs          │
├─────────────────────────────┴───────────────────────────────┤
│ Quick Actions                                               │
│ [Log Time] [New Request] [New Priority] [View Reports]      │
└─────────────────────────────────────────────────────────────┘
```

### Customer Dashboard
Current: 4 cards + Quick Actions + Recent Time Entries

Add:
- Recent Requests section (title, status, date)
- Recent Priorities section (title, status, level)

## Reporting Module

### Routes
- `/reports` - Main reports page (internal: all data, customer: their data)

### Internal Reports Page
```
┌─────────────────────────────────────────────────────────────┐
│ Reports                                                     │
├─────────────────────────────────────────────────────────────┤
│ Filters:                                                    │
│ [Customer ▼] [Date From] [Date To] [Category ▼] [Apply]     │
├─────────────────────────────────────────────────────────────┤
│ Summary Cards:                                              │
│ [Total Hours] [Billable Hours] [Entries Count]              │
├─────────────────────────────────────────────────────────────┤
│ Time Entries Table                            [Export CSV]  │
│ Date | Customer | Contract | Category | Hours | Billable    │
└─────────────────────────────────────────────────────────────┘
```

### Customer Reports Page
Same layout but:
- No customer filter (auto-filtered to their customer)
- Shows only their data

## Server Actions

### New Actions (`app/actions/reports.ts`)
```typescript
interface ReportFilters {
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  categoryId?: string;
}

interface ReportSummary {
  totalHours: number;
  billableHours: number;
  entryCount: number;
}

export async function getTimeEntriesReport(filters: ReportFilters): Promise<{
  summary: ReportSummary;
  entries: TimeEntryWithRelations[];
}>

export async function getRecentRequests(customerId?: string, limit?: number): Promise<RequestWithRelations[]>

export async function getRecentPriorities(customerId?: string, limit?: number): Promise<PriorityWithRelations[]>
```

## CSV Export
Client-side CSV generation from table data:
- Use a simple utility function to convert array to CSV
- Trigger download via blob URL

## Components

### New Components
- `components/reports/report-filters.tsx` - Filter form
- `components/reports/report-summary.tsx` - Summary cards
- `components/reports/time-entries-table.tsx` - Data table with export

### Dashboard Updates
- Update `app/(portal)/dashboard/page.tsx` - Add recent activity sections
- Update `components/dashboard/customer-dashboard.tsx` - Add recent requests/priorities

## Navigation
Add "Reports" link to sidebar for all users.
