import React, { useEffect } from 'react'

import memoryGameStore from '../../store/store';
import useMemoryGame from '../../hook/memory-game.hook';
import MemoryCard from './cards/memory-card';
import { GameHeader } from './header';
import { Button } from '@/components/ui/button';

const GRID_COLS: Record<string, string> = {
    Easy: "grid-cols-4",
    Medium: "grid-cols-4 md:grid-cols-8",
    Hard: "grid-cols-6 lg:grid-cols-8",
    Extreme: "grid-cols-6 lg:grid-cols-8",
};

export default function Game() {
    const {
        complexity,
        mode,
        customCols,
        paused,
        pausedAt,
        pausedTotalMs,
        peeking,
        locked,
        toast,
        setToast,
        setPaused,
        setPausedAt,
        setPausedTotalMs,
    } = memoryGameStore();
    const { gameCards } = useMemoryGame();
    const gridRef = React.useRef<HTMLDivElement>(null);

    function resume() {
        if (pausedAt) {
            setPausedTotalMs(pausedTotalMs + (Date.now() - pausedAt));
        }
        setPausedAt(null);
        setPaused(false);
    }

    function autoPause() {
        if (peeking || locked || paused) return;
        setPaused(true);
        setPausedAt(Date.now());
    }

    // achievement toast auto-dismiss
    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), 3500);
        return () => clearTimeout(timer);
    }, [toast]);

    // auto-pause after 30s of no input (protects timed rounds)
    useEffect(() => {
        if (paused) return;
        let timer = setTimeout(autoPause, 30000);
        const reset = () => {
            clearTimeout(timer);
            timer = setTimeout(autoPause, 30000);
        };
        window.addEventListener("pointerdown", reset);
        window.addEventListener("keydown", reset);
        return () => {
            clearTimeout(timer);
            window.removeEventListener("pointerdown", reset);
            window.removeEventListener("keydown", reset);
        };
    }, [paused]);

    // arrow-key navigation across the card grid
    function handleKeyDown(e: React.KeyboardEvent) {
        if (paused) return;
        const buttons = gridRef.current?.querySelectorAll<HTMLButtonElement>("button");
        if (!buttons) return;
        const active = document.activeElement;
        const current = Array.from(buttons).findIndex((b) => b === active);
        if (current === -1 || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
        e.preventDefault();
        const cols = getComputedStyle(gridRef.current!).gridTemplateColumns.split(" ").length;
        const moves: Record<string, number> = {
            ArrowLeft: -1, ArrowRight: 1, ArrowUp: -cols, ArrowDown: cols,
        };
        const next = current + moves[e.key];
        if (next >= 0 && next < buttons.length) buttons[next].focus();
    }

    if (paused) {
        return (
            <div className='w-fit'>
                <GameHeader />
                <div className='p-5 bg-white bg-opacity-70 rounded-lg flex flex-col items-center gap-4'>
                    <p className='text-2xl font-bold uppercase tracking-widest'>Paused</p>
                    <p className='text-sm text-muted-foreground'>Board is hidden while paused</p>
                    <Button onClick={resume}>Resume</Button>
                </div>
            </div>
        );
    }

    return (
        <div className='w-fit'>
            {toast && (
                <div className='fixed top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg z-50 font-semibold'>
                    {toast}
                </div>
            )}
            <GameHeader />
            <div className='p-5 bg-white bg-opacity-70 rounded-lg' >
                <div
                    ref={gridRef}
                    onKeyDown={handleKeyDown}
                    className={`grid ${mode === "Custom" ? "" : GRID_COLS[complexity]} gap-5`}
                    style={mode === "Custom" ? { gridTemplateColumns: `repeat(${customCols}, minmax(0, 1fr))` } : undefined}
                >
                    {gameCards.map((card, index) => (
                        <MemoryCard key={index} index={index} color={card as string} />
                    ))}
                </div>
            </div>
        </div>
    )
}
