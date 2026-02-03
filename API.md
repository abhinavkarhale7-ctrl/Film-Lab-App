# API Documentation

This document describes the REST API endpoints for the Film Lab Management App.

## Base URL

- Development: `http://localhost:3000`
- Production: `https://your-domain.com`

## Authentication

The API uses NextAuth.js for authentication with JWT tokens. Include session cookies with requests.

### Login

**Endpoint:** `POST /api/auth/signin`

Uses NextAuth's built-in authentication flow.

## API Endpoints

### Users

#### Register New User

**Endpoint:** `POST /api/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+1234567890"
}
```

**Response:** `201 Created`
```json
{
  "message": "User created successfully",
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "CUSTOMER"
  }
}
```

**Errors:**
- `400 Bad Request` - Invalid input or user already exists
- `500 Internal Server Error` - Server error

---

### Orders

#### Create Order

**Endpoint:** `POST /api/orders`

**Authentication:** Required

**Request Body:**
```json
{
  "filmType": "MM35_C41",
  "scanType": "HIGH_RES",
  "quantity": 2,
  "specialInstructions": "Please handle with care",
  "pushPull": true,
  "rushService": false,
  "prints": true
}
```

**Film Types:**
- `MM35_C41` - 35mm Color (C-41)
- `MM35_BW` - 35mm Black & White
- `MM120_C41` - 120 Color (C-41)
- `MM120_BW` - 120 Black & White
- `E6_SLIDE` - E-6 Slide Film

**Scan Types:**
- `STANDARD` - Standard scan ($15/roll)
- `HIGH_RES` - High-resolution scan ($25/roll)
- `PROFESSIONAL` - Professional scan ($40/roll)

**Response:** `201 Created`
```json
{
  "message": "Order created successfully",
  "order": {
    "id": "clx...",
    "orderNumber": "FL-L8M9N0P1-Q2R3S",
    "totalPrice": 95.00,
    "status": "RECEIVED"
  }
}
```

**Errors:**
- `401 Unauthorized` - Not authenticated
- `400 Bad Request` - Invalid input
- `500 Internal Server Error` - Server error

---

#### Get All Orders

**Endpoint:** `GET /api/orders`

**Authentication:** Required

**Query Parameters:** None

**Response:** `200 OK`
```json
{
  "orders": [
    {
      "id": "clx...",
      "orderNumber": "FL-L8M9N0P1-Q2R3S",
      "userId": "clx...",
      "status": "RECEIVED",
      "totalPrice": 95.00,
      "filmType": "MM35_C41",
      "scanType": "HIGH_RES",
      "quantity": 2,
      "specialInstructions": "Handle with care",
      "estimatedCompletion": "2024-01-15T00:00:00.000Z",
      "createdAt": "2024-01-08T10:30:00.000Z",
      "updatedAt": "2024-01-08T10:30:00.000Z",
      "user": {
        "id": "clx...",
        "email": "customer@example.com",
        "name": "Customer Name"
      },
      "orderItems": [
        {
          "id": "clx...",
          "serviceType": "HIGH_RES Scanning",
          "quantity": 2,
          "unitPrice": 25.00,
          "subtotal": 50.00
        }
      ]
    }
  ]
}
```

**Notes:**
- Customers see only their orders
- Admin/Staff see all orders

**Errors:**
- `401 Unauthorized` - Not authenticated
- `500 Internal Server Error` - Server error

---

#### Get Order by ID

**Endpoint:** `GET /api/orders/:id`

**Authentication:** Required

**Path Parameters:**
- `id` - Order ID

**Response:** `200 OK`
```json
{
  "order": {
    "id": "clx...",
    "orderNumber": "FL-L8M9N0P1-Q2R3S",
    "userId": "clx...",
    "status": "RECEIVED",
    "totalPrice": 95.00,
    "filmType": "MM35_C41",
    "scanType": "HIGH_RES",
    "quantity": 2,
    "specialInstructions": "Handle with care",
    "estimatedCompletion": "2024-01-15T00:00:00.000Z",
    "createdAt": "2024-01-08T10:30:00.000Z",
    "updatedAt": "2024-01-08T10:30:00.000Z",
    "user": {
      "id": "clx...",
      "email": "customer@example.com",
      "name": "Customer Name"
    },
    "orderItems": [
      {
        "id": "clx...",
        "serviceType": "HIGH_RES Scanning",
        "quantity": 2,
        "unitPrice": 25.00,
        "subtotal": 50.00,
        "createdAt": "2024-01-08T10:30:00.000Z"
      }
    ],
    "scans": []
  }
}
```

**Errors:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized to view this order
- `404 Not Found` - Order not found
- `500 Internal Server Error` - Server error

---

#### Update Order Status

**Endpoint:** `PATCH /api/orders/:id`

**Authentication:** Required (Admin/Staff only)

**Path Parameters:**
- `id` - Order ID

**Request Body:**
```json
{
  "status": "IN_PROCESS"
}
```

**Order Statuses:**
- `RECEIVED` - Order received
- `IN_PROCESS` - Being processed
- `SCANNING` - Scanning in progress
- `READY_FOR_PICKUP` - Ready for customer pickup
- `SHIPPED` - Shipped to customer
- `COMPLETED` - Order completed

**Response:** `200 OK`
```json
{
  "message": "Order updated successfully",
  "order": {
    "id": "clx...",
    "orderNumber": "FL-L8M9N0P1-Q2R3S",
    "status": "IN_PROCESS",
    "updatedAt": "2024-01-08T11:00:00.000Z"
  }
}
```

**Errors:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not admin/staff
- `400 Bad Request` - Invalid status
- `500 Internal Server Error` - Server error

---

## Data Models

### User

```typescript
{
  id: string;
  email: string;
  passwordHash: string;
  name: string | null;
  phone: string | null;
  role: "CUSTOMER" | "ADMIN" | "STAFF";
  createdAt: Date;
  updatedAt: Date;
}
```

### Order

```typescript
{
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  totalPrice: number;
  filmType: FilmType;
  scanType: ScanType;
  quantity: number;
  specialInstructions: string | null;
  estimatedCompletion: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### OrderItem

```typescript
{
  id: string;
  orderId: string;
  serviceType: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  createdAt: Date;
}
```

### Scan

```typescript
{
  id: string;
  orderId: string;
  fileUrl: string;
  fileSize: number;
  uploadDate: Date;
  scanSettings: string | null;
}
```

## Error Handling

All errors follow this format:

```json
{
  "error": "Error message",
  "details": [] // Optional, for validation errors
}
```

### Common HTTP Status Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Rate Limiting

Currently not implemented. Consider adding rate limiting for production:
- 100 requests per minute per IP
- 1000 requests per hour per user

## Pagination

Currently not implemented. For large result sets, consider adding:
- `page` query parameter
- `limit` query parameter (default: 50, max: 100)
- Response includes pagination metadata

## Future Endpoints

These endpoints are planned for future implementation:

### Payments
- `POST /api/payments` - Create payment
- `GET /api/payments/:id` - Get payment details

### File Upload
- `POST /api/upload` - Upload reference images
- `GET /api/scans/:orderId` - Download scans

### Services
- `GET /api/services` - List available services
- `POST /api/services` - Create service (admin)
- `PATCH /api/services/:id` - Update service (admin)

### Analytics
- `GET /api/analytics/orders` - Order statistics
- `GET /api/analytics/revenue` - Revenue reports

## Testing

Use tools like:
- **Postman** - API testing
- **Insomnia** - API client
- **curl** - Command line testing

Example curl request:
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

## Changelog

### v1.0.0 (Current)
- User registration and authentication
- Order creation and management
- Admin order status updates
- Role-based access control

### Planned for v1.1.0
- Payment processing
- File upload/download
- Email notifications
- Analytics endpoints
