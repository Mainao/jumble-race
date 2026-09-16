import { CreateRoomForm } from "../../features/room/components/CreateRoomForm";
import { JoinRoomForm } from "../../features/room/components/JoinRoomForm";

export default function Home() {
    return (
        <div className="home-page">
            <h1>Jumble Race</h1>
            <CreateRoomForm />
            <JoinRoomForm />
        </div>
    );
}
