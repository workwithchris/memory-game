import { GameMode, GameType, ColorTheme, EmojiTheme } from "../types";
import { dailySeed, seededRng } from "./core";
import { shuffle } from "./core";
import generateNumbers from "./numbers";
import { generateColors, generateColorDeck } from "./colors";
import generateNumberSequence from "./numbers-sequence";
import generateEmojis, { generateEmojiDeck } from "./emoji";

export const JOKER = "★";
export const TRAP = "☠";

export type DeckOpts = {
    pairs?: number;
    emojiTheme?: EmojiTheme;
    colorTheme?: ColorTheme;
    jokers?: boolean;
};

export function buildDeck(
    type: GameType,
    complexity: string,
    mode: GameMode,
    seedOverride: number | null | undefined,
    opts: DeckOpts = {}
): (string | number)[] {
    const rng = mode === "Daily" ? seededRng(seedOverride ?? dailySeed()) : Math.random;
    const custom = opts.pairs != null;

    let cards: (string | number)[];
    if (custom) {
        const pairs = Math.min(Math.max(opts.pairs!, 4), 40);
        if (type === "Color") cards = generateColorDeck(pairs, rng, opts.colorTheme ?? "Vibrant");
        else if (type === "Emoji") cards = generateEmojiDeck(pairs, rng, opts.emojiTheme ?? "Classic");
        else if (type === "Number-Sequence") cards = shuffle(Array.from({ length: pairs * 2 }, (_, i) => i + 1), rng);
        else cards = shuffle(Array.from({ length: 48 }, (_, i) => i + 1), rng).slice(0, pairs);
    } else {
        if (type === "Number") cards = generateNumbers(complexity, rng);
        else if (type === "Emoji") cards = generateEmojis(complexity, rng, opts.emojiTheme ?? "Classic");
        else if (type === "Number-Sequence") cards = generateNumberSequence(complexity, rng);
        else cards = generateColors(complexity, rng, opts.colorTheme ?? "Vibrant");
    }

    const pairGame = type !== "Number-Sequence";

    // wildcards: two jokers that match anything (not for sequence mode)
    if (opts.jokers && pairGame) {
        cards.splice(Math.floor(rng() * cards.length), 0, JOKER, JOKER);
    }

    // one trap card on the hardest levels (not for sequence mode)
    const trapLevel = complexity === "Hard" || complexity === "Extreme" || (custom && (opts.pairs ?? 0) >= 20);
    if (trapLevel && pairGame) {
        cards.splice(Math.floor(rng() * cards.length), 0, TRAP);
    }

    return cards;
}
