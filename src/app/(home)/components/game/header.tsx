import { Eye, Volume2, VolumeX } from "lucide-react";

import memoryGameStore from "../../store/store";import CountdownTimer from "./countdown-timer";
import GameBackButton from "../game-info/back-button";
import CloseModal from "./modal/close.modal";
import Timer from "@/components/game-timer";
import { sfx } from "../../helpers/sfx";

export const GameHeader = () => {
    const {
        startTime,
        hasGameTimer,
        gameTimer,
        matchedCards,
        gameCards,
        moves,
        streak,
        lives,
        livesEnabled,
        hintsLeft,
        peeking,
        locked,
        paused,
        pausedAt,
        pausedTotalMs,
        setPeeking,
        setLocked,
        setHintsLeft,
        setMoves,
        mode,
        activePlayer,
        playerScores,
        roundWins,
        player2Name,
        playerName,
        complexity,
        gameType,
        soundOn,
        setSoundOn,
        setGameState,
        setEndTime,
        setOutcome,
        setFirstCard,
        setSecondCard,
    } = memoryGameStore();

    const totalCards = gameCards.length;
    const found = matchedCards.length;
    const nextTarget = Math.min(matchedCards.length + 1, totalCards);

    function timeOut() {
        setFirstCard(null);
        setSecondCard(null);
        setLocked(false);
        sfx.lose();
        setGameState("Ended");
        setOutcome("lost");
        setEndTime(new Date().toISOString());
    }

    function peek() {
        if (hintsLeft <= 0 || peeking || locked || paused) return;
        sfx.peek();
        setHintsLeft(0);
        setMoves(moves + 2); // peek costs 2 moves
        setLocked(true);
        setPeeking(true);
        setTimeout(() => {
            setPeeking(false);
            setLocked(false);
        }, 3000);
    }

    function toggleSound() {
        setSoundOn(!soundOn);
    }

    return (
        <div className='pb-4 space-y-4'>
            <div className='flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-sm'>
                <span className='text-xs uppercase tracking-wider text-muted-foreground bg-primary/90 text-primary-foreground px-2 py-0.5 rounded'>
                    {mode}
                </span>
                {gameType === "Number-Sequence" && (
                    <span className='tabular-nums'>
                        <span className='text-xs uppercase tracking-wider text-muted-foreground'>Find</span> {nextTarget}
                    </span>
                )}
                {hasGameTimer ? (
                    <div className='flex items-baseline gap-2'>
                        <span className='text-muted-foreground text-xs uppercase tracking-wider'>Time left</span>
                        <CountdownTimer onComplete={timeOut} time={+gameTimer!} paused={paused} />
                    </div>
                ) : (
                    <Timer startDate={startTime} pausedAt={pausedAt} pausedTotalMs={pausedTotalMs} />
                )}
                {livesEnabled && <span aria-label={`${lives} lives left`}>{"♥".repeat(lives)}<span className='opacity-30'>{"♥".repeat(3 - lives)}</span></span>}
                {streak > 0 && <span aria-label={`${streak} match streak`}>🔥 {streak}</span>}
                <span className='tabular-nums ml-auto'>
                    Cards {found}/{totalCards} · Moves {moves}
                </span>
            </div>
            {(mode === "Duel" || mode === "BestOf3") && (
                <div className='flex items-center gap-4 font-mono text-sm'>
                    <span className='uppercase tracking-wider text-muted-foreground text-xs'>Turn</span>
                    <span className='font-bold'>{activePlayer === 0 ? playerName : player2Name}</span>
                    {mode === "BestOf3" && (
                        <span className='tabular-nums'>
                            Series {roundWins[0]}—{roundWins[1]}
                        </span>
                    )}
                    <span className='tabular-nums ml-auto'>
                        {playerName} {playerScores[0]} · {playerScores[1]} {player2Name}
                    </span>
                </div>
            )}
            <div className='items-center gap-3 flex justify-between'>
                <div className='flex items-center gap-3'>
                    <button
                        type="button"
                        aria-label={soundOn ? "Mute sounds" : "Unmute sounds"}
                        onClick={toggleSound}
                        className='bg-white p-2 rounded-full cursor-pointer hover:scale-105 h-10 w-10 items-center flex'
                    >
                        {soundOn ? <Volume2 className='h-5 w-5' /> : <VolumeX className='h-5 w-5' />}
                    </button>
                    {gameType !== "Number-Sequence" && (
                        <button
                            type="button"
                            aria-label={hintsLeft > 0 ? "Peek at the board (costs 2 moves)" : "No peeks left"}
                            disabled={hintsLeft <= 0 || peeking}
                            onClick={peek}
                            className='bg-white p-2 rounded-full cursor-pointer hover:scale-105 h-10 w-10 items-center flex disabled:opacity-40 disabled:hover:scale-100'
                        >
                            <Eye className='h-5 w-5' />
                        </button>
                    )}
                </div>
                <div className='items-center gap-4 flex'>
                    <GameBackButton />
                    <CloseModal />
                </div>
            </div>
        </div>
    );
};
