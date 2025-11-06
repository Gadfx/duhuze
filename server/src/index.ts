import express from 'express';
import cors from 'cors';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import adminRoutes from './routes/admin';
import authRoutes from './routes/auth';
import roleRoutes from './routes/roles';
import { setupAdminSocket } from './socket/adminSocket';
import Ad from './models/Ad';

// Import your existing logic
import { handelStart, handelDisconnect, getType } from './lib';
import { GetTypesResult, room } from './types';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tugwemo')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);

// --- Serve uploaded files ---
app.use('/uploads', express.static(path.join(__dirname, "../uploads")));

// --- Serve main frontend ---
app.use(express.static(path.join(__dirname, "../../client/dist")));

// SPA routing for main frontend (for React/Vite frontend)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

// --- Serve admin frontend ---
app.use('/admin', express.static(path.join(__dirname, "../../admin/dist")));

// SPA routing for admin (for React/Vite frontend)
app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../admin/dist/index.html"));
});

// Catch-all for main frontend (must be last)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

// --- Example API endpoints ---
app.get("/api/status", (req, res) => {
  res.json({ status: "Server is running" });
});

app.post("/api/echo", (req, res) => {
  res.json({ received: req.body });
});

// --- HTTP server for Socket.io ---
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Make io instance available to routes
app.set('io', io);

let online: number = 0;
let roomArr: Array<room> = [];

// Setup admin socket namespace
setupAdminSocket(io);

io.on('connection', (socket) => {
  online++;
  io.emit('online', online);

  // on start
  socket.on('start', cb => {
    handelStart(roomArr, socket, cb, io);
  });

  // On disconnect
  socket.on('disconnect', () => {
    online--;
    io.emit('online', online);
    handelDisconnect(socket.id, roomArr, io);
  });

  // On next
  socket.on('next', () => {
    handelDisconnect(socket.id, roomArr, io);
    handelStart(roomArr, socket, () => {
      socket.emit('remote-socket', socket.id);
    }, io);
  });

  /// WebRTC logic
  socket.on('ice:send', ({ candidate }) => {
    const type: GetTypesResult = getType(socket.id, roomArr);
    if (type) {
      if (type?.type === 'p1' && typeof type?.p2id === 'string') {
        io.to(type.p2id).emit('ice:reply', { candidate, from: socket.id });
      }
      if (type?.type === 'p2' && typeof type?.p1id === 'string') {
        io.to(type.p1id).emit('ice:reply', { candidate, from: socket.id });
      }
    }
  });

  socket.on('sdp:send', ({ sdp }) => {
    const type = getType(socket.id, roomArr);
    if (type) {
      if (type?.type === 'p1' && typeof type?.p2id === 'string') {
        io.to(type.p2id).emit('sdp:reply', { sdp, from: socket.id });
      }
      if (type?.type === 'p2' && typeof type?.p1id === 'string') {
        io.to(type.p1id).emit('sdp:reply', { sdp, from: socket.id });
      }
    }
  });

  // Messages
  socket.on("send-message", (input, type, roomid) => {
    const sender = type === 'p1' ? 'You: ' : 'Stranger: ';
    socket.to(roomid).emit('get-message', input, sender);
  });

  // Report user
  socket.on('report-user', async (data) => {
    try {
      const { reportedUserId, reason, details, roomId, screenshot } = data;

      // Import Report model
      const Report = require('./models/Report').default;

      // Get reporter user info from token
      let reporterId = null;
      const token = socket.handshake.auth?.token;
      if (token) {
        try {
          const jwt = require('jsonwebtoken');
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
          reporterId = decoded.userId;
        } catch (error) {
          console.log('Token verification failed for reporter:', error instanceof Error ? error.message : String(error));
        }
      }

      // Create report
      const report = new Report({
        reportedUser: reportedUserId,
        reporter: reporterId,
        reason,
        description: details,
        roomId,
        status: 'pending',
        screenshot // Store screenshot data
      });

      await report.save();

      // Emit to admin namespace for real-time updates
      io.of('/admin').emit('new-report', {
        report: report.toObject(),
        timestamp: new Date()
      });

      console.log(`User reported: ${reportedUserId} - Reason: ${reason}`);
    } catch (error) {
      console.error('Report user error:', error);
      socket.emit('report-error', { message: 'Failed to submit report' });
    }
  });
});

// --- Start server ---
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});
