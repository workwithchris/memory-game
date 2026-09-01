export type Complexity = "Easy" | "Medium" | "Hard" | "Extreme";

export type GameState = "New" | "Playing" | "Ended";

export type GameType = "Color" | "Number" | "Number-Sequence" | "Emoji";

export type GameMode = "Classic" | "Daily" | "TimeAttack" | "Duel" | "BestOf3" | "Zen" | "Custom";

export type EmojiTheme = "Classic" | "Animals" | "Food" | "Space";

export type ColorTheme = "Vibrant" | "Pastel" | "Neon";

export type GameCardProp={ color: string, index: number, isMatched: boolean, setIsMatched: any }