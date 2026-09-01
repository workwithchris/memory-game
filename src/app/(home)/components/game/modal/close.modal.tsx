
import React from 'react'
import { Pause, Power } from 'lucide-react'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button';

import memoryGameStore from '@/app/(home)/store/store';

export default function CloseModal() {
    const {
        setFirstCard, setSecondCard, setMatchedCards, setGameState,
        setLocked, setPaused, setPausedAt, paused, pausedAt, pausedTotalMs, setPausedTotalMs
    } = memoryGameStore();
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    type="button"
                    aria-label={paused ? 'Resume' : 'Pause or end game'}
                    className='bg-white p-2 rounded-full cursor-pointer hover:scale-105 h-10 w-10 items-center flex'
                >
                    {paused ? <Power className='h-5 w-5 text-red-500' /> : <Pause className='h-5 w-5' />}
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Pause the game?</DialogTitle>
                </DialogHeader>
                <div className='flex flex-row-reverse gap-3'>
                    <Button
                        variant='destructive'
                        onClick={() => {
                            setFirstCard(null)
                            setSecondCard(null)
                            setMatchedCards([])
                            setLocked(false)
                            setGameState("New")
                        }}>End game</Button>
                    <Button
                        onClick={() => {
                            setPaused(true);
                            setPausedAt(Date.now());
                        }}>Pause</Button>
                </div>
                <p className='text-sm text-muted-foreground'>
                    Pausing hides the board and freezes the timer. Elapsed time pauses count too.
                </p>
            </DialogContent>
        </Dialog>
    )
}
