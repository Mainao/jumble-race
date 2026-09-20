export const WORD_LIST: string[] = [
    // 4-letter
    "puma", "tent", "frog", "kite", "lamp", "desk", "fish", "gold", "leaf", "moon",
    "nest", "pond", "rain", "sand", "star",
    // 5-letter
    "eagle", "brave", "chalk", "dance", "flame", "grape", "house", "ivory", "joker", "knife",
    "lemon", "mango", "noble", "ocean", "piano",
    // 6-letter
    "garden", "bottle", "yellow", "forest", "castle", "dragon", "hunter", "bridge", "market", "window",
    "pencil", "rocket", "guitar", "monkey", "tunnel", "wallet", "basket", "camera", "hammer", "island",
];

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

export function pickGameWords(count: number): string[] {
    const pool = [...WORD_LIST];
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, count);
}
