import { shuffle } from "./core";
import { ColorTheme } from "../types";

// curated, visually distinct palettes — random hex pairs can be near-identical
export const COLOR_SETS: Record<ColorTheme, string[]> = {
    Vibrant: [
        "#E53935", "#F06292", "#BA68C8", "#6A1B9A", "#5C6BC0", "#1E88E5",
        "#29B6F6", "#26C6DA", "#26A69A", "#66BB6A", "#9CCC65", "#D4E157",
        "#FFEE58", "#FFB300", "#FB8C00", "#F4511E", "#8D6E63", "#757575",
        "#546E7A", "#212121", "#AD1457", "#283593", "#2E7D32", "#00838C",
    ],
    Pastel: [
        "#F8BBD0", "#F48FB1", "#CE93D8", "#B39DDB", "#9FA8DA", "#90CAF9",
        "#81D4FA", "#80DEEA", "#80CBC4", "#A5D6A7", "#C5E1A5", "#E6EE9C",
        "#FFF59D", "#FFE082", "#FFCC80", "#FFAB91", "#BCAAA4", "#B0BEC5",
        "#F48FB1", "#D1C4E9", "#C8E6C9", "#FFF9C4", "#FFCCBC", "#CFD8DC",
    ],
    Neon: [
        "#FF1744", "#F50057", "#D500F9", "#AA00FF", "#6200EA", "#304FFE",
        "#2979FF", "#00B0FF", "#00E5FF", "#1DE9B6", "#00E676", "#76FF03",
        "#FFEA00", "#FFC400", "#FF9100", "#FF3D00", "#FF4081", "#FFAB00",
        "#C6FF00", "#64FFDA", "#18FFFF", "#7C4DFF", "#536DFE", "#FF6E40",
    ],
};

export function generateColors(complexity: string, rng: () => number = Math.random, theme: ColorTheme = "Vibrant"): any[] {
    switch (complexity) {
        case "Easy":
            return generateGameColor(8, rng, theme);
        case "Medium":
            return generateGameColor(16, rng, theme);
        case "Hard":
            return generateGameColor(24, rng, theme);
        case "Extreme":
            return generateGameColor(24, rng, theme);
        default:
            return generateGameColor(24, rng, theme);
    }
}

function generateGameColor(length: number, rng: () => number, theme: ColorTheme) {
    const color = generateRandomColorsArray(length, rng, theme);
    const gameColors = shuffle([...color, ...color], rng);
    return gameColors
};

export function generateColorDeck(pairs: number, rng: () => number, theme: ColorTheme): any[] {
    const picked = generateRandomColorsArray(Math.min(pairs, COLOR_SETS[theme].length), rng, theme);
    return shuffle([...picked, ...picked], rng);
}

function generateRandomColorsArray(length: number, rng: () => number, theme: ColorTheme) {
    return shuffle([...COLOR_SETS[theme]], rng).slice(0, length);
}
