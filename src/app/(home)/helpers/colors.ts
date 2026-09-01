import { shuffle } from "./core";

// curated, visually distinct palette — random hex pairs can be near-identical
const PALETTE = [
    "#E53935", "#F06292", "#BA68C8", "#6A1B9A", "#5C6BC0", "#1E88E5",
    "#29B6F6", "#26C6DA", "#26A69A", "#66BB6A", "#9CCC65", "#D4E157",
    "#FFEE58", "#FFB300", "#FB8C00", "#F4511E", "#8D6E63", "#757575",
    "#546E7A", "#212121", "#AD1457", "#283593", "#2E7D32", "#00838C",
];

export function generateColors(complexity: string, rng: () => number = Math.random): any[] {
    switch (complexity) {
        case "Easy":
            return generateGameColor(8, rng);
        case "Medium":
            return generateGameColor(16, rng);
        case "Hard":
            return generateGameColor(24, rng);
        case "Extreme":
            return generateGameColor(24, rng);
        default:
            return generateGameColor(24, rng);
    }
}

function generateGameColor(length: number, rng: () => number) {
    const color = generateRandomColorsArray(length, rng);
    const gameColors = shuffle([...color, ...color], rng);
    return gameColors
};

function generateRandomColorsArray(length: number, rng: () => number) {
    return shuffle([...PALETTE], rng).slice(0, length);
}
