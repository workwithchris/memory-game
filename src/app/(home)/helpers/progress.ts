// local run stats + achievements, persisted in localStorage

export type RunSummary = {
    gameType: string;
    complexity: string;
    won: boolean;
    timeMs: number;
    moves: number;
    mismatches: number;
    maxStreak: number;
    mode: string;
    lostLife: boolean;
};

export type StatEntry = {
    games: number;
    wins: number;
    bestTimeMs: number | null;
    bestMoves: number | null;
};

export type Stats = Record<string, StatEntry>;

const STATS_KEY = "memory-stats";
const ACHIEVEMENTS_KEY = "memory-achievements";

function readJson<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
}

export function keyFor(gameType: string, complexity: string) {
    return `${gameType}:${complexity}`;
}

export function getStats(): Stats {
    return readJson<Stats>(STATS_KEY, {});
}

export function bestFor(gameType: string, complexity: string): StatEntry | undefined {
    return getStats()[keyFor(gameType, complexity)];
}

export function recordRun(run: RunSummary): { isNewBestTime: boolean; isNewBestMoves: boolean } {
    if (typeof window === "undefined") return { isNewBestTime: false, isNewBestMoves: false };
    const stats = getStats();
    const key = keyFor(run.gameType, run.complexity);
    const entry: StatEntry = stats[key] ?? { games: 0, wins: 0, bestTimeMs: null, bestMoves: null };
    entry.games += 1;
    let isNewBestTime = false;
    let isNewBestMoves = false;
    if (run.won) {
        entry.wins += 1;
        if (entry.bestTimeMs === null || run.timeMs < entry.bestTimeMs) {
            entry.bestTimeMs = run.timeMs;
            isNewBestTime = true;
        }
        if (entry.bestMoves === null || run.moves < entry.bestMoves) {
            entry.bestMoves = run.moves;
            isNewBestMoves = true;
        }
    }
    stats[key] = entry;
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    return { isNewBestTime, isNewBestMoves };
}

// ---- achievements ----

export type Achievement = {
    id: string;
    name: string;
    description: string;
};

export const ACHIEVEMENTS: Achievement[] = [
    { id: "first-clear", name: "First Steps", description: "Win your first round" },
    { id: "flawless", name: "Flawless", description: "Win with zero mismatches" },
    { id: "speed-demon", name: "Speed Demon", description: "Win Medium or harder in under 60s" },
    { id: "streak-5", name: "In the Zone", description: "Reach a 5-match streak" },
    { id: "daily-done", name: "Daily Grinder", description: "Complete a Daily challenge" },
    { id: "survivor", name: "Survivor", description: "Win with lives on after losing at least one" },
    { id: "duelist", name: "Duelist", description: "Play a Duel to the end" },
];

export function getUnlocked(): string[] {
    return readJson<string[]>(ACHIEVEMENTS_KEY, []);
}

export function evaluate(run: RunSummary, unlocked: string[]): string[] {
    const wins = Object.values(getStats()).reduce((n, s) => n + s.wins, 0);
    const earned: string[] = [];
    const has = (id: string) => unlocked.includes(id) || earned.includes(id);
    const check = (id: string, cond: boolean) => {
        if (cond && !has(id)) earned.push(id);
    };
    check("first-clear", run.won || wins > 0);
    check("flawless", run.won && run.mismatches === 0);
    check("speed-demon", run.won && run.timeMs < 60000 && (run.complexity === "Medium" || run.complexity === "Hard" || run.complexity === "Extreme"));
    check("streak-5", run.maxStreak >= 5);
    check("daily-done", run.won && run.mode === "Daily");
    check("survivor", run.won && run.maxStreak >= 0 && run.lostLife);
    check("duelist", run.mode === "Duel");
    return earned;
}

export function unlock(earned: string[]): void {
    if (typeof window === "undefined" || earned.length === 0) return;
    const unlocked = getUnlocked();
    const merged = Array.from(new Set([...unlocked, ...earned]));
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(merged));
}
