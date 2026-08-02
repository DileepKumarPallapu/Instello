// Socket.io Real-Time Gateway: Chat Messaging, Typing Status, Read Receipts & WebRTC Signaling
import { Server as SocketIOServer, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { DbService } from '../services/db.service';

const db = DbService.getInstance();

export function setupSocketGateway(io: SocketIOServer): void {
  const onlineUsers = new Map<string, string>(); // userId -> socketId

  io.on('connection', (socket: Socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Register authenticated user socket
    socket.on('user:online', (data: { userId: string }) => {
      if (data.userId) {
        onlineUsers.set(data.userId, socket.id);
        io.emit('user:status_changed', { userId: data.userId, isOnline: true });
      }
    });

    // Join chat room
    socket.on('chat:join_room', (data: { roomId: string }) => {
      socket.join(data.roomId);
      console.log(`[Socket.io] User ${socket.id} joined room ${data.roomId}`);
    });

    // Handle real-time messaging
    socket.on('chat:send_message', (data: { roomId: string; senderId: string; content: string; type?: string }) => {
      const newMessage = {
        id: `msg-${uuidv4().substring(0, 8)}`,
        groupId: data.roomId,
        senderId: data.senderId,
        content: data.content,
        type: data.type || 'TEXT',
        createdAt: new Date(),
      };

      db.messages.push(newMessage);
      io.to(data.roomId).emit('chat:new_message', newMessage);
    });

    // Typing status indicator
    socket.on('chat:typing', (data: { roomId: string; userId: string; username: string; isTyping: boolean }) => {
      socket.to(data.roomId).emit('chat:user_typing', data);
    });

    // WebRTC Audio/Video Call Signaling
    socket.on('webrtc:offer', (data: { targetUserId: string; offer: any; callType: 'AUDIO' | 'VIDEO' }) => {
      const targetSocketId = onlineUsers.get(data.targetUserId);
      if (targetSocketId) {
        io.to(targetSocketId).emit('webrtc:incoming_call', {
          callerSocketId: socket.id,
          offer: data.offer,
          callType: data.callType,
        });
      }
    });

    socket.on('webrtc:answer', (data: { callerSocketId: string; answer: any }) => {
      io.to(data.callerSocketId).emit('webrtc:call_answered', {
        answer: data.answer,
      });
    });

    socket.on('webrtc:ice_candidate', (data: { targetSocketId: string; candidate: any }) => {
      io.to(data.targetSocketId).emit('webrtc:ice_candidate', {
        candidate: data.candidate,
      });
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
      for (const [uId, sId] of onlineUsers.entries()) {
        if (sId === socket.id) {
          onlineUsers.delete(uId);
          io.emit('user:status_changed', { userId: uId, isOnline: false });
          break;
        }
      }
    });
  });
}
