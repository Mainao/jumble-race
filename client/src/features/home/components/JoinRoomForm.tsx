import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { joinRoom, onRoomJoined, onJoinError } from "@/features/room/api/RoomSocket";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Badge } from "@/ui/Badge";

export function JoinRoomForm() {
    const [roomId, setRoomId] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const cleanupJoined = onRoomJoined((roomId) => {
            navigate(`/room/${roomId}`, { state: { isHost: false } }); // 👈
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

                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Enter your friend's room code:
                </label>

                <div className="relative flex items-center">
                    <Input
                        variant="code"
                        accent="blue"
                        type="text"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        placeholder="ENTER CODE"
                        maxLength={6}
                        className="text-blue placeholder:text-slate-300"
                    />
                </div>

                {error && (
                    <p className="mt-2 text-xs font-bold text-rose-600">
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
