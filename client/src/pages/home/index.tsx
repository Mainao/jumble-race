import { CreateRoomForm } from "@/features/home/components/CreateRoomForm";
import { JoinRoomForm } from "@/features/home/components/JoinRoomForm";
import { Card } from "@/ui/Card";

export default function Home() {
    return (
        <div className="min-h-screen bg-cream text-ink relative overflow-x-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-72 h-72 bg-graph-grid opacity-40 pointer-events-none -z-10" />
            <div className="absolute bottom-10 right-0 w-80 h-80 bg-graph-grid opacity-40 pointer-events-none -z-10" />
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-8 pb-8 flex-1 flex flex-col items-center justify-center relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow border-2 border-ink rounded-full brutal-shadow-sm mb-4 transform -rotate-1 hover:rotate-0 transition-transform cursor-default">
                    <span className="font-display text-xs sm:text-sm font-extrabold uppercase tracking-wider text-ink">
                        Multiplayer Word Unscramble Battle
                    </span>
                </div>
                <div className="relative text-center my-2 select-none">
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
                        <div className="hidden md:flex absolute top-0 bottom-0 left-1/2 -translate-x-1/2 items-center justify-center pointer-events-none">
                            <div className="w-0.5 h-full bg-ink/15 relative"></div>
                        </div>
                        <div className="flex md:hidden items-center my-1">
                            <div className="flex-1 h-0.5 bg-ink/15" />
                            <div className="flex-1 h-0.5 bg-ink/15" />
                        </div>
                        <JoinRoomForm />
                    </div>
                </Card>
            </main>
        </div>
    );
}
