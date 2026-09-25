import type { RoundResultEntry } from "@/features/room/api/RoomSocket";

interface RoundResultsScreenProps {
    round: number;
    totalRounds: number;
    roundResults: RoundResultEntry[];
    correctWords: string[];
}

export default function RoundResultsScreen({
    round,
    totalRounds,
    roundResults,
    correctWords,
}: RoundResultsScreenProps) {
    const sorted = [...roundResults].sort(
        (a, b) => b.cumulativeScore - a.cumulativeScore,
    );

    return (
        <div className="min-h-screen bg-cream text-ink flex items-center justify-center px-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-80 h-80 bg-graph-grid opacity-40 pointer-events-none -z-10" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-graph-grid opacity-40 pointer-events-none -z-10" />

            <div className="w-full max-w-md sm:max-w-lg bg-white border-3 sm:border-4 border-ink rounded-2xl sm:rounded-3xl p-5 sm:p-7 brutal-shadow-lg text-center space-y-5 relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-pink text-white border-2 border-ink rounded-lg text-xs font-black uppercase tracking-wider brutal-shadow-sm">
                    Round {round} of {totalRounds} Complete
                </span>

                <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-wide">
                    Round Results
                </h1>

                <div className="space-y-1.5">
                    {sorted.map((entry, i) => (
                        <div
                            key={entry.socketId}
                            className="flex items-center justify-between px-4 py-2.5 bg-cream border-2 border-ink rounded-xl text-left"
                        >
                            <span className="font-black text-sm sm:text-base">
                                #{i + 1} {entry.name}
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-slate-600">
                                +{entry.roundScore} ({entry.wordsCompleted}/5) ·{" "}
                                {entry.cumulativeScore} total
                            </span>
                        </div>
                    ))}
                </div>

                <div className="pt-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                        Correct Words
                    </span>
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                        {correctWords.map((word) => (
                            <span
                                key={word}
                                className="px-2.5 py-1 bg-yellow border-2 border-ink rounded-lg text-xs font-black uppercase"
                            >
                                {word}
                            </span>
                        ))}
                    </div>
                </div>

                <p className="text-xs font-bold text-slate-400">
                    {round >= totalRounds
                        ? "Generating final results..."
                        : "Next round starting soon..."}
                </p>
            </div>
        </div>
    );
}
