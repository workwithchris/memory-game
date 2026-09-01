import memoryGameStore from '@/app/(home)/store/store';
import { GameCardProp } from '@/app/(home)/types';
import React, { useEffect } from 'react'
import { sfx } from '@/app/(home)/helpers/sfx';

export default function NumberSequenceCard({ color, index, isMatched, setIsMatched }: GameCardProp) {
    const { complexity, matchedCards, setMatchedCards, locked, setLocked, moves, setMoves, peeking } = memoryGameStore();

    const shown = isMatched || peeking;

    const handleNumberSequenceSelect = () => {
        if (isMatched || locked || peeking) return;
        sfx.flip();
        setIsMatched(true)
        setLocked(true)
        setMoves(moves + 1)
        setTimeout(() => {
            if (matchedCards.length === 0) {
                if (color.toString() === "1") {
                    setMatchedCards([...matchedCards, { color, index }])
                } else {
                    setIsMatched(false)
                }
            } else {
                if (color.toString() === (matchedCards.length + 1).toString()) {
                    setMatchedCards([...matchedCards, { color, index }])
                    setIsMatched(true);
                } else {
                    setIsMatched(false)
                }
            }
            setLocked(false)
        }, 200);
    }

    useEffect(() => {
        const isSelected = matchedCards.filter((card) => card.index === index).length === 1
        if (isSelected) {
            setIsMatched(true)
        }
    }, [matchedCards])

    return (
        <button
            type="button"
            aria-label={shown ? `Sequence number ${color}` : `Hidden card ${index + 1}`}
            onClick={handleNumberSequenceSelect}
            className={`card-flip-btn pop-in ${complexity === "Hard" || complexity === "Extreme" ? "h-12 w-12" : "h-16 w-16"} lg:h-20 lg:w-20 hover:scale-105 cursor-pointer transition-all rounded focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
            style={{ animationDelay: `${index * 15}ms` }}
        >
            <span className="flip-3d" style={{ transform: shown ? "rotateY(0deg)" : "rotateY(180deg)" }}>
                <span className="flip-face bg-white border shadow-sm" aria-hidden={shown} />
                <span className="flip-face back bg-white border shadow-sm" aria-hidden={!shown}>
                    {shown && <span className='font-bold tabular-nums'>{color}</span>}
                </span>
            </span>
        </button>
    );
}
