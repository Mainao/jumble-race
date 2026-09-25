import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";

import { createRoom, onRoomCreated } from "@/features/room/api/RoomSocket";
import { Badge } from "@/ui/Badge";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";

export function CreateRoomForm() {
    const [roomName, setRoomName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const cleanup = onRoomCreated(({ roomId, roomName }) => {
            navigate(`/room/${roomId}`, { state: { isHost: true, roomName } });
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

                <label htmlFor="room-name" className="sr-only">
                    Room Name:
                </label>

                <div className="relative flex items-center">
                    <Input
                        id="room-name"
                        variant="code"
                        accent="yellow"
                        type="text"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        placeholder="Room name"
                        maxLength={30}
                    />
                </div>
            </div>

            <Button type="submit" variant="yellow" className="w-full">
                <span>CREATE ROOM</span>
            </Button>
        </form>
    );
}
