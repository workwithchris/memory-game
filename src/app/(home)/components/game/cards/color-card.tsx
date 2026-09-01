import React, { useEffect } from 'react'
import memoryGameStore from '@/app/(home)/store/store';
import { GameCardProp } from '@/app/(home)/types';
import { sfx } from '@/app/(home)/helpers/sfx';

export default function ColorCard({ color, index, isMatched, setIsMatched }: GameCardProp) {
    const {
        firstCard,
        setFirstCard,
        secondCard,
        setSecondCard,
        matchedCards,
        locked,
        setLocked,
        moves,
        setMoves,
        peeking,
        complexity,
        gameType,
        soundOn
    } = memoryGameStore();

    const shown = isMatched || peeking;

    function handleSelectCard() {
        if (isMatched || locked || peeking) return;
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
            aria-label={shown ? `Card ${index + 1}: ${gameType === "Color" ? "color" : color}` : `Hidden card ${index + 1}`}
            onClick={handleSelectCard}
            className={`${complexity === "Hard" || complexity === "Extreme" ? "h-12 w-12" : "h-16 w-16"} lg:h-20 lg:w-20 hover:scale-105 cursor-pointer transition-all rounded focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
        >
            {shown && (
                gameType === "Color" ? (
                    <span className="block h-full w-full rounded" style={{ backgroundColor: color }} title={color} />
                ) : gameType === "Number" ? (
                    <span className={`font-bold tabular-nums ${small ? "text-lg" : "text-2xl"}`}>{color}</span>
                ) : (
                    <span className={small ? "text-xl" : "text-3xl"}>{color}</span>
                )
            )}
        </button>
    );
}
