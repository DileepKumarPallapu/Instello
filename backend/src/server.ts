// Production API Express / NestJS Server Entry Point
import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { PostController } from './controllers/post.controller';
import { FeedController } from './controllers/feed.controller';
import { SocialController } from './controllers/social.controller';
import { AiController } from './controllers/ai.controller';
import { AnalyticsController } from './controllers/analytics.controller';
import { MonetizationController } from './controllers/monetization.controller';
import { AdminController } from './controllers/admin.controller';
import { setupSocketGateway } from './sockets/chat.gateway';

const app = express();
const server = http.createServer(app);

// Socket.io initialization with CORS
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

setupSocketGateway(io);

// Security & Body Parsers
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { success: false, error: 'Too many requests, please try again later.' },
});
app.use('/api/', apiLimiter);

// Root Web Page Dashboard for localhost:4000
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Instello Backend API Engine</title>
      <style>
        body {
          background-color: #0B0F17;
          color: #F8FAFC;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
        }
        .card {
          background: rgba(19, 26, 42, 0.85);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 24px;
          padding: 40px;
          max-width: 500px;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }
        h1 {
          background: linear-gradient(45deg, #F59E0B, #EC4899, #8B5CF6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 32px;
          margin-bottom: 8px;
        }
        .badge {
          background: rgba(16, 185, 129, 0.2);
          color: #34D399;
          border: 1px solid rgba(16, 185, 129, 0.4);
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: bold;
          display: inline-block;
          margin-bottom: 20px;
        }
        p { color: #94A3B8; font-size: 14px; line-height: 1.6; }
        .creator { color: #F59E0B; font-weight: bold; margin-top: 15px; }
        .endpoint {
          background: rgba(255, 255, 255, 0.05);
          padding: 10px;
          border-radius: 12px;
          font-family: monospace;
          color: #A5B4FC;
          font-size: 12px;
          margin-top: 15px;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Instello Backend Engine</h1>
        <div class="badge">🚀 LIVE & HEALTHY ON PORT 4000</div>
        <p>Express REST API & Socket.io Real-Time WebRTC Signal Gateway initialized successfully.</p>
        <div class="endpoint">HTTP GET /api/v1/health</div>
        <p class="creator">Chief Architect & Creator: Pallapu Dileep Kumar</p>
      </div>
    </body>
    </html>
  `);
});

// Healthcheck
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    timestamp: new Date().toISOString(),
    platform: 'Instello Backend Engine v1.0',
    founder: 'Pallapu Dileep Kumar',
  });
});

// Auth Routes
app.post('/api/v1/auth/signup', AuthController.signup);
app.post('/api/v1/auth/login', AuthController.login);
app.post('/api/v1/auth/verify-otp', AuthController.verifyOTP);
app.get('/api/v1/auth/me', AuthController.getMe);

// User Profile & Graph Routes
app.get('/api/v1/users/search', UserController.searchUsers);
app.get('/api/v1/users/profile/:username', UserController.getProfile);
app.put('/api/v1/users/profile', UserController.updateProfile);

// Post Routes
app.post('/api/v1/posts', PostController.createPost);
app.get('/api/v1/posts/:id', PostController.getPostById);
app.post('/api/v1/posts/:postId/poll/vote', PostController.votePoll);
app.put('/api/v1/posts/:id/pin', PostController.togglePinPost);

// Feed & Story Routes
app.get('/api/v1/feed', FeedController.getFeed);
app.get('/api/v1/stories', FeedController.getStories);

// Social Engagement Routes
app.post('/api/v1/posts/:postId/react', SocialController.reactPost);
app.post('/api/v1/posts/:postId/comments', SocialController.addComment);
app.post('/api/v1/posts/:postId/repost', SocialController.repost);

// AI Generator & Moderation Routes
app.post('/api/v1/ai/caption', AiController.generateCaption);
app.post('/api/v1/ai/moderate', AiController.moderateContent);

// Analytics & Insights
app.get('/api/v1/analytics/creator', AnalyticsController.getCreatorAnalytics);

// Monetization Routes
app.get('/api/v1/monetization/plans', MonetizationController.getPlans);
app.post('/api/v1/monetization/tip', MonetizationController.sendTip);

// Admin Governance Routes
app.get('/api/v1/admin/reports', AdminController.getReports);
app.put('/api/v1/admin/users/:userId/status', AdminController.updateUserStatus);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 [Instello API Engine] Running on port ${PORT}`);
});
