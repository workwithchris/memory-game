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
    const small = complexity === "Hard" || complexity === "Extreme";

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

    function faceContent() {
        if (isTrap) return <span className={small ? "text-xl" : "text-2xl"}>☠️</span>;
        if (color === JOKER) return <span className={`font-bold ${small ? "text-lg" : "text-2xl"}`}>★</span>;
        if (gameType === "Color") return <span className="block h-full w-full" style={{ backgroundColor: color }} title={color} />;
        if (gameType === "Number") return <span className={`font-bold tabular-nums ${small ? "text-lg" : "text-2xl"}`}>{color}</span>;
        return <span className={small ? "text-xl" : "text-3xl"}>{color}</span>;
    }

    return (
        <button
            type="button"
            aria-label={shown ? `Card ${index + 1}: ${isTrap ? "trap" : gameType === "Color" ? "color" : color}` : `Hidden card ${index + 1}`}
            onClick={handleSelectCard}
            className={`card-flip-btn pop-in ${complexity === "Hard" || complexity === "Extreme" ? "h-12 w-12" : "h-16 w-16"} lg:h-20 lg:w-20 hover:scale-105 cursor-pointer transition-all rounded focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${isDead ? "opacity-70" : ""}`}
            style={{ animationDelay: `${index * 15}ms` }}
        >
            <span className="flip-3d" style={{ transform: shown ? "rotateY(0deg)" : "rotateY(180deg)" }}>
                {/* back face: the hidden card back */}
                <span className="flip-face bg-white border shadow-sm" aria-hidden={shown} />
                {/* front face: the revealed content */}
                <span className="flip-face back bg-white border shadow-sm" aria-hidden={!shown}>
                    {faceContent()}
                </span>
            </span>
        </button>
    );
}
