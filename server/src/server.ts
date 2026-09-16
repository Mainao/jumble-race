import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

app.use(cors());

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
    },
});

const rooms = new Map<string, { id: string; players: string[] }>();

function generateRoomId(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

io.on("connection", (socket) => {
    console.log("Player connected:", socket.id);

    socket.on("create-room", () => {
        const roomId = generateRoomId();

        rooms.set(roomId, { id: roomId, players: [socket.id] });
        socket.join(roomId);

        console.log(`Room ${roomId} created by ${socket.id}`);
        socket.emit("room-created", roomId);
    });

    socket.on("join-room", (roomId: string) => {
        console.log("Join request:", roomId);

        const room = rooms.get(roomId);

        if (!room) {
            socket.emit("join-error", "Room not found");
            return;
        }

        room.players.push(socket.id);
        socket.join(roomId);

        console.log(`Player ${socket.id} joined room ${roomId}`);

        socket.emit("room-joined", roomId);

        io.to(roomId).emit("player-list", room.players);
    });

    socket.on("disconnect", () => {
        console.log("Player disconnected:", socket.id);

        for (const [roomId, room] of rooms.entries()) {
            const index = room.players.indexOf(socket.id);
            if (index !== -1) {
                room.players.splice(index, 1);
                io.to(roomId).emit("player-list", room.players);

                if (room.players.length === 0) {
                    rooms.delete(roomId);
                    console.log(`Room ${roomId} deleted (empty)`);
                }
                break;
            }
        }
    });
});

httpServer.listen(8080, () => {
    console.log("Server running on http://localhost:8080");
});
