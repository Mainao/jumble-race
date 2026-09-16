import { useParams, useNavigate } from "react-router-dom";
import { leaveRoom } from "../../features/room/api/RoomSocket";

export default function Room() {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const handleLeave = () => {
        leaveRoom();
        navigate("/");
    };

    return (
        <div>
            <h1>Room: {roomId}</h1>
            <button onClick={handleLeave}>Leave Room</button>
        </div>
    );
}
