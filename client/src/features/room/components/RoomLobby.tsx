import { Button } from "@/ui/Button";
import type { Player } from "@/features/room/lib/avatar";

interface RoomLobbyProps {
    roomId: string | undefined;
    players: Player[];
    isHost: boolean;
    error: string;
    onLeave: () => void;
    onCopy: () => void;
    onStartGame: () => void;
}

export default function RoomLobby({
    roomId,
    players,
    isHost,
    error,
    onLeave,
    onCopy,
    onStartGame,
}: RoomLobbyProps) {
    return (
        <div className="min-h-screen bg-cream text-ink relative overflow-x-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-80 h-80 bg-graph-grid opacity-40 pointer-events-none -z-10" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-graph-grid opacity-40 pointer-events-none -z-10" />

            <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-3 flex items-center justify-between relative z-20">
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 select-none">
                        <span className="font-display font-extrabold text-xl tracking-tight text-ink">
                            JUMBLE <span className="text-blue">RACE</span>
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="danger" size="sm" onClick={onLeave}>
                        <span>Leave Room</span>
                    </Button>
                </div>
            </header>

            <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 flex-1 flex flex-col items-center justify-center relative z-10">
                <div className="w-full space-y-5">
                    <div className="bg-white border-4 border-ink rounded-3xl p-5 sm:p-7 brutal-shadow-lg relative overflow-hidden">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-pink text-white border-2 border-ink rounded-lg text-xs font-black uppercase tracking-wider brutal-shadow-sm">
                                        <span>GAME ROOM LOBBY</span>
                                    </span>
                                    <span className="text-xs font-bold text-slate-500">
                                        {players.length}/8 Players Joined
                                    </span>
                                </div>

                                <h1 className="font-display text-3xl sm:text-4xl font-black text-ink tracking-tight leading-tight">
                                    ROOM{" "}
                                    <span className="text-blue">
                                        {roomId}
                                    </span>
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
                                    Share the code with your friends and hit
                                    Start Game when ready!
                                </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={onCopy}
                                >
                                    <span>Copy Code</span>
                                </Button>
                                <Button variant="secondary" size="sm">
                                    <span>Share Link</span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="px-2 sm:px-4 py-2 space-y-3">
                        <div className="flex items-center gap-2">
                            <h2 className="font-display text-xl sm:text-2xl font-black text-ink uppercase tracking-wide">
                                PLAYERS JOINED ({players.length})
                            </h2>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-base sm:text-lg font-bold text-ink">
                            {players.map((p) => (
                                <span
                                    key={p.socketId}
                                    className="inline-flex items-center gap-1.5"
                                >
                                    <span>{p.avatar}</span>
                                    <span>{p.name}</span>
                                    {p.isHost && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow border border-ink rounded-md text-[11px] font-black uppercase text-ink">
                                            <span>Host</span>
                                        </span>
                                    )}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="pt-4 flex flex-col items-center">
                    {isHost ? (
                        <Button
                            type="button"
                            variant="yellow"
                            size="lg"
                            onClick={onStartGame}
                        >
                            <span>START GAME</span>
                        </Button>
                    ) : (
                        <p className="text-sm font-bold text-slate-500">
                            Waiting for host to start...
                        </p>
                    )}

                    {error && (
                        <p className="mt-3 text-xs font-bold text-rose-600">
                            {error}
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
}
