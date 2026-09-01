import { shuffle } from "./core";

export default function generateNumbers(complexity: string): any[] {
    switch (complexity) {
        case "Easy":
            return generateGameNumbers(8);
        case "Medium":
            return generateGameNumbers(16);
        case "Hard":
            return generateGameNumbers(32);
        case "Extreme":
            return generateGameNumbers(32);
        default:
            return generateGameNumbers(32);
    }
}

function generateGameNumbers(length: number) {
    const color = generateRandomNumbersArray(length);
    const gameColors = shuffle([...color, ...color]);
    return gameColors
};

function generateRandomNumbersArray(length: number) {
    // unique values only — duplicates would make some cards permanently unmatchable
    const pool = shuffle(Array.from({ length: 48 }, (_, i) => i + 1));
    return pool.slice(0, length);
}