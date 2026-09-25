import { useLocation,useParams } from "react-router-dom";

import FinalResultsScreen from "@/features/room/components/FinalResultsScreen";
import GameScreen from "@/features/room/components/GameScreen";
import NameGateForm from "@/features/room/components/NameGateForm";
import RoomLobby from "@/features/room/components/RoomLobby";
import RoundResultsScreen from "@/features/room/components/RoundResultsScreen";
import { useRoomSocket } from "@/features/room/hooks/useRoomSocket";

export default function RoomPage() {
    const { roomId } = useParams();
    const location = useLocation();
    const locationState = location.state as
        | { isHost?: boolean; roomName?: string }
        | null;
    const arrivedAsHost = Boolean(locationState?.isHost);
    const roomName = locationState?.roomName;

    const {
        hasJoined,
        nameInput,
        setNameInput,
        error,
        players,
        phase,
        roundData,
        roundResultsData,
        finalScoresData,
        isHost,
        handleLeave,
        handleCopy,
        handleJoin,
        handleStartGame,
    } = useRoomSocket(roomId);

    // ── Gate: ask for a player name before showing the room ──
    if (!hasJoined) {
        return (
            <NameGateForm
                roomId={roomId}
                arrivedAsHost={arrivedAsHost}
                nameInput={nameInput}
                onNameInputChange={setNameInput}
                error={error}
                onSubmit={handleJoin}
                onCancel={handleLeave}
            />
        );
    }

    // ── Game: rendered on the same route once the host starts the game ──
    if (phase === "playing" && roundData) {
        return (
            <GameScreen
                key={roundData.round}
                roomId={roomId}
                roundData={roundData}
            />
        );
    }

    if (phase === "round-results" && roundResultsData) {
        return (
            <RoundResultsScreen
                round={roundResultsData.round}
                totalRounds={roundData?.totalRounds ?? roundResultsData.round}
                roundResults={roundResultsData.roundResults}
                correctWords={roundResultsData.correctWords}
            />
        );
    }

    if (phase === "finished" && finalScoresData) {
        return (
            <FinalResultsScreen
                finalScores={finalScoresData.finalScores}
                isHost={isHost}
                onPlayAgain={handleStartGame}
                onBackToHome={handleLeave}
            />
        );
    }

    // ── Room content (only shown after the name is set) ──
    return (
        <RoomLobby
            roomId={roomId}
            roomName={roomName}
            players={players}
            isHost={isHost}
            error={error}
            onLeave={handleLeave}
            onCopy={handleCopy}
            onStartGame={handleStartGame}
        />
    );
}
