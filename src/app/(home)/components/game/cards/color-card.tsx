import React, { useEffect } from 'react'
import memoryGameStore from '@/app/(home)/store/store';
import { GameCardProp } from '@/app/(home)/types';
import { sfx } from '@/app/(home)/helpers/sfx';
import { JOKER, TRAP } from '@/app/(home)/helpers/deck';

export default function ColorCard({ color, index, isMatched, setIsMatched }: GameCardProp) {
    const {
        firstCard,
        setFirstCard,
        secondCard,
        setSecondCard,
        matchedCards,
        deadIndices,
        setDeadIndices,
        locked,
        setLocked,
        moves,
        setMoves,
        streak,
        setStreak,
        mismatches,
        setMismatches,
        mode,
        activePlayer,
        setActivePlayer,
        peeking,
        complexity,
        gameType,
    } = memoryGameStore();

    const isTrap = color === TRAP;
    const isDead = deadIndices.includes(index);
    const shown = isMatched || peeking || isDead;

    function handleSelectCard() {
        if (isMatched || locked || peeking) return;

        // trap card: costs 2 moves, breaks your streak, then goes dark
        if (isTrap && !isDead) {
            sfx.miss();
            setMoves(moves + 2);
            setStreak(0);
            setMismatches(mismatches + 1);
            setDeadIndices([...deadIndices, index]);
            setLocked(true);
            setTimeout(() => setLocked(false), 600);
            if (mode === "Duel" || mode === "BestOf3") {
                setActivePlayer(activePlayer === 0 ? 1 : 0);
            }
            return;
        }

        sfx.flip();
        if (firstCard != null) {
            // guard: same card twice would "match" itself
            if (firstCard.index === index) return;
            setSecondCard({ index, color })
            setMoves(moves + 1)
        }
        else {
            setFirstCard({ index, color });
        }
    }

    useEffect(() => {
        if (isDead) {
            setIsMatched(true);
            return;
        }
        const isSelected = matchedCards.filter((card) => card.index === index).length === 1
        if (isSelected) {
            setIsMatched(true)
        }
        else {
            if (index === firstCard?.index || index === secondCard?.index || isSelected) {
                setIsMatched(true)
            }
            if (firstCard === null) {
                setIsMatched(false)
            }
        }
    }, [firstCard, secondCard])

    const small = complexity === "Hard" || complexity === "Extreme";

    return (
        <button
            type="button"
            aria-label={shown ? `Card ${index + 1}: ${isTrap ? "trap" : gameType === "Color" ? "color" : color}` : `Hidden card ${index + 1}`}
            onClick={handleSelectCard}
            className={`${complexity === "Hard" || complexity === "Extreme" ? "h-12 w-12" : "h-16 w-16"} lg:h-20 lg:w-20 hover:scale-105 cursor-pointer transition-all rounded bg-white border shadow-sm flex items-center justify-center focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${isDead ? "opacity-70" : ""}`}
        >
            {shown && (
                isTrap ? (
                    <span className={`${small ? "text-xl" : "text-2xl"}`}>☠️</span>
                ) : gameType === "Color" ? (
                    color === JOKER ? (
                        <span className={`font-bold ${small ? "text-lg" : "text-2xl"}`}>★</span>
                    ) : (
                        <span className="block h-full w-full rounded" style={{ backgroundColor: color }} title={color} />
                    )
                ) : gameType === "Number" ? (
                    color === JOKER ? (
                        <span className={`font-bold ${small ? "text-lg" : "text-2xl"}`}>★</span>
                    ) : (
                        <span className={`font-bold tabular-nums ${small ? "text-lg" : "text-2xl"}`}>{color}</span>
                    )
                ) : color === JOKER ? (
                    <span className={`font-bold ${small ? "text-lg" : "text-2xl"}`}>★</span>
                ) : (
                    <span className={small ? "text-xl" : "text-3xl"}>{color}</span>
                )
            )}
        </button>
    );
}
