# Technical Architecture & API Documentation - Aura

## 1. System Security Architecture

### Authentication & Authorization Flow
1. **JWT Dual Token Standard**: Access tokens (signed with HMAC-SHA256, 7-day expiry) paired with refresh token device sessions stored in the `DeviceSession` database table.
2. **Two-Factor Authentication (2FA)**: Time-based One-Time Passwords (TOTP) / Email OTP verification guards.
3. **Rate Limiting & Threat Mitigation**: Express rate limiting middleware enforces maximum 300 requests per 15-minute window per IP.
4. **Data Sanitization**: Helmet HTTP headers protection, CORS domain whitelist enforcement, and SQL Injection prevention via Prisma parameterized queries.

---

## 2. API Endpoint Specifications

### Auth Endpoints
- `POST /api/v1/auth/signup` - Register new user account.
- `POST /api/v1/auth/login` - Authenticate user credentials & initiate 2FA if enabled.
- `POST /api/v1/auth/verify-otp` - Complete 2FA OTP code validation.
- `GET /api/v1/auth/me` - Fetch authenticated user profile & preferences.

### Post & Feed Endpoints
- `POST /api/v1/posts` - Create post (Supports Text, Photo, Video, Audio, Poll, Scheduling).
- `GET /api/v1/posts/:id` - Fetch post details with author and comments.
- `POST /api/v1/posts/:postId/poll/vote` - Cast vote on interactive poll.
- `GET /api/v1/feed?type=recommended|following|trending|reels|nearby` - Fetch algorithmic feeds.
- `GET /api/v1/stories` - Fetch active stories bar data.

### Social Engagement Endpoints
- `POST /api/v1/posts/:postId/react` - Register reaction (LIKE, LOVE, LAUGH, SAD, ANGRY).
- `POST /api/v1/posts/:postId/comments` - Submit comment or reply to thread.
- `POST /api/v1/posts/:postId/repost` - Repost creation with quote caption.

### Real-Time & WebRTC Socket Events
- `user:online` / `user:status_changed` - User presence tracking.
- `chat:join_room` / `chat:send_message` / `chat:new_message` - Messaging stream.
- `chat:typing` - Real-time typing indicators.
- `webrtc:offer` / `webrtc:answer` / `webrtc:ice_candidate` - Peer-to-peer audio/video call signaling.

### AI & Moderation Endpoints
- `POST /api/v1/ai/caption` - Generate AI captions and hashtags based on prompt tone.
- `POST /api/v1/ai/moderate` - Scan text content for safety and spam risks.

### Creator & Admin Endpoints
- `GET /api/v1/analytics/creator` - Retrieve reach, impressions chart, and revenue.
- `GET /api/v1/admin/reports` - Fetch content safety report queue.
- `PUT /api/v1/admin/users/:userId/status` - Modify user status (ACTIVE, SUSPENDED, BANNED).

---

## 3. Database Entity-Relationship Diagram Overview

```
+---------------+        +---------------+        +---------------+
|     User      | 1----1 |    Profile    |        |     Post      |
+---------------+        +---------------+        +---------------+
| id (PK)       |        | id (PK)       |   +--> | id (PK)       |
| email         |        | userId (FK)   |   |    | authorId (FK) |
| username      |        | bio           |   |    | type          |
| role          |        | avatarUrl     |   |    | caption       |
+-------+-------+        +---------------+   |    | likesCount    |
        |                                    |    +-------+-------+
        | 1                                  |            |
        |                                    |            | 1
        +------------------------------------+            |
        |                                                 | N
        | 1                                       +-------v-------+
        +---------------------------------------> |    Comment    |
                                                  +---------------+
                                                  | id (PK)       |
                                                  | postId (FK)   |
                                                  | authorId (FK) |
                                                  | content       |
                                                  +---------------+
```

---

## 4. Verification & Testing Instructions

### Automated Tests Execution
```bash
# Run unit & integration tests across backend and frontend
npm test
```

### Manual Acceptance Tests
1. **User Auth & 2FA**: Test signup, login with demo credentials, and OTP input.
2. **Multi-Media Composer**: Create a Photo post, test AI Caption generation button, and vote on Polls.
3. **Real-time Chat & WebRTC**: Open `/messages` in two browser windows, send live messages, and trigger the Video Call modal overlay.
4. **Creator & Admin Studio**: Visit `/studio` to view reach analytics, and `/admin` to process moderation queues.
