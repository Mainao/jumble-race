import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { createRoom, onRoomCreated } from "../api/roomSocket";

export function CreateRoomForm() {
    const navigate = useNavigate();

    useEffect(() => {
        const cleanup = onRoomCreated((roomId) => {
            navigate(`/room/${roomId}`);
        });
        return cleanup;
    }, [navigate]);

    return (
        <div>
            <button onClick={createRoom}>Create Room</button>
        </div>
    );
}
