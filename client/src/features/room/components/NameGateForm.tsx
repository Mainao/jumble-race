import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";

interface NameGateFormProps {
    roomId: string | undefined;
    arrivedAsHost: boolean;
    nameInput: string;
    onNameInputChange: (value: string) => void;
    error: string;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

export default function NameGateForm({
    roomId,
    arrivedAsHost,
    nameInput,
    onNameInputChange,
    error,
    onSubmit,
    onCancel,
}: NameGateFormProps) {
    return (
        <div className="min-h-screen bg-cream text-ink flex items-center justify-center px-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-80 h-80 bg-graph-grid opacity-40 pointer-events-none -z-10" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-graph-grid opacity-40 pointer-events-none -z-10" />

            <form
                onSubmit={onSubmit}
                className="w-full max-w-sm bg-white border-4 border-ink rounded-3xl p-8 brutal-shadow-xl text-center"
            >
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-yellow border-2 border-ink rounded-lg text-xs font-black uppercase tracking-wider brutal-shadow-sm mb-4">
                    Room {roomId}
                </span>

                <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-wide mb-2">
                    Enter your nickname
                </h2>
                <p className="text-sm font-semibold text-slate-600 mb-6">
                    {arrivedAsHost
                        ? "You're creating this room, so you'll be the host."
                        : "Enter a name to join this room."}
                </p>

                <Input
                    variant="text"
                    accent="blue"
                    autoFocus
                    value={nameInput}
                    onChange={(e) => onNameInputChange(e.target.value)}
                    placeholder="Enter your name"
                    maxLength={20}
                    className="mb-4"
                />

                {error && (
                    <p className="text-xs font-bold text-rose-600 mb-3">{error}</p>
                )}

                <Button
                    type="submit"
                    variant="blue"
                    disabled={!nameInput.trim()}
                    className="w-full"
                >
                    Ok
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onCancel}
                    className="w-full mt-3 text-slate-500"
                >
                    Cancel and leave
                </Button>
            </form>
        </div>
    );
}
