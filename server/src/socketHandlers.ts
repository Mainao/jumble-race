import { io } from "./io";
import { rooms, generateRoomId, toPlayerList } from "./rooms";
import { startRound, checkRoundEnd, startPlayerWord } from "./game";
import { MAX_PLAYERS, TOTAL_ROUNDS, WORDS_PER_ROUND, WORD_TIME_SECONDS } from "./config";
import { getWordPool, shuffleWords } from "./wordPool";

export function registerSocketHandlers() {
    io.on("connection", (socket) => {
        console.log("Player connected:", socket.id);

        socket.on("create-room", ({ roomName }: { roomName: string }) => {
            const roomId = generateRoomId();

            rooms.set(roomId, {
                id: roomId,
                name: roomName,
                players: [],
                hostSocketId: socket.id,
                status: "lobby",
                game: null,
            });
            socket.join(roomId);

            console.log(`Room "${roomName}" (${roomId}) created by ${socket.id}`);
            socket.emit("room-created", { roomId, roomName });
        });

        socket.on("join-room", (roomId: string) => {
            console.log("Join request:", roomId);

            const room = rooms.get(roomId);

            if (!room) {
                socket.emit("join-error", "Room not found");
                return;
            }

            if (room.players.length >= MAX_PLAYERS) {
                console.log(`Join rejected: room ${roomId} is full`);
                socket.emit("join-error", "Room is full");
                return;
            }

            socket.join(roomId);

            console.log(`Player ${socket.id} joined room ${roomId}`);

            socket.emit("room-joined", roomId);
        });

        socket.on(
            "set-player-name",
            ({ roomId, name }: { roomId: string; name: string }) => {
                console.log(`Set player name: ${socket.id} -> "${name}" in room ${roomId}`);

                const room = rooms.get(roomId);

                if (!room) {
                    socket.emit("join-error", "Room not found");
                    return;
                }

                const existing = room.players.find((p) => p.socketId === socket.id);
                if (existing) {
                    existing.name = name;
                } else {
                    if (room.players.length >= MAX_PLAYERS) {
                        console.log(`Set-player-name rejected: room ${roomId} is full`);
                        socket.emit("join-error", "Room is full");
                        return;
                    }
                    room.players.push({ socketId: socket.id, name });
                }

                io.to(roomId).emit("player-list", toPlayerList(room));
            }
        );

        socket.on("start-game", async ({ roomId }: { roomId: string }) => {
            const room = rooms.get(roomId);

            if (!room) {
                console.log(`Start-game ignored: room ${roomId} not found`);
                return;
            }

            if (room.hostSocketId !== socket.id) {
                console.log(
                    `Start-game rejected: ${socket.id} is not host of room ${roomId}`,
                );
                socket.emit("start-game-error", "Only the host can start the game");
                return;
            }

            const wordsNeeded = TOTAL_ROUNDS * WORDS_PER_ROUND;
            let allWords: string[];
            try {
                allWords = await getWordPool();
            } catch (err) {
                console.error(`Failed to load word pool for room ${roomId}:`, err);
                socket.emit("start-game-error", "Could not start game, please try again");
                return;
            }

            if (allWords.length < wordsNeeded) {
                console.log(
                    `Start-game rejected: room ${roomId} needs ${wordsNeeded} words, only ${allWords.length} available`,
                );
                socket.emit("start-game-error", "Not enough words available to start a game");
                return;
            }

            const gameWordPool = shuffleWords(allWords).slice(0, wordsNeeded);
            const cumulativeScores: Record<string, number> = {};
            for (const player of room.players) {
                cumulativeScores[player.socketId] = 0;
            }

            room.game = {
                currentRound: 1,
                totalRounds: TOTAL_ROUNDS,
                wordsPerRound: WORDS_PER_ROUND,
                wordTimeSeconds: WORD_TIME_SECONDS,
                roundWords: [],
                gameWordPool,
                playerProgress: {},
                cumulativeScores,
            };

            console.log(`Game started in room ${roomId} by host ${socket.id}`);

            startRound(roomId);
        });

        socket.on(
            "submit-word",
            ({
                roomId,
                wordIndex,
                guess,
            }: {
                roomId: string;
                wordIndex: number;
                guess: string;
            }) => {
                const room = rooms.get(roomId);
                if (!room || !room.game || room.status !== "playing") return;

                const progress = room.game.playerProgress[socket.id];
                if (!progress || progress.finishedAt !== null) return;

                if (wordIndex !== progress.currentWordIndex) {
                    console.log(
                        `Ignoring out-of-order submission from ${socket.id} in room ${roomId} (wordIndex=${wordIndex}, expected=${progress.currentWordIndex})`,
                    );
                    return;
                }

                const answer = room.game.roundWords[wordIndex];
                const isCorrect = guess.trim().toLowerCase() === answer;

                if (isCorrect) {
                    if (progress.wordTimer) clearTimeout(progress.wordTimer);

                    const secondsTaken = Math.floor(
                        (Date.now() - progress.wordStartedAt) / 1000,
                    );
                    const bonus = Math.max(
                        0,
                        room.game.wordTimeSeconds - secondsTaken,
                    );
                    progress.wordsSolved += 1;
                    progress.timeBonus += bonus;

                    console.log(
                        `Word correct: ${socket.id} solved word ${wordIndex} ("${answer}") in room ${roomId} (+${bonus} bonus)`,
                    );
                    socket.emit("word-result", { correct: true, wordIndex });

                    const nextIndex = wordIndex + 1;
                    if (nextIndex >= room.game.wordsPerRound) {
                        progress.finishedAt = Date.now();
                        console.log(
                            `Player ${socket.id} finished round ${room.game.currentRound} in room ${roomId}`,
                        );
                        checkRoundEnd(roomId);
                    } else {
                        startPlayerWord(roomId, socket.id, nextIndex);
                    }
                } else {
                    console.log(
                        `Word incorrect: ${socket.id} guessed "${guess}" for word ${wordIndex} in room ${roomId}`,
                    );
                    socket.emit("word-result", { correct: false, wordIndex });
                }
            }
        );

        socket.on("disconnect", () => {
            console.log("Player disconnected:", socket.id);

            for (const [roomId, room] of rooms.entries()) {
                const index = room.players.findIndex((p) => p.socketId === socket.id);
                if (index !== -1) {
                    room.players.splice(index, 1);

                    if (room.players.length === 0) {
                        if (room.game) {
                            for (const progress of Object.values(
                                room.game.playerProgress,
                            )) {
                                if (progress.wordTimer) clearTimeout(progress.wordTimer);
                            }
                        }
                        rooms.delete(roomId);
                        console.log(`Room ${roomId} deleted (empty)`);
                        break;
                    }

                    if (room.hostSocketId === socket.id) {
                        room.hostSocketId = room.players[0].socketId;
                        console.log(
                            `Host of room ${roomId} disconnected; reassigned host to ${room.hostSocketId}`
                        );
                    }

                    io.to(roomId).emit("player-list", toPlayerList(room));

                    if (room.status === "playing" && room.game) {
                        const progress = room.game.playerProgress[socket.id];
                        if (progress?.wordTimer) clearTimeout(progress.wordTimer);
                        delete room.game.playerProgress[socket.id];
                        checkRoundEnd(roomId);
                    }

                    break;
                }
            }
        });
    });
}
