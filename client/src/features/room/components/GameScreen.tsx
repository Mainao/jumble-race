import { useEffect, useState } from "react";
import {
    submitWord,
    onWordResult,
    onWordTimeout,
    type RoundStartedPayload,
} from "@/features/room/api/RoomSocket";
import { cn } from "@/lib/cn";

interface GameScreenProps {
    roomId: string | undefined;
    roundData: RoundStartedPayload;
}

type Feedback = "idle" | "correct" | "incorrect" | "timeout";

export default function GameScreen({ roomId, roundData }: GameScreenProps) {
    const { round, totalRounds, scrambledWords, wordTimeSeconds } = roundData;

    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [typedIndices, setTypedIndices] = useState<number[]>([]);
    const [feedback, setFeedback] = useState<Feedback>("idle");
    const [waitingForOthers, setWaitingForOthers] = useState(false);
    const [wordStartedAt, setWordStartedAt] = useState(() => Date.now());
    const [now, setNow] = useState(() => Date.now());

    const currentScrambled = scrambledWords[currentWordIndex] ?? "";

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    const advanceToNextWord = () => {
        if (currentWordIndex + 1 >= scrambledWords.length) {
            setWaitingForOthers(true);
        } else {
            setCurrentWordIndex(currentWordIndex + 1);
            setTypedIndices([]);
            setWordStartedAt(Date.now());
        }
        setFeedback("idle");
    };

    useEffect(() => {
        const cleanup = onWordResult((result) => {
            if (result.wordIndex !== currentWordIndex) return;

            if (result.correct) {
                setFeedback("correct");
                setTimeout(advanceToNextWord, 500);
            } else {
                setFeedback("incorrect");
                setTimeout(() => {
                    setTypedIndices([]);
                    setFeedback("idle");
                }, 500);
            }
        });

        return cleanup;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentWordIndex, scrambledWords.length]);

    useEffect(() => {
        const cleanup = onWordTimeout(({ wordIndex }) => {
            if (wordIndex !== currentWordIndex) return;

            setFeedback("timeout");
            setTimeout(advanceToNextWord, 800);
        });

        return cleanup;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentWordIndex, scrambledWords.length]);

    const secondsLeft = Math.max(
        0,
        wordTimeSeconds - Math.floor((now - wordStartedAt) / 1000),
    );

    const handleLetterClick = (index: number) => {
        if (feedback !== "idle") return;
        if (typedIndices.length >= currentScrambled.length) return;
        setTypedIndices((prev) => [...prev, index]);
    };

    const handleSlotClick = (slotPosition: number) => {
        if (feedback !== "idle") return;
        setTypedIndices((prev) => prev.filter((_, idx) => idx !== slotPosition));
    };

    const handleClear = () => {
        if (feedback !== "idle") return;
        setTypedIndices([]);
    };

    const handleSubmit = () => {
        if (!roomId) return;
        if (typedIndices.length !== currentScrambled.length) return;

        const guess = typedIndices.map((i) => currentScrambled[i]).join("");
        submitWord(roomId, currentWordIndex, guess);
    };

    return (
        <div className="min-h-screen bg-cream text-ink flex items-center justify-center px-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-80 h-80 bg-graph-grid opacity-40 pointer-events-none -z-10" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-graph-grid opacity-40 pointer-events-none -z-10" />

            <div className="w-full max-w-md sm:max-w-lg bg-white border-3 sm:border-4 border-ink rounded-2xl sm:rounded-3xl p-5 sm:p-7 brutal-shadow-lg text-center space-y-6 relative z-10">
                <div className="flex items-center justify-between text-xs sm:text-sm font-black uppercase tracking-wider text-slate-500">
                    <span>
                        Round {round} of {totalRounds}
                    </span>
                    <span
                        className={cn(
                            secondsLeft <= 5 ? "text-rose-600" : "text-blue",
                        )}
                    >
                        {secondsLeft}s
                    </span>
                </div>

                {waitingForOthers ? (
                    <div className="py-10">
                        <p className="font-display text-lg sm:text-xl font-black uppercase tracking-wide">
                            Waiting for all players to finish...
                        </p>
                    </div>
                ) : (
                    <>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                            Word {currentWordIndex + 1} of {scrambledWords.length}
                        </span>

                        {/* Answer Letter Slots */}
                        <div className="space-y-2">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                                {feedback === "timeout"
                                    ? "⏱ Time's up!"
                                    : "YOUR ANSWER"}
                            </span>
                            <div
                                className={cn(
                                    "flex items-center justify-center gap-2 sm:gap-3 flex-wrap",
                                    feedback === "incorrect" && "shake",
                                )}
                            >
                                {Array.from({ length: currentScrambled.length }).map(
                                    (_, slotIdx) => {
                                        const sourceIndex = typedIndices[slotIdx];
                                        const filled = sourceIndex !== undefined;
                                        const letter = filled
                                            ? currentScrambled[sourceIndex]
                                            : "";

                                        return (
                                            <div
                                                key={`slot-${slotIdx}`}
                                                onClick={() =>
                                                    filled && handleSlotClick(slotIdx)
                                                }
                                                className={cn(
                                                    "font-display w-11 h-13 sm:w-14 sm:h-16 rounded-xl sm:rounded-2xl border-3 border-ink flex items-center justify-center text-2xl sm:text-3xl font-black select-none transition-all",
                                                    filled &&
                                                        feedback === "idle" &&
                                                        "bg-blue text-white brutal-shadow-sm -translate-y-0.5 cursor-pointer",
                                                    filled &&
                                                        feedback === "correct" &&
                                                        "bg-emerald-500 text-white",
                                                    filled &&
                                                        feedback === "incorrect" &&
                                                        "bg-rose-500 text-white",
                                                    filled &&
                                                        feedback === "timeout" &&
                                                        "bg-amber-500 text-white",
                                                    !filled &&
                                                        "bg-slate-50 border-dashed text-slate-400",
                                                )}
                                            >
                                                {letter}
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                        </div>

                        {/* Scrambled Letters */}
                        <div className="space-y-2">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                                TAP LETTERS TO SOLVE
                            </span>
                            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                                {currentScrambled.split("").map((letter, i) => {
                                    if (typedIndices.includes(i)) return null;

                                    return (
                                        <button
                                            key={`letter-${i}`}
                                            type="button"
                                            onClick={() => handleLetterClick(i)}
                                            disabled={feedback !== "idle"}
                                            className="font-display w-11 h-13 sm:w-14 sm:h-16 bg-yellow text-ink border-3 border-ink rounded-xl sm:rounded-2xl font-black text-2xl sm:text-3xl brutal-btn brutal-shadow flex items-center justify-center select-none hover:scale-105 active:translate-y-1 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            {letter}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={handleClear}
                                disabled={feedback !== "idle"}
                                className="px-4 py-2.5 bg-white border-2 border-ink rounded-xl font-black text-xs sm:text-sm brutal-btn brutal-shadow-sm flex items-center gap-1.5 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <span>Clear</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={
                                    typedIndices.length !== currentScrambled.length ||
                                    feedback !== "idle"
                                }
                                className="px-6 py-2.5 bg-emerald-500 text-white border-2 border-ink rounded-xl font-black text-xs sm:text-sm brutal-btn brutal-shadow flex items-center gap-2 hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <span>SUBMIT</span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
