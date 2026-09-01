import { create } from "zustand";
import { Complexity, GameMode, GameState, GameType } from "../types";



type MemoryGameStore = {
    playerName: string;
    player2Name: string;
    mode: GameMode;
    activePlayer: 0 | 1;
    playerScores: [number, number];
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
    soundOn: boolean;
    firstCard: { index: number, color: string } | null;
    secondCard: { index: number, color: string } | null;
    matchedCards: { index: number, color: string }[];
    resetRound: () => void;
    setGameTimer: (gameTimer: string) => void;
    setGameType: (gameType: GameType) => void;
    setMode: (mode: GameMode) => void;
    setPlayerName: (playerName: string) => void;
    setPlayer2Name: (player2Name: string) => void;
    setActivePlayer: (activePlayer: 0 | 1) => void;
    setPlayerScores: (playerScores: [number, number]) => void;
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
    setSoundOn: (soundOn: boolean) => void;
    setFirstCard: (firstCard: { index: number, color: string } | null) => void;
    setSecondCard: (secondCard: { index: number, color: string } | null) => void;
    setMatchedCards: (matchedCards: { index: number, color: string }[]) => void;
}

const initialState = {
    playerName: "Player",
    player2Name: "Player 2",
    mode: "Classic" as GameMode,
    activePlayer: 0 as 0 | 1,
    playerScores: [0, 0] as [number, number],
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
    soundOn: true,
    firstCard: null,
    secondCard: null,
    matchedCards: [] as { index: number, color: string }[],
}

const memoryGameStore = create<MemoryGameStore>((set) => ({
    ...initialState,
    resetRound: () => set({ ...initialState, playerName: memoryGameStore.getState().playerName, player2Name: memoryGameStore.getState().player2Name, gameType: memoryGameStore.getState().gameType, complexity: memoryGameStore.getState().complexity, hasGameTimer: memoryGameStore.getState().hasGameTimer, gameTimer: memoryGameStore.getState().gameTimer, mode: memoryGameStore.getState().mode, livesEnabled: memoryGameStore.getState().livesEnabled, soundOn: memoryGameStore.getState().soundOn }),
    setGameType: (gameType: GameType) => set({ gameType }),
    setGameTimer: (gameTimer: string) => set({ gameTimer }),
    setMode: (mode: GameMode) => set({ mode }),
    setPlayerName: (playerName: string) => set({ playerName }),
    setPlayer2Name: (player2Name: string) => set({ player2Name }),
    setActivePlayer: (activePlayer: 0 | 1) => set({ activePlayer }),
    setPlayerScores: (playerScores: [number, number]) => set({ playerScores }),
    setComplexity: (complexity: Complexity) => set({ complexity }),
    setHasGameTimer: (hasGameTimer: boolean) => set({ hasGameTimer }),
    setGameState: (gameState: GameState) => set({ gameState }),
    setStartTime: (startTime: string | null) => set({ startTime }),
    setEndTime: (endTime: string | null) => set({ endTime }),
    setOutcome: (outcome: "won" | "lost") => set({ outcome }),
    setLocked: (locked: boolean) => set({ locked }),
    setMoves: (moves: number) => set({ moves }),
    setLives: (lives: number) => set({ lives }),
    setLivesEnabled: (livesEnabled: boolean) => set({ livesEnabled }),
    setLostLife: (lostLife: boolean) => set({ lostLife }),
    setStreak: (streak: number) => set({ streak }),
    setMaxStreak: (maxStreak: number) => set({ maxStreak }),
    setMismatches: (mismatches: number) => set({ mismatches }),
    setHintsLeft: (hintsLeft: number) => set({ hintsLeft }),
    setPeeking: (peeking: boolean) => set({ peeking }),
    setSoundOn: (soundOn: boolean) => set({ soundOn }),
    setFirstCard: (firstCard: { index: number, color: string } | null) => set({ firstCard }),
    setSecondCard: (secondCard: { index: number, color: string } | null) => set({ secondCard }),
    setMatchedCards: (matchedCards: { index: number, color: string }[]) => set({ matchedCards }),
}))

export default memoryGameStore;
