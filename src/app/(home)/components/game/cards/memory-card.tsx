import React, { useEffect, useState } from 'react'
import memoryGameStore from '../../../store/store';
import NumberSequenceCard from './number-sequnce.card';
import ColorCard from './color-card';

export default function MemoryCard({ color, index }: { color: string, index: number }) {
    const {
        complexity,
        gameType
    } = memoryGameStore();

    // preview phase: the full board is shown first so you can memorize it, then cards flip face-down
    const [isMatched, setIsMatched] = useState(true);
    const previewMs = gameType === "Number-Sequence"
        ? complexity === "Easy" ? 1500 : complexity === "Medium" ? 2000 : complexity === "Hard" ? 3500 : 6000
        : complexity === "Easy" ? 1200 : complexity === "Medium" ? 1800 : complexity === "Hard" ? 2500 : 4000;

    useEffect(() => {
        const timer = setTimeout(() => setIsMatched(false), previewMs);
        return () => clearTimeout(timer);
    }, [previewMs])

    if (gameType === "Number-Sequence") {
        return <NumberSequenceCard color={color} index={index} isMatched={isMatched} setIsMatched={setIsMatched} />
    }

    return <ColorCard color={color} index={index} isMatched={isMatched} setIsMatched={setIsMatched} />
}

