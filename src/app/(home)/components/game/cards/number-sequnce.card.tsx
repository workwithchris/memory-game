import memoryGameStore from '@/app/(home)/store/store';
import { GameCardProp } from '@/app/(home)/types';
import React, { useEffect } from 'react'
import { sfx } from '@/app/(home)/helpers/sfx';

export default function NumberSequenceCard({ color, index, isMatched, setIsMatched }: GameCardProp) {
    const { complexity, matchedCards, setMatchedCards, locked, setLocked, moves, setMoves, peeking } = memoryGameStore();

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

    return <button
        type="button"
        aria-label={isMatched || peeking ? `Sequence number ${color}` : `Hidden card ${index + 1}`}
        onClick={handleNumberSequenceSelect}
        className={`${complexity === "Hard" || complexity === "Extreme" ? "h-12 w-12" : "h-16 w-16"} lg:h-20 lg:w-20 hover:scale-105 cursor-pointer transition-all rounded focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
    >
        <div className='flex items-center justify-center h-full rounded'
            style={{
                backgroundColor: isMatched || peeking ? "green" : "white",
                color: isMatched || peeking ? "white" : "black"
            }}>
            {(isMatched || peeking) && <span className='font-bold tabular-nums'>{color}</span>}
        </div>
    </button>
}
