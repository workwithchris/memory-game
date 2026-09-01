import React from 'react'
import { ChevronLeft } from 'lucide-react';
import memoryGameStore from '../../store/store';

export default function GameBackButton() {
    const {
        resetRound,
        setGameState,
        setStartTime,
    } = memoryGameStore();
    return (
        <button
            type="button"
            aria-label='Back to setup'
            onClick={() => {
                resetRound();
                setGameState("New")
                setStartTime(null)
            }}
            className='bg-white p-2 rounded-full cursor-pointer hover:scale-105 h-10 w-10 items-center flex'>
            <ChevronLeft size={30} />
        </button>
    )
}
