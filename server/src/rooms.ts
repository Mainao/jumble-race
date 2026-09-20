export type Player = { socketId: string; name: string };

export type RoomStatus = "lobby" | "playing" | "round-results" | "finished";

export type PlayerProgress = {
    currentWordIndex: number;
    wordsSolved: number;
    timeBonus: number;
    finishedAt: number | null;
    wordStartedAt: number;
    wordTimer: NodeJS.Timeout | null;
};

export type GameState = {
    currentRound: number;
    totalRounds: number;
    wordsPerRound: number;
    wordTimeSeconds: number;
    roundWords: string[];
    gameWordPool: string[];
    playerProgress: Record<string, PlayerProgress>;
    cumulativeScores: Record<string, number>;
};

export type RoomData = {
    id: string;
    name: string;
    players: Player[];
    hostSocketId: string;
    status: RoomStatus;
    game: GameState | null;
};

export const rooms = new Map<string, RoomData>();

export function generateRoomId(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function toPlayerList(room: RoomData) {
    return room.players.map((player) => ({
        ...player,
        isHost: player.socketId === room.hostSocketId,
    }));
}
