import { shuffle } from "./core";

export default function generateNumberSequence(complexity: string, rng: () => number = Math.random): any[] {
    switch (complexity) {
        case "Easy":
            return generateGameNumbers(16, rng);
        case "Medium":
            return generateGameNumbers(24, rng);
        case "Hard":
            return generateGameNumbers(48, rng);
        case "Extreme":
            return generateGameNumbers(48, rng);
        default:
            return generateGameNumbers(48, rng);
    }
}

function generateGameNumbers(length: number, rng: () => number) {
    const color = generateNumber(1, length);
    const gameColors = shuffle([...color], rng);
    return gameColors
};

function generateNumber(start: number, end: number) {
    const numbers = [];
    for (let i = start; i <= end; i++) {
        numbers.push(i);
    }
    return numbers;
}
