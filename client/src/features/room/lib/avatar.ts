import type { RoomPlayer } from "@/features/room/api/RoomSocket";

export interface Player {
    socketId: string;
    name: string;
    avatar: string;
    color: string;
    isHost: boolean;
}

const AVATAR_POOL = ["🏎️", "🦊", "🎯", "⚡", "🚀", "🐯", "🎮", "🔥"];
const COLOR_POOL = ["#3B66FF", "#FF2E93", "#10B981", "#FFD214", "#8B5CF6"];

function hashString(value: string): number {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
        hash = (hash * 31 + value.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
}

export function toDisplayPlayer(player: RoomPlayer): Player {
    return {
        socketId: player.socketId,
        name: player.name,
        isHost: player.isHost,
        avatar: AVATAR_POOL[hashString(player.socketId) % AVATAR_POOL.length],
        color: COLOR_POOL[
            hashString(`${player.socketId}-color`) % COLOR_POOL.length
        ],
    };
}
