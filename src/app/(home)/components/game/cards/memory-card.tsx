import React, { useEffect, useState } from 'react'
import memoryGameStore from '../../../store/store';
import NumberSequenceCard from './number-sequnce.card';
import ColorCard from './color-card';

export default function MemoryCard({ color, index }: { color: string, index: number }) {
    const {
        complexity,
        gameType
    } = memoryGameStore();

    // preview phase: cells start lit, then hide after previewMs
    const [isMatched, setIsMatched] = useState(true);
    const previewMs = gameType === "Number-Sequence"
        ? complexity === "Easy" ? 500 : complexity === "Medium" ? 1000 : complexity === "Hard" ? 3000 : 6000
        : complexity === "Easy" ? 300 : complexity === "Medium" ? 500 : complexity === "Hard" ? 3000 : 6000;

    useEffect(() => {
        const timer = setTimeout(() => setIsMatched(false), previewMs);
        return () => clearTimeout(timer);
    }, [previewMs])

    if (gameType === "Number-Sequence") {
        return <NumberSequenceCard color={color} index={index} isMatched={isMatched} setIsMatched={setIsMatched} />
    }

    return <ColorCard color={color} index={index} isMatched={isMatched} setIsMatched={setIsMatched} />
}

