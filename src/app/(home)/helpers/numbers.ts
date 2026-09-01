import { shuffle } from "./core";

export default function generateNumbers(complexity: string, rng: () => number = Math.random): any[] {
    switch (complexity) {
        case "Easy":
            return generateGameNumbers(8, rng);
        case "Medium":
            return generateGameNumbers(16, rng);
        case "Hard":
            return generateGameNumbers(32, rng);
        case "Extreme":
            return generateGameNumbers(32, rng);
        default:
            return generateGameNumbers(32, rng);
    }
}

function generateGameNumbers(length: number, rng: () => number) {
    // unique values only — duplicates would make some cards permanently unmatchable
    const pool = shuffle(Array.from({ length: 48 }, (_, i) => i + 1), rng);
    return pool.slice(0, length);
}
