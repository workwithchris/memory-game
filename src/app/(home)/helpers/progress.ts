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
    livesLeft: number;
    timeLimitSec: number | null;
};

export type StatEntry = {
    games: number;
    wins: number;
    bestTimeMs: number | null;
    bestMoves: number | null;
    history: number[];
};

export type Stats = Record<string, StatEntry>;

const STATS_KEY = "memory-stats";
const ACHIEVEMENTS_KEY = "memory-achievements";
const DAILY_KEY = "memory-daily";

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
    const entry: StatEntry = stats[key] ?? { games: 0, wins: 0, bestTimeMs: null, bestMoves: null, history: [] };
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
        // winning-run history for the improvement sparkline (last 30)
        entry.history = [...(entry.history ?? []), run.timeMs].slice(-30);
    }
    stats[key] = entry;
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    return { isNewBestTime, isNewBestMoves };
}

// ---- daily streak ----

export function dateStr(offsetDays = 0): string {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}${mm}${dd}`;
}

export function recordDailyPlay(): void {
    if (typeof window === "undefined") return;
    const data = readJson<{ days: string[]; streak: number }>(DAILY_KEY, { days: [], streak: 0 });
    const today = dateStr();
    if (data.days.includes(today)) return;
    data.streak = data.days.includes(dateStr(-1)) ? data.streak + 1 : 1;
    data.days = [...data.days, today].slice(-60);
    localStorage.setItem(DAILY_KEY, JSON.stringify(data));
}

export function getDaily(): { days: string[]; streak: number } {
    return readJson<{ days: string[]; streak: number }>(DAILY_KEY, { days: [], streak: 0 });
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
    { id: "second-wind", name: "Second Wind", description: "Win after dropping to your last life" },
    { id: "photo-finish", name: "Photo Finish", description: "Win Time Attack with 10+ seconds to spare" },
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
    check("survivor", run.won && run.lostLife);
    check("duelist", run.mode === "Duel" || run.mode === "BestOf3");
    check("second-wind", run.won && run.lostLife && run.livesLeft === 1);
    check("photo-finish", run.won && run.mode === "TimeAttack" && run.timeLimitSec !== null && run.timeLimitSec - run.timeMs / 1000 >= 10);
    return earned;
}

export function unlock(earned: string[]): void {
    if (typeof window === "undefined" || earned.length === 0) return;
    const unlocked = getUnlocked();
    const merged = Array.from(new Set([...unlocked, ...earned]));
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(merged));
}
