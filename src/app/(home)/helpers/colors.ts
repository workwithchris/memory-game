import { shuffle } from "./core";

export function generateColors(complexity: string): any[] {
    switch (complexity) {
        case "Easy":
            return generateGameColor(8);
        case "Medium":
            return generateGameColor(16);
        case "Hard":
            return generateGameColor(24);
        case "Extreme":
            return generateGameColor(24);
        default:
            return generateGameColor(24);
    }
}

// curated, visually distinct palette — random hex pairs can be near-identical
const PALETTE = [
    "#E53935", "#F06292", "#BA68C8", "#6A1B9A", "#5C6BC0", "#1E88E5",
    "#29B6F6", "#26C6DA", "#26A69A", "#66BB6A", "#9CCC65", "#D4E157",
    "#FFEE58", "#FFB300", "#FB8C00", "#F4511E", "#8D6E63", "#757575",
    "#546E7A", "#212121", "#AD1457", "#283593", "#2E7D32", "#00838C",
];

function generateRandomColorsArray(length: number) {
    return shuffle([...PALETTE]).slice(0, length);
}

function generateGameColor(length: number) {
    const color = generateRandomColorsArray(length);
    const gameColors = shuffle([...color, ...color]);
    return gameColors
};