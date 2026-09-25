import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    type GameFinishedPayload,
    getSocketId,
    leaveRoom,
    onGameFinished,
    onJoinError,
    onPlayerList,
    onRoundEnded,
    onRoundStarted,
    onStartGameError,
    type RoundEndedPayload,
    type RoundStartedPayload,
    setPlayerName,
    startGame,
} from "@/features/room/api/RoomSocket";
import { type Player,toDisplayPlayer } from "@/features/room/lib/avatar";

type Phase = "lobby" | "playing" | "round-results" | "finished";

export function useRoomSocket(roomId: string | undefined) {
    const navigate = useNavigate();

    const [hasJoined, setHasJoined] = useState(false);
    const [nameInput, setNameInput] = useState("");
    const [error, setError] = useState("");

    const [players, setPlayers] = useState<Player[]>([]);
    const [phase, setPhase] = useState<Phase>("lobby");
    const [roundData, setRoundData] = useState<RoundStartedPayload | null>(null);
    const [roundResultsData, setRoundResultsData] =
        useState<RoundEndedPayload | null>(null);
    const [finalScoresData, setFinalScoresData] =
        useState<GameFinishedPayload | null>(null);

    useEffect(() => {
        const cleanupPlayerList = onPlayerList((serverPlayers) => {
            setPlayers(serverPlayers.map(toDisplayPlayer));

            const mySocketId = getSocketId();
            if (serverPlayers.some((p) => p.socketId === mySocketId)) {
                setHasJoined(true);
            }
        });
        const cleanupJoinError = onJoinError((message) => {
            setError(message);
        });

        return () => {
            cleanupPlayerList();
            cleanupJoinError();
        };
    }, []);

    useEffect(() => {
        const cleanupStartGameError = onStartGameError((message) => {
            setError(message);
        });
        const cleanupRoundStarted = onRoundStarted((data) => {
            setRoundData(data);
            setPhase("playing");
        });
        const cleanupRoundEnded = onRoundEnded((data) => {
            setRoundResultsData(data);
            setPhase("round-results");
        });
        const cleanupGameFinished = onGameFinished((data) => {
            setFinalScoresData(data);
            setPhase("finished");
        });

        return () => {
            cleanupStartGameError();
            cleanupRoundStarted();
            cleanupRoundEnded();
            cleanupGameFinished();
        };
    }, []);

    const currentPlayer = players.find((p) => p.socketId === getSocketId());
    const isHost = currentPlayer?.isHost ?? false;

    const handleLeave = () => {
        leaveRoom();
        navigate("/");
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(roomId ?? "");
    };

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = nameInput.trim();
        if (!trimmed || !roomId) return;

        setError("");
        setPlayerName(roomId, trimmed);
    };

    const handleStartGame = () => {
        if (!roomId) return;
        startGame(roomId);
    };

    return {
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
    };
}
