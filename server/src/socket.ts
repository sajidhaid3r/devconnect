import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import { verifyToken } from "./utils/jwt";

let io: Server | null = null;
const userSockets = new Map<string, Set<string>>(); // userId -> socketIds

// Real-time notifications per PDF Day 11: Socket.io for connection requests, endorsements
export function initSocket(httpServer: HTTPServer) {
  io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_ORIGIN, credentials: true },
  });

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required"));
    try {
      const payload = verifyToken(token);
      (socket as any).userId = payload.userId;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = (socket as any).userId as string;
    if (!userSockets.has(userId)) userSockets.set(userId, new Set());
    userSockets.get(userId)!.add(socket.id);

    socket.on("disconnect", () => {
      userSockets.get(userId)?.delete(socket.id);
    });
  });

  return io;
}

export function emitToUser(userId: string, event: string, payload: unknown) {
  const sockets = userSockets.get(userId);
  if (!io || !sockets) return;
  for (const socketId of sockets) {
    io.to(socketId).emit(event, payload);
  }
}
