import { socket } from "../../../lib";

export function createRoom() {
    if (!socket.connected) socket.connect();
    socket.emit("create-room");
}

export function joinRoom(roomId: string) {
    if (!socket.connected) socket.connect();
    socket.emit("join-room", roomId);
}

export function onRoomCreated(callback: (roomId: string) => void) {
    socket.on("room-created", callback);
    return () => {
        socket.off("room-created", callback);
    };
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

export function leaveRoom() {
    socket.disconnect();
}
