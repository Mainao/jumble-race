import { PrismaClient } from "./generated/prisma/client";

const prisma = new PrismaClient();

let wordCache: string[] = [];
let cacheLoadedAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function getWordPool(): Promise<string[]> {
    if (Date.now() - cacheLoadedAt > CACHE_TTL_MS || wordCache.length === 0) {
        const words = await prisma.word.findMany({ where: { isActive: true } });
        wordCache = words.map((w) => w.text);
        cacheLoadedAt = Date.now();
    }
    return wordCache;
}

export function shuffleWords<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}
