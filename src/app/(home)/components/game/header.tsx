import memoryGameStore from "../../store/store";
import CountdownTimer from "./countdown-timer";
import GameBackButton from "../game-info/back-button";
import CloseModal from "./modal/close.modal";
import Timer from "@/components/game-timer";

const TOTAL_PAIRS: Record<string, Record<string, number>> = {
    "Number-Sequence": { Easy: 16, Medium: 32, Hard: 48, Extreme: 48 },
    default: { Easy: 8, Medium: 16, Hard: 24, Extreme: 24 },
};

export const GameHeader = () => {
    const {
        startTime,
        hasGameTimer,
        gameTimer,
        matchedCards,
        moves,
        complexity,
        gameType,
        setGameState,
        setEndTime,
        setOutcome,
        setFirstCard,
        setSecondCard,
        setLocked,
    } = memoryGameStore();

    const totalPairs = TOTAL_PAIRS[gameType]?.[complexity] ?? TOTAL_PAIRS.default[complexity];
    const found = gameType === "Number-Sequence" ? matchedCards.length : matchedCards.length / 2;

    function timeOut() {
        setFirstCard(null);
        setSecondCard(null);
        setLocked(false);
        setGameState("Ended");
        setOutcome("lost");
        setEndTime(new Date().toISOString());
    }

    return (
        <div className='pb-4 space-y-4'>
            <div className='flex items-baseline justify-between font-mono text-sm'>
                {hasGameTimer ? (
                    <div className='flex items-baseline gap-2'>
                        <span className='text-muted-foreground text-xs uppercase tracking-wider'>Time left</span>
                        <CountdownTimer onComplete={timeOut} time={+gameTimer!} />
                    </div>
                ) : (
                    <div className='flex items-baseline gap-2'>
                        <Timer startDate={startTime} />
                    </div>
                )}
                <span className='tabular-nums'>
                    Pairs {found}/{totalPairs} · Moves {moves}
                </span>
            </div>
            <div className='items-center gap-4 flex justify-end'>
                <GameBackButton />
                <CloseModal />
            </div>
        </div>
    );
};
