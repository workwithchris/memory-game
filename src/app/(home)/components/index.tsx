"use client"
import React, { useEffect } from 'react'

import memoryGameStore from '../store/store'
import { setSfxEnabled } from '../helpers/sfx';
import Newgame from './game-states/new-game';
import InfoDrawer from './game-info/info.drawer';
import Game from './game/game';
import Ended from './game-states/ended';

export default function MemoryGame() {
    const {
        gameState,
        soundOn,
    } = memoryGameStore();

    useEffect(() => {
        setSfxEnabled(soundOn);
    }, [soundOn]);

    if (gameState === "New") {
        return <div className='flex justify-center items-center h-screen w-screen relative p-5 lg:p-0'>
            <Newgame />
            <InfoDrawer />
        </div>
    }

    if (gameState === "Playing") {
        return <div className='relative p-5 h-screen w-screen'>
            <div className='space-y-6 relative h-full flex flex-col justify-center w-full items-center'>
                <Game />
            </div>
        </div>
    }

    return <div className='flex justify-center items-center h-screen w-screen p-5'>
        <Ended />
    </div>
}
