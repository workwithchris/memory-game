import { shuffle } from "./core";
import { EmojiTheme } from "../types";

export const EMOJI_SETS: Record<EmojiTheme, string[]> = {
    Classic: [
        "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣",
        "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰",
        "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜",
        "🤪", "🤨", "🧐", "🤓", "😎", "🥸", "🤩", "🥳",
        "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️",
        "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤"
    ],
    Animals: [
        "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼",
        "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🙈",
        "🐔", "🐧", "🐦", "🐤", "🦆", "🦉", "🦇", "🐺",
        "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐞",
        "🐢", "🐍", "🦎", "🐙", "🦑", "🦀", "🐡", "🐠",
        "🐬", "🐳", "🦈", "🐊", "🐘", "🦍", "🦓", "🦒"
    ],
    Food: [
        "🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇",
        "🍓", "🫐", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥",
        "🥝", "🍅", "🥑", "🥦", "🥬", "🥒", "🌶️", "🌽",
        "🥕", "🧄", "🧅", "🥔", "🍠", "🥐", "🥯", "🍞",
        "🥖", "🧇", "🧈", "🍳", "🥞", "🧀", "🍕", "🌮",
        "🌯", "🍜", "🍣", "🍩", "🍪", "🎂", "🍫", "🍿"
    ],
    Space: [
        "🌍", "🌎", "🌏", "🌑", "🌒", "🌓", "🌔", "🌕",
        "🌖", "🌗", "🌘", "🌙", "☀️", "⭐", "🌟", "✨",
        "⚡", "🔥", "☄️", "🪐", "🌌", "🌈", "💫", "🌠",
        "🚀", "🛸", "🛰️", "👨‍🚀", "👩‍🚀", "🚢", "🔭", "⚛️",
        "🌌", "🌠", "☄️", "🌞", "🌝", "🌚", "🌛", "🌜",
        "🎖️", "🧑‍🔬", "🧑‍🚀", "🛎️", "🗺️", "🧭", "⏱️", "🧿"
    ],
};

export default function generateEmojis(complexity: string, rng: () => number = Math.random, theme: EmojiTheme = "Classic"): any[] {
    switch (complexity) {
        case "Easy":
            return generateGameEmojis(8, rng, theme);
        case "Medium":
            return generateGameEmojis(16, rng, theme);
        case "Hard":
            return generateGameEmojis(32, rng, theme);
        case "Extreme":
            return generateGameEmojis(32, rng, theme);
        default:
            return generateGameEmojis(32, rng, theme);
    }
}

function generateGameEmojis(length: number, rng: () => number, theme: EmojiTheme) {
    const emoji = getRandomUniqueEmojis(length, rng, theme);
    const gameEmojis = shuffle([...emoji, ...emoji], rng);
    return gameEmojis
};

export function generateEmojiDeck(pairs: number, rng: () => number, theme: EmojiTheme): any[] {
    const picked = getRandomUniqueEmojis(Math.min(pairs, EMOJI_SETS[theme].length), rng, theme);
    return shuffle([...picked, ...picked], rng);
}

function getRandomUniqueEmojis(length: number, rng: () => number, theme: EmojiTheme) {
    const emojis = EMOJI_SETS[theme];

    if (length > emojis.length) {
        length = emojis.length;
    }

    const shuffledEmojis = shuffle(emojis, rng);
    return shuffledEmojis.slice(0, length);
}
