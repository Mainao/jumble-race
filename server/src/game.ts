import { io } from "./io";
import { rooms, type PlayerProgress } from "./rooms";
import { scrambleWord } from "./words";
import { ROUND_RESULTS_DELAY_MS } from "./config";

// Starts (or restarts, for the next word) a single player's per-word timer.
export function startPlayerWord(roomId: string, socketId: string, wordIndex: number) {
    const room = rooms.get(roomId);
    if (!room || !room.game) return;

    const { game } = room;
    const existing = game.playerProgress[socketId];

    const progress: PlayerProgress = existing ?? {
        currentWordIndex: wordIndex,
        wordsSolved: 0,
        timeBonus: 0,
        finishedAt: null,
        wordStartedAt: 0,
        wordTimer: null,
    };

    progress.currentWordIndex = wordIndex;
    progress.wordStartedAt = Date.now();
    progress.wordTimer = setTimeout(
        () => handleWordTimeout(roomId, socketId),
        game.wordTimeSeconds * 1000,
    );

    game.playerProgress[socketId] = progress;
}

function handleWordTimeout(roomId: string, socketId: string) {
    const room = rooms.get(roomId);
    if (!room || !room.game || room.status !== "playing") return;

    const progress = room.game.playerProgress[socketId];
    if (!progress || progress.finishedAt !== null) return;

    const timedOutIndex = progress.currentWordIndex;
    console.log(
        `Word timeout: ${socketId} ran out of time on word ${timedOutIndex} in room ${roomId}`,
    );

    io.to(socketId).emit("word-timeout", { wordIndex: timedOutIndex });

    const nextIndex = timedOutIndex + 1;
    if (nextIndex >= room.game.wordsPerRound) {
        progress.finishedAt = Date.now();
        console.log(
            `Player ${socketId} finished round ${room.game.currentRound} in room ${roomId} (final word timed out)`,
        );
        checkRoundEnd(roomId);
    } else {
        startPlayerWord(roomId, socketId, nextIndex);
    }
}

export function startRound(roomId: string) {
    const room = rooms.get(roomId);
    if (!room || !room.game) return;

    const { game } = room;
    const start = (game.currentRound - 1) * game.wordsPerRound;
    game.roundWords = game.gameWordPool.slice(start, start + game.wordsPerRound);
    game.playerProgress = {};

    room.status = "playing";

    console.log(
        `Round ${game.currentRound}/${game.totalRounds} started in room ${roomId}: ${game.roundWords.join(", ")}`,
    );

    io.to(roomId).emit("round-started", {
        round: game.currentRound,
        totalRounds: game.totalRounds,
        scrambledWords: game.roundWords.map(scrambleWord),
        wordTimeSeconds: game.wordTimeSeconds,
    });

    for (const player of room.players) {
        startPlayerWord(roomId, player.socketId, 0);
    }
}

export function checkRoundEnd(roomId: string) {
    const room = rooms.get(roomId);
    if (!room || !room.game || room.players.length === 0) return;

    const allFinished = room.players.every(
        (p) => room.game!.playerProgress[p.socketId]?.finishedAt != null,
    );

    if (allFinished) {
        console.log(`All players finished round in room ${roomId}, ending early`);
        endRound(roomId);
    }
}

function endRound(roomId: string) {
    const room = rooms.get(roomId);
    if (!room || !room.game) return;
    if (room.status === "round-results" || room.status === "finished") return;

    const { game } = room;

    for (const progress of Object.values(game.playerProgress)) {
        if (progress.wordTimer) clearTimeout(progress.wordTimer);
        progress.wordTimer = null;
    }

    room.status = "round-results";

    const roundResults = room.players.map((player) => {
        const progress = game.playerProgress[player.socketId] ?? {
            currentWordIndex: 0,
            wordsSolved: 0,
            timeBonus: 0,
            finishedAt: null,
            wordStartedAt: 0,
            wordTimer: null,
        };
        const roundScore = progress.wordsSolved * 100 + progress.timeBonus;

        game.cumulativeScores[player.socketId] =
            (game.cumulativeScores[player.socketId] ?? 0) + roundScore;

        return {
            socketId: player.socketId,
            name: player.name,
            wordsCompleted: progress.wordsSolved,
            roundScore,
            cumulativeScore: game.cumulativeScores[player.socketId],
        };
    });

    console.log(
        `Round ${game.currentRound} ended in room ${roomId}: ${roundResults
            .map((r) => `${r.name}=${r.roundScore}`)
            .join(", ")}`,
    );

    io.to(roomId).emit("round-ended", {
        round: game.currentRound,
        roundResults,
        correctWords: game.roundWords,
    });

    setTimeout(() => {
        const nextRoom = rooms.get(roomId);
        if (!nextRoom || !nextRoom.game) return;

        if (nextRoom.game.currentRound < nextRoom.game.totalRounds) {
            nextRoom.game.currentRound += 1;
            startRound(roomId);
        } else {
            nextRoom.status = "finished";

            const finalScores = nextRoom.players
                .map((player) => ({
                    socketId: player.socketId,
                    name: player.name,
                    cumulativeScore:
                        nextRoom.game!.cumulativeScores[player.socketId] ?? 0,
                }))
                .sort((a, b) => b.cumulativeScore - a.cumulativeScore);

            console.log(`Game finished in room ${roomId}`);

            io.to(roomId).emit("game-finished", { finalScores });
        }
    }, ROUND_RESULTS_DELAY_MS);
}
