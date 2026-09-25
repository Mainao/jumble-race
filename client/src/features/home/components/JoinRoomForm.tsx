import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    joinRoom,
    onJoinError,
    onRoomJoined,
} from "@/features/room/api/RoomSocket";
import { Badge } from "@/ui/Badge";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";

export function JoinRoomForm() {
    const [roomId, setRoomId] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const cleanupJoined = onRoomJoined(({ roomId, roomName }) => {
            navigate(`/room/${roomId}`, { state: { isHost: false, roomName } });
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
        <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-between space-y-3"
        >
            <div>
                <div className="flex items-center justify-between mb-2">
                    <Badge variant="blue">
                        <span>JOIN ROOM</span>
                    </Badge>
                    <span className="text-[11px] font-bold text-slate-500">
                        Have a Code
                    </span>
                </div>

                <label htmlFor="room-code" className="sr-only">
                    Room Code:
                </label>

                <div className="relative flex items-center">
                    <Input
                        id="room-code"
                        variant="code"
                        accent="blue"
                        type="text"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        placeholder="Enter code"
                        maxLength={6}
                        aria-describedby={error ? "room-code-error" : undefined}
                    />
                </div>

                {error && (
                    <p
                        id="room-code-error"
                        role="alert"
                        className="mt-2 text-xs font-bold text-rose-600"
                    >
                        {error}
                    </p>
                )}
            </div>

            <Button type="submit" variant="blue" className="w-full">
                <span>JOIN ROOM</span>
            </Button>
        </form>
    );
}
