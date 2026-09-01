import { GameMode, GameType } from "../types";
import { dailySeed, seededRng } from "./core";
import generateNumbers from "./numbers";
import { generateColors } from "./colors";
import generateNumberSequence from "./numbers-sequence";
import generateEmojis from "./emoji";

export function buildDeck(type: GameType, complexity: string, mode: GameMode, seedOverride?: number | null) {
    const rng = mode === "Daily" ? seededRng(seedOverride ?? dailySeed()) : Math.random;
    if (type === "Number") return generateNumbers(complexity, rng);
    if (type === "Emoji") return generateEmojis(complexity, rng);
    if (type === "Number-Sequence") return generateNumberSequence(complexity, rng);
    return generateColors(complexity, rng);
}
