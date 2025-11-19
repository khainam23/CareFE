# Support API Endpoints Documentation

## Overview
This document describes all support-related API endpoints configured in the Care Service frontend application.

## Base Configuration

- **Base URL**: `http://localhost:8080` (configurable via `VITE_API_BASE_URL`)
- **Authentication**: JWT Bearer token (automatically added via axios interceptor)
- **Authorization**: Requires `ROLE_SUPPORT` or `ROLE_ADMIN`
- **Response Format**: All endpoints return `ApiResponse<T>` wrapper with `success`, `message`, and `data` fields

## Endpoints

### 1. Get All Tickets
**Endpoint**: `GET /api/support/tickets`  
**Service Method**: `supportService.getTickets()`  
**Description**: Retrieves all support tickets in the system  
**Authorization**: ROLE_SUPPORT or ROLE_ADMIN  
**Response**: `ApiResponse<List<SupportTicketDTO>>`

**Example Usage**:
```javascript
const response = await supportService.getTickets();
if (response.success) {
  const tickets = response.data;
}
```

---

### 2. Get Unassigned Tickets
**Endpoint**: `GET /api/support/tickets/unassigned`  
**Service Method**: `supportService.getUnassignedTickets()`  
**Description**: Retrieves tickets that have not been assigned to any support staff  
**Authorization**: ROLE_SUPPORT or ROLE_ADMIN  
**Response**: `ApiResponse<List<SupportTicketDTO>>`

**Example Usage**:
```javascript
const response = await supportService.getUnassignedTickets();
if (response.success) {
  const unassignedTickets = response.data;
}
```

---

### 3. Get Assigned Tickets
**Endpoint**: `GET /api/support/tickets/assigned`  
**Service Method**: `supportService.getAssignedTickets()`  
**Description**: Retrieves tickets assigned to the current support staff member  
**Authorization**: ROLE_SUPPORT or ROLE_ADMIN  
**Response**: `ApiResponse<List<SupportTicketDTO>>`

**Example Usage**:
```javascript
const response = await supportService.getAssignedTickets();
if (response.success) {
  const myTickets = response.data;
}
```

---

### 4. Get Ticket By ID
**Endpoint**: `GET /api/support/tickets/:id`  
**Service Method**: `supportService.getTicketById(ticketId)`  
**Description**: Retrieves detailed information for a specific ticket  
**Authorization**: ROLE_SUPPORT or ROLE_ADMIN  
**Parameters**:
- `ticketId` (number): The ID of the ticket to retrieve

**Response**: `ApiResponse<SupportTicketDTO>`

**Example Usage**:
```javascript
const response = await supportService.getTicketById(123);
if (response.success) {
  const ticket = response.data;
}
```

---

### 5. Assign Ticket
**Endpoint**: `PUT /api/support/tickets/:id/assign`  
**Service Method**: `supportService.assignTicket(ticketId)`  
**Description**: Assigns a ticket to the current support staff member  
**Authorization**: ROLE_SUPPORT or ROLE_ADMIN  
**Parameters**:
- `ticketId` (number): The ID of the ticket to assign

**Request Body**:
```json
{
  "supportUserId": 123
}
```

**Response**: `ApiResponse<SupportTicketDTO>`

**Example Usage**:
```javascript
const response = await supportService.assignTicket(123);
if (response.success) {
  console.log('Ticket assigned successfully');
}
```

**Note**: The service automatically retrieves the current user ID from localStorage.

---

### 6. Update Ticket Status
**Endpoint**: `PUT /api/support/tickets/:id/status`  
**Service Method**: `supportService.updateTicketStatus(ticketId, status)`  
**Description**: Updates the status of a ticket  
**Authorization**: ROLE_SUPPORT or ROLE_ADMIN  
**Parameters**:
- `ticketId` (number): The ID of the ticket to update
- `status` (string): New status value (OPEN, IN_PROGRESS, RESOLVED, CLOSED)

**Request Body**:
```json
{
  "status": "IN_PROGRESS"
}
```

**Response**: `ApiResponse<SupportTicketDTO>`

**Example Usage**:
```javascript
const response = await supportService.updateTicketStatus(123, 'IN_PROGRESS');
if (response.success) {
  console.log('Status updated successfully');
}
```

---

### 7. Resolve Ticket
**Endpoint**: `PUT /api/support/tickets/:id/resolve`  
**Service Method**: `supportService.resolveTicket(ticketId, resolution)`  
**Description**: Resolves a ticket with a solution text  
**Authorization**: ROLE_SUPPORT or ROLE_ADMIN  
**Parameters**:
- `ticketId` (number): The ID of the ticket to resolve
- `resolution` (string): The resolution text (minimum 10 characters)

**Request Body**:
```json
{
  "resolution": "Issue resolved by resetting the password and verifying email."
}
```

**Response**: `ApiResponse<SupportTicketDTO>`

**Example Usage**:
```javascript
const resolution = "Issue resolved by resetting the password.";
const response = await supportService.resolveTicket(123, resolution);
if (response.success) {
  console.log('Ticket resolved successfully');
}
```

---

### 8. Escalate Ticket
**Endpoint**: `PUT /api/support/tickets/:id/escalate`  
**Service Method**: `supportService.escalateTicket(ticketId)`  
**Description**: Escalates a ticket to Admin for higher-level handling  
**Authorization**: ROLE_SUPPORT or ROLE_ADMIN  
**Parameters**:
- `ticketId` (number): The ID of the ticket to escalate

**Response**: `ApiResponse<SupportTicketDTO>`

**Example Usage**:
```javascript
const response = await supportService.escalateTicket(123);
if (response.success) {
  console.log('Ticket escalated successfully');
}
```

---

## Data Models

### SupportTicketDTO
```typescript
{
  id: number;
  ticketNumber: string;
  customerId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  category: string; // TECHNICAL, ACCOUNT, BOOKING, PAYMENT, VERIFICATION, COMPLAINT, FEEDBACK
  priority: string; // LOW, MEDIUM, HIGH, URGENT
  status: string; // OPEN, IN_PROGRESS, RESOLVED, CLOSED, ESCALATED
  subject: string;
  description: string;
  assignedToId: number | null;
  assignedToName: string | null;
  resolution: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}
```

### ApiResponse<T>
```typescript
{
  success: boolean;
  message: string;
  data: T;
}
```

## Error Handling

All service methods use try-catch blocks and throw errors in a consistent format:

```javascript
try {
  const response = await supportService.getTickets();
  return response.data;
} catch (error) {
  throw error.response?.data || error.message;
}
```

Common error scenarios:
- **401 Unauthorized**: Token expired or invalid (automatically redirects to login)
- **403 Forbidden**: User doesn't have required role
- **404 Not Found**: Ticket doesn't exist
- **400 Bad Request**: Invalid request data

## Authentication

All requests automatically include the JWT token via axios interceptor:

```javascript
config.headers.Authorization = `Bearer ${token}`;
```

The token is retrieved from `localStorage.getItem('token')`.

## Testing

Use the test utility to verify all endpoints:

```javascript
import { testSupportEndpoints } from '../utils/supportApiTest';

// Run all tests
await testSupportEndpoints();

// Or test individual endpoints
import { testGetAllTickets, testAssignTicket } from '../utils/supportApiTest';
await testGetAllTickets();
await testAssignTicket(123);
```

## Configuration Files

- **Endpoints**: `CareFE/src/api/endpoints.js`
- **Service**: `CareFE/src/services/supportService.js`
- **Axios Config**: `CareFE/src/api/axiosConfig.js`
- **Test Utility**: `CareFE/src/utils/supportApiTest.js`
