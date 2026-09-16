import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { joinRoom, onRoomJoined, onJoinError } from "../api/RoomSocket";

export function JoinRoomForm() {
    const [roomId, setRoomId] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const cleanupJoined = onRoomJoined((id) => {
            navigate(`/room/${id}`);
        });
        const cleanupError = onJoinError((message) => {
            setError(message);
        });

        return () => {
            cleanupJoined();
            cleanupError();
        };
    }, [navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomId.trim()) return;
        setError("");
        joinRoom(roomId.trim());
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room code"
            />
            <button type="submit">Join Room</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    );
}
