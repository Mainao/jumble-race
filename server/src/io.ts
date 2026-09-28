import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const allowedOrigins = (process.env.CLIENT_URL ?? "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim());

const app = express();

app.use(cors({ origin: allowedOrigins }));

export const httpServer = createServer(app);

export const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
    },
});
