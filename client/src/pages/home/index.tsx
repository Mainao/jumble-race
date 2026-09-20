import { CreateRoomForm } from "@/features/home/components/CreateRoomForm";
import { JoinRoomForm } from "@/features/home/components/JoinRoomForm";
import { Card } from "@/ui/Card";

export default function Home() {
    return (
        <div className="min-h-screen bg-cream text-ink relative overflow-x-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-72 h-72 bg-graph-grid opacity-40 pointer-events-none -z-10" />
            <div className="absolute bottom-10 right-0 w-80 h-80 bg-graph-grid opacity-40 pointer-events-none -z-10" />
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-8 pb-8 flex-1 flex flex-col items-center justify-center relative z-10">
                {/* Top Tagline Pill */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow border-2 border-ink rounded-full brutal-shadow-sm mb-4 transform -rotate-1 hover:rotate-0 transition-transform cursor-default">
                    <span className="font-display text-xs sm:text-sm font-extrabold uppercase tracking-wider text-ink">
                        Multiplayer Word Unscramble Battle
                    </span>
                </div>
                <div className="relative text-center my-2 select-none">
                    {/* Decorative burst & lightning around title */}

                    <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none text-center">
                        <span className="text-comic-blue inline-block transform -rotate-1 hover:rotate-0 transition-transform">
                            JUMBLE
                        </span>
                        <span className="mx-2 sm:mx-3 text-ink inline-block">
                            {" "}
                        </span>
                        <span className="text-comic-pink inline-block transform rotate-2 hover:rotate-0 transition-transform">
                            RACE!
                        </span>
                    </h1>
                </div>

                <div className="max-w-2xl mx-auto my-5 text-center px-4">
                    <p className="font-sans text-lg sm:text-xl md:text-2xl font-bold text-ink leading-snug">
                        Race to unscramble words before your friends do. Create
                        a room, share the code, and jump in.
                    </p>
                </div>

                <Card>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch relative">
                        <CreateRoomForm />
                        {/* <form className="flex flex-col justify-between space-y-3">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span
                                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-yellow border-2 border-ink rounded-lg text-xs font-black uppercase tracking-wider text-ink"
                                        style={{
                                            fontFamily:
                                                "'Fredoka', cursive, sans-serif",
                                        }}
                                    >
                                        <span>CREATE ROOM</span>
                                    </span>
                                    <span className="text-[11px] font-bold text-slate-500">
                                        Host a Game
                                    </span>
                                </div>

                                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                                    Room Code (Edit or generate new):
                                </label>

                     
                                <div className="relative flex items-center">
                                    <input
                                        type="text"
                                        placeholder="CODE"
                                        maxLength={6}
                                        className="w-full py-3 pl-4 pr-12 bg-cream border-[2.5px] border-ink rounded-xl font-black text-xl sm:text-2xl tracking-widest text-center uppercase text-ink focus:outline-none focus:border-yellow brutal-shadow-sm"
                                        style={{
                                            fontFamily:
                                                "'Fredoka', cursive, sans-serif",
                                        }}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 px-4 bg-yellow text-ink border-[2.5px] border-ink rounded-xl font-black text-base sm:text-lg brutal-btn brutal-shadow uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-105 active:translate-y-0.5"
                                style={{
                                    fontFamily:
                                        "'Fredoka', cursive, sans-serif",
                                }}
                            >
                                <span>CREATE ROOM</span>
                            </button>
                        </form> */}

                        {/* Desktop Center Divider with "OR" */}
                        <div className="hidden md:flex absolute top-0 bottom-0 left-1/2 -translate-x-1/2 items-center justify-center pointer-events-none">
                            <div className="w-0.5 h-full bg-ink/15 relative">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border-2 border-ink text-ink font-black text-xs flex items-center justify-center brutal-shadow-sm">
                                    OR
                                </div>
                            </div>
                        </div>

                        {/* Mobile Divider */}
                        <div className="flex md:hidden items-center my-1">
                            <div className="flex-1 h-0.5 bg-ink/15" />
                            <span className="px-3 text-xs font-black text-slate-400">
                                OR
                            </span>
                            <div className="flex-1 h-0.5 bg-ink/15" />
                        </div>

                        {/* ================= RIGHT: JOIN ROOM WITH CODE INPUT ================= */}
                        <JoinRoomForm />
                    </div>
                </Card>
            </main>
        </div>
    );
}
