import { socket } from "@/lib";

export function createRoom(roomName: string) {
    if (!socket.connected) socket.connect();
    socket.emit("create-room", { roomName });
}

export function onRoomCreated(
    callback: (data: { roomId: string; roomName: string }) => void,
) {
    socket.on("room-created", callback);
    return () => {
        socket.off("room-created", callback);
    };
}

export function joinRoom(roomId: string) {
    if (!socket.connected) socket.connect();
    socket.emit("join-room", roomId);
}

export function onRoomJoined(callback: (roomId: string) => void) {
    socket.on("room-joined", callback);
    return () => {
        socket.off("room-joined", callback);
    };
}

export function onJoinError(callback: (message: string) => void) {
    socket.on("join-error", callback);
    return () => {
        socket.off("join-error", callback);
    };
}

export type RoomPlayer = { socketId: string; name: string; isHost: boolean };

export function setPlayerName(roomId: string, name: string) {
    socket.emit("set-player-name", { roomId, name });
}

export function onPlayerList(callback: (players: RoomPlayer[]) => void) {
    socket.on("player-list", callback);
    return () => {
        socket.off("player-list", callback);
    };
}

export function getSocketId() {
    return socket.id;
}

export function startGame(roomId: string) {
    socket.emit("start-game", { roomId });
}

export function onStartGameError(callback: (message: string) => void) {
    socket.on("start-game-error", callback);
    return () => {
        socket.off("start-game-error", callback);
    };
}

export type RoundStartedPayload = {
    round: number;
    totalRounds: number;
    scrambledWords: string[];
    wordTimeSeconds: number;
};

export function onRoundStarted(callback: (data: RoundStartedPayload) => void) {
    socket.on("round-started", callback);
    return () => {
        socket.off("round-started", callback);
    };
}

export function submitWord(roomId: string, wordIndex: number, guess: string) {
    socket.emit("submit-word", { roomId, wordIndex, guess });
}

export type WordResultPayload = {
    correct: boolean;
    wordIndex: number;
};

export function onWordResult(callback: (data: WordResultPayload) => void) {
    socket.on("word-result", callback);
    return () => {
        socket.off("word-result", callback);
    };
}

export type WordTimeoutPayload = {
    wordIndex: number;
};

export function onWordTimeout(callback: (data: WordTimeoutPayload) => void) {
    socket.on("word-timeout", callback);
    return () => {
        socket.off("word-timeout", callback);
    };
}

export type RoundResultEntry = {
    socketId: string;
    name: string;
    wordsCompleted: number;
    roundScore: number;
    cumulativeScore: number;
};

export type RoundEndedPayload = {
    round: number;
    roundResults: RoundResultEntry[];
    correctWords: string[];
};

export function onRoundEnded(callback: (data: RoundEndedPayload) => void) {
    socket.on("round-ended", callback);
    return () => {
        socket.off("round-ended", callback);
    };
}

export type FinalScoreEntry = {
    socketId: string;
    name: string;
    cumulativeScore: number;
};

export type GameFinishedPayload = {
    finalScores: FinalScoreEntry[];
};

export function onGameFinished(callback: (data: GameFinishedPayload) => void) {
    socket.on("game-finished", callback);
    return () => {
        socket.off("game-finished", callback);
    };
}

export function leaveRoom() {
    socket.disconnect();
}
