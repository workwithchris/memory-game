import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Complexity, GameMode, GameState, GameType } from "../types";

type Card = { index: number, color: string };

type MemoryGameStore = {
    playerName: string;
    player2Name: string;
    mode: GameMode;
    activePlayer: 0 | 1;
    playerScores: [number, number];
    roundWins: [number, number];
    complexity: Complexity;
    gameState: GameState;
    gameType: GameType;
    startTime: string | null;
    endTime: string | null;
    hasGameTimer: boolean;
    gameTimer: string | null;
    outcome: "won" | "lost";
    locked: boolean;
    moves: number;
    lives: number;
    livesEnabled: boolean;
    lostLife: boolean;
    streak: number;
    maxStreak: number;
    mismatches: number;
    hintsLeft: number;
    peeking: boolean;
    paused: boolean;
    pausedAt: number | null;
    pausedTotalMs: number;
    dailySeedValue: number | null;
    soundOn: boolean;
    gameCards: (string | number)[];
    firstCard: Card | null;
    secondCard: Card | null;
    matchedCards: Card[];
    resetRound: () => void;
    setGameCards: (gameCards: (string | number)[]) => void;
    setGameTimer: (gameTimer: string) => void;
    setGameType: (gameType: GameType) => void;
    setMode: (mode: GameMode) => void;
    setPlayerName: (playerName: string) => void;
    setPlayer2Name: (player2Name: string) => void;
    setActivePlayer: (activePlayer: 0 | 1) => void;
    setPlayerScores: (playerScores: [number, number]) => void;
    setRoundWins: (roundWins: [number, number]) => void;
    setComplexity: (complexity: Complexity) => void;
    setGameState: (gameState: GameState) => void;
    setStartTime: (startTime: string | null) => void;
    setEndTime: (endTime: string | null) => void;
    setHasGameTimer: (hasGameTimer: boolean) => void;
    setOutcome: (outcome: "won" | "lost") => void;
    setLocked: (locked: boolean) => void;
    setMoves: (moves: number) => void;
    setLives: (lives: number) => void;
    setLivesEnabled: (livesEnabled: boolean) => void;
    setLostLife: (lostLife: boolean) => void;
    setStreak: (streak: number) => void;
    setMaxStreak: (maxStreak: number) => void;
    setMismatches: (mismatches: number) => void;
    setHintsLeft: (hintsLeft: number) => void;
    setPeeking: (peeking: boolean) => void;
    setPaused: (paused: boolean) => void;
    setPausedAt: (pausedAt: number | null) => void;
    setPausedTotalMs: (pausedTotalMs: number) => void;
    setDailySeedValue: (dailySeedValue: number | null) => void;
    setSoundOn: (soundOn: boolean) => void;
    setFirstCard: (firstCard: Card | null) => void;
    setSecondCard: (secondCard: Card | null) => void;
    setMatchedCards: (matchedCards: Card[]) => void;
}

const initialState = {
    playerName: "Player",
    player2Name: "Player 2",
    mode: "Classic" as GameMode,
    activePlayer: 0 as 0 | 1,
    playerScores: [0, 0] as [number, number],
    roundWins: [0, 0] as [number, number],
    complexity: "Easy" as Complexity,
    gameState: "New" as GameState,
    gameType: "Color" as GameType,
    startTime: null,
    endTime: null,
    hasGameTimer: false,
    gameTimer: "3",
    outcome: "won" as "won" | "lost",
    locked: false,
    moves: 0,
    lives: 3,
    livesEnabled: false,
    lostLife: false,
    streak: 0,
    maxStreak: 0,
    mismatches: 0,
    hintsLeft: 1,
    peeking: false,
    paused: false,
    pausedAt: null as number | null,
    pausedTotalMs: 0,
    dailySeedValue: null as number | null,
    soundOn: true,
    gameCards: [] as (string | number)[],
    firstCard: null as Card | null,
    secondCard: null as Card | null,
    matchedCards: [] as Card[],
}

const memoryGameStore = create<MemoryGameStore>()(
    persist(
        (set) => ({
            ...initialState,
            resetRound: () => {
                const s = memoryGameStore.getState();
                set({
                    ...initialState,
                    // keep session settings + series progress
                    playerName: s.playerName,
                    player2Name: s.player2Name,
                    mode: s.mode,
                    gameType: s.gameType,
                    complexity: s.complexity,
                    hasGameTimer: s.hasGameTimer,
                    gameTimer: s.gameTimer,
                    livesEnabled: s.livesEnabled,
                    soundOn: s.soundOn,
                    roundWins: s.roundWins,
                });
            },
            setGameCards: (gameCards) => set({ gameCards }),
            setGameType: (gameType) => set({ gameType }),
            setGameTimer: (gameTimer) => set({ gameTimer }),
            setMode: (mode) => set({ mode }),
            setPlayerName: (playerName) => set({ playerName }),
            setPlayer2Name: (player2Name) => set({ player2Name }),
            setActivePlayer: (activePlayer) => set({ activePlayer }),
            setPlayerScores: (playerScores) => set({ playerScores }),
            setRoundWins: (roundWins) => set({ roundWins }),
            setComplexity: (complexity) => set({ complexity }),
            setHasGameTimer: (hasGameTimer) => set({ hasGameTimer }),
            setGameState: (gameState) => set({ gameState }),
            setStartTime: (startTime) => set({ startTime }),
            setEndTime: (endTime) => set({ endTime }),
            setOutcome: (outcome) => set({ outcome }),
            setLocked: (locked) => set({ locked }),
            setMoves: (moves) => set({ moves }),
            setLives: (lives) => set({ lives }),
            setLivesEnabled: (livesEnabled) => set({ livesEnabled }),
            setLostLife: (lostLife) => set({ lostLife }),
            setStreak: (streak) => set({ streak }),
            setMaxStreak: (maxStreak) => set({ maxStreak }),
            setMismatches: (mismatches) => set({ mismatches }),
            setHintsLeft: (hintsLeft) => set({ hintsLeft }),
            setPeeking: (peeking) => set({ peeking }),
            setPaused: (paused) => set({ paused }),
            setPausedAt: (pausedAt) => set({ pausedAt }),
            setPausedTotalMs: (pausedTotalMs) => set({ pausedTotalMs }),
            setDailySeedValue: (dailySeedValue) => set({ dailySeedValue }),
            setSoundOn: (soundOn) => set({ soundOn }),
            setFirstCard: (firstCard) => set({ firstCard }),
            setSecondCard: (secondCard) => set({ secondCard }),
            setMatchedCards: (matchedCards) => set({ matchedCards }),
        }),
        {
            name: "memory-game-store",
            version: 1,
            storage: createJSONStorage(() => localStorage),
            // rehydrate manually after mount to avoid SSR hydration mismatch
            skipHydration: true,
            partialize: (s) => {
                const { locked, peeking, paused, pausedAt, pausedTotalMs, ...rest } = s as MemoryGameStore & Record<string, unknown>;
                return rest as MemoryGameStore;
            },
        }
    )
)

export default memoryGameStore;
