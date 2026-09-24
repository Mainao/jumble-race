// Hardcoded word list moved to word-pool.ts + Prisma (Word model).

export function scrambleWord(word: string): string {
    if (word.length <= 1) return word;

    let scrambled = word;
    while (scrambled === word) {
        const letters = word.split("");
        for (let i = letters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [letters[i], letters[j]] = [letters[j], letters[i]];
        }
        scrambled = letters.join("");
    }
    return scrambled;
}
