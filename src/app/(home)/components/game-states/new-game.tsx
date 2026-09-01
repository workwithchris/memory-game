"use client"
import React, { useEffect, useRef } from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import memoryGameStore from '../../store/store'

export default function Newgame() {
    const playernameRef = useRef<HTMLInputElement>(null);
    const {
        complexity,
        setComplexity,
        setGameState,
        setPlayerName,
        setMatchedCards,
        setMoves,
        setOutcome,
        setLocked,
        setStartTime,
        hasGameTimer,
        setGameTimer,
        gameTimer,
        setHasGameTimer,
        gameType,
        setGameType,
        playerName
    } = memoryGameStore();

    function startGame() {
        setPlayerName(playernameRef.current!.value);
        setGameState("Playing");
        setMatchedCards([])
        setMoves(0)
        setOutcome("won")
        setLocked(false)
        setStartTime(new Date().toISOString());
        playernameRef.current!.value = "";
    }

    useEffect(() => {
        playernameRef.current!.value = playerName
    }, [])

    return (
        <Card className='p-6 w-[500px] rounded-lg border bg-card'>
            <div className='w-full space-y-5'>
                <h2 className='text-3xl pb-4'>Memory Game</h2>
                <div className='space-y-4'>
                    <div>
                        <Label>Player Name</Label>
                        <Input name='playerName' ref={playernameRef} required />
                    </div>
                    <div>
                        <Label>Game Type</Label>
                        <Select onValueChange={setGameType}>
                            <SelectTrigger>
                                <SelectValue placeholder={gameType} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Color">Color</SelectItem>
                                {/* <SelectItem value="images">Images</SelectItem> */}
                                <SelectItem value="Number">Number</SelectItem>
                                <SelectItem value="Number-Sequence">Number Sequence</SelectItem>
                                <SelectItem value="Emoji">Emoji</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Game Complexity</Label>
                        <Select onValueChange={setComplexity}>
                            <SelectTrigger>
                                <SelectValue placeholder={complexity} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Easy">Easy</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                {<SelectItem value="Hard">Hard</SelectItem>}
                                {<SelectItem value="Extreme">Extreme</SelectItem>}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='flex gap-4'>
                        <Checkbox checked={hasGameTimer} onCheckedChange={() => {
                            setHasGameTimer(!hasGameTimer)
                        }}>Has Game Timer</Checkbox>
                        <Label>Set Game Timer</Label>
                    </div>
                    {hasGameTimer && <div>
                        <Label>Game Timer</Label>
                        <Select onValueChange={setGameTimer}>
                            <SelectTrigger>
                                <SelectValue placeholder={gameTimer} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="3">3m</SelectItem>
                                <SelectItem value="5">5m</SelectItem>
                                <SelectItem value="6">6m</SelectItem>
                                <SelectItem value="10">10m</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>}
                    <div className='pt-4'>
                        <Button className='w-full' onClick={startGame}>
                            Start Game
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    )
}
