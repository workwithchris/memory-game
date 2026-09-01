import { shuffle } from "./core";

export default function generateEmojis(complexity: string, rng: () => number = Math.random): any[] {
    switch (complexity) {
        case "Easy":
            return generateGameEmojis(8, rng);
        case "Medium":
            return generateGameEmojis(16, rng);
        case "Hard":
            return generateGameEmojis(32, rng);
        case "Extreme":
            return generateGameEmojis(32, rng);
        default:
            return generateGameEmojis(32, rng);
    }
}

function generateGameEmojis(length: number, rng: () => number) {
    const emoji = getRandomUniqueEmojis(length, rng);
    const gameEmojis = shuffle([...emoji, ...emoji], rng);
    return gameEmojis
};

function getRandomUniqueEmojis(length: number, rng: () => number) {
    const emojis = [
        "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣",
        "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰",
        "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜",
        "🤪", "🤨", "🧐", "🤓", "😎", "🥸", "🤩", "🥳",
        "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️",
        "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤"
    ];

    if (length > emojis.length) {
        length = emojis.length;
    }

    const shuffledEmojis = shuffle(emojis, rng);
    return shuffledEmojis.slice(0, length);
}
