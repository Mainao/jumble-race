import type { FinalScoreEntry } from "@/features/room/api/RoomSocket";
import { Badge } from "@/ui/Badge";
import { Button } from "@/ui/Button";

interface FinalResultsScreenProps {
    finalScores: FinalScoreEntry[];
    isHost: boolean;
    onPlayAgain: () => void;
    onBackToHome: () => void;
}

export default function FinalResultsScreen({
    finalScores,
    isHost,
    onPlayAgain,
    onBackToHome,
}: FinalResultsScreenProps) {
    const sorted = [...finalScores].sort(
        (a, b) => b.cumulativeScore - a.cumulativeScore,
    );

    return (
        <div className="min-h-screen bg-cream text-ink flex items-center justify-center px-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-80 h-80 bg-graph-grid opacity-40 pointer-events-none -z-10" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-graph-grid opacity-40 pointer-events-none -z-10" />

            <div className="w-full max-w-md sm:max-w-lg bg-white border-3 sm:border-4 border-ink rounded-2xl sm:rounded-3xl p-5 sm:p-7 brutal-shadow-lg text-center space-y-5 relative z-10">
                <Badge variant="yellow">Game Over</Badge>

                <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-wide">
                    Final Standings
                </h1>

                <div className="space-y-1.5">
                    {sorted.map((entry, i) => (
                        <div
                            key={entry.socketId}
                            className="flex items-center justify-between px-4 py-2.5 bg-cream border-2 border-ink rounded-xl text-left"
                        >
                            <span className="font-black text-sm sm:text-base">
                                {i === 0 ? "🏆 " : `#${i + 1} `}
                                {entry.name}
                            </span>
                            <span className="text-sm font-bold text-slate-600">
                                {entry.cumulativeScore} pts
                            </span>
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                    {isHost && (
                        <Button
                            variant="yellow"
                            size="sm"
                            onClick={onPlayAgain}
                        >
                            <span>Play Again</span>
                        </Button>
                    )}
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={onBackToHome}
                    >
                        <span>Back to Home</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
