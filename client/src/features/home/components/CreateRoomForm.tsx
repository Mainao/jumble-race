import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom, onRoomCreated } from "@/features/room/api/RoomSocket";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Badge } from "@/ui/Badge";

export function CreateRoomForm() {
    const [roomName, setRoomName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const cleanup = onRoomCreated(({ roomId }) => {
            navigate(`/room/${roomId}`, { state: { isHost: true } });
        });
        return cleanup;
    }, [navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomName.trim()) return;
        createRoom(roomName.trim());
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-between space-y-3"
        >
            <div>
                <div className="flex items-center justify-between mb-2">
                    <Badge variant="yellow">
                        <span>CREATE ROOM</span>
                    </Badge>
                    <span className="text-[11px] font-bold text-slate-500">
                        Host a Game
                    </span>
                </div>

                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Room Code (Edit or generate new):
                </label>

                <div className="relative flex items-center">
                    <Input
                        variant="code"
                        accent="yellow"
                        type="text"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        placeholder="Room name"
                        maxLength={10}
                    />
                </div>
            </div>

            <Button type="submit" variant="yellow" className="w-full">
                <span>CREATE ROOM</span>
            </Button>
        </form>
    );
}
