# Notification System Design

## Requirements
- **Functional Requirements:**
  - Create notifications.
  - List all notifications.
  - View specific notification details.
  - Mark notifications as read.
  - Delete notifications.
  - Centralized logging for tracking and evaluation.
- **Non-Functional Requirements:**
  - Fast response times.
  - Reusable logging middleware.
  - Clean and responsive frontend.

## Architecture Diagram (Real-Time Architecture)
```mermaid
graph TD
    Client[Client] -->|REST / WS| Gateway[API Gateway]
    Gateway --> NotificationService[Notification Service]
    NotificationService -->|Pub/Sub| Queue[Message Queue (RabbitMQ/Kafka)]
    Queue --> WSServer[WebSocket Server]
    WSServer -->|Push| Students[Students]
    NotificationService -->|Read/Write| DB[(PostgreSQL DB)]
    Client -->|Logs| Logger[Logging Middleware]
    NotificationService -->|Logs| Logger
    Logger -->|POST /evaluation-service/logs| EvalService[Evaluation Service]
```

## Database Design

**Database Selected:** PostgreSQL

**Reason:**
- ACID compliance guarantees reliable transactions.
- Powerful indexing ensures fast querying on large datasets.
- Fast filtering makes it highly suitable for retrieving specific user notifications.

**Schema:**
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    student_id BIGINT NOT NULL,
    type VARCHAR(20),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP
);
```

## API Design
**Core APIs:**
- `POST /notifications`
  - Body: `{ student_id, type, message }`
  - Returns: `201 Created`
- `GET /notifications`
  - Returns: `200 OK`, array of notification objects.
- `GET /notifications/:id`
  - Returns: `200 OK`, specific notification object.
- `PATCH /notifications/:id/read`
  - Returns: `200 OK`, marks the notification as read.
- `DELETE /notifications/:id`
  - Returns: `204 No Content`, deletes the notification.

## Notification Flow
1. User or System interacts with the Notification Service to create a notification.
2. Service saves the notification to PostgreSQL and pushes it to the Message Queue.
3. WebSocket Server consumes the message from the queue and pushes it in real-time to the Student client.
4. Throughout the process, `logging_middleware` captures events and pushes them to the evaluation service.

## Scalability Considerations
- Message Queues (RabbitMQ/Kafka) decouple the notification creation from the real-time delivery, allowing both to scale independently.
- API Gateway handles rate limiting and routing.
- PostgreSQL database can be optimized with read replicas for heavy read operations.

## Error Handling
- Standard HTTP status codes will be used (e.g., 400 for bad input, 404 for not found, 500 for server errors).
- All errors will be logged via the `logging_middleware` with an 'error' stack level.
- The frontend will display user-friendly error messages if the backend responds with a failure.

## Logging Strategy
- A reusable TypeScript `logging_middleware` library is used.
- Logs include `stack`, `level`, `packageName`, and `message`.
- All logs are dispatched to `http://4.224.186.213/evaluation-service/logs`.

## Query Optimization (Stage 3)
**Original Query:**
```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```
**Problem:**
- Uses `SELECT *` which fetches unnecessary columns.
- No index exists, causing full table scans.
- Sorting millions of rows without an index is highly inefficient.

**Solution:**
Create a composite index on the filtering and sorting columns:
```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentID, isRead, createdAt);
```

**Optimized Query:**
```sql
SELECT id, type, message, createdAt
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

## DB Overload Solution (Stage 4)
To mitigate database overload and improve system resilience, we implement caching and other optimization strategies:

**1. Redis Cache Implementation**
- A Redis caching layer is introduced in front of the PostgreSQL database.
- **Data Flow:**
  `Client -> Notification Service -> Redis Cache -> (on cache miss) -> PostgreSQL Database`
- Frequently accessed, non-mutating data (like recent notifications) are served directly from Redis, significantly reducing DB read operations.

**2. Additional Optimizations:**
- **Pagination:** Implement cursor-based or offset pagination for the `GET /notifications` endpoint to limit payload sizes and DB scanning.
- **Lazy Loading:** Load historical notifications only as the user scrolls, deferring unnecessary queries.
- **WebSockets:** Maintain active connections for real-time delivery to avoid constant client polling.
- **Read Replicas:** Route heavy `SELECT` queries to database read replicas to take the load off the primary writable database instance.

## Message Queue & Asynchronous Processing (Stage 5)
**Problem with Sequential Processing:**
```python
for student in students:
    send_email()
    save_to_db()
    push_to_app()
```
- **Sequential & Slow:** Processing blocking operations in a loop is extremely slow and degrades API response times.
- **Partial Failure:** If `save_to_db()` succeeds but `push_to_app()` fails, the system state becomes inconsistent.
- **No Retry Mechanism:** Failures in any step are not automatically retried.

**Optimized Architecture:**
Using an event-driven, asynchronous worker model resolves these issues:
```mermaid
graph TD
    API[API] -->|Publishes Event| Queue[Message Queue (RabbitMQ / Kafka)]
    Queue --> Worker1[Email Worker]
    Queue --> Worker2[Push Worker]
    Queue --> Worker3[DB Worker]
```
- **RabbitMQ/Kafka:** Acts as the central message broker to distribute workload asynchronously.
- **Retry Mechanism:** Workers can automatically retry failed jobs.
- **Dead Letter Queue (DLQ):** Messages that repeatedly fail are routed to a DLQ for manual inspection and debugging without blocking the main queue.
