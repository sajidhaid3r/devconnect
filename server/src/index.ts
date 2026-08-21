import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app";

// 1. Create HTTP server wrapping Express app
const server = http.createServer(app);

// 2. Clean and sanitize frontend origin URL for CORS
const rawOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const allowedOrigin = rawOrigin.trim().replace(/\/$/, "");


// 3. Attach Socket.IO to HTTP server with cross-domain CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// 4. Handle Socket connections
io.on("connection", (socket) => {
  console.log("Client connected to socket:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// 5. Export io instance so controllers can emit real-time events if needed
export { io };

// 6. Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
