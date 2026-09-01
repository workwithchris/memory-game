"use client"
import React, { useEffect, useRef } from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import memoryGameStore from '../../store/store'
import { bestFor } from '../../helpers/progress'

export default function Newgame() {
    const playernameRef = useRef<HTMLInputElement>(null);
    const player2nameRef = useRef<HTMLInputElement>(null);
    const {
        complexity,
        setComplexity,
        setGameState,
        setPlayerName,
        setPlayer2Name,
        setMatchedCards,
        setStartTime,
        hasGameTimer,
        setGameTimer,
        gameTimer,
        setHasGameTimer,
        gameType,
        setGameType,
        playerName,
        mode,
        setMode,
        livesEnabled,
        setLivesEnabled,
        soundOn,
        setSoundOn,
        resetRound
    } = memoryGameStore();

    const best = bestFor(gameType, complexity);

    function applyMode(next: string) {
        setMode(next as typeof mode);
        if (next === "TimeAttack") {
            setHasGameTimer(true);
            setGameTimer("1");
        } else {
            setHasGameTimer(false);
            setGameTimer("3");
        }
    }

    function startGame() {
        setPlayerName(playernameRef.current!.value || "Player");
        if (mode === "Duel") setPlayer2Name(player2nameRef.current?.value || "Player 2");
        resetRound();
        setGameState("Playing");
        setStartTime(new Date().toISOString());
        playernameRef.current!.value = "";
    }

    useEffect(() => {
        playernameRef.current!.value = playerName
        try {
            const stored = localStorage.getItem("memory-sound");
            if (stored !== null) setSoundOn(stored === "on");
        } catch { }
    }, [])

    useEffect(() => {
        try { localStorage.setItem("memory-sound", soundOn ? "on" : "off"); } catch { }
    }, [soundOn])

    return (
        <Card className='p-6 w-[500px] rounded-lg border bg-card'>
            <div className='w-full space-y-5'>
                <h2 className='text-3xl pb-4'>Memory Game</h2>
                <div className='space-y-4'>
                    <div>
                        <Label>Player Name</Label>
                        <Input name='playerName' ref={playernameRef} required />
                    </div>
                    {mode === "Duel" && (
                        <div>
                            <Label>Player 2 Name</Label>
                            <Input name='player2Name' ref={player2nameRef} placeholder="Player 2" />
                        </div>
                    )}
                    <div>
                        <Label>Mode</Label>
                        <Select onValueChange={applyMode}>
                            <SelectTrigger>
                                <SelectValue placeholder={mode} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Classic">Classic</SelectItem>
                                <SelectItem value="Daily">Daily Challenge</SelectItem>
                                <SelectItem value="TimeAttack">Time Attack (60s)</SelectItem>
                                <SelectItem value="Duel">Duel (2 players)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Game Type</Label>
                        <Select onValueChange={setGameType}>
                            <SelectTrigger>
                                <SelectValue placeholder={gameType} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Color">Color</SelectItem>
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
                                <SelectItem value="Hard">Hard</SelectItem>
                                <SelectItem value="Extreme">Extreme</SelectItem>
                            </SelectContent>
                        </Select>
                        {best && (
                            <p className='pt-1 text-xs text-muted-foreground'>
                                Your best: {best.wins > 0 ? `${best.bestTimeMs !== null ? Math.round(best.bestTimeMs / 1000) + "s" : "—"} · ${best.bestMoves ?? "—"} moves` : "no wins yet"}
                            </p>
                        )}
                    </div>
                    <div className='flex gap-4'>
                        <Checkbox checked={hasGameTimer} disabled={mode === "TimeAttack"} onCheckedChange={() => {
                            setHasGameTimer(!hasGameTimer)
                        }}>Has Game Timer</Checkbox>
                        <Label>Set Game Timer</Label>
                    </div>
                    {hasGameTimer && mode !== "TimeAttack" && <div>
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
                    <div className='flex gap-4'>
                        <Checkbox checked={livesEnabled} onCheckedChange={() => setLivesEnabled(!livesEnabled)}>Lives</Checkbox>
                        <Label>3 lives — a mismatch costs one</Label>
                    </div>
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
